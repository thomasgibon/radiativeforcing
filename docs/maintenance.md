# Repository maintenance

## Notebook policy

Notebook source is versioned; generated cell outputs and execution counters are
not. Before committing a notebook, clear its outputs with:

```shell
uv run jupyter nbconvert --clear-output --inplace notebooks/*.ipynb
```

For verification, execute notebooks into the ignored `build/notebooks`
directory instead of overwriting the source copy.

Notebook calculations must not become a second implementation once the core
package is introduced. They should import tested functions and focus on the
explanation and visual narrative.

## Data policy

- Preserve source assessment versions in separate directories.
- Record the source publication, table, page, units, extraction method, and any
  transformation for every parameter set.
- Never replace AR5 values in place with AR6 or later values.
- Prefer links and citations over bundled third-party PDFs.

## Legacy code

Files in `legacy/` are retained for historical reference. They are not part of
the supported execution path and should not be imported by notebooks, tests,
or the future application.
