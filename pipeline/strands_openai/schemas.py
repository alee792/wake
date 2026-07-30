from __future__ import annotations

from pydantic import BaseModel, ConfigDict, Field, field_validator


class CoachOutput(BaseModel):
    """The frozen athlete-facing coaching artifact."""

    model_config = ConfigDict(extra="forbid", strict=True)

    headline: str = Field(min_length=1)
    explanation: str = Field(min_length=1)
    cue: str = Field(min_length=1)
    drill: str = Field(min_length=1)
    successCriterion: str = Field(min_length=1)
    citedObservationIds: list[str] = Field(min_length=1)
    limitation: str = Field(min_length=1)

    @field_validator("citedObservationIds")
    @classmethod
    def citations_are_unique_and_nonempty(cls, value: list[str]) -> list[str]:
        if any(not item.strip() for item in value):
            raise ValueError("citation IDs must be non-empty")
        if len(value) != len(set(value)):
            raise ValueError("citation IDs must be unique")
        return value
