import argparse
from pathlib import Path

from .render import PdfRenderer
from . import language, dm

from matplotlib import pyplot as plt


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
    p.add_argument("--statistics", action="store_true", help="Instead of outputing a program output program statistics", default=False)
    p.add_argument("workout", help="Path to file containing the workout specification", type=Path)
    return p.parse_args()


def _do_session_statistics(spec: dm.Program, fig):
    volumes = spec.session_volumes(unit="%")
    xs1 = [i*2 for i in range(len(volumes))]
    xs2 = [x+1 for x in xs1]
    reps = spec.session_reps()

    ax1 = fig.add_subplot(121)
    ax1.set_title("Sessions")
    ax2 = ax1.twinx()

    ax1.bar(xs1, volumes, label="Volume")
    ax1.set_ylabel("volume")
    ax2.bar(xs2, reps, color="r", label="Reps")
    ax2.set_ylabel("reps")
    ax2.tick_params(axis="y", color="r")
    h1, l1 = ax1.get_legend_handles_labels()
    h2, l2 = ax2.get_legend_handles_labels()
    ax1.legend(h1+h2, l1+l2)

def _do_cycle_statistics(spec: dm.Program, fig):
    ax = fig.add_subplot(122)
    ax.plot([1,2,3], [1,2,3])


def _do_statistics(spec: dm.Program):
    fig = plt.figure()
    _do_session_statistics(spec, fig)
    _do_cycle_statistics(spec, fig)
    plt.show()
    raise SystemExit(0)

def main():
    ns = _parse_cli()
    if ns.dump:
        print(_SAMPLE_PROGRAM)
        raise SystemExit(0)
    with open(ns.workout) as f:
        spec = language.parse(f.read())

    if ns.statistics:
        _do_statistics(spec)
    PdfRenderer(str(ns.workout.with_suffix(".pdf")))(spec)
