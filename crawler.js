function Crawler(x,y,set) {
  this.found =false;
  this.current = lab.getCell(x,y);
  this.closedSet = [];
  this.openSet = [];
  if (set) this.openSet.push(lab.getCell(x,y));
  var cell = lab.getCell(x,y);
  cell.gScore = 0;
  cell.fScore = cell.gScore + lab.heuristic(cell,end);
}

Crawler.prototype.paint = function() {

  /*for (var i=0;i<this.openSet.length;i++) {
    push();
  	translate(scl*(this.openSet[i].x+1),scl*(this.openSet[i].y+1));
  	fill(0,255,0);
  	noStroke();
  	rect(0+1,0+1,scl-1,scl-1);
  	pop();
  }
  for (var i=0;i<this.closedSet.length;i++) {
    push();
  	translate(scl*(this.closedSet[i].x+1),scl*(this.closedSet[i].y+1));
  	fill(255,0,0);
  	noStroke();
  	rect(0+1,0+1,scl-1,scl-1);
  	pop();
  }*/
  push();
	translate(scl*(this.current.x+1),scl*(this.current.y+1));
	fill(255,255,0,100);
	noStroke();
	rect(0+1,0+1,scl-1,scl-1);
	pop();
}

Crawler.prototype.setCurrent = function() {
    this.current = this.openSet[0];
    for (var i=0;i<this.openSet.length;i++) {
      if (this.openSet[i].fScore < this.current.fScore) this.current = this.openSet[i];
      //if (lab.heuristic(this.openSet[i],end) < lab.heuristic(this.current,end)) this.current = this.openSet[i];//only heuristics matter when the quickest solution is the only solution
    }

    if (this.current.x === end.pos.x && this.current.y === end.pos.y) {
      this.found = true;
      background(0);
    	lab.paint();
    }

    this.closedSet.push(this.current);
    var index = this.openSet.indexOf(this.current);
    if (index > -1) {
      this.openSet.splice(index,1);
    }
}

Crawler.prototype.crawl = function() {
  var neighbours = lab.neighbours(this.current.x,this.current.y);
  for (var i=0;i<neighbours.length;i++) {
    if (!this.closedSet.includes(neighbours[i])) {
      if (!this.openSet.includes(neighbours[i])) {
        this.openSet.push(neighbours[i]);
      }
      var tempGscore = this.current.gScore + 1;
      if (tempGscore < neighbours[i].gScore || neighbours[i].gScore == null) {
        neighbours[i].cameFrom = this.current;
        neighbours[i].gScore = tempGscore;
        neighbours[i].fScore =  neighbours[i].gScore + lab.heuristic(neighbours[i],end);
      }
    }
  }
}
