"""CO2 pulse metrics following the IPCC AR6 Chapter 7 implementation.

The formulas and defaults reproduce the CO2 branch of the metric generator at
IPCC-WG1/Chapter-7 commit 2f948c862dbc158182ba47b863395ec1a4aa7998.
Absolute metrics are expressed per kilogram unless an emission mass is passed
explicitly to :func:`co2_pulse_response`.
"""

from __future__ import annotations

from dataclasses import dataclass

import numpy as np
from numpy.typing import ArrayLike, NDArray


@dataclass(frozen=True)
class CO2PulseParameters:
    """Assessed central parameters used by the AR6 CO2 metric calculation."""

    atmospheric_mass_kg: float = 5.1352e18
    mean_air_molar_mass_kg_mol: float = 28.97e-3
    co2_molar_mass_kg_mol: float = 44.01e-3
    background_co2_ppm: float = 409.9
    background_n2o_ppb: float = 332.1
    rapid_adjustment_fraction: float = 0.05
    partition_fractions: tuple[float, float, float, float] = (
        0.2173,
        0.2240,
        0.2824,
        0.2763,
    )
    decay_times_years: tuple[float, float, float] = (394.4, 36.54, 4.304)
    thermal_times_years: tuple[float, float] = (
        3.424102092311,
        285.003477841911,
    )
    thermal_coefficients_k_per_w_m2: tuple[float, float] = (
        0.443767728883447,
        0.313998206372015,
    )


@dataclass(frozen=True)
class PulseResponse:
    """Linked physical quantities resulting from a CO2 pulse emission."""

    years: NDArray[np.float64]
    airborne_fraction: NDArray[np.float64]
    atmospheric_mass_kg: NDArray[np.float64]
    forcing_w_m2: NDArray[np.float64]
    integrated_forcing_w_m2_year: NDArray[np.float64]
    temperature_change_k: NDArray[np.float64]


AR6_CO2 = CO2PulseParameters()


def _years(values: ArrayLike) -> NDArray[np.float64]:
    result = np.asarray(values, dtype=float)
    if np.any(~np.isfinite(result)) or np.any(result < 0):
        raise ValueError("Time values must be finite and non-negative.")
    return result


def co2_airborne_fraction(
    years: ArrayLike,
    parameters: CO2PulseParameters = AR6_CO2,
) -> NDArray[np.float64]:
    """Return the fraction of a pulse remaining in the atmosphere.

    The constant first term represents a remainder that persists over the
    metric's 500-year calculation window. Geological removal processes on much
    longer timescales are outside this response function.
    """

    time = _years(years)
    fractions = np.asarray(parameters.partition_fractions)
    lifetimes = np.asarray(parameters.decay_times_years)
    finite_boxes = np.sum(
        fractions[1:] * np.exp(-time[..., np.newaxis] / lifetimes),
        axis=-1,
    )
    return fractions[0] + finite_boxes


def meinshausen_co2_forcing(
    concentration_ppm: ArrayLike,
    reference_ppm: float,
    n2o_ppb: float,
) -> NDArray[np.float64]:
    """Return CO2 radiative forcing using the FaIR 1.6.2 relationship.

    This is the CO2 branch of ``fair.forcing.ghg.meinshausen`` with
    ``scale_F2x=False``, as called by the pinned AR6 metric generator. Inputs
    are CO2 in ppm and N2O in ppb; the result is W m-2.
    """

    concentration = np.asarray(concentration_ppm, dtype=float)
    if reference_ppm <= 0 or n2o_ppb < 0:
        raise ValueError("Reference CO2 must be positive and N2O non-negative.")
    if np.any(~np.isfinite(concentration)) or np.any(concentration <= 0):
        raise ValueError("CO2 concentrations must be finite and positive.")

    a1 = -2.4785e-7
    b1 = 7.5906e-4
    c1 = -2.1492e-3
    d1 = 5.2488
    maximum = reference_ppm - b1 / (2 * a1)
    difference = concentration - reference_ppm
    alpha_prime = np.where(
        concentration <= reference_ppm,
        d1,
        np.where(
            concentration <= maximum,
            d1 + a1 * difference**2 + b1 * difference,
            d1 - b1**2 / (4 * a1),
        ),
    )
    alpha_n2o = c1 * np.sqrt(n2o_ppb)
    return (alpha_prime + alpha_n2o) * np.log(concentration / reference_ppm)


def co2_effective_radiative_efficiency_ppb(
    parameters: CO2PulseParameters = AR6_CO2,
) -> float:
    """Return effective radiative efficiency in W m-2 ppb-1.

    One ppb of CO2 is 0.001 ppm. The finite difference and 5% rapid adjustment
    reproduce the value written to the AR6 cleaned metric table.
    """

    forcing = meinshausen_co2_forcing(
        parameters.background_co2_ppm + 0.001,
        parameters.background_co2_ppm,
        parameters.background_n2o_ppb,
    )
    return float(forcing * (1 + parameters.rapid_adjustment_fraction))


