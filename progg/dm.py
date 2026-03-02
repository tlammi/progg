from dataclasses import dataclass

@dataclass
class SetGroup:
    count: int
    reps: list[int]
    what: str

    def total_reps(self) -> int:
        res = sum(self.reps)
        res *= self.count
        return res

    def volume(self) -> float:
        try:
            return self.total_reps() * float(self.what)
        except ValueError:
            return 0.0


@dataclass
class Exercise:
    name: str
    sets: list[SetGroup]

    def total_reps(self):
        return sum(s.total_reps() for s in self.sets)

    def volume(self):
        return sum(s.volume() for s in self.sets)


@dataclass
class Session:
    name: str
    exercises: list[Exercise]

    def total_reps(self):
        return sum(e.total_reps() for e in self.exercises)

    def volume(self):
        return sum(e.volume() for e in self.exercises)

@dataclass
class Cycle:
    name: str
    sessions: list[Session]

    def total_reps(self):
        return sum(s.total_reps() for s in self.sessions)

    def volume(self):
        return sum(s.volume() for s in self.sessions)

@dataclass
class Program:
    name: str
    cycles: list[Cycle]
