// app.js: our main javascript file for this app
"use strict";

var tiles = [];
var timer;
var right = 0;
var wrong = 0;
var left = 8;
var imgClicked;
var tileClicked;
var idx;
for (idx = 1; idx <= 32; ++idx) {
    tiles.push({
        tileNum: idx,
        src: 'img/tile' + idx + '.jpg',
        flipped: false,
        matched: false
    });
}

$(document).ready(function() {
    $('#start-game').click(function() {
        tiles = _.shuffle(tiles);
        var selectedTiles = tiles.slice(0,8);
        var tilePairs = [];
        _.forEach(selectedTiles, function (tile) {
            tilePairs.push(tile);
            tilePairs.push(_.clone(tile));
        });
        tilePairs = _.shuffle(tilePairs);
        imgClicked = [];
        tileClicked = [];
        window.clearInterval(timer);

        var gameBoard = $('#game-board');
        gameBoard.empty();
        var row = $(document.createElement('div'));
        var img;
        _.forEach(tilePairs, function(tile, elemIndex) {
            if (elemIndex > 0 && 0 === (elemIndex % 4)) {
                gameBoard.append(row);
                row = $(document.createElement('div'));
            }

            img = $(document.createElement('img'));
            img.attr({
                src: 'img/tile-back.png',
                alt: 'tile ' + tile.tileNum
            });

            img.data('tile', tile);
            row.append(img);
        });
        gameBoard.append(row);

        var startTime = Date.now();
        timer = window.setInterval(function () {
            var elapsedSeconds = (Date.now() - startTime) / 1000;
            elapsedSeconds = Math.floor(elapsedSeconds);
            $('#elapsed-seconds').text(elapsedSeconds + ' seconds');
        }, 1000);

        status();

        $('#game-board img').click(function () {
            var clickedImg = $(this);
            var tile = clickedImg.data('tile');
            if (tile.flipped)
            {
                return;
            }
            flipTile(tile, clickedImg);

            flippedTile(tile, clickedImg);
        });
    });
});

function status () {
    $('#right').text(right);
    $('#wrong').text(wrong);
    $('#left').text(left);
}

function flipTile(tile, img) {
    img.fadeOut(100, function () {
        if (tile.flipped) {
            if (!tile.matched) {
                img.attr('src', 'img/tile-back.png');
            }
        }
        else {
            img.attr('src', tile.src);
        }
        tile.flipped = !tile.flipped;
        img.fadeIn(100);
    });
}

function flippedTile(tile, img) {
    if (imgClicked.length == 0) {
        imgClicked.push(img);
        tileClicked.push(tile);
    }
    else {
        if (tileClicked[0].tileNum == tile.tileNum) {
            right++;
            left--;
            imgClicked = [];
            tileClicked = [];
            if (left == 0) {
                window.setTimeout(function () {
                    window.clearInterval(timer);
                    alert("You won!");
                }, 250);
            }
        }
        else {
            var idx;
            wrong++;
            window.setTimeout(function () {
                flipTile(tileClicked[0], imgClicked[0]);
                flipTile(tile, img);
                imgClicked = [];
                tileClicked = [];
            }, 1000);
        }
        status();
    }


}
