var AsteroidGame = (function() {
  function Asteroid(x, y, radius, velocity, game) {
    var self = this;
    this.posx = x;
    this.posy = y;
    this.radius = radius;
    this.color = Asteroid.get_random_color();
    this.velocity = velocity;
    this.bullets = [];

    this.offScreen = function() {
      if (self.posx > (game.screensize+self.radius) || self.posx < (0-self.radius)) {
        return true;
      }
      else if (self.posy > (game.screensize+self.radius) || self.posy < (0-self.radius)) {
        return true;
      }
      else {
        return false;
      };
    };



    this.draw = function(ctx) {
      ctx.fillStyle = self.color;
      ctx.beginPath();
      ctx.arc(self.posx, self.posy, self.radius, 0, Math.PI*2, false);
      ctx.fill();
    };

    this.update = function() {
      self.posx += self.velocity[0];
      self.posy += self.velocity[1];
      if (self.offScreen()) {
          game.asteroids = _.without(game.asteroids, self);
        }
    };

  };

  Asteroid.get_random_color = function() {
  var letters = '0123456789ABCDEF'.split('');
  var color = '#';
    for (var i = 0; i < 6; i++ ) {
      color += letters[Math.round(Math.random() * 15)];
    }
    return color;
  };

  Asteroid.randomAsteroid = function(game) {

    var posx = Math.floor((Math.random()*game.screensize)+1);
    var posy = Math.floor((Math.random()*game.screensize)+1);
    var veloX = (Math.random()*10)-5;
    var veloY = (Math.random()*10)-5;
    var velocity = [veloX, veloY];
    return new Asteroid(posx, posy, 20, velocity, game);
  };

  function Game(ctx) {
    var self = this;
    this.screensize = 800;
    this.asteroids = [];
    this.ship = undefined;

    this.initialize = function() {
      for (var i = 0; i < 10; i++) {
        var ast = Asteroid.randomAsteroid(self);
        self.asteroids.push(ast);
      };
      self.ship = new Ship(self);
    };

    this.draw = function(ast) {
      ctx.clearRect(0, 0, self.screensize, self.screensize);
      self.asteroids.forEach(function(ast) {
        ast.draw(ctx);
      });
      self.ship.draw(ctx);

      self.bullets.forEach(function(bul) {
        bul.draw(ctx);
      });

    };

    this.update = function() {
      self.asteroids.forEach(function(asteroid) {
        asteroid.update();
      });
      self.ship.update();

      self.bullets.forEach(function(bul) {
        bul.update();
      });

      if (self.ship.isHit()) {
        // alert("Game Over");
      };
    };

    this.start = function() {
      key('up', function() { self.ship.power(0,-2)});
      key('down', function() { self.ship.power(0,2)});
      key('left', function() { self.ship.power(-2,0)});
      key('right', function() { self.ship.power(2,0)});
      key('space', function() { self.ship.fireBullet()});
      setInterval(function() {
        self.update();
        self.draw();
      }, 1000/40);
    }
  };



  function Ship(game) {
    var self = this;
    this.velocity = {x: 0, y: 0 };
    this.radius = 10;
    this.posx = game.screensize/2;
    this.posy = game.screensize/2;


    this.draw = function(ctx) {
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(self.posx, self.posy, self.radius, 0, Math.PI*2, false);
      ctx.fill();


    };

    this.isHit = function() {
      return _.some(game.asteroids, function(ast) {
        var distance = Math.sqrt(Math.pow((self.posx-ast.posx),2)+Math.pow((self.posy-ast.posy),2));
        if (distance <= (self.radius+ast.radius)) {
          return true;
        } else {
          return false;
        }
      });
    };

    this.update = function() {
      self.posx += self.velocity.x;
      self.posy += self.velocity.y;
      self.offScreen();
    };

    this.offScreen = function() {
      if (self.posx > (game.screensize+self.radius)) {
        self.posx = 0;
      } else if (self.posx < (0-self.radius)) {
        self.posx = game.screensize };
      if (self.posy > (game.screensize+self.radius)) {
        self.posy = 0;
      } else if (self.posy < (0-self.radius)) {
        self.posy = game.screensize;
      };
    };

    this.power= function(dx,dy) {
      self.velocity.x += dx;
      self.velocity.y += dy;
      if (self.velocity.x > 16) {
        self.velocit.x = 16;
      }
      else if (self.velocity.x < -16) {
        self.velocity.x = -16;
      }
      else if (self.velocity.y > 16) {
        self.velocity.y = 16;
      }
      else if (self.velocity.y < -16) {
        self.velocity.y = -16;
      };
    }

    this.fireBullet = function() {
      game.bullets.push(new Bullet(self));
    }

  };

  function Bullet(game) {
    var self = this;
    this.radius = 4;
    this.direction = {x: (ship.velocity.x), y: (ship.velocity.y)};
    this.speed = 30;
    this.velocity = {x: (this.direction.x * this.speed), y: (this.direction.y * this.speed)}
    this.posx = ship.posx;
    this.posy = ship.posy;


    this.draw = function(ctx) {
      ctx.fillStyle = "green";
      ctx.beginPath();
      ctx.arc(self.posx, self.posy, self.radius, 0, Math.PI*2, false);
      ctx.fill();
    };

    this.update = function () {
      self.posx += self.velocity.x;
      self.posy += self.velocity.y;
      // self.velocity = self.direction * self.speed;
    };

  }

  return {
    Game: Game
  }
})();


$(function(){
  var canvas = document.getElementById('game-screen');
  var ctx = canvas.getContext('2d');
  game = new AsteroidGame.Game(ctx)
  game.initialize();
  game.start();

})
