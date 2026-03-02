import enum
from dataclasses import dataclass

from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, KeepInFrame

from .render import PdfRenderer
from . import dm

LANDSCAPE_A4 = landscape(A4)
TABLE_MARGIN = 20

def main():

    p = dm.Program(
        name="Esimerkkiohjelma",
        cycles=[
            dm.Cycle(name="Viikko 1", sessions=[
                dm.Session(name="Maanantai", exercises=[
                        dm.Exercise("Tempaus", [dm.SetGroup(3, [2,2], "100")])
                ])
            ])
        ])
    r = PdfRenderer("foo.pdf")
    r(p)
