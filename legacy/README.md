# Legacy code

These scripts are preserved as historical references and are not supported:

- `gwp_animation.py` is the original Matplotlib animation script. It contains
  an unimplemented calculation function, uses obsolete pandas APIs, and expects
  a generated CSV file that was never committed.
- `fair_gwp_reference.py` is a partial copy of an older FaIR helper and cannot
  run independently because its package-relative imports and surrounding
  constants are absent.

Useful behavior should be reimplemented in the tested core package rather than
repairing these files in place.
