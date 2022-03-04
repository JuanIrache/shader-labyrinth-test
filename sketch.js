let start, end;

let scl;
let lab;
const ww = 16 * 2;
const hh = 9 * 2;

const breakable = 0.05; //chances of breaking a wall when stuck to create alternative paths

let crawler;
let startCoords, endCoords;
let fontRegular;
let theShader;
let canvas;
let shaderStarted;

const initialise = () => {
  lab = new Lab();
  start = new Searcher(0, 0, true);
  end = new Searcher(ww - 1, hh - 1, false);
  background(0);
  lab.paint(false);
};

function preload() {
  fontRegular = loadFont('Roboto-Bold.ttf');
  theShader = loadShader('shader.vert', 'shader.frag');
}

let graph;

function setup() {
  scl = (windowWidth * 0.7) / (ww + 2);
  canvas = createCanvas((ww + 2) * scl, (hh + 2) * scl, WEBGL);
  graph = createGraphics((ww + 2) * scl, (hh + 2) * scl, WEBGL);
  textFont(fontRegular);
  initialise();
}

function mousePressed() {
  if (!startCoords) startCoords = [mouseX, mouseY];
  else if (!endCoords) endCoords = [mouseX, mouseY];
}

function draw() {
  translate(-width / 2, -height / 2);
  var complete;
  if (lab.cells) complete = true;
  for (var i = 0; i < lab.cells.length; i++) {
    if (!lab.cells[i].visited) complete = false;
  }

  if (complete && !lab.found) {
    lab.complete();
    background(0);
    lab.paint(false);
  }

  if (!lab.found) {
    background(0);
    lab.paint(false);
    start.paint(false);
    // end.paint(false);
    start.search(end);
  } else if (crawler.openSet && !crawler.found && !shaderStarted) {
    background(0);
    lab.paint(false);
    fill(255);
    if (!startCoords) text('Set start point', 10, 15);
    else if (!endCoords) text('Set end point', 10, 15);
    strokeWeight(1.0);
    if (startCoords) {
      stroke(255, 0, 0);
      point(...startCoords);
    }
    if (endCoords) {
      stroke(0, 255, 0);
      point(...endCoords);
      shaderStarted = true;
    }
    graph.image(canvas, -width / 2, -height / 2);
  } else {
    for (let i = 0; i < 10; i++) {
      background(0);
      shader(theShader);
      theShader.setUniform('uFrame', graph);
      theShader.setUniform('uRes', [graph.width, graph.height]);
      noStroke();
      rect(0, 0, width, height);
      graph.image(canvas, -width / 2, -height / 2);
    }
  }
}

let foundProgress = 1;
