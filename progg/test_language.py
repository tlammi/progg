from . import language as lang
from .dm import SetGroup


psg = lang.parse_set_group

def test_setgroup_simple():
    res = psg("1x1x1%")
    assert res.count == 1
    assert res.reps  == [1]
    assert res.what == "1%"

def test_setgroup_no_sets():
    res = psg("1x10%")
    assert res.count == 1
    assert res.reps == [1]
    assert res.what == "10%"

def test_setgroup_sets_and_reps():
    res = psg("3x10")
    assert res.count == 3
    assert res.reps == [10]
    assert res.what == ""

def test_setgroup_combo():
    res = psg("3x1+2+3x100%")
    assert res.count == 3
    assert res.reps == [1,2,3]
    assert res.what == "100%"

def test_setgroup_free_form():
    s = "do something strange"
    res = psg(s)
    assert res.count == 0
    assert res.reps == []
    assert res.what == s

def test_setgroup_rpe():
    res = psg("2x3xRPE 9")
    assert res.count == 2
    assert res.reps == [3]
    assert res.what == "RPE 9"
