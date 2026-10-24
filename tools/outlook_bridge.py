#!/usr/bin/env python3
"""Compass 0.5.77.24 — read-only classic Outlook COM flagged-mail bridge.

Windows only, classic desktop Outlook (not new Outlook). No mailbox credentials.
No email bodies, recipients, attachments or raw MAPI identifiers exported.
Usage:
 py -m pip install pywin32
 py tools/outlook_bridge.py --export outlook-flags.json
 py tools/outlook_bridge.py --serve --origin https://YOUR-COMPASS-ORIGIN

Security: 127.0.0.1 only; explicit CORS origin AND unpredictable bearer token
printed at launch; no write operations; server headers disable caching.
"""
import argparse
import datetime as dt
import hashlib
import json
import secrets
import sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit

SCHEMA='compass-outlook-flags-v1'


def _date(value):
    try:
        d=value.date() if hasattr(value,'date') else value
        if d.year<1971 or d.year>2100: return None
        return d.isoformat()
    except (ValueError, TypeError, AttributeError, OverflowError): return None


def _flagged(folder, limit):
    """Use MAPI restriction, never enumerate the entire Exchange mailbox."""
    try:
        items=folder.Items.Restrict('[FlagStatus] = 2')  # olFlagMarked; not olFlagComplete
        count=min(items.Count,limit)
        return (items.Item(i) for i in range(1,count+1))
    except Exception:
        # Some Exchange stores reject Restrict; bound the fallback per folder.
        items=folder.Items
        return (items.Item(i) for i in range(1,min(items.Count,limit)+1))


def read_flagged(limit=200):
    if sys.platform!='win32': raise RuntimeError('Die Outlook-Brücke funktioniert nur auf Windows.')
    try:
        import pythoncom
        import win32com.client
    except ImportError as exc:
        raise RuntimeError('pywin32 fehlt: py -m pip install pywin32') from exc
    pythoncom.CoInitialize()
    try:
        outlook=win32com.client.Dispatch('Outlook.Application')
        namespace=outlook.GetNamespace('MAPI')
        output=[];seen=set();folders_opened=0
        # To-Do search folder (if supported) also covers flagged items from user folders.
        # Fall back to default Inbox and Sent; never traverse an entire mailbox.
        for folder_kind in (28,6,5): # olFolderToDo / olFolderInbox / olFolderSentMail
            try: folder=namespace.GetDefaultFolder(folder_kind)
            except Exception: continue
            folders_opened+=1
            store=str(folder.StoreID or '')
            for item in _flagged(folder,min(limit*3,450)):
                try:
                    if int(item.Class)!=43 or int(item.FlagStatus)!=2: continue # MailItem only
                    subject=' '.join(str(item.Subject or '').split())[:180]
                    entry=str(item.EntryID or '')
                    if not subject or not entry:continue
                    key=hashlib.sha256((store+'\x00'+entry).encode('utf-8')).hexdigest()
                    if key in seen:continue
                    seen.add(key)
                    try: flag_due=_date(item.TaskDueDate)
                    except Exception: flag_due=None
                    output.append({'id':key,'subject':subject,'flagDueDate':flag_due})
                    if len(output)>=limit:break
                except Exception:
                    continue
            if len(output)>=limit:break
        if not folders_opened:raise RuntimeError('Outlook-Postfach nicht lesbar; klassisches Outlook öffnen und Profil prüfen.')
        return {'schema':SCHEMA,'source':'classic-outlook-local','generatedAt':dt.datetime.now(dt.timezone.utc).isoformat(),'items':output}
    finally:
        pythoncom.CoUninitialize()


def _allowed_origin(origin):
    u=urlsplit(origin)
    if u.scheme!='https' or not u.hostname or u.username or u.password or u.path not in ('','/') or u.query or u.fragment:
        raise ValueError('--origin muss eine reine HTTPS-Origin sein, z. B. https://example.pages.dev')
    return u.scheme+'://'+u.netloc


