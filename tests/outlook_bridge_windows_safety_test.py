"""Run via python -m unittest discover -s tests -p '*windows_safety_test.py'."""
import importlib.util
import pathlib
import unittest
ROOT=pathlib.Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('outlook_bridge',ROOT/'tools'/'outlook_bridge.py')
mod=importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)
class SafetyTests(unittest.TestCase):
    def test_origin_allowlist(self):
        self.assertEqual(mod._allowed_origin('https://example.pages.dev/'),'https://example.pages.dev')
        for origin in ['http://example.pages.dev','https://example.pages.dev/path','https://a.com@evil.com','https://a.com?x=y']:
            with self.assertRaises(ValueError):mod._allowed_origin(origin)
    def test_due_date_clean(self):
        import datetime
        self.assertIsNone(mod._date(None))
        self.assertIsNone(mod._date(datetime.datetime(4501,1,1)))
        self.assertEqual(mod._date(datetime.datetime(2026,10,24)),'2026-10-24')
    def test_scan_refuses_nonwindows(self):
        import sys
        if sys.platform!='win32':
            with self.assertRaisesRegex(RuntimeError,'Windows'):mod.read_flagged(10)
if __name__=='__main__':unittest.main()
