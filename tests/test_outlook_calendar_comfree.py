"""COM-free tests: run with python -m unittest discover -s tests -p 'test_outlook_calendar_comfree.py'."""
import os,sys,unittest,datetime as dt
sys.path.insert(0,os.path.join(os.path.dirname(__file__),'..','tools'))
from outlook_calendar import read_calendar,stable_id,normalize_snapshot
class FakeItem:
 def __init__(self,start,subject='Test',recur=0):
  self.Class=26;self.Start=start;self.End=start+dt.timedelta(hours=1);self.Subject=subject
  self.Location='TU Graz';self.GlobalAppointmentID='series-1';self.RecurrenceState=recur
  self.AllDayEvent=False;self.BusyStatus=2;self.MeetingStatus=0
class Items:
 def __init__(self,entries):self.entries=entries;self.Count=len(entries);self.IncludeRecurrences=False
 def Sort(self,*args):pass
 def Restrict(self,*args):return self.entries
 def Item(self,i):return self.entries[i-1]
 def __iter__(self):return iter(self.entries)
class Folder:
 def __init__(self,rows):self.StoreID='ABC';self.EntryID='XYZ';self.Items=Items(rows)
class FakeNS:
 def __init__(self,rows):self.calendar_folders=[Folder(rows)]
class Tests(unittest.TestCase):
 def test_only_in_window_snapshot(self):
  x=read_calendar(today=dt.date(2026,11,18),namespace=FakeNS([FakeItem(dt.datetime(2026,11,18,14))]))
  self.assertTrue(x['complete']);self.assertEqual(len(x['events']),1)
 def test_snapshot_identity_deterministic(self):
  ns=FakeNS([FakeItem(dt.datetime(2026,11,18,14))]);a=read_calendar(today=dt.date(2026,11,18),namespace=ns)
  b=read_calendar(today=dt.date(2026,11,18),namespace=ns)
  self.assertEqual(a['events'][0]['source_id'],b['events'][0]['source_id'])
 def test_window_invalid(self):
  with self.assertRaises(ValueError):read_calendar(500,180,namespace=FakeNS([]))
 def test_stable_hash(self):
  self.assertEqual(stable_id('a','b'),stable_id('a','b'));self.assertNotEqual(stable_id('a','b'),stable_id('b','a'))
 def test_deleted_overrides_live(self):
  sid=stable_id('1');v=normalize_snapshot([{'source_id':sid}], [{'source_id':sid}], '2026-11-01','2026-11-02','2026-11-01T00:00:00Z')
  self.assertEqual(v['events'],[]);self.assertEqual(len(v['deleted']),1)
class RecurrenceTests(unittest.TestCase):
 def test_moved_exception_uses_original_instance_identity(self):
  original=dt.datetime(2026,11,18,9)
  occurrence=FakeItem(original,recur=2)
  moved=FakeItem(original+dt.timedelta(days=1),recur=3)
  class Exc:
   OriginalDate=original
   Deleted=False
   AppointmentItem=moved
  class Exceptions:
   Count=1
   def Item(self,n):return Exc()
  class Master(FakeItem):
   def GetRecurrencePattern(self):return type('Pattern',(),{'Exceptions':Exceptions()})()
  master=Master(original,recur=1)
  ns=FakeNS([master,occurrence]);result=read_calendar(today=dt.date(2026,11,18),namespace=ns)
  self.assertEqual(len(result['events']),1)
  self.assertIn('2026-11-19',result['events'][0]['start'])
 def test_deleted_exception_emits_tombstone(self):
  original=dt.datetime(2026,11,18,9)
  class Exc:
   OriginalDate=original
   Deleted=True
  class Exceptions:
   Count=1
   def Item(self,n):return Exc()
  class Master(FakeItem):
   def GetRecurrencePattern(self):return type('Pattern',(),{'Exceptions':Exceptions()})()
  master=Master(original,recur=1)
  result=read_calendar(today=dt.date(2026,11,18),namespace=FakeNS([master]))
  self.assertEqual(len(result['deleted']),1)
  self.assertEqual(result['events'],[])
 def test_com_failure_does_not_return_empty_snapshot(self):
  class BrokenItems(Items):
   def Restrict(self,*args):raise RuntimeError('Exchange offline')
  folder=Folder([]);folder.Items=BrokenItems([])
  class BrokenNS:calendar_folders=[folder]
  with self.assertRaises(RuntimeError):read_calendar(today=dt.date(2026,11,18),namespace=BrokenNS())
if __name__=='__main__':unittest.main()
