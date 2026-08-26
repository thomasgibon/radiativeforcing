# Tests

The test suite now covers the first Phase 2 scientific vertical slice:

- integrity and schema of the pinned AR6 metric table;
- CO2 atmospheric impulse response and mass conversion;
- effective radiative forcing, AGWP, and temperature response equations;
- reproduction of the published AR6 CO2 AGWP and AGTP checkpoints;
- agreement between analytical expressions and numerical integration; and
- consistency and basic accessibility of the generated narrative prototype.

Run it with:

```shell
uv run pytest
```

Executing notebooks remains a separate reproducibility check and is not a
substitute for the scientific regression tests.
