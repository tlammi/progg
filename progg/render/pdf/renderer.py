
from reportlab.platypus import SimpleDocTemplate, Table, PageBreak
from reportlab.lib.pagesizes import A4, landscape
from reportlab.pdfbase.pdfmetrics import stringWidth

from .. import renderer
from ... import dm

_LANDSCAPE_A4 = landscape(A4)
_SESS_PADDING = 20
_BASIC_FONT = "Helvetica"


def _font_size(s: str) -> int:
    """
    Calculate font size based on text length
    """
    size = len(s)
    if size < 20:
        return 12
    if size < 40:
        return 10
    return 8

def _rendered_str_width(s: str, font_size = 0) -> int:
    font_size = font_size or _font_size(s)
    return stringWidth(s, _BASIC_FONT, font_size)

def _wrap_text(text: str, max_width: float) -> list[str]:
    words = text.split()
    font_size = _font_size(" ".join(words))
    out = []
    while True:
        if _rendered_str_width(" ".join(words), font_size) <= max_width:
            out.append(" ".join(words))
            break
        prefix = words.copy()
        while _rendered_str_width(" ".join(prefix), font_size) > max_width:
            prefix.pop(-1)
            if not prefix:
                raise NotImplementedError("Splitting text outside of spaces not implemented")
        out.append(" ".join(prefix))
        words = words[len(prefix):]
    return out


def _title_tbl(s: str):
    return [Table([[s]], style=[("FONTNAME", (0,0), (0,0), "Helvetica-Bold")])]


def _session_tbl(sess: dm.Session, session_count: int):
    tbl_width = (_LANDSCAPE_A4[0] - (session_count-1)*_SESS_PADDING) // session_count - 5
    column_count = 5
    exercise_name_styles = []
    rows = [
        [sess.name],
        [None, None, "s", "t", "%"],
    ]
    for e in sess.exercises:
        name_rows = _wrap_text(e.name, tbl_width)
        fs = min(_font_size(e.name), 10)
        exercise_name_styles.append(("FONTSIZE", (0, len(rows)), (-1, len(rows)+len(name_rows)-1), fs))
        for row in name_rows:
            rows.append([row])
        for s in e.sets:
            rows.append([None, None, s.count, "+".join(str(r) for r in s.reps), s.what])

    rows.append([])
    rows.append(["toistot", None, None, None, "voluumi"])
    rows.append([sess.total_reps(), None, None, None, sess.volume()])

    col_width = (_LANDSCAPE_A4[0] - (session_count-1)*_SESS_PADDING) // session_count // column_count
    col_widths = [col_width]*column_count

    max_reps_width = col_width
    for r in rows:
        if len(r) == 5:
            if r[3] is not None:
                max_reps_width = max(max_reps_width, _rendered_str_width(r[3], 12))

    col_widths[3] = max_reps_width

    return [Table(rows, colWidths=col_widths, style=[
        ("FONTSIZE", (0,0), (-1,-1), 8),
        ("BOX", (0,0), (-1,-1), 1, "black"),
        ("FONTNAME", (0,0), (0,0), "Helvetica-Bold"),
        # TODO: adjust alignment
        ("ALIGN", (-1, 0), (-1, -1), "RIGHT"),
        ("ALIGN", (-2, 0), (-2, -1), "LEFT"),
    ] + exercise_name_styles)]


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
