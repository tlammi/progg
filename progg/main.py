import argparse

from dataclasses import dataclass
from pathlib import Path

from .render import PdfRenderer
from . import language, dm

from matplotlib import pyplot as plt
from matplotlib.axes import Axes


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


@dataclass
class MultiBarData:
    axes: Axes
    values: list
    kwargs: dict

def _do_multi_set_bar_graph(*data: MultiBarData):
    xs = []
    count = len(data)
    for i, v in enumerate(data):
        new = [j*count+i for j in range(len(v.values))]
        xs.append(new)

    for x, d in zip(xs, data):
        d.axes.bar(x, d.values, **d.kwargs)

    hs = []
    ls = []
    for d in data:
        handle, label = d.axes.get_legend_handles_labels()
        hs.extend(handle)
        ls.extend(label)
    data[0].axes.legend(hs, ls)

def _do_session_statistics(spec: dm.Program, fig):
    volumes = spec.session_volumes(unit="%")
    fig.subplots_adjust(right=0.75)
    reps = spec.session_reps()
    ax1 = fig.add_subplot(111)
    ax1.set_title("Sessions")
    ax1.set_ylabel("volume")
    ax2 = ax1.twinx()
    ax2.set_ylabel("reps")

    ax3 = ax1.twinx()
    ax3.set_ylabel("avg load")

    ax3.spines.right.set_position(("axes", 1.2))
    ax3.set(ylim=(50, 100))

    loads = []
    for c in spec.cycles:
        for sess in c.sessions:
            loads.append(sess.avg_load(unit="%"))

    _do_multi_set_bar_graph(
        MultiBarData(axes=ax1, values=volumes, kwargs={"label": "Volume"}),
        MultiBarData(axes=ax2, values=reps, kwargs={"label": "Reps", "color": "r"}),
        MultiBarData(axes=ax3, values=loads, kwargs={"label": "Avg Load", "color": "g"})
    )

def _do_cycle_statistics(spec: dm.Program, fig):
    volumes = [c.volume(unit="%") for c in spec.cycles]
    fig.subplots_adjust(right=0.75)
    reps = [c.total_reps() for c in spec.cycles]
    ax1 = fig.add_subplot(111)
    ax1.set_title("Sessions")
    ax1.set_ylabel("volume")
    ax2 = ax1.twinx()
    ax2.set_ylabel("reps")

    ax3 = ax1.twinx()
    ax3.set_ylabel("avg load")

    ax3.spines.right.set_position(("axes", 1.2))
    ax3.set(ylim=(50, 100))

    loads = []
    for c in spec.cycles:
        loads.append(c.avg_load(unit="%"))

    _do_multi_set_bar_graph(
        MultiBarData(axes=ax1, values=volumes, kwargs={"label": "Volume"}),
        MultiBarData(axes=ax2, values=reps, kwargs={"label": "Reps", "color": "r"}),
        MultiBarData(axes=ax3, values=loads, kwargs={"label": "Avg Load", "color": "g"})
    )


def _do_statistics(spec: dm.Program):
    fig = plt.figure()
    _do_session_statistics(spec, fig)
    fig = plt.figure()
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
