import os

from .render import PdfRenderer
from . import language


def main():
    print(os.getcwd())
    with open("./foo.workout") as f:
        spec = language.parse(f.read())

    PdfRenderer("foo.pdf")(spec)
