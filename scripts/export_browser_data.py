"""Export validated AR6 CO2 pulse data for the dependency-free prototype."""

from __future__ import annotations

import json
from pathlib import Path

import numpy as np

from radiativeforcing.ar6.co2 import (
    AR6_CO2,
    co2_agtp,
    co2_agwp,
    co2_effective_forcing_per_kg,
    co2_effective_radiative_efficiency_ppb,
    co2_pulse_response,
)


ROOT = Path(__file__).parents[1]
OUTPUT = ROOT / "app" / "data" / "co2-pulse.json"


def rounded(values, significant_digits=12):
    return [float(f"{value:.{significant_digits}g}") for value in values]


def build_payload():
    years = np.arange(0.0, 501.0, 1.0)
    response = co2_pulse_response(years, emission_mass_kg=1000.0)
    parameters = AR6_CO2
    calculated = {
        "agwp20_w_m2_year_kg": float(co2_agwp(20)),
        "agwp100_w_m2_year_kg": float(co2_agwp(100)),
        "agwp500_w_m2_year_kg": float(co2_agwp(500)),
        "agtp50_k_kg": float(co2_agtp(50)),
        "agtp100_k_kg": float(co2_agtp(100)),
    }
    return {
        "schema_version": 2,
        "generated_by": "scripts/export_browser_data.py",
        "model_id": "ipcc-ar6-wgi-ch7-co2-pulse",
        "display_name": "CO2 pulse response (IPCC AR6)",
        "assessment_status": "Reproduces the IPCC AR6 WGI Chapter 7 CO2 metric calculation",
        "emission_mass_kg": 1000,
        "effective_radiative_efficiency_w_m2_ppb": co2_effective_radiative_efficiency_ppb(),
        "initial_forcing_w_m2_per_kg": co2_effective_forcing_per_kg(),
        "components": [
            {
                "amplitude": parameters.partition_fractions[0],
                "lifetime_years": None,
                "meaning": "Long-lived remainder over the 500-year metric window",
            },
            *[
                {"amplitude": amplitude, "lifetime_years": lifetime}
                for amplitude, lifetime in zip(
                    parameters.partition_fractions[1:],
                    parameters.decay_times_years,
                    strict=True,
                )
            ],
        ],
        "thermal_response": {
            "timescales_years": list(parameters.thermal_times_years),
            "coefficients_k_per_w_m2": list(
                parameters.thermal_coefficients_k_per_w_m2
            ),
        },
        "series": {
            "years": rounded(response.years, 8),
            "airborne_fraction": rounded(response.airborne_fraction),
            "forcing_w_m2_per_tonne": rounded(response.forcing_w_m2),
            "temperature_change_k_per_tonne": rounded(
                response.temperature_change_k
            ),
        },
        "metrics": {
            "calculated": calculated,
            "published_rounded": {
                "agwp20_w_m2_year_kg": 2.43e-14,
                "agwp100_w_m2_year_kg": 8.95e-14,
                "agwp500_w_m2_year_kg": 3.14e-13,
                "agtp50_k_kg": 4.28e-16,
                "agtp100_k_kg": 3.95e-16,
            },
        },
        "source": {
            "assessment": "IPCC AR6 WGI Chapter 7",
            "repository": "https://github.com/IPCC-WG1/Chapter-7",
            "commit": "2f948c862dbc158182ba47b863395ec1a4aa7998",
            "table_path": "data_output/7sm/metrics_supplement_cleaned.csv",
            "calculation_path": "src/ar6/metrics/co2.py",
            "generation_notebook": "notebooks/335_chapter7_generate_metrics.ipynb",
            "repository_data_path": "data/ar6/raw/metrics_supplement_cleaned.csv",
        },
        "display": {
            "maximum_year": 500,
            "quantity": "fraction of emitted CO2 remaining in the atmosphere",
            "long_timescale_note": "Beyond this 500-year window, ocean–sediment chemistry and rock weathering continue to draw down the long-lived remainder over tens to hundreds of thousands of years and longer; these processes are not represented here.",
        },
    }


def main():
    OUTPUT.write_text(
        json.dumps(build_payload(), indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    print(f"Wrote {OUTPUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
