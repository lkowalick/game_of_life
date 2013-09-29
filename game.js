var game = {};

game.size = 400;

game.shift = 5;

game.boxes = Math.floor(game.size / game.shift);

game.drawBox = function(i, j, context) {
  var start_x = i*game.shift;
  var start_y = j*game.shift;
  context.fillStyle = "black";
  context.fillRect(start_x, start_y, game.shift, game.shift);
};

game.removeBox = function(i, j, context) {
  var start_x = i*game.shift;
  var start_y = j*game.shift;
  context.fillStyle = "white";
  context.fillRect(start_x, start_y, game.shift, game.shift);
};

game.mod = function(n,m){
  return (n%m + m) % m;
};

game.isBoxFilled = function(i, j, context) {
  var centerOfiBox = i*this.shift + Math.floor(this.shift/2);
  var centerOfjBox = j*this.shift + Math.floor(this.shift/2);
  var pixels = context.getImageData(centerOfiBox, centerOfjBox, 1, 1);
  if (pixels.data[3] === 255) {
    return true;
  }
  else {
    return false;
  }
};

game.neighbors = function(i,j) {
  var ishift = -1;
  var jshift = -1;
  var result = [];
  for(ishift = -1; ishift <= 1; ishift++) {
    for(jshift = -1; jshift <= 1; jshift++) {
      if (ishift == 0 && jshift == 0){
        //do nothing;
      }
      else {
        result.push({ 
          i: this.mod(i + ishift, this.boxes), 
          j: this.mod(j + jshift, this.boxes)
        });
      }
    }
  }
  return result;
};

game.willBeFilled = function(i,j,c) {
  var filledNeighbors = 0;
  var result;
  this.neighbors(i,j).forEach(function(elt, index, array) {
    if ( game.isBoxFilled(elt.i, elt.j, c) ){
      filledNeighbors++;
    }
  });
  switch(filledNeighbors) {
    case 3:
      result = true;
      break;
    case 2:
      result = this.isBoxFilled(i, j, c);
      break;
    default:
      result = false;
  }
  return result;
};

game.clear = function(context) {
  context.clearRect(0,0,this.size, this.size);
}

game.timeStep = function(context) {
  var i = 0;
  var j = 0;
  var filledBoxes = [];
  for(i = 0; i <= this.boxes; i++) {
    for(j = 0; j <= this.boxes; j++) {
      if ( this.willBeFilled(i, j, context) ) {
        filledBoxes.push([i,j]);
      }
    }
  }
  this.clear(context);
  filledBoxes.forEach(function(elt, index, array) {
    game.drawBox(elt[0],elt[1],context);
  });
}

game.glider = function(i,j,context) {
  game.drawBox(i+1,j,context);
  game.drawBox(i,j+2,context);
  game.drawBox(i+1,j+2,context);
  game.drawBox(i+2,j+1,context);
  game.drawBox(i+2,j+2,context);
};

game.gliderb = function(i,j,context) {
  game.drawBox(i,j+1,context);
  game.drawBox(i+2,j,context);
  game.drawBox(i+2,j+1,context);
  game.drawBox(i+1,j+2,context);
  game.drawBox(i+2,j+2,context);
};

$(document).ready(function(){
  var canvas = document.getElementById("game");
  var c = canvas.getContext("2d");

  game.glider(0,0,c);
  game.glider(4,4,c);
  game.gliderb(10,10,c);
  game.gliderb(15,15,c);
  window.setInterval(function() {game.timeStep(c); }, 10);
});
