# Model status and known limitations

## AR6 CO2 vertical slice

The supported calculation in `src/radiativeforcing/ar6/co2.py` reproduces the
CO2 branch of the IPCC AR6 WGI Chapter 7 metric generator pinned in
`data/ar6/README.md`. Regression tests cover:

- the four-box atmospheric impulse response;
- concentration-to-forcing and atmosphere-mass conversions;
- instantaneous forcing and analytical integration;
- the two-timescale global temperature response; and
- published CO2 AGWP20, AGWP100, AGWP500, AGTP50, and AGTP100 values.

The browser pulse data is generated from this implementation. This validates
the CO2 vertical slice only; non-CO2 carbon-cycle adjustments, indirect effects,
and gas-specific metric values remain future Phase 2 work.

This document records the behavior found during the Phase 1 repository audit.
It describes the code as it exists; it is not a validation of the underlying
scientific implementation.

## Impulse response and GWP notebook

`01_impulse_response_and_gwp.ipynb`:

- Models most non-CO2 gases with a single exponential lifetime.
- Models CO2 as a persistent fraction plus three exponential components.
- Converts radiative efficiency per ppb to a response per kg using atmospheric
  mass, mean atmospheric molar mass, gas molar mass, and a correction factor.
- Integrates forcing with a cumulative rectangular sum and calculates GWP as
  the ratio of each integrated response to the CO2 response.
- Uses the historical table values without a row-by-row extraction record.

The integration convention, endpoint handling, correction factors, and expected
tolerances against published values need explicit validation in Phase 2.

## Emission profile notebook

`02_emission_profiles_and_convolution.ipynb`:

- Interpolates piecewise-linear annual emission profiles.
- Uses hand-derived analytical expressions to combine emissions with a
  single-exponential or multi-exponential decay response.
- Demonstrates constant CO2 and methane emission profiles through 2200.

Known issues to resolve before treating its results as scientific output:

- The function name `concentration` does not state its output units.
- `c_0=275` is combined with profiles labeled kg/year, so the initial-condition
  units are ambiguous.
- The `step` argument is unused and the implementation assumes annual spacing.
- Input validation relies on assertions and exact Python `float` type checks.
- Debug output is printed during calculation.
- The analytical expressions have no regression or conservation tests.
- The radiative-efficiency conversion assumes a linear marginal response; its
  valid scope is not explained in the notebook.

These points are intentionally documented rather than silently altered during
repository cleanup. Phase 2 will replace them with explicit, unit-aware,
tested calculations after the AR6 source audit.

## Legacy scripts

See `legacy/README.md`. Neither legacy script is part of the reproducible
notebook path.
