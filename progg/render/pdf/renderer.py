
import re
from reportlab.platypus import SimpleDocTemplate, Table, PageBreak, KeepInFrame
from reportlab.lib.pagesizes import A4, landscape
from reportlab.pdfbase.pdfmetrics import stringWidth

from .grid import Grid
from .. import renderer
from ... import dm

_LANDSCAPE_A4 = landscape(A4)
_BASIC_FONT = "Helvetica"
_WRAP_TRESHOLD = 100.0


def _font_size(s: str) -> int:
    """
    Calculate font size based on text length
    """
    size = len(s)
    if size < 20:
        return 10
    if size < 40:
        return 9
    return 8

def _rendered_str_width(s: str, font_size = 0) -> int:
    font_size = font_size or _font_size(s)
    return stringWidth(s, _BASIC_FONT, font_size)

def _wrap_text(text: str) -> list[str]:
    words = text.split()
    font_size = _font_size(" ".join(words))
    out = []
    while True:
        if _rendered_str_width(" ".join(words), font_size) <= _WRAP_TRESHOLD:
            out.append(" ".join(words))
            break
        prefix = words.copy()
        while _rendered_str_width(" ".join(prefix), font_size) > _WRAP_TRESHOLD:
            prefix.pop(-1)
            if not prefix:
                raise NotImplementedError("Splitting text outside of spaces not implemented")
        out.append(" ".join(prefix))
        words = words[len(prefix):]
    return out

def _session_grid(sess: dm.Session):
    g = Grid()
    g[0, 0] = sess.name
    g.emplace(0, 1, ["s", "t", "p"])
    for e in sess.exercises:
        _, y = g.dims()
        nm_rows = _wrap_text(e.name)
        for r in nm_rows:
            g[0, g.dims()[1]] = r
        g.style.append(("FONTSIZE", (0, y), (-1, g.dims()[1]-1), _font_size(e.name)))
        for i in range(y, g.dims()[1]):
            g.style.append(("SPAN", (0, i), (-1, i)))
        for s in e.sets:
            _, y = g.dims()
            g.emplace(0, y, [s.count, "+".join(str(i) for i in s.reps), s.what])
    g.style.extend([
        ("SPAN", (0, 0), (-1, 0)),
        ("BOX", (0, 0), (-1, -1), 1, "black"),
        ("FONTNAME", (0, 0), (0, 0), "Helvetica-Bold"),
    ])
    return g

def _page(cycle: dm.Cycle, program_name: str):
    hdr = Grid()
    hdr[0, 0] = program_name
    hdr[0, 2] = cycle.name
    hdr[2, 2] = "toistot"
    hdr[3, 2] = cycle.total_reps()
    hdr[5, 2] = "voluumi"
    hdr[6, 2] = cycle.volume(unit="%")
    hdr[8, 2] = "keskikuorma"
    hdr[9, 2] = f"{cycle.avg_load(unit="%"):.2f}"
    hdr.style.extend([
        ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
        ("BOX", (2,2), (3, 2), 1, "black"),
        ("BOX", (5,2), (6, 2), 1, "black"),
        ("BOX", (8,2), (9, 2), 1, "black"),
    ])

    sessions = Grid()
    session_list = [_session_grid(s) for s in cycle.sessions]
    max_height = max(s.dims()[1] for s in session_list)
    for i, s in enumerate(session_list):
        s[0, max_height+1] = "toistot"
        s[0, max_height+2] = cycle.sessions[i].total_reps()
        s[-1, max_height+1] = "voluumi"
        s[-1, max_height+2] = cycle.sessions[i].volume(unit="%")
    for g in session_list:
        x, _ = sessions.dims()
        if x == 0:
            sessions.add_child(x, 0, g)
        else:
            sessions.add_child(x+1, 0, g)
    w, h = _LANDSCAPE_A4
    tbl = Table([
        [hdr.as_table(hAlign="LEFT")],
        [KeepInFrame(maxWidth=w, maxHeight=h, content=[sessions.as_table()])],
    ])

    return KeepInFrame(maxWidth=w, maxHeight=h, content=[tbl])

class PdfRenderer(renderer.Renderer):

    def __init__(self, filename: str):
        self._doc = SimpleDocTemplate(filename, pagesize=_LANDSCAPE_A4, leftMargin=0, rightMargin=0, topMargin=0, bottomMargin=0)

    def __call__(self, program: dm.Program):
        pages = []

        for cycle in program.cycles:
            pages.append(_page(cycle, program.name))
            pages.append(PageBreak())
        self._doc.build(pages)
