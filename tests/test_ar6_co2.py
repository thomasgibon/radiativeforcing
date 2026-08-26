import csv
from pathlib import Path

import numpy as np
import pytest

from radiativeforcing.ar6.co2 import (
    AR6_CO2,
    climate_temperature_impulse_response,
    co2_agfp,
    co2_agtp,
    co2_agwp,
    co2_airborne_fraction,
    co2_effective_radiative_efficiency_ppb,
    co2_kg_per_ppm,
    co2_pulse_response,
)


ROOT = Path(__file__).parents[1]
AR6_TABLE = ROOT / "data" / "ar6" / "raw" / "metrics_supplement_cleaned.csv"


def published_co2_metrics():
    with AR6_TABLE.open(encoding="utf-8", newline="") as stream:
        rows = csv.DictReader(stream)
        row = next(item for item in rows if item["Formula"] == "CO2")
    return {key: float(value) for key, value in row.items() if value and key != "Name" and key != "CAS" and key != "Formula"}


def test_ar6_partition_fractions_and_airborne_fraction():
    assert sum(AR6_CO2.partition_fractions) == pytest.approx(1.0)

    years = np.arange(0, 501)
    fraction = co2_airborne_fraction(years)

    assert fraction[0] == pytest.approx(1.0)
    assert np.all(np.diff(fraction) < 0)
    assert fraction[-1] > AR6_CO2.partition_fractions[0]
    assert fraction[-1] == pytest.approx(0.28035, abs=5e-5)


def test_ar6_mass_and_radiative_efficiency_conversions():
    published = published_co2_metrics()

    assert co2_kg_per_ppm() == pytest.approx(7.8011788747e12, rel=1e-10)
    assert co2_effective_radiative_efficiency_ppb() == pytest.approx(
        published["Radiative efficiency (W m-2 ppb-1)"],
        rel=5e-3,
    )


@pytest.mark.parametrize(
    ("horizon", "column"),
    [
        (20, "AGWP20 (W m-2 yr kg-1)"),
        (100, "AGWP100 (W m-2 yr kg-1)"),
        (500, "AGWP500 (W m-2 yr kg-1)"),
    ],
)
def test_agwp_reproduces_published_ar6_rounding(horizon, column):
    assert float(co2_agwp(horizon)) == pytest.approx(
        published_co2_metrics()[column],
        rel=5e-3,
    )


@pytest.mark.parametrize(
    ("horizon", "column"),
    [
        (50, "AGTP50 (K kg-1)"),
        (100, "AGTP100 (K kg-1)"),
    ],
)
def test_agtp_reproduces_published_ar6_rounding(horizon, column):
    assert float(co2_agtp(horizon)) == pytest.approx(
        published_co2_metrics()[column],
        rel=5e-3,
    )


def test_analytic_metrics_match_numerical_integrals():
    years = np.linspace(0, 100, 20_001)
    numerical_agwp = np.trapezoid(co2_agfp(years), years)
    numerical_agtp = np.trapezoid(
        co2_agfp(years) * climate_temperature_impulse_response(100 - years),
        years,
    )

    assert numerical_agwp == pytest.approx(float(co2_agwp(100)), rel=1e-9)
    assert numerical_agtp == pytest.approx(float(co2_agtp(100)), rel=1e-8)


def test_one_tonne_response_keeps_units_and_scales_linearly():
    response = co2_pulse_response([0, 100, 500], emission_mass_kg=1000)

    assert response.atmospheric_mass_kg[0] == pytest.approx(1000)
    assert response.atmospheric_mass_kg[1] == pytest.approx(
        1000 * co2_airborne_fraction(100)
    )
    assert response.forcing_w_m2[0] == pytest.approx(1000 * co2_agfp(0))
    assert response.temperature_change_k[2] == pytest.approx(1000 * co2_agtp(500))


@pytest.mark.parametrize("invalid", [-1, np.nan, np.inf])
def test_time_validation_rejects_invalid_values(invalid):
    with pytest.raises(ValueError):
        co2_airborne_fraction(invalid)
