
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
    g.emplace(2, 1, ["s", "t", "p"])
    for e in sess.exercises:
        _, y = g.dims()
        g[0, y] = e.name
        print(_rendered_str_width(e.name))
        g.style.append(("SPAN", (0, y), (-1, y)))
        g.style.append(("FONTSIZE", (0, y), (-1, y), _font_size(e.name)))
        for s in e.sets:
            _, y = g.dims()
            g.emplace(2, y, [s.count, "+".join(str(i) for i in s.reps), s.what])
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
    hdr.style.append(("FONTNAME", (0, 0), (-1, -1), "Helvetica-Bold"))

    sessions = Grid()
    for s in cycle.sessions:
        g = _session_grid(s)
        x, _ = sessions.dims()
        if x == 0:
            sessions.add_child(x, 0, g)
        else:
            sessions.add_child(x+1, 0, g)
    return Table([
        [hdr.as_table(hAlign="LEFT")],
        [sessions.as_table()],
    ])

class PdfRenderer(renderer.Renderer):

    def __init__(self, filename: str):
        self._doc = SimpleDocTemplate(filename, pagesize=_LANDSCAPE_A4, leftMargin=0, rightMargin=0, topMargin=0, bottomMargin=0)

    def __call__(self, program: dm.Program):
        pages = []

        for cycle in program.cycles:
            pages.append(_page(cycle, program.name))
            pages.append(PageBreak())
        self._doc.build(pages)
