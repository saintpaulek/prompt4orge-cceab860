from __future__ import annotations

import base64
import json
from pathlib import Path

ROOT = Path('/home/ubuntu/promptforge')
OUT = ROOT / 'vercel_deploy_input.json'
EXCLUDED_DIRS = {'.git', 'node_modules', 'dist', 'build', '.manus-logs', '.cache', '.vite', 'coverage'}
EXCLUDED_FILES = {'.env', '.env.local', '.env.production', 'vercel_deploy_input.json'}

files = []
for path in sorted(ROOT.rglob('*')):
    if not path.is_file():
        continue
    rel_path = path.relative_to(ROOT)
    rel = rel_path.as_posix()
    if set(rel_path.parts) & EXCLUDED_DIRS or path.name in EXCLUDED_FILES:
        continue
    if rel.startswith('.git/'):
        continue
    data = path.read_bytes()
    try:
        text = data.decode('utf-8')
    except UnicodeDecodeError:
        files.append({'file': rel, 'encoding': 'base64', 'data': base64.b64encode(data).decode('ascii')})
    else:
        files.append({'file': rel, 'encoding': 'utf-8', 'data': text})

payload = {
    'name': 'promptforge',
    'target': 'production',
    'teamId': 'team_Rsouh99PDwyoLQ1NSaVEmiVF',
    'projectSettings': {
        'framework': 'vite',
        'installCommand': 'pnpm install --frozen-lockfile',
        'buildCommand': 'pnpm build',
    },
    'files': files,
}
OUT.write_text(json.dumps(payload), encoding='utf-8')
print(f'prepared {len(files)} source files ({OUT.stat().st_size} bytes)')
