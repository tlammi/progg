
def _offset_style(entry: list, x: int, y: int, w: int, h: int):
    tl_x, tl_y = entry[1]
    br_x, br_y = entry[2]
    if tl_x < 0:
        tl_x += x+w
    else:
        tl_x += x
    if tl_y < 0:
        tl_y += y+h
    else:
        tl_y += y
    if br_x < 0:
        br_x += x+w
    else:
        br_x += x
    if br_y < 0:
        br_y += y+h
    else:
        br_y += y
    rest = entry[3:]
    return [entry[0], (tl_x, tl_y), (br_x, br_y)] + rest

class Grid:

    def __init__(self):
        self.data: list[list] = []
        self.style = []

    def __getitem__(self, idx):
        return self.data[idx[1]][idx[0]]

    def __setitem__(self, idx, val):
        x, y = idx
        self.reserve(x+1, y+1)
        self.data[idx[1]][idx[0]] = val

    def dims(self):
        if not self.data:
            return 0, 0
        return len(self.data[0]), len(self.data)

    def reserve(self, x: int, y: int):
        orig_x, orig_y = self.dims()
        if orig_x < x:
            diff = orig_x - x
            for row in self.data:
                row += [None] * diff
        if orig_y < y:
            for _ in range(y - orig_y):
                self.data.append([None] * x)

    def add_child(self, x: int, y: int, child: "Grid"):
        w, h = child.dims()
        self.reserve(x+w, h+y)
        for i in range(h):
            for j in range(w):
                self.data[y+i][x+j] = child.data[i][j]
        for s in child.style:
            self.style.append(_offset_style(s, x, y, w, h))
