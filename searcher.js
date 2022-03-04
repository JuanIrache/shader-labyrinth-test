function Searcher(x, y, visit) {
  this.pos = createVector(x, y);
  this.visited = [];
  this.visited.push(this.pos);
  if (visit) lab.cells[this.pos.y * ww + this.pos.x].visited = true;
}

Searcher.prototype.possibles = function (other) {
  var possibles = [];
  possibles.push(createVector(this.pos.x + 1, this.pos.y + 0));
  possibles.push(createVector(this.pos.x + 0, this.pos.y + 1));
  possibles.push(createVector(this.pos.x - 1, this.pos.y + 0));
  possibles.push(createVector(this.pos.x + 0, this.pos.y - 1));

  for (var i = possibles.length - 1; i >= 0; i--) {
    if (
      this.hasVisited(possibles[i]) ||
      //   other.hasVisited(possibles[i]) ||
      possibles[i].x < 0 ||
      possibles[i].y < 0 ||
      possibles[i].x > ww - 1 ||
      possibles[i].y > hh - 1 ||
      lab.cells[possibles[i].y * ww + possibles[i].x].visited
    )
      possibles.splice(i, 1);
  }

  return possibles;
};

Searcher.prototype.search = function (other) {
  var possibles = this.possibles(other);

  while (possibles.length < 1) {
    if (this.visited.length > 1) {
      if (random() < breakable) {
        var r = floor(random(4));
        if (r == 0) {
          lab.getCell(this.pos.x, this.pos.y).right = false;
        } else if (r == 1) {
          lab.getCell(this.pos.x, this.pos.y).bottom = false;
        } else if (r == 2 && lab.getCell(this.pos.x - 1, this.pos.y)) {
          lab.getCell(this.pos.x - 1, this.pos.y).right = false;
        } else if (r == 3 && lab.getCell(this.pos.x, this.pos.y - 1)) {
          lab.getCell(this.pos.x, this.pos.y - 1).bottom = false;
        }
      }

      this.visited.pop();
      this.pos = this.visited[this.visited.length - 1];
      possibles = this.possibles(other);
    } else {
      break;
    }
  }
  if (possibles.length > 0) {
    var r = floor(random(possibles.length));
    if (possibles[r].x - this.pos.x > 0) {
      lab.cells[floor(this.pos.y * ww + this.pos.x)].right = false;
    } else if (possibles[r].y - this.pos.y > 0) {
      lab.cells[floor(this.pos.y * ww + this.pos.x)].bottom = false;
    } else if (possibles[r].x - this.pos.x < 0) {
      lab.cells[floor(possibles[r].y * ww + possibles[r].x)].right = false;
    } else if (possibles[r].y - this.pos.y < 0) {
      lab.cells[floor(possibles[r].y * ww + possibles[r].x)].bottom = false;
    }

    this.pos = possibles[r];
    this.visited.push(possibles[r]);
    lab.cells[floor(possibles[r].y * ww + possibles[r].x)].visited = true;
  }
};

Searcher.prototype.hasVisited = function (pos) {
  for (var i = 0; i < this.visited.length; i++) {
    if (this.visited[i].x == pos.x && this.visited[i].y == pos.y) return i;
  }
  return false;
};

Searcher.prototype.paint = function (path) {
  if (path) {
    for (var i = 0; i < this.visited.length; i++) {
      push();
      translate(scl * (this.visited[i].x + 1), scl * (this.visited[i].y + 1));
      fill(255);
      noStroke();
      rect(0 + 1, 0 + 1, scl - 1, scl - 1);
      pop();
    }
  }
  push();
  translate(scl * (this.pos.x + 1), scl * (this.pos.y + 1));
  fill(255);
  noStroke();
  rect(0 + 1, 0 + 1, scl - 1, scl - 1);
  pop();
};
