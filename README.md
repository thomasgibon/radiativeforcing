# Radiative forcing

This project explains how greenhouse-gas atmospheric decay and radiative
efficiency combine into instantaneous radiative forcing, integrated forcing,
and global warming potential (GWP). It also contains an early model of the
forcing caused by time-varying emission profiles.

The repository is currently an educational notebook project. The next stages
will extract a tested calculation library and build an interactive application.
The canonical scientific narrative, phased roadmap, technical architecture,
and completion criteria are maintained in
[`docs/implementation-plan.md`](docs/implementation-plan.md).

## Narrative prototype

The opening interactive scene is available in [`app/`](app/). It releases a
one-tonne CO2 pulse, animates the atmospheric fraction remaining using the
validated AR6 calculation core, and introduces the resulting Earth energy
imbalance one concept at a time.

```shell
uv run python -m http.server 8000
```

Open <http://localhost:8000/app/>. The prototype has no JavaScript build step;
see [`app/README.md`](app/README.md) for its scientific status.

## Notebooks

- [`notebooks/01_impulse_response_and_gwp.ipynb`](notebooks/01_impulse_response_and_gwp.ipynb)
  derives impulse-response functions and GWP values from the bundled AR5-era
  parameter tables.
- [`notebooks/02_emission_profiles_and_convolution.ipynb`](notebooks/02_emission_profiles_and_convolution.ipynb)
  is an exploratory prototype for applying those responses to emission
  profiles. Its equations and units have not yet received the validation
  planned for Phase 2.

The notebook outputs are intentionally cleared in version control. Execute the
notebooks to regenerate their tables and figures. GitHub Actions executes both
notebooks from a locked environment on every push and pull request.

## Set up

The recommended environment manager is [uv](https://docs.astral.sh/uv/):

```shell
uv sync
uv run jupyter lab
```

The notebooks locate `data/ar5` whether Jupyter is started in the repository
root or in the `notebooks` directory.

To execute both notebooks non-interactively:

```shell
uv run jupyter nbconvert --to notebook --execute --output-dir build/notebooks notebooks/01_impulse_response_and_gwp.ipynb
uv run jupyter nbconvert --to notebook --execute --output-dir build/notebooks notebooks/02_emission_profiles_and_convolution.ipynb
```

## Repository layout

- `data/ar5/`: historical input tables and their provenance notes
- `docs/`: model status, maintenance, and literature documentation
- `legacy/`: preserved scripts that are not part of the supported code path
- `notebooks/`: explanatory and exploratory notebooks
- `tests/`: scientific regression tests to be introduced with the core model

## Scientific status

The current calculations were developed from IPCC Fifth Assessment Report
(AR5)-era parameters and related literature. They are retained as a historical
baseline, not presented as the latest recommended factors. Before building the
shared calculation package, the project will audit the IPCC Sixth Assessment
Report (AR6) data, conventions, corrections, and machine-readable sources.

This software is educational and should not yet be used for regulatory,
inventory, or financial reporting.

## License

No open-source license has been selected yet. Until the copyright holder adds
one, the default copyright restrictions apply. Third-party data and literature
remain subject to their respective source terms.
