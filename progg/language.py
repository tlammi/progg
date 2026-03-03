from lark import Lark, Tree, Transformer

from . import dm

_GRAMMAR = r"""

program: "program" identifier cycle*
cycle: cycle_lit identifier session*
session: sess_lit identifier exercise*
exercise: ex_lit identifier+

?cycle_lit.1: "cycle"
?sess_lit.1: "session"
?ex_lit.1: "exercise"
?identifier.0: STRING | /\S+/

%import common.ESCAPED_STRING -> STRING
%import common.WS
%ignore WS
"""

class Mt(Transformer):
    def exercise(self, items):
        nm = items[1].strip('"')
        # TODO: This should use real parsing
        sets = []
        for i in items[2:]:
            count, reps, what = i.split("x")
            replist = [int(i) for i in reps.split("+")]
            sets.append(dm.SetGroup(count=int(count), reps=replist, what=what))
        return dm.Exercise(name=nm, sets=sets)

    def session(self, items):
        nm = items[1].strip('"')
        return dm.Session(name=nm, exercises=items[2:])

    def cycle(self, items):
        nm = items[1].strip('"')
        return dm.Cycle(name=nm, sessions=items[2:])

    def program(self, items):
        nm = items[0].strip('"')
        return dm.Program(name=nm, cycles=items[1:])


def parse(s: str) -> dm.Program:
    return Mt().transform(Lark(_GRAMMAR, start="program").parse(s))
