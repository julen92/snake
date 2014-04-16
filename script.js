var intervalHandler = null;
var snakeBeginDomOffset = 3;
var duration = 150;


function position(position) {
    this.x = position.x;
    this.y = position.y
    this.copy = function() {
        return {x: this.x, y: this.y};
    }
};

var initialSnakeOptions = {
    items: 3,
    velocity: new position({x: 1, y: 0}),
    class: 'rocket'
};

function snakeItem(initialPosition) {
    this.position = new position(initialPosition);
    this.isOnPosition = function(position) {
        return position.x === this.position.x && position.y == this.position.y;
    };
    this.move = function(vector) {
        this.position.x += vector.x;
        this.position.y += vector.y;
    };
    this.moveTo = function(newPosition) {
        this.position = newPosition;
    };
    this.updateFireballSize = function() {
        var DOMitems = this.getDomItems();
        for (i = DOMitems.length - 1; i > 0; i--) {
            currentSize = 100 * (snake.body.length - i + 6) / (snake.body.length + 6);
            currentNode = $(DOMitems[i]);
            currentNode.css('background-size', currentSize + '% ' + currentSize + '%');
        }
    };
}

function buildSnake(options) {
    this.body = [];
    this.class = options.class;
    this.velocity = null;
    this.getHead = function() {
        return this.body[0];
    };
    this.getDomItems = function(){
        return $('#box .'+ this.class);
    };
    this.detectCollision= function(velocity) {
        console.log(this.velocity);
        for (i = this.body.length - 1; i > 0; i--) {
            if (this.body[i].position.x == (this.getHead().position.x + this.velocity.x)
                    && this.body[i].position.y == (this.getHead().position.y + this.velocity.y)) {
                return true;
            }
        }

        if (
                this.getHead().position.x + this.velocity.x + 1 > $('#box').width() / $('#head').width() ||
                this.getHead().position.y + this.velocity.y + 1 > $('#box').height() / $('#head').height() ||
                this.getHead().position.x + this.velocity.x < 0 ||
                this.getHead().position.y + this.velocity.y < 0
                )
        {
            return true;
        }
        return false;
    };
}

var snake = new buildSnake({});
var flyingSaucer = new buildSnake({});

var snake = {
    body: [],
    class: '',
    velocity: null,
    getHead: function() {
        return this.body[0];
    },
    getDomItems: function(){
        return $('#box .'+ this.class);
    },
    detectCollision: function(velocity) {
        console.log(this.velocity);
        for (i = this.body.length - 1; i > 0; i--) {
            if (this.body[i].position.x == (this.getHead().position.x + this.velocity.x)
                    && this.body[i].position.y == (this.getHead().position.y + this.velocity.y)) {
                return true;
            }
        }

        if (
                this.getHead().position.x + this.velocity.x + 1 > $('#box').width() / $('#head').width() ||
                this.getHead().position.y + this.velocity.y + 1 > $('#box').height() / $('#head').height() ||
                this.getHead().position.x + this.velocity.x < 0 ||
                this.getHead().position.y + this.velocity.y < 0
                )
        {
            return true;
        }
        return false;
    },
    updateFireballSize: function() {
        var DOMitems = this.getDomItems();
        for (i = DOMitems.length - 1; i > 0; i--) {
            currentSize = 100 * (snake.body.length - i + 6) / (snake.body.length + 6);
            currentNode = $(DOMitems[i]);
            currentNode.css('background-size', currentSize + '% ' + currentSize + '%');
        }
    },
    screenUpdate: function(options) {
        var offset = 0;
        var currentNode = null;
        var DOMitems = this.getDomItems();
        for (i in this.body) {
            offset = parseInt(i);
            currentNode = $(DOMitems[i]);

            if (currentNode.size() == 0) {
                currentNode = $('<div class="snakeItem"></div>');
                $('#box').append(currentNode);
                currentNode.css({top: $('#head').height() * this.body[i].position.y + "px"});
                currentNode.css({left: $('#head').width() * this.body[i].position.x + "px"});
            } else {
                currentNode.animate({top: $('#head').height() * this.body[i].position.y + "px"}, duration / 3);
                currentNode.animate({left: $('#head').width() * this.body[i].position.x + "px"}, duration / 3);
            }
        }
        var angle = 0;
        if (this.velocity.y === 0) {
            if (this.velocity.x === -1) {
                angle = -90;
            } else {
                angle = 90;
            }
        } else {
            if (this.velocity.y === 1) {
                angle = 180;
            } else {
                angle = 0;
            }
        }

        $('#head').rotate(angle);

        if (options.updateFireballs == true) {
            this.updateFireballSize();
        }
    },
    move: function() {
        for (i = this.body.length - 1; i > 0; i--) {
            this.body[i].position = new position(this.body[i - 1].position.copy());
        }
        this.getHead().move(this.velocity);
    },
    init: function(options) {
        this.velocity = options.velocity;
        
        this.body = [
            new snakeItem(new position({x: 7, y: 3})),
            new snakeItem(new position({x: 6, y: 3})),
            new snakeItem(new position({x: 5, y: 3})),
        ];
        this.class = options.class;

        //initialize position of snake body
        var offset = 0;
        $('#box .'+this.class).remove();
        
        for (i in this.body){
            var newHtml = '<div';
            if(i == 0) newHtml += ' id="head"';
            newHtml += ' class="' + this.class+ '"></div>';
            $('#box').append($(newHtml));
        }

        var DOMitems = this.getDomItems();
        for (i in this.body) {
            currentNode = $(DOMitems[i]);
            console.log(DOMitems[i])
            currentNode.css('left', $('#head').width() * this.body[i].position.x);
            currentNode.css('top', $('#head').height() * this.body[i].position.y);
        }

        this.updateFireballSize();
    }
};
var food = {
    position: {
        x: 0,
        y: 0
    },
    foodsEaten: 0,
    screenUpdate: function() {
        $('#food').css('left', $('#food').width() * this.position.x);
        $('#food').css('top', $('#food').height() * this.position.y);
    },
    updateScore: function() {
        $('#points').html(++this.foodsEaten);
    }

};

