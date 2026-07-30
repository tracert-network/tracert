# examples/

Complete, realistic, schema-valid manifests to **read for calibration** — how much detail belongs in `description`/`excludes`, how pricing and provenance vary across capability types. These are reference material, **not** the copy-me starting point (that is [`../templates/example-provider/`](../templates/example-provider/)), and nothing here is a live capability (the validator only serves `providers/*/capabilities/`).

| Example | Shows |
|---|---|
| [`free-geocode/`](free-geocode/) | A **free**, first-party capability — `pricing.free: true`, no payment fields, `input_retention.policy: none`. |
| [`unofficial-wrapper/`](unofficial-wrapper/) | An **unofficial BYOK wrapper** of a third-party API — `provenance.integration_status: unofficial` with a distinct `adapter_operator`, `payment_offers: [byok]`, `input_retention.policy: ephemeral`, and honest "not affiliated / not endorsed" labelling. |

`npm run validate` from `registry/` checks these against the TRACE Manifest schema too, so they can't silently rot.
