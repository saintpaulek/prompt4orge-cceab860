import json
from collections import Counter
from pathlib import Path

source = Path('/home/ubuntu/upload/pasted_content_3.txt')
records = json.loads(source.read_text())
required = {'id', 'title', 'category', 'role', 'tags', 'access', 'prompt'}
missing = sorted(required - set(records[0])) if records else sorted(required)
ids = [str(row.get('id')) for row in records]
categories = Counter(row.get('category') for row in records)
access = Counter(str(row.get('access', '')).upper() for row in records)
print(json.dumps({
    'total': len(records),
    'missing_fields_first_record': missing,
    'duplicate_ids': len(ids) - len(set(ids)),
    'min_id': min(ids) if ids else None,
    'max_id': max(ids) if ids else None,
    'categories': dict(sorted(categories.items())),
    'access': dict(sorted(access.items())),
    'invalid_access_values': sorted(set(access) - {'FREE', 'LOCKED'}),
    'empty_prompts': sum(not str(row.get('prompt', '')).strip() for row in records),
}, indent=2))
