var intervalHandler = null;
var snakeBeginDomOffset = 3;
var duration = 150;

var debug = false;

function position(position) {
    this.x = position.x;
    this.y = position.y
    this.copy = function() {
        return {x: this.x, y: this.y};
    }
}
;

var initialSnakeOptions = {
    items: 3,
    velocity: new position({x: 1, y: 0}),
    class: 'rocket',
    AIControlled: true
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
    }
}

function snakeBuilder() {
    this.body = [];
    this.class = '';
    this.velocity = null;
    this.isAI = false;

    this.getHead = function() {
        return this.body[0];
    };

    this.detectCollision = function(velocity) {
        if (debug)
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

    this.updateFireballSize = function() {
        for (i = this.body.length - 1; i > 0; i--) {
            currentSize = 100 * (snake.body.length - i + 6) / (snake.body.length + 6);
            currentNode = $('#box :nth-child(' + (i + snakeBeginDomOffset) + ')');
            currentNode.css('background-size', currentSize + '% ' + currentSize + '%');
        }
    };

    this.screenUpdate = function(options) {
        var offset = 0;
        var currentNode = null;
        for (i in this.body) {
            offset = snakeBeginDomOffset + parseInt(i);
            currentNode = $('#box :nth-child(' + offset + ')');

            if (currentNode.size() == 0) {
                $('#box').append($('<div class="' + this.class + '"></div>'));
                currentNode = $('#box :nth-child(' + offset + ')');
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
    };

    this.move = function() {
        for (i = this.body.length - 1; i > 0; i--) {
            this.body[i].position = new position(this.body[i - 1].position.copy());
        }
        this.getHead().move(this.velocity);
    };

    this.setDijkstraVelocity = function() {
        var tilesMap = getEmptyTiles();

        tilesMap = updateTilesMap(tilesMap);

        tilesMap = findDijkstraPath(tilesMap);

        displayTiles(tilesMap);

    };

    this.init = function(options) {
        this.velocity = options.velocity;

        this.isAI = options.AIControlled;

        this.body = [
            new snakeItem(new position({x: 7, y: 3})),
            new snakeItem(new position({x: 6, y: 3})),
            new snakeItem(new position({x: 5, y: 3})),
        ];
        this.class = options.class;

        //initialize position of snake body
        var offset = 0;
        $('#box .' + this.class).remove();

        for (i in this.body) {
            var newHtml = '<div';
            if (i == 0)
                newHtml += ' id="head"';
            newHtml += ' class="' + this.class + '"></div>';
            $('#box').append($(newHtml));
        }

        for (i in this.body) {
            offset = snakeBeginDomOffset + parseInt(i);
            $('#box :nth-child(' + offset + ')').css('left', $('#head').width() * this.body[i].position.x);
            $('#box :nth-child(' + offset + ')').css('top', $('#head').height() * this.body[i].position.y);
        }

        this.updateFireballSize();
    };
}

var snake = new snakeBuilder();
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

function getRowsCount() {
    return 16;
}
;
function getColumnsCount() {
    return 20;
}
;
function getEmptyTiles() {
    var tiles = [];
    for (i = -1; i <= getRowsCount(); i++) {
        tiles [i] = [];
        for (j = -1; j <= getColumnsCount(); j++) {
            tiles [i][j] = null;
        }
    }
    return tiles;
}

function updateTilesMap(myMap) {
    var body = snake.body;
    for (itemIndex in body) {
        myMap[body[itemIndex].position.y][body[itemIndex].position.x] = ' X';
    }
    myMap[snake.getHead().position.y][snake.getHead().position.x] = ' H';

    myMap[food.position.y][food.position.x] = 0;

    return myMap;
}



function displayTiles(tiles) {
    for (i in tiles) {
        var tileRow = '';
        for (j in tiles[i]) {
            tileRow = tileRow + tiles[i][j] + ' ';
        }
        console.log(tileRow);
    }
}


function getCellValue(myMap, rowIndex, columnIndex) {
    if (debug)
        console.log('get', rowIndex, columnIndex);
    if (myMap[rowIndex] && myMap[rowIndex][columnIndex])
        return '';
    if (debug)
        console.log(myMap[rowIndex][columnIndex]);
    return myMap[rowIndex][columnIndex];
}
;

function setCellValue(myMap, rowIndex, columnIndex, newValue) {
    console.log(newValue);
    if (debug)
        console.log('set', rowIndex, columnIndex);
    if (myMap[rowIndex] && myMap[rowIndex][columnIndex])
        return '';
    myMap[rowIndex][columnIndex] = newValue;
}
;

function populateNeighbours(myMap, rowIndex, columnIndex) {
    var anythingChanged = false;
    var oldValue = getCellValue(myMap, rowIndex, columnIndex);
    if (isNaN(parseInt(oldValue)))
        return false;
    var newValue = parseInt(oldValue) + 1;

    var i = rowIndex;
    var j = columnIndex;

    var fieldsToPopulate = [
        {x: i - 1, y: j},
        {x: i + 1, y: j},
        {x: i, y: j + 1},
        {x: i, y: j - 1}
    ];

    for (i in fieldsToPopulate) {
        if (getCellValue(myMap, fieldsToPopulate[i].x, fieldsToPopulate[i].y) == null)
        {
            setCellValue(myMap, fieldsToPopulate[i].x, fieldsToPopulate[i].y, newValue);
            anythingChanged = true;
        }
        ;
    }
    console.log('dddd' + anythingChanged);
    return anythingChanged;

}
;

function findDijkstraPath(myMap) {
    var anyFieldHasChanged = true;
    var iterationsCount = 0;
    while (iterationsCount++ < 35) {
        console.log(anyFieldHasChanged + 'jmjm')

        anyFieldHasChanged = false;
        for (rowIndex = 0; rowIndex < getRowsCount(); rowIndex++) {

            for (columnIndex = 0; columnIndex < getColumnsCount(); columnIndex++) {

                if (populateNeighbours(myMap, rowIndex, columnIndex)) {
                    console.log('!');
                    anyFieldHasChanged = true;
                }
            }
        }

    }
    return myMap;
}

var makeAStep = function() {
    if (snake.isAI) {
        snake.setDijkstraVelocity();
    }
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
            $('#game-over').css('display', 'block');
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

    if (intervalHandler !== null)
        clearInterval(intervalHandler);
    $('#game-over').css('display', 'none');
    //intervalHandler = setInterval(makeAStep, duration);
};


$(document).ready(function() {
    $(document).keydown(function(key) {
//        switch (parseInt(key.which, 10)) {
//            case 37:  /* a = go left*/
//                snake.velocity = {x: -1, y: 0};
//                break;
//            case 40: /* s = go down */
//                snake.velocity = {x: 0, y: 1};
//                break;
//            case 38:   /* w = go up*/
//                snake.velocity = {x: 0, y: -1};
//                break;
//            case 39: /* d = go right */
//                snake.velocity = {x: 1, y: 0};
//                break;
//        }
    });

    init();

    $('#box').on('dblclick', function(eventObject) {
        init();
    });
});

