#!/usr/bin/env python3
"""Compass read-only Kraken API localhost bridge.

Only binds 127.0.0.1. Requires exact Origin allow-list and a strong ephemeral
pairing token on every browser request. Credentials remain only in process RAM.
Never logs secrets, saves unencrypted snapshots or exposes a public endpoint.
"""
import getpass
import json
import secrets
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse
from kraken_sync import sync

PORT = 18757
LIMIT = 3_000_000

class Session:
    def __init__(self, key, secret, origin):
        self.key = key
        self.secret = secret
        self.origin = origin
        self.token = secrets.token_urlsafe(32)
        self.lock = threading.Lock()
        self.status = 'idle'
        self.result = None
        self.error = ''
    def run(self):
        try:
            result = sync(self.key, self.secret)
            with self.lock:
                self.result = result
                self.status = 'ready'
        except Exception:
            with self.lock:
                self.status = 'failed'
                self.error = 'Kraken antwortet nicht oder Zugang/Berechtigungen prüfen. Details im lokalen Terminal.'
            print('Kraken-Synchronisation fehlgeschlagen; Berechtigungen und Internetverbindung prüfen.')


def serve(session):
    class Handler(BaseHTTPRequestHandler):
        def log_message(self, format, *args):
            # Never print query strings, headers, browser URLs or private data.
            pass
        def _cors(self):
            return self.headers.get('Origin') == session.origin
        def _auth(self):
            return self._cors() and self.headers.get('Authorization') == 'Bearer ' + session.token
        def _headers(self, status, length=0, cors=False):
            self.send_response(status)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Cache-Control', 'no-store, private')
            self.send_header('X-Content-Type-Options', 'nosniff')
            if cors:
                self.send_header('Access-Control-Allow-Origin', session.origin)
                self.send_header('Vary', 'Origin')
                self.send_header('Access-Control-Allow-Private-Network', 'true')
            self.send_header('Content-Length', str(length))
            self.end_headers()
        def _reply(self, obj, status=200):
            data=json.dumps(obj, ensure_ascii=False).encode('utf-8')
            self._headers(status, len(data), self._cors())
            self.wfile.write(data)
        def do_OPTIONS(self):
            if not self._cors():
                return self._headers(403)
            self.send_response(204)
            self.send_header('Access-Control-Allow-Origin', session.origin)
            self.send_header('Access-Control-Allow-Headers', 'Authorization, Content-Type')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.send_header('Access-Control-Allow-Private-Network', 'true')
            self.send_header('Cache-Control', 'no-store')
            self.send_header('Content-Length','0')
            self.end_headers()
        def do_GET(self):
            if not self._auth():
                return self._reply({'error':'Nicht autorisiert'},403)
            if self.path != '/result':
                return self._reply({'error':'Nicht gefunden'},404)
            with session.lock:
                status=session.status
                result=session.result if status=='ready' else None
                message=session.error if status=='failed' else ''
            self._reply({'status':status,'snapshot':result,'error':message})
        def do_POST(self):
            if not self._auth():
                return self._reply({'error':'Nicht autorisiert'},403)
            if self.path != '/sync':
                return self._reply({'error':'Nicht gefunden'},404)
            if int(self.headers.get('Content-Length', '0') or 0) != 0:
                return self._reply({'error':'Kein Body zugelassen'},400)
            with session.lock:
                if session.status=='running':
                    return self._reply({'status':'running'},202)
                session.status='running'
                session.result=None
                session.error=''
            threading.Thread(target=session.run,daemon=True).start()
            self._reply({'status':'running'},202)

    httpd=ThreadingHTTPServer(('127.0.0.1',PORT),Handler)
    print(f'Lokaler Connector bereit: 127.0.0.1:{PORT} · Nur-Lese-Zugriff')
    print('Kopplungscode für Compass (vertraulich, NICHT der Kraken-Key): ' + session.token)
    print('Compass → Finanzen → Portfolio: Code eingeben und Jetzt lokal synchronisieren wählen.')
    print('Beenden mit Strg+C. API-Schlüssel werden nicht dauerhaft gespeichert.')
    try:
        httpd.serve_forever(poll_interval=.3)
    finally:
        httpd.server_close()


def main():
    print('Compass · Kraken Local Bridge 0.5.17.5 (NUR LESEN)')
    origin=input('Exakte Compass-Website-Origin, z. B. https://name.github.io (ohne /Pfad): ').strip().rstrip('/')
    u=urlparse(origin)
    if u.scheme != 'https' and not (u.scheme == 'http' and u.hostname in ('localhost','127.0.0.1')):
        raise ValueError('Nur HTTPS-Compass-Seiten oder lokale Entwicklungsseiten.')
    if not u.hostname or u.path not in ('','/') or u.query or u.fragment or u.username or u.password:
        raise ValueError('Bitte nur die Origin eingeben, nicht die vollständige URL.')
    key=getpass.getpass('Kraken API-Key (nur Lesen): ').strip()
    secret=getpass.getpass('Kraken API-Secret: ').strip()
    if not key or not secret:
        raise ValueError('Schlüssel fehlen.')
    serve(Session(key,secret,origin))

if __name__=='__main__':
    try:
        main()
    except (KeyboardInterrupt,ValueError,OSError) as exc:
        print('Connector beendet. '+str(exc)[:150])
