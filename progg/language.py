from lark import Lark, Tree, Transformer

from . import dm

_SET_GROUP_GRAMMAR = r"""
spec: sets_reps_what | sets_reps | reps_what | anything
?sets_reps_what: sets "x" reps "x" what
?sets_reps: sets "x" reps
?reps_what: reps "x" what

sets: NUMBER
reps: NUMBER ( "+" NUMBER )*
what: anything
anything: /.+/

%import common.NUMBER

%import common.WS
%ignore WS
"""

class SgTransformer(Transformer):

    def anything(self, items):
        return items[0].value

    def sets(self, items):
        return int(items[0])

    def reps(self, items):
        return [int(i) for i in items]

    def what(self, items):
        return items[0]

    def spec(self, items):
        if len(items) == 1 and isinstance(items[0], str):
            return dm.SetGroup(0, [], items[0])
        children = items[0].children
        if len(children) == 3:
            return dm.SetGroup(children[0], children[1], children[2])
        assert len(children) == 2
        if isinstance(children[1], list):
            return dm.SetGroup(children[0], children[1], "")
        return dm.SetGroup(1, children[0], children[1])


def parse_set_group(s: str) -> dm.SetGroup:
    return SgTransformer().transform(Lark(_SET_GROUP_GRAMMAR, start="spec").parse(s))

_GRAMMAR = r"""

program: "program" identifier cycle*
cycle: cycle_lit identifier session*
session: sess_lit identifier exercise*
exercise: ex_lit identifier+

?cycle_lit.1: "cycle"
?sess_lit.1: "session" | "sess"
?ex_lit.1: "exercise" | "ex"
?identifier.0: STRING | /[^"]\S+/

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
            i = i.value
            if i.startswith('"') and i.endswith('"'):
                i = i[1:-1]
            sets.append(parse_set_group(i))
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



