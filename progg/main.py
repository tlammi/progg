import argparse
from pathlib import Path

from .render import PdfRenderer
from . import language


_SAMPLE_PROGRAM = r"""program "Sample Program"
  cycle "Cycle 1"
    session 1
      exercise "Squat 90s recovery" 3x10
      exercise "Bulgarian split squat @ smith" 3x12
      exercise "Leg extension" 3x12
      exercise "Leg curl" 3x12
      exercise "plank roll on ball" 2x60s
    session 2
      exercise Vatsat 3x15
    session 3
    session 4
      exercise rest
"""


class DumpAction(argparse.Action):
    def __call__(self, *args, **kwargs):
        del args
        del kwargs
        print(_SAMPLE_PROGRAM)
        raise SystemExit(0)

def _parse_cli():
    p = argparse.ArgumentParser()
    p.add_argument("--dump", action=DumpAction, nargs=0, help="Dump a sample program to output")
    p.add_argument("workout", help="Path to file containing the workout specification", type=Path)
    return p.parse_args()


def main():
    ns = _parse_cli()
    if ns.dump:
        print(_SAMPLE_PROGRAM)
        raise SystemExit(0)
    with open(ns.workout) as f:
        spec = language.parse(f.read())
    PdfRenderer(str(ns.workout.with_suffix(".pdf")))(spec)