def co2_kg_per_ppm(parameters: CO2PulseParameters = AR6_CO2) -> float:
    """Return kilograms of atmospheric CO2 corresponding to one ppm."""

    return (
        1e-6
        * (parameters.co2_molar_mass_kg_mol / parameters.mean_air_molar_mass_kg_mol)
        * parameters.atmospheric_mass_kg
    )


def co2_effective_forcing_per_kg(
    parameters: CO2PulseParameters = AR6_CO2,
) -> float:
    """Return the AR6 pulse calculation's initial forcing in W m-2 kg-1."""

    forcing_per_ppm = meinshausen_co2_forcing(
        parameters.background_co2_ppm + 1.0,
        parameters.background_co2_ppm,
        parameters.background_n2o_ppb,
    )
    effective_forcing = forcing_per_ppm * (
        1 + parameters.rapid_adjustment_fraction
    )
    return float(effective_forcing / co2_kg_per_ppm(parameters))


def co2_agfp(
    years: ArrayLike,
    parameters: CO2PulseParameters = AR6_CO2,
) -> NDArray[np.float64]:
    """Return instantaneous effective forcing in W m-2 per kg emitted."""

    return co2_effective_forcing_per_kg(parameters) * co2_airborne_fraction(
        years, parameters
    )


def co2_agwp(
    horizon_years: ArrayLike,
    parameters: CO2PulseParameters = AR6_CO2,
) -> NDArray[np.float64]:
    """Return integrated effective forcing in W m-2 yr per kg emitted."""

    horizon = _years(horizon_years)
    fractions = np.asarray(parameters.partition_fractions)
    lifetimes = np.asarray(parameters.decay_times_years)
    integral = fractions[0] * horizon + np.sum(
        fractions[1:]
        * lifetimes
        * (1 - np.exp(-horizon[..., np.newaxis] / lifetimes)),
        axis=-1,
    )
    return co2_effective_forcing_per_kg(parameters) * integral


def climate_temperature_impulse_response(
    years: ArrayLike,
    parameters: CO2PulseParameters = AR6_CO2,
) -> NDArray[np.float64]:
    """Return temperature response to a forcing impulse.

    Units are K per (W m-2 yr). Convolution with an AGFP time series over years
    produces temperature change in K.
    """

    time = _years(years)
    thermal_times = np.asarray(parameters.thermal_times_years)
    thermal_coefficients = np.asarray(
        parameters.thermal_coefficients_k_per_w_m2
    )
    return np.sum(
        (thermal_coefficients / thermal_times)
        * np.exp(-time[..., np.newaxis] / thermal_times),
        axis=-1,
    )


def co2_agtp(
    horizon_years: ArrayLike,
    parameters: CO2PulseParameters = AR6_CO2,
) -> NDArray[np.float64]:
    """Return global temperature change at a horizon in K per kg emitted."""

    horizon = _years(horizon_years)
    fractions = np.asarray(parameters.partition_fractions)
    lifetimes = np.asarray(parameters.decay_times_years)
    thermal_times = np.asarray(parameters.thermal_times_years)
    thermal_coefficients = np.asarray(
        parameters.thermal_coefficients_k_per_w_m2
    )
    forcing_per_kg = co2_effective_forcing_per_kg(parameters)

    persistent = np.sum(
        fractions[0]
        * thermal_coefficients
        * (1 - np.exp(-horizon[..., np.newaxis] / thermal_times)),
        axis=-1,
    )
    finite = np.zeros_like(horizon, dtype=float)
    for fraction, lifetime in zip(fractions[1:], lifetimes, strict=True):
        finite += np.sum(
            fraction
            * lifetime
            * thermal_coefficients
            * (
                np.exp(-horizon[..., np.newaxis] / lifetime)
                - np.exp(-horizon[..., np.newaxis] / thermal_times)
            )
            / (lifetime - thermal_times),
            axis=-1,
        )
    return forcing_per_kg * (persistent + finite)


def co2_pulse_response(
    years: ArrayLike,
    emission_mass_kg: float = 1.0,
    parameters: CO2PulseParameters = AR6_CO2,
) -> PulseResponse:
    """Return linked burden, forcing, cumulative forcing, and temperature."""

    if not np.isfinite(emission_mass_kg) or emission_mass_kg < 0:
        raise ValueError("Emission mass must be finite and non-negative.")
    time = np.atleast_1d(_years(years))
    fraction = co2_airborne_fraction(time, parameters)
    return PulseResponse(
        years=time,
        airborne_fraction=fraction,
        atmospheric_mass_kg=emission_mass_kg * fraction,
        forcing_w_m2=emission_mass_kg * co2_agfp(time, parameters),
        integrated_forcing_w_m2_year=emission_mass_kg
        * co2_agwp(time, parameters),
        temperature_change_k=emission_mass_kg * co2_agtp(time, parameters),
    )
