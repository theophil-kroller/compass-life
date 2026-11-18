"""Read-only classic Outlook Calendar snapshot over Windows COM.

No Outlook credentials, Graph API, invitations, item updates or deletions.
COM is initialized and released on the thread that performs each snapshot.
The bridge never returns raw Outlook/MAPI IDs (only stable SHA-256 IDs).
"""
import datetime as dt
import hashlib
import os
import sys
from zoneinfo import ZoneInfo

ZONE = ZoneInfo('Europe/Vienna')


def local_iso(value):
    if not value:
        return None
    try:
        if not isinstance(value, dt.datetime):
            value = dt.datetime(value.year, value.month, value.day,
                                value.hour, value.minute, value.second)
        if value.tzinfo is None:
            value = value.replace(tzinfo=ZONE)
        return value.astimezone(ZONE).isoformat(timespec='seconds')
    except (TypeError, ValueError, OverflowError, AttributeError):
        return None


def stable_id(*parts):
    raw='\x00'.join(str(x or '') for x in parts)
    return 'outlook-local-' + hashlib.sha256(raw.encode('utf-8')).hexdigest()


def field(item, key, default=None):
    try:
        result = getattr(item, key)
        return result if result is not None else default
    except Exception:
        return default


def valid_day(value):
    try:
        return dt.date.fromisoformat(str(value))
    except Exception:
        raise ValueError('Invalid calendar window day')


def _date_string(value):
    try:
        return value.date().isoformat() if hasattr(value, 'date') else value.isoformat()
    except Exception:
        return None


def _item_dict(item, calendar_id, store_id, original=None, include_body=False):
    if int(field(item, 'Class', -1)) != 26: # olAppointment
        return None
    start=field(item, 'Start')
    end=field(item, 'End')
    start_iso,end_iso=local_iso(start),local_iso(end)
    if not start_iso or not end_iso or end_iso <= start_iso:
        return None
    series=str(field(item, 'GlobalAppointmentID', '') or field(item,'EntryID',''))
    if not series:return None
    recurrence=int(field(item, 'RecurrenceState', 0) or 0)
    original_date=_date_string(original) if original else (start_iso[:10] if recurrence else '')
    # Stable across a moved occurrence: recurrence key is its ORIGINAL slot.
    source_id=stable_id(store_id,calendar_id,series,original_date)
    free_busy=int(field(item,'BusyStatus',2) or 0)
    row={'source_id':source_id,'calendar_id':calendar_id,
         'series_id':stable_id(store_id,calendar_id,series) if recurrence else None,
         'original_start': original_date if recurrence else None,
         'title':str(field(item,'Subject','') or '').strip()[:250],
         'start':start_iso,'end':end_iso,'all_day':bool(field(item,'AllDayEvent',False)),
         'location':str(field(item,'Location','') or '').strip()[:400],
         'status':'cancelled' if str(field(item,'MeetingStatus',0))=='5' else 'confirmed',
         'availability':{0:'free',1:'tentative',2:'busy',3:'out_of_office',4:'elsewhere'}.get(free_busy,'busy'),
         'created_at':local_iso(field(item,'CreationTime')),
         'last_modified':local_iso(field(item,'LastModificationTime'))}
    if include_body:row['description']=str(field(item,'Body','') or '')[:8000]
    return row


def normalize_snapshot(events, deletions, start, end, at):
    """Deterministic valid envelope, independently mock-testable."""
    if valid_day(end)<=valid_day(start):raise ValueError('End must follow start')
    by_id={}
    for row in events:
        if isinstance(row,dict) and row.get('source_id'):
            by_id[row['source_id']]=row
    deleted_by_id={}
    for row in deletions:
        if isinstance(row,dict) and row.get('source_id'):
            deleted_by_id[row['source_id']]=row
            by_id.pop(row['source_id'],None)
    return {'schema_version':'1.0','source':'compass-outlook-bridge','snapshot_type':'complete',
            'timezone':'Europe/Vienna','generated_at':at,'window':{'start':start,'end':end},
            'complete':True,'events':list(sorted(by_id.values(),key=lambda x:(x.get('start',''),x['source_id']))),
            'deleted':list(deleted_by_id.values())}


