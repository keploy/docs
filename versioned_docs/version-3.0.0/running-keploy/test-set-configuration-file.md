---
title: Test-Set Configuration File (config.yaml)
description: How to define per test-set configuration (like overriding appCommand) using config.yaml placed alongside mock.yaml.
---

# Test-Set Configuration File

Each Keploy test-set can have its own lightweight configuration file. Create a file named `config.yaml` in the **same directory** as the corresponding `mock.yaml` (and any captured test data). This lets you override runtime parameters (like the application start command) or supply per test-set scripts/metadata without affecting other sets.

## File Location

```
tests/
	my-test-set/
		mock.yaml          # Recorded mocks for this test-set
		config.yaml        # Test-set specific configuration (optional)
		...                # Any other assets
```

If `config.yaml` is absent, Keploy falls back to global/default settings.

## Minimal Use Case: Override appCommand

To run the application under test with a different command (env vars, flags, image, binary path, etc.) only for this test-set, place a `config.yaml` beside `mock.yaml` containing just the `appCommand` key:

```yaml
appCommand: docker run --rm --name python-api \
	--network python-api-network \
	-e DATABASE_URL=mysql+pymysql://user:password@mysql-db:3306/fastapi_db \
	-e SECRET_KEY=super-secret-key-for-testing \
	-e ACCESS_TOKEN_EXPIRE_MINUTES=5 \
	-p 8000:8000 python-rest-api
```

That’s all you need when your only goal is to override how the app starts during replay for this specific test-set.

## Available (Optional) Keys

You can extend `config.yaml` later if needed. Common fields (all optional unless noted):

common example -

```yaml
preScript: ""
postScript: ""
template: {}
mockRegistry: null
appCommand: <my test-set specific app command>
metadata:
  name: flask-mysql-app
```

| Key            | Purpose                                                                                                                    |
| -------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `appCommand`   | Command Keploy should run to start the application for this test-set. Overrides any global/app-level command.              |
| `preScript`    | Shell script (inline or path) executed before starting the app / replaying tests. Use for seeding DB, cleaning state, etc. |
| `postScript`   | Shell script executed after tests finish (cleanup, exporting artifacts).                                                   |
| `mockId`       | Explicit identifier if you maintain multiple mock groups in the same folder and need disambiguation.                       |
| `template`     | A map/object for advanced templating or variable substitution (future/advanced usage).                                     |
| `mockRegistry` | (Optional) Registry or remote reference for fetching mocks if they aren’t local.                                           |
| `metadata`     | Arbitrary informational fields (e.g., `name`, `owner`, `tags`). Non-functional but useful for organization.                |

> Note: Only include the keys you actually need. Unused keys can be omitted entirely.

## Tips & Best Practices

1. Keep the minimal override: if you only change the start command, only keep `appCommand`—simpler diffs and fewer merge conflicts.
2. Avoid storing secrets directly; prefer referencing environment files or secret managers.
3. Use descriptive `metadata.name` to make CI logs clearer when multiple test-sets run.
4. Validate the command manually once before relying on it in automated replay.

## Troubleshooting

| Symptom                             | Likely Cause                                                        | Fix                                                       |
| ----------------------------------- | ------------------------------------------------------------------- | --------------------------------------------------------- |
| App doesn’t start for this test-set | Typo in `appCommand` or missing image                               | Run the command locally; ensure image/tag exists.         |
| Pre/post script not executed        | Wrong key name (`preScript`/`postScript`) or YAML indentation error | Validate YAML (e.g., with `yamllint`) and check spelling. |
| Wrong mocks used                    | Missing/incorrect `mockId` when multiple sets present               | Add/adjust `mockId` or standardize directory structure.   |

## Quick Validation Checklist

- `config.yaml` sits beside `mock.yaml`.
- YAML parses (`yamllint config.yaml`).
- Only necessary keys included.
- `appCommand` works standalone in your shell.

---
