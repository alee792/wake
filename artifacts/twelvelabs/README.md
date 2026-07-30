# TwelveLabs artifact handoff

Paste the real Pegasus provider envelope, unchanged, at:

`artifacts/twelvelabs/pegasus-pasted-output.json`

Do not place a rewritten or curated payload at that path. Validation reports,
selected highlights, and Wake normalization are separate sibling artifacts:

- `pegasus-validation.json`
- `pegasus-curation.json`
- `jockey-raw-response.json`
- `jockey-observation.json`

The Pegasus request is human-operated. Repository code validates and imports the
result but does not make the Pegasus API call.
