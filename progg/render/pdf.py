
from reportlab.platypus import SimpleDocTemplate, Table, PageBreak
from reportlab.lib.pagesizes import A4, landscape

from . import renderer
from .. import dm

_LANDSCAPE_A4 = landscape(A4)
_SESS_PADDING = 20


def _title_tbl(s: str):
    return [Table([[s]], style=[("FONTNAME", (0,0), (0,0), "Helvetica-Bold")])]

def _session_tbl(sess: dm.Session, session_count: int):
    rows = [
        [sess.name],
        [None, None, "s", "t", "%"],
    ]
    for e in sess.exercises:
        rows.append([e.name])
        for s in e.sets:
            rows.append([None, None, s.count, "+".join(str(r) for r in s.reps), s.what])

    rows.append([])
    rows.append(["toistot", None, None, None, "voluumi"])
    rows.append([sess.total_reps(), None, None, None, sess.volume()])

    col_width = (_LANDSCAPE_A4[0] - 4*_SESS_PADDING) // session_count // 5

    return [Table(rows, colWidths=col_width, style=[
        ("BOX", (0,0), (-1,-1), 1, "black"),
        ("FONTNAME", (0,0), (0,0), "Helvetica-Bold"),
        # TODO: adjust alignment
        ("ALIGN", (-1, 0), (-1, -1), "RIGHT"),
    ])]


def _page(program_name: str, cycle: dm.Cycle):
    sess_count = len(cycle.sessions)
    sessions = [_session_tbl(s, sess_count) for s in cycle.sessions]
    return Table([
        _title_tbl(program_name),
        _title_tbl(cycle.name),
        sessions,
    ])

class PdfRenderer(renderer.Renderer):

    def __init__(self, filename: str):
        self._doc = SimpleDocTemplate(filename, pagesize=_LANDSCAPE_A4, leftMargin=0, rightMargin=0, topMargin=0, bottomMargin=0)

    def __call__(self, program: dm.Program):
        pages = []
        for cycle in program.cycles:
            pages.append(_page(program.name, cycle))
            pages.append(PageBreak())
        self._doc.build(pages)