def serve(origin,port,limit):
    origin=_allowed_origin(origin)
    token=secrets.token_urlsafe(32)
    class Handler(BaseHTTPRequestHandler):
        def _headers(self,status=200):
            self.send_response(status)
            self.send_header('Content-Type','application/json; charset=utf-8')
            self.send_header('Cache-Control','no-store, max-age=0')
            self.send_header('X-Content-Type-Options','nosniff')
            self.send_header('Vary','Origin')
            if self.headers.get('Origin')==origin:
                self.send_header('Access-Control-Allow-Origin',origin)
                self.send_header('Access-Control-Allow-Methods','GET, OPTIONS')
                self.send_header('Access-Control-Allow-Headers','X-Compass-Bridge-Key')
            self.end_headers()
        def _permitted(self):
            return self.headers.get('Origin')==origin and secrets.compare_digest(self.headers.get('X-Compass-Bridge-Key',''),token)
        def do_OPTIONS(self):
            if self.path!='/v1/flags' or self.headers.get('Origin')!=origin:
                self._headers(403);return
            self._headers(204)
        def do_GET(self):
            if self.path!='/v1/flags' or not self._permitted():
                self._headers(403);self.wfile.write(b'{"error":"Not allowed"}');return
            try:
                payload=json.dumps(read_flagged(limit),ensure_ascii=False).encode('utf-8')
                self._headers(200);self.wfile.write(payload)
            except Exception as exc:
                # Do not echo mailbox internals to requesting pages.
                print(f'[Outlook Bridge] Fehler beim Lesen: {type(exc).__name__}: {exc}',file=sys.stderr)
                self._headers(503);self.wfile.write(b'{"error":"Outlook COM unavailable; check the local bridge console"}')
        def log_message(self,format,*args):
            # No email subjects or access token in logs.
            pass
    with ThreadingHTTPServer(('127.0.0.1',port),Handler) as server:
        print('Compass Outlook Bridge 0.5.77.24 (read-only)')
        print('Website:',origin)
        print('URL: http://127.0.0.1:%d/v1/flags'%port)
        print('Bridge-Schlüssel (nur in Compass eingeben, NICHT teilen):',token)
        print('Ctrl+C beendet die Verbindung. Keine E-Mails werden verändert.')
        try:server.serve_forever(poll_interval=.5)
        except KeyboardInterrupt:pass


def main():
    parser=argparse.ArgumentParser(description=__doc__,formatter_class=argparse.RawDescriptionHelpFormatter)
    group=parser.add_mutually_exclusive_group(required=True)
    group.add_argument('--serve',action='store_true',help='lokaler Bridge-Server, nur 127.0.0.1')
    group.add_argument('--export',metavar='PATH',help='JSON-Vorschau zum manuellen Import exportieren')
    parser.add_argument('--origin',help='Erlaubte HTTPS-Website-Origin, erforderlich für --serve')
    parser.add_argument('--port',type=int,default=8765)
    parser.add_argument('--limit',type=int,default=200)
    args=parser.parse_args()
    if not 1024<=args.port<=65535 or not 1<=args.limit<=250:parser.error('Port 1024..65535 und Limit 1..250 erforderlich')
    try:
        if args.serve:
            if not args.origin:parser.error('--serve benötigt --origin')
            serve(args.origin,args.port,args.limit)
        else:
            target=Path(args.export).expanduser().resolve()
            if target.exists():raise ValueError('Exportdatei existiert bereits. Nicht unbemerkt überschreiben.')
            content=read_flagged(args.limit)
            with target.open('x',encoding='utf-8') as f:
                json.dump(content,f,ensure_ascii=False,indent=2)
            print(len(content['items']),'markierte Nachrichten nach',target,'exportiert. Enthält BETREFFZEILEN im Klartext! Nach Import sicher löschen.')
    except (OSError,ValueError,RuntimeError) as exc:
        parser.exit(1,'Outlook Bridge: '+str(exc)+'\n')

if __name__=='__main__': main()