var makeAStep = function() {
    if (snake.detectCollision(snake.velocity) === true) {
        var explosion = $('<div id="explosion"><img src="images/explosion.gif"></div>');
        var newcss = {
            top: parseInt($("#head").css("top").substring(0, $("#head").css("top").length - 2)) - 90 + 'px',
            left: parseInt($("#head").css("left").substring(0, $("#head").css("left").length - 2)) - 61 + 'px',
            position: 'absolute'
        };
        explosion.css(newcss);
        $('#box').append(explosion);
        var alertInterval = setInterval(function() {

            clearInterval(alertInterval);
            $('#explosion').remove();
            $('#game-over').css('display','block');
        }, 800);

        clearInterval(intervalHandler);
        intervalHandler == null;
        return;
    }

    var lastItemPosition = snake.body[snake.body.length - 1].position.copy();

    snake.move();

    var iJustAteSomeFood = snake.getHead().isOnPosition(food.position);

    if (iJustAteSomeFood == true) {
        food.updateScore();
        generateFood();
        snake.body.push(new snakeItem(lastItemPosition));
    }

    snake.screenUpdate({updateFireballs: iJustAteSomeFood});
};

var generateFood = function() {
    /*
     * move food from the column and row where the head is, to avoid placing it right at the head
     * we decrease range of avaliable positions by one row and one column,
     * and later we swap position when nessesary. 
     */

    food.position.x = Math.floor(Math.random() * ($('#box').width() / $('#head').width() - 1));
    food.position.y = Math.floor(Math.random() * ($('#box').height() / $('#head').height() - 1));
    if (food.position.x >= snake.getHead().position.x)
        food.position.x++;
    if (food.position.y >= snake.getHead().position.y)
        food.position.y++;
    food.screenUpdate();
};

var init = function() {
    snake.init(initialSnakeOptions);
    generateFood();

    if (intervalHandler != null)
        clearInterval(intervalHandler);
    $('#game-over').css('display','none');
    intervalHandler = setInterval(makeAStep, duration);
};

$(document).ready(function() {
    $(document).keydown(function(key) {
        switch (parseInt(key.which, 10)) {
            case 37:  /* a = go left*/
                snake.velocity = {x: -1, y: 0};
                break;
            case 40: /* s = go down */
                snake.velocity = {x: 0, y: 1};
                break;
            case 38:   /* w = go up*/
                snake.velocity = {x: 0, y: -1};
                break;
            case 39: /* d = go right */
                snake.velocity = {x: 1, y: 0};
                break;
        }
    });

    init();

    $('#box').on('dblclick', function(eventObject) {
        init();
        });
});

