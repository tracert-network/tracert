# templates/

A complete, valid, annotated starting point for a new capability. Nothing here is a live capability — the validator only scans `providers/*/capabilities/`, so `templates/` is reference material.

```
example-provider/
  capabilities/example-capability.yaml        an annotated TRACE Manifest (acme.summarize-text)
  schemas/example-capability.input.schema.json
  schemas/example-capability.output.schema.json
```

To publish your own: copy `example-provider/` to `../providers/<your-provider-id>/`, rename and fill in the files, then run `npm run validate` from `registry/`. Full guide: [`../CONTRIBUTING.md`](../CONTRIBUTING.md).
