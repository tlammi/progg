from dataclasses import dataclass
from typing import TypeVar

T = TypeVar("T")

def _unit_or_zero(what: str, unit: str) -> float:
    if not what.endswith(unit):
        return 0.0
    what = what[:-len(unit)]
    return float(what)


def _flatten[T](list_of_lists: list[list[T]]) -> list[T]:
    return [i for j in list_of_lists for i in j]

def _avg_load(loads: list[tuple[float, int]]) -> tuple[float, int]:
    total_weight = 0.0
    total_reps = 0

    for weight, reps in loads:
        if weight > 0.0 and reps > 0:
            total_weight += weight * reps
            total_reps += reps
    if total_reps > 0:
        return total_weight/total_reps, total_reps
    return 0.0, 0

@dataclass
class SetGroup:
    count: int
    reps: list[int]
    what: str

    def total_reps(self) -> int:
        res = sum(self.reps)
        res *= self.count
        return res

    def volume(self, unit: str = "") -> float:
        return self.total_reps() * _unit_or_zero(self.what, unit)

    def load(self, unit: str = "") -> list[tuple[float, int]]:
        return [(_unit_or_zero(self.what, unit), self.total_reps())]


@dataclass
class Exercise:
    name: str
    sets: list[SetGroup]

    def total_reps(self):
        return sum(s.total_reps() for s in self.sets)

    def volume(self, unit: str = ""):
        return sum(s.volume(unit) for s in self.sets)

    def load(self, unit: str = ""):
        vals = [s.load(unit) for s in self.sets]
        return _flatten(vals)

    def avg_load(self, unit: str = ""):
        return _avg_load(self.load(unit))[0]

@dataclass
class Session:
    name: str
    exercises: list[Exercise]

    def total_reps(self):
        return sum(e.total_reps() for e in self.exercises)

    def volume(self, unit: str = ""):
        return sum(e.volume(unit) for e in self.exercises)

    def load(self, unit : str = ""):
        vals = [e.load(unit) for e in self.exercises]
        return _flatten(vals)

    def avg_load(self, unit: str = ""):
        return _avg_load(self.load(unit))[0]

@dataclass
class Cycle:
    name: str
    sessions: list[Session]

    def total_reps(self):
        return sum(s.total_reps() for s in self.sessions)

    def volume(self, unit: str = ""):
        return sum(s.volume(unit) for s in self.sessions)

    def load(self, unit: str = ""):
        vals = [s.load(unit) for s in self.sessions]
        return _flatten(vals)

    def avg_load(self, unit: str = ""):
        return _avg_load(self.load(unit))[0]

@dataclass
class Program:
    name: str
    cycles: list[Cycle]
