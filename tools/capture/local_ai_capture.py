#!/usr/bin/env python3
"""Explicit local-only LM Studio capture suggestions. No Notion connection, no cloud fallback."""
import argparse
import json
from pathlib import Path
from urllib.request import Request, urlopen

ENDPOINT = 'http://127.0.0.1:1234/v1/chat/completions'
SYSTEM = '''Analysiere nur ausdrücklich genannte Ergebnisse und Folgepunkte aus den gelieferten Notizen.
Erfinde KEINE Fristen, Personen, Zusagen oder Tatsachen.
Gib ausschließlich ein JSON Objekt {"items": [{"title": str, "note": str, "kind": str, "tags": []}]} zurück.
kind ist einer von: Aktion, Waiting For, Gesprächspunkt, Beschluss, Idee, Ungeklärt.
Höchstens 30 Vorschläge. Unklare Dinge bleiben Ungeklärt. Das Ergebnis ist ein Entwurf, keine gespeicherte Aufgabe.'''

def main():
    ap = argparse.ArgumentParser(description='Lokal über LM Studio Entwürfe für Compass erzeugen')
    ap.add_argument('--input', required=True, help='Textdatei nur mit den zu extrahierenden Gesprächsergebnissen')
    ap.add_argument('--output', required=True, help='Ausgabepfad für einen Compass-JSON-Entwurf')
    ap.add_argument('--model', default='local-model', help='In LM Studio geladener Modellname')
    args = ap.parse_args()
    data = Path(args.input).read_text(encoding='utf-8')
    if not 1 <= len(data) <= 40000:
        ap.error('Text muss 1 bis 40000 Zeichen enthalten.')
    payload = json.dumps({'model': args.model, 'stream': False, 'temperature': 0.1,
        'messages': [{'role': 'system', 'content': SYSTEM}, {'role': 'user', 'content': data}]}, ensure_ascii=False).encode('utf-8')
    req = Request(ENDPOINT, data=payload, headers={'Content-Type': 'application/json'}, method='POST')
    with urlopen(req, timeout=90) as response:
        obj = json.load(response)
    content = obj['choices'][0]['message']['content'].strip()
    if content.startswith('```'):
        content = content.split('\n', 1)[1].rsplit('```', 1)[0].strip()
    result = json.loads(content)
    if not isinstance(result, dict) or not isinstance(result.get('items'), list) or len(result['items']) > 40:
        raise ValueError('Modell hat keine gültige Vorschlagsliste ausgegeben.')
    Path(args.output).write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')
    print(f'{len(result["items"])} Entwürfe in {args.output} gespeichert. Vor dem Import in Compass prüfen.')

if __name__ == '__main__':
    main()
