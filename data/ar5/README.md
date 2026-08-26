# AR5-era input data

These files preserve the parameter set used by the original notebooks. They
have been renamed for clarity but their numeric values have not been updated.

## Files

- `ghg_properties.csv`: lifetimes, radiative efficiencies, GWP/GTP reference
  values, molar masses, and correction factors for greenhouse gases.
- `co2_properties.csv`: coefficients and time constants for the CO2
  impulse-response function used in the original notebook.
- `co2_fit_parameters.dat`: fits for several carbon-cycle models, including the
  multi-model mean used in `co2_properties.csv`.

The three CO2 time-constant columns were renamed from visually ambiguous
Cyrillic `т` labels to `tau1`, `tau2`, and `tau3`; values are unchanged.

## Provenance and limitations

The original notebook cites IPCC AR5 Working Group I Chapter 8, Joos et al.
(2013), Hodnebrog et al. (2013), and Millar et al. (2017). The table currently
has no machine-readable provenance record showing the exact extraction steps
for every row. Consequently, it must be treated as a historical reproduction
dataset until the values have been checked against the cited sources.

Phase 2 will begin with a separate AR6 source audit. Any AR6 data will be stored
in its own versioned directory rather than silently replacing this baseline.

