import json
import math
from html.parser import HTMLParser
from pathlib import Path

import pytest

from radiativeforcing.ar6.co2 import co2_agfp, co2_airborne_fraction


ROOT = Path(__file__).parents[1]
APP = ROOT / "app"
MODEL_PATH = APP / "data" / "co2-pulse.json"


def load_model():
    return json.loads(MODEL_PATH.read_text(encoding="utf-8"))


class IdCollector(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.scripts = []
        self.stylesheets = []

    def handle_starttag(self, tag, attrs):
        attributes = dict(attrs)
        if "id" in attributes:
            self.ids.add(attributes["id"])
        if tag == "script" and attributes.get("src"):
            self.scripts.append(attributes["src"])
        if tag == "link" and attributes.get("rel") == "stylesheet":
            self.stylesheets.append(attributes["href"])


def test_pulse_response_starts_at_emitted_mass_and_declines():
    model = load_model()

    assert model["emission_mass_kg"] == 1000
    assert model["model_id"] == "ipcc-ar6-wgi-ch7-co2-pulse"
    assert model["series"]["airborne_fraction"][0] == pytest.approx(1.0)

    fractions = model["series"]["airborne_fraction"]
    assert all(0 < fraction <= 1 for fraction in fractions)
    assert all(a >= b for a, b in zip(fractions, fractions[1:]))
    assert fractions[100] > fractions[500] > 0.2
    assert fractions == pytest.approx(co2_airborne_fraction(range(501)))
    assert model["series"]["forcing_w_m2_per_tonne"] == pytest.approx(
        1000 * co2_agfp(range(501))
    )


def test_pulse_components_are_well_formed_and_provenanced():
    model = load_model()

    assert model["assessment_status"]
    assert len(model["source"]["commit"]) == 40
    assert math.isclose(
        sum(component["amplitude"] for component in model["components"]),
        1.0,
        abs_tol=2e-6,
    )
    assert all(
        component["lifetime_years"] is None
        or component["lifetime_years"] > 0
        for component in model["components"]
    )
    assert model["generated_by"] == "scripts/export_browser_data.py"


def test_opening_page_has_required_interaction_and_accessible_chart():
    parser = IdCollector()
    parser.feed((APP / "index.html").read_text(encoding="utf-8"))

    required_ids = {
        "experiment",
        "emit-button",
        "reset-button",
        "time-slider",
        "play-button",
        "response-chart",
        "chart-title",
        "chart-description",
        "mass-value",
        "forcing",
        "forcing-chart",
        "forcing-chart-title",
        "forcing-chart-description",
        "forcing-time-slider",
        "forcing-value",
    }
    assert required_ids <= parser.ids
    assert parser.scripts == ["./app.js"]
    assert parser.stylesheets == ["./styles.css"]
    assert (APP / parser.scripts[0]).is_file()
    assert (APP / parser.stylesheets[0]).is_file()
