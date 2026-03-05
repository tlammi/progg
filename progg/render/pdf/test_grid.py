from .grid import Grid

def test_default():
    g = Grid()
    assert g.dims() == (0, 0)

def test_reserve_empty():
    g = Grid()
    g.reserve(20, 100)
    assert g.dims() == (20, 100)

def test_reserve_smaller():
    g = Grid()
    g.reserve(100, 100)
    g.reserve(10, 10)
    assert g.dims() == (100, 100)

def test_add_child_empty():
    g = Grid()
    child = Grid()
    g.add_child(1, 2, child)
    assert g.dims() == (1,2)
    assert not g.style

def test_add_child_offsets():
    g = Grid()
    child = Grid()
    child[1,2] = "foo"
    g.add_child(3, 4, child)

    v = g[4, 6]
    assert v == "foo"

