# IPCC AR6 metric data

This directory preserves the machine-readable greenhouse-gas metric table used
for the IPCC Sixth Assessment Report, Working Group I, Chapter 7 scientific
audit.

## Pinned source

- Repository: <https://github.com/IPCC-WG1/Chapter-7>
- Repository DOI: <https://doi.org/10.5281/zenodo.5211357>
- Commit: `2f948c862dbc158182ba47b863395ec1a4aa7998`
- Commit date: 2022-09-27
- Source path: `data_output/7sm/metrics_supplement_cleaned.csv`
- Upstream SHA-256: `584fe16c1ffe454a0db4656857f54176cbf290d55a6775ea4e060ae2f461930c`
- Local SHA-256: `0eaa91b2626bb60b0c69be08ebc90ac1aab61c33baca402c8977dcbc93524943`

The upstream file has no terminating newline. The local text representation
adds one terminating LF so it can be maintained by the repository patching
tools; all CSV records and field values are otherwise unchanged. Both hashes
are recorded so that this normalization remains visible.

The upstream repository is distributed under the 3-Clause BSD License. Its
README notes that the cleaned output corrects erroneous CFC-11 and CFC-12
values in printed Supplementary Table 7.SM.7 and can differ occasionally in
third-significant-figure rounding.

## Scientific sources

- Forster et al. (2021), IPCC AR6 WGI Chapter 7:
  <https://doi.org/10.1017/9781009157896.009>
- Smith et al. (2021), Chapter 7 Supplementary Material:
  <https://www.ipcc.ch/report/ar6/wg1/downloads/report/IPCC_AR6_WGI_Chapter_07_Supplementary_Material.pdf>
- Joos et al. (2013), CO2 impulse response:
  <https://doi.org/10.5194/acp-13-2793-2013>
- Meinshausen et al. (2020), greenhouse-gas forcing relationships:
  <https://doi.org/10.5194/gmd-13-3571-2020>

## CO2 calculation conventions

The pinned AR6 generation notebook and `src/ar6/metrics/co2.py` use:

- 2019 background concentrations of 409.9 ppm CO2 and 332.1 ppb N2O;
- the Meinshausen concentration-to-forcing relationship from FaIR 1.6.2;
- a 5% enhancement for the assessed CO2 tropospheric rapid adjustment;
- the Joos four-box response with fractions
  `(0.2173, 0.2240, 0.2824, 0.2763)` and finite timescales
  `(394.4, 36.54, 4.304)` years; and
- the two-timescale temperature response with timescales
  `(3.424102092311, 285.003477841911)` years and coefficients
  `(0.443767728883447, 0.313998206372015)` K per W m-2.

The local implementation reproduces these equations without importing the
entire historical FaIR 1.6.2 package. Its regression tests compare calculated
CO2 AGWP and AGTP values with the cleaned AR6 table.
