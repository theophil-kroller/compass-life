#!/usr/bin/env python3
"""Compass local Kraken Spot read-only sync. Standard library only.

API secrets are entered with getpass and used in RAM only. No Cloudflare or
GitHub API endpoint is contacted. The resulting JSON is PLAINTEXT financial
information: import into Compass Vault and delete the unencrypted export.
"""
import base64
import datetime as dt
import getpass
import hashlib
import hmac
import json
import os
from pathlib import Path
import sys
import time
from urllib.parse import urlencode
from urllib.request import Request, urlopen

API_HOST = 'https://api.kraken.com'
ENDPOINTS = {'Balance', 'Ledgers', 'TradesHistory'}
MAX_PAGES = 80  # Maximum 4000 rows per dataset per run. Mark truncated.
WAIT_SECONDS = 2.0


def request_kraken(name, public_key, private_key, params=None):
    if name not in ENDPOINTS:
        raise ValueError('Nicht erlaubter Kraken-Endpunkt')
    path = '/0/private/' + name
    nonce = str(time.time_ns() // 1000)
    body = urlencode({'nonce': nonce, **(params or {})})
    digest = hashlib.sha256((nonce + body).encode('utf-8')).digest()
    signature = base64.b64encode(hmac.new(base64.b64decode(private_key), path.encode('utf-8') + digest, hashlib.sha512).digest()).decode('ascii')
    req = Request(API_HOST + path, data=body.encode('utf-8'), headers={
        'API-Key': public_key, 'API-Sign': signature,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Compass-Local-Kraken-ReadOnly/0.5.17.4'
    }, method='POST')
    with urlopen(req, timeout=30) as response:
        content = response.read(5_000_001)
    if len(content) > 5_000_000:
        raise ValueError('Kraken-Antwort zu groß')
    obj = json.loads(content)
    if obj.get('error'):
        # Errors may contain server messages; never include payload or keys.
        raise RuntimeError('; '.join(str(x)[:180] for x in obj['error']))
    if not isinstance(obj.get('result'), dict):
        raise ValueError('Unerwartete Kraken-Antwort')
    return obj['result']


def fetch_pages(endpoint, field, public_key, private_key):
    output = {}
    total = None
    for page in range(MAX_PAGES):
        if page:
            time.sleep(WAIT_SECONDS)
        result = request_kraken(endpoint, public_key, private_key, {'ofs': page * 50})
        entries = result.get(field, {})
        if not isinstance(entries, dict):
            raise ValueError('Unerwartete Antwortstruktur für ' + endpoint)
        output.update(entries)
        count = result.get('count')
        if isinstance(count, int):
            total = count
        print(f'  {endpoint}: {len(output)} von {total if total is not None else "?"} geladen')
        if total is not None and len(output) >= total:
            return output, False
        if not entries:
            return output, total is not None and len(output) < total
    return output, True


def safe_number(x):
    s = str(x)
    if len(s) > 60 or not s or s in ('None', 'nan', 'inf', '-inf'):
        raise ValueError('Ungültiger API-Betrag')
    return s


def sync(key, secret):
    print('Kraken Spot: Lade Währungsbestände …')
    balances = request_kraken('Balance', key, secret)
    balances = {str(k): safe_number(v) for k, v in balances.items() if not isinstance(v, (list, dict))}
    time.sleep(WAIT_SECONDS)
    print('Kraken Spot: Lade Ledger-Historie …')
    ledger_records, ledgers_partial = fetch_pages('Ledgers', 'ledger', key, secret)
    time.sleep(WAIT_SECONDS)
    print('Kraken Spot: Lade Handels-Historie …')
    trade_records, trades_partial = fetch_pages('TradesHistory', 'trades', key, secret)
    ledgers = []
    for entry_id, row in ledger_records.items():
        if not isinstance(row, dict):
            continue
        ledgers.append({k: v for k, v in {
            'id': str(entry_id), 'time': row.get('time'), 'asset': str(row.get('asset', '')),
            'amount': safe_number(row.get('amount')), 'fee': safe_number(row.get('fee')),
            'balance': safe_number(row.get('balance')), 'type': str(row.get('type', '')),
            'subtype': str(row.get('subtype', '')), 'refid': str(row.get('refid') or '')
        }.items()})
    trades = []
    for entry_id, row in trade_records.items():
        if not isinstance(row, dict):
            continue
        trades.append({
            'id': str(entry_id), 'time': row.get('time'), 'pair': str(row.get('pair', '')),
            'type': str(row.get('type', '')), 'price': safe_number(row.get('price')),
            'volume': safe_number(row.get('vol')), 'cost': safe_number(row.get('cost')),
            'fee': safe_number(row.get('fee'))
        })
    return {'format': 'compass-kraken-readonly-v1',
        'generatedAt': dt.datetime.now(dt.timezone.utc).isoformat().replace('+00:00','Z'),
        'balances': balances, 'ledgers': ledgers, 'trades': trades,
        'partial': ledgers_partial or trades_partial}


def main():
    print('Compass · Kraken API (NUR LESEN)')
    print('Bitte API-Key mit Query Funds, Query Ledger Entries und Query Closed Orders & Trades erstellen.')
    print('API-Secret wird nicht auf Festplatte oder an Compass-Server geschrieben.')
    key = getpass.getpass('Kraken API Key: ').strip()
    secret = getpass.getpass('Kraken API Secret: ').strip()
    if not key or not secret:
        raise ValueError('API Key und Secret sind erforderlich')
    payload = sync(key, secret)
    downloads = Path.home() / 'Downloads'
    downloads.mkdir(parents=True, exist_ok=True)
    target = downloads / ('compass_kraken_' + dt.datetime.now().strftime('%Y%m%d_%H%M%S') + '.json')
    # Do not create a private financial document with world-readable permissions.
    fd = os.open(str(target), os.O_CREAT | os.O_EXCL | os.O_WRONLY, 0o600)
    with os.fdopen(fd, 'w', encoding='utf-8') as stream:
        json.dump(payload, stream, ensure_ascii=False, indent=2)
    print('\nExport gespeichert: ' + str(target))
    print(f"Währungen: {len(payload['balances'])} · Ledger: {len(payload['ledgers'])} · Trades: {len(payload['trades'])}")
    if payload['partial']:
        print('ACHTUNG: Historie ist unvollständig. Weitere API-Seiten könnten vorhanden sein.')
    print('Datei in Compass → Finanzen → Portfolio importieren und anschließend lokal löschen.')


if __name__ == '__main__':
    try:
        main()
    except (ValueError, RuntimeError, OSError) as exc:
        print('Fehler: ' + str(exc)[:240], file=sys.stderr)
        sys.exit(1)
