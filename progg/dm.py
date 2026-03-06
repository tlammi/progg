from dataclasses import dataclass

def _unit_or_zero(what: str, unit: str) -> float:
    if not what.endswith(unit):
        return 0.0
    what = what[:-len(unit)]
    return float(what)

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


@dataclass
class Exercise:
    name: str
    sets: list[SetGroup]

    def total_reps(self):
        return sum(s.total_reps() for s in self.sets)

    def volume(self, unit: str = ""):
        return sum(s.volume(unit) for s in self.sets)


@dataclass
class Session:
    name: str
    exercises: list[Exercise]

    def total_reps(self):
        return sum(e.total_reps() for e in self.exercises)

    def volume(self, unit: str = ""):
        return sum(e.volume(unit) for e in self.exercises)

@dataclass
class Cycle:
    name: str
    sessions: list[Session]

    def total_reps(self):
        return sum(s.total_reps() for s in self.sessions)

    def volume(self, unit: str = ""):
        return sum(s.volume(unit) for s in self.sessions)

@dataclass
class Program:
    name: str
    cycles: list[Cycle]
