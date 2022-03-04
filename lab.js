function Lab() {
  this.found = false;
  this.cells = [];
  for (var y = 0; y < hh; y++) {
    for (var x = 0; x < ww; x++) {
      this.cells.push(new Cell(true, true, x, y));
    }
  }
}

Lab.prototype.paint = function (paintCells) {
  stroke(255);
  strokeWeight(1);
  for (var y = 0; y < hh; y++) {
    for (var x = 0; x < ww; x++) {
      push();
      translate(scl * (x + 1), scl * (y + 1));
      if (this.cells[floor(y * ww + x)].right) {
        line(scl, 0, scl, scl);
      }
      if (this.cells[floor(y * ww + x)].bottom) {
        line(0, scl, scl, scl);
      }
      if (x == 0) {
        line(0, 0, 0, scl);
      } else if (x == ww - 1) {
        line(scl, 0, scl, scl);
      }
      if (y == 0) {
        line(0, 0, scl, 0);
      } else if (y == hh - 1) {
        line(0, scl, scl, scl);
      }
      if (this.cells[floor(y * ww + x)].visited && !this.found && paintCells) {
        fill(255, 100);
        noStroke();
        rect(0 + 1, 0 + 1, scl - 1, scl - 1);
      }
      pop();
    }
  }
};

Lab.prototype.complete = function () {
  this.found = true;
  crawler = new Crawler(0, 0, true);
};

Lab.prototype.getCell = function (x, y) {
  return this.cells[y * ww + x];
};

Lab.prototype.heuristic = function (cell, target) {
  var dx = abs(cell.x - target.pos.x);
  var dy = abs(cell.y - target.pos.y);
  return dx + dy;
};

Lab.prototype.neighbours = function (x, y) {
  var neighbours = []; //check walls
  if (x + 1 < ww && !this.getCell(x, y).right)
    neighbours.push(this.getCell(x + 1, y + 0));
  if (y + 1 < hh && !this.getCell(x, y).bottom)
    neighbours.push(this.getCell(x + 0, y + 1));
  if (x - 1 >= 0 && !this.getCell(x - 1, y).right)
    neighbours.push(this.getCell(x - 1, y + 0));
  if (y - 1 >= 0 && !this.getCell(x, y - 1).bottom)
    neighbours.push(this.getCell(x + 0, y - 1));

  return neighbours;
};

function Cell(right, bottom, x, y) {
  this.right = right;
  this.bottom = bottom;
  this.visited = false;
  this.cameFrom = null;
  this.gScore = null;
  this.fScore = null;
  this.x = x;
  this.y = y;
}

Cell.prototype.visited = function () {
  this.visited = true;
};

Cell.prototype.paint = function (walls) {
  push();
  translate(scl * (this.x + 1), scl * (this.y + 1));
  if (walls) {
    fill(0, 0, 255);
    noStroke();
    rect(0 + 1, 0 + 1, scl - 1, scl - 1);
  }
  pop();
};
