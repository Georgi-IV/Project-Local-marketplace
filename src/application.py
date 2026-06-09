from __future__ import annotations

from typing import List


def get_project_name() -> str:
    """Return the name of the project."""
    return "Local Marketplace"


def list_components() -> List[str]:
    """Return the main project component directories."""
    return ["backend", "frontend", "src", "tests"]
