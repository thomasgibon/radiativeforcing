import hashlib
import json
from pathlib import Path


ROOT = Path(__file__).parents[1]
AR6 = ROOT / "data" / "ar6"


def test_pinned_ar6_table_matches_local_manifest():
    manifest = json.loads((AR6 / "source.json").read_text(encoding="utf-8"))
    table = AR6 / "raw" / "metrics_supplement_cleaned.csv"

    assert len(manifest["commit"]) == 40
    assert hashlib.sha256(table.read_bytes()).hexdigest() == manifest["local_sha256"]
    assert manifest["upstream_sha256"] != manifest["local_sha256"]
    assert "terminating LF" in manifest["local_normalization"]


def test_ar6_table_has_expected_schema_and_scope():
    lines = (AR6 / "raw" / "metrics_supplement_cleaned.csv").read_text(
        encoding="utf-8"
    ).splitlines()

    assert lines[0].startswith("Name,CAS,Acronym,Formula,Lifetime (yr)")
    assert "AGWP100 (W m-2 yr kg-1)" in lines[0]
    assert "AGTP100 (K kg-1)" in lines[0]
    assert len(lines) == 251
