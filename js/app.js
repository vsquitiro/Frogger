// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.animation = [
        'images/dragon-animation-1.png',
        'images/dragon-animation-2.png',
        'images/dragon-animation-3.png',
        'images/dragon-animation-4.png'
    ]
    //this.sprite = 'images/enemy-bug.png';
    this.randomize();
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    this.x = this.x + (this.speed * dt);
    var hitBoxX = [this.x - 77, this.x + 77];
    var hitBoxY = [this.y - 113, this.y - 53];
    if ((this.x - this.animate) > this.frameRate) {
        this.frame = (this.frame + 1) % (this.animation.length);
        this.sprite = this.animation[this.frame];
        this.animate += this.frameRate;
    }
    
    //collission detection
    if ((hitBoxX[0] <= player.x && player.x <= hitBoxX[1]) 
        && (hitBoxY[0] <= player.y && player.y <= hitBoxY[1])) {
        player.dead = true;
        // player.x = 202;
        // player.y = 467;
    }

    //enemy wrap-around
    if (this.x >= 808) {
        this.randomize();
    } 
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.randomize = function() {
    this.frame = (Math.floor(Math.random() * 4));
    this.sprite = this.animation[this.frame];
    this.frameRate = 15;
    this.animate = -202;
    this.x = -202;
    this.y = (Math.floor((Math.random() * (3 + player.tier)) + 1) * 83) + 143;
    this.speed = Math.floor((Math.random() * 200) + 100) + player.speedMod;
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.animation = ['images/char-boy.png'];
    for (var i=1; i < 31; i++) {
        var newImage = 'images/water-animation/water-';
        if (i < 10) {
            newImage = newImage + 0;
        };
        newImage = newImage + i + '.png';
        this.animation.push(newImage);
    };
    this.animation.push('images/blank.png');
    this.frame = 0;
    this.sprite = this.animation[this.frame];
    this.deathAnimation = [
        'images/char-boy-d1.png',
        'images/char-boy-d2.png',
        'images/char-boy-d3.png',
        'images/char-boy-d4.png',
        'images/char-boy-d1.png',
        'images/char-boy-d1.png',
        'images/char-boy-d1.png',
        'images/char-boy-d1.png'
        ];
    this.dead = false;
    this.deathFrameRate = 4;
    this.deathFrame = 0;
    this.tier = 0;
    this.tierIncrease = 25;
    this.x = 303;
    this.y = 384;
    this.score = 0
    this.difficultyMod = 0;
    this.maxSpeed = 5;
    this.speedMod = 0
    this.level = 1;
};

Player.prototype.update = function(dt) {
    if (this.dead) {
        if (this.frame < this.deathAnimation.length) {
            this.sprite = this.deathAnimation[this.frame];
            if (this.deathFrame === this.deathFrameRate) {
                this.frame += 1;
                this.deathFrame = 0;
            };
            this.deathFrame += 1;
            this.x += 3;
        } else {
            this.dead = false;
            this.x = 303;
            this.y = 384 + (this.tier * 83);
            this.frame = 0;
            this.sprite = this.animation[this.frame];
        }

    }
    if (this.score > this.difficultyMod) {
        this.difficultyMod += 1;
        this.level += 1;
        document.getElementById("level").innerHTML = "Level: " + this.level;
        if (this.difficultyMod % this.maxSpeed != 0) {
            this.speedMod += 75;
            for (var i = 0; i < allEnemies.length; i++) {
                allEnemies[i].speed += 75;
            };
        } else {
            for (var i = 0; i < allEnemies.length; i++) {
                allEnemies[i].speed = allEnemies[i].speed - (75 * (this.maxSpeed - 1));
            };
            this.speedMod = 0;
            allEnemies.push(new Enemy);
        };
    };
    if (this.y === 52) {
        if (this.frame === this.animation.length - 1) {
            this.score += 1;
            if (this.score === (this.tierIncrease * (this.tier + 1)) && (this.tier < 3)) {
                this.tier += 1;
            }
            this.x = 303;
            this.y = 384 + (this.tier * 83);
            this.frame = 0;
            this.sprite = this.animation[this.frame];
        } else {
            this.frame += 1;
            this.sprite = this.animation[this.frame];
        };
    };
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(moveCommand) {
    if (this.y === 52 || this.dead) {
        // noop - prevents players from moving while splash animation is played
    }
    else if (moveCommand === 'left' && this.x != 0) {
        this.x = this.x - 101;
    }
    else if (moveCommand === 'up') {
        if (this.y === 135) {
            this.x = this.x - 35;
        };
        this.y = this.y - 83;
    }
    else if (moveCommand === 'right' && this.x != 606) {
        this.x = this.x + 101;
    }
    else if (moveCommand === 'down' && this.y != 633) {
        this.y = this.y + 83;
    }
}

Player.prototype.splash = function() {
    console.log("splash");
    for (i = 1; i < this.animation.length; i++) {
        this.sprite = this.animation[i];
    }
}
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var player = new Player();

var allEnemies = [];
for (var i = 0; i < 5; i++) {
    allEnemies.push(new Enemy());
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
