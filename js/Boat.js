// Generated by CoffeeScript 1.10.0
(function() {
  var Boat;

  Boat = (function() {
    function Boat(posX, posY) {
      this.posX = posX;
      this.posY = posY;
      this.srcX = Math.floor(this.posX / 50);
      this.srcY = Math.floor(this.posY / 50);
      this.age = 0;
      this.goal = [-1, -1];
      this.image = new Image();
      this.image.src = 'img/boat.png';
    }

    Boat.prototype.navigate = function() {
      var dirX, dirY;
      if (this.goal[0] < 0) {
        return false;
      }
      if (Math.abs(this.goal[0] - this.posX) < 3 && Math.abs(this.goal[1] - this.posY) < 3) {
        return false;
      }
      dirX = 0;
      dirY = 0;
      if (this.posX > this.goal[0]) {
        dirX = -1;
      }
      if (this.posX < this.goal[0]) {
        dirX = 1;
      }
      if (this.posY > this.goal[1]) {
        dirY = -1;
      }
      if (this.posY < this.goal[1]) {
        dirY = 1;
      }
      this.posX += dirX * 0.5;
      this.posY += dirY * 0.5;
      return true;
    };

    Boat.prototype.findNewGoal = function(x, y) {
      return this.goal = [x, y];
    };

    Boat.prototype.draw = function(ctx) {
      return ctx.drawImage(this.image, 0, 0, 10, 20, this.posX, this.posY, 10, 20);
    };

    return Boat;

  })();

  if (typeof module !== 'undefined' && module.exports) {
    exports.Boat = Boat;
  } else {
    window.Boat = Boat;
  }

}).call(this);