def read_calendar(back_days=14, forward_days=180, include_body=False, max_events=5000,
                  today=None, namespace=None):
    """Get the calendar from the already configured classic Outlook MAPI profile.

    Only successful, completed enumeration returns a snapshot. All COM failures
    propagate to the HTTP 503 handler, never turning into empty calendars.
    """
    if not 0<=back_days<=365 or not 1<=forward_days<=730:
        raise ValueError('Invalid Outlook calendar window')
    if not 1<=max_events<=20000:raise ValueError('Invalid calendar event limit')
    current=today or dt.datetime.now(ZONE).date()
    start=(current-dt.timedelta(days=back_days)).isoformat()
    end=(current+dt.timedelta(days=forward_days+1)).isoformat() # exclusive
    at=dt.datetime.now(dt.timezone.utc).isoformat(timespec='seconds')
    owns_com=namespace is None
    if owns_com:
        if sys.platform!='win32':raise RuntimeError('Classic Outlook COM requires Windows')
        try:
            import pythoncom
            import win32com.client
        except ImportError as exc:
            raise RuntimeError('pywin32 fehlt: py -m pip install pywin32') from exc
        pythoncom.CoInitialize()
        try:
            namespace=win32com.client.Dispatch('Outlook.Application').GetNamespace('MAPI')
        except Exception:
            pythoncom.CoUninitialize();raise
    try:
        folders=[]
        if owns_com:
            # Each configured Exchange/PST store can have its own calendar.
            for store in namespace.Stores:
                try:
                    folder=store.GetDefaultFolder(9)
                    if folder is not None:folders.append(folder)
                except Exception:continue
            if not folders:folders=[namespace.GetDefaultFolder(9)]
        else:
            if hasattr(namespace,'calendar_folders'):folders=list(namespace.calendar_folders)
            else:folders=[namespace.GetDefaultFolder(9)]
        if not folders:raise RuntimeError('No Outlook calendar is available')
        events=[];deletions=[];count=0
        for folder in folders:
            store_id=str(field(folder,'StoreID',''))
            calendar_id=stable_id('calendar',store_id,field(folder,'EntryID',''))
            items=folder.Items
            items.Sort('[Start]')
            items.IncludeRecurrences=True
            # Outlook Restrict queries are locale sensitive. Restrict using a
            # US-date string per documented Outlook object-model syntax.
            a=dt.datetime.combine(valid_day(start),dt.time.min).strftime('%m/%d/%Y %I:%M %p')
            b=dt.datetime.combine(valid_day(end),dt.time.min).strftime('%m/%d/%Y %I:%M %p')
            restricted=items.Restrict(f"[Start] < '{b}' AND [End] > '{a}'")
            # Recurrences can make Count unreliable, so bound actual iteration.
            for item in restricted:
                if count>=max_events:
                    raise RuntimeError('Outlook snapshot limit reached: no incomplete snapshot saved')
                row=_item_dict(item,calendar_id,store_id,include_body=include_body)
                if row:
                    events.append(row);count+=1
            # Explicit deleted/moved exceptions are obtained from each series
            # master, not inferred from a failed connection. A master list is
            # bounded by the number of items visited in a window.
            masters=folder.Items
            for i in range(1,min(int(field(masters,'Count',0) or 0),max_events*2)+1):
                master=masters.Item(i)
                if int(field(master,'Class',-1))!=26 or int(field(master,'RecurrenceState',0) or 0)!=1:continue
                try: pattern=master.GetRecurrencePattern()
                except Exception:continue
                series=str(field(master,'GlobalAppointmentID','') or field(master,'EntryID',''))
                exceptions=field(pattern,'Exceptions')
                if exceptions is None:continue
                for j in range(1,int(field(exceptions,'Count',0) or 0)+1):
                    ex=exceptions.Item(j)
                    orig=field(ex,'OriginalDate')
                    orig_day=_date_string(orig)
                    if not orig_day or not start<=orig_day<end:continue
                    sid=stable_id(store_id,calendar_id,series,orig_day)
                    if bool(field(ex,'Deleted',False)):
                        deletions.append({'source_id':sid,'series_id':stable_id(store_id,calendar_id,series),
                                          'original_start':orig_day,'change_type':'deleted','status':'cancelled'})
                    else:
                        changed=field(ex,'AppointmentItem')
                        if changed is not None:
                            row=_item_dict(changed,calendar_id,store_id,orig,include_body)
                            if row:
                                row['source_id']=sid
                                row['series_id']=stable_id(store_id,calendar_id,series)
                                row['original_start']=orig_day
                                events.append(row)
        if not folders:raise RuntimeError('Outlook calendar unavailable')
        return normalize_snapshot(events,deletions,start,end,at)
    finally:
        if owns_com:
            pythoncom.CoUninitialize()
