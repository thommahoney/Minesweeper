var board;

function init()
{
	var board_elem = $('<div/>', {
		id : 'board',
	});
	$(board_elem).bind('contextmenu', function(e) {
		e.preventDefault();
	});
	$('div#content').prepend(board_elem);
	newGame();
}

function Board(n)
{
	$('div#board').empty();
	
	var boardSize = (24 * n) + (n * 2);
	$('div#board').css('width', boardSize);
	$('div#board').css('height', boardSize);
	
	var b = [];
	for (var i = 0; i < n; i++)
	{
		b[i] = [];
		for (var j = 0; j < n; j++)
		{
			var p = new Piece(i, j);
			b[i][j] = p;
			$('div#board').append(p);
		}
	}
	b.size = n;
	b.playable = true;

	return b;
}

function Piece(row, col)
{
	var piece = $('<div/>', {
		class : 'piece'
	});
	$(piece).append($('<span/>'));
	piece.row = row;
	piece.col = col;
	piece.hasMine = false;
	piece.hasFlag = false;
	piece.count = 0;
	piece.visible = false;
	$(piece).click({row: row, col: col}, function(e) {
		var p = board[e.data.row][e.data.col];
		pieceWasClicked(p);
	});
	$(piece).bind('contextmenu', {row: row, col: col}, function(e) {
		e.preventDefault();
		var p = board[e.data.row][e.data.col];
		flagPiece(p);
	});
	return piece;
}

function setPieceText(piece, text)
{
	$(piece).css('background-color', '#efefef');
    $(piece).children('span').html(text);
	piece.visible = true;
}

function randomNumber(m)
{
	return Math.floor(m * Math.random(m));
}

function generateMines(k)
{
	var l = 0;
	while (l < k)
	{
		var row = randomNumber(board.size);
		var col = randomNumber(board.size);
		var piece = board[row][col];
		if (!piece.hasMine)
		{
			piece.hasMine = true;
			for (var i = (row - 1); i < (row + 2); i++)
			{
				if (i < 0 || i > (board.size - 1))
				{
					continue;
				}
				for (var j = (col - 1); j < (col + 2); j++)
				{
					if (j < 0 || j > (board.size - 1))
					{
						continue;
					}
					var p = board[i][j];
					if (p.hasMine)
					{
						continue;
					}
					p.count++;
				}
			}
			l++;	
		}
	}
}

function boom(piece)
{
	var boomText = $('<div/>', {
			class: 'boom'
		});
	$(boomText).text('BOOM!');
	$(piece).append(boomText);
	$(boomText).animate({
		opacity: 0.0,
		top: '-100px',
		left: '-42px',
		fontSize: '36px'
	}, 'slow');
	board.playable = false;
	setPieceText(piece, '&#149;');
	$(piece).css('color', '#ffffff');
	$(piece).css('background-color', '#ee3333');
	revealMines();
}

function gameIsOver()
{
	var done = true;
	for (var i = 0; i < board.size; i++)
	{
		for (var j = 0; j < board.size; j++)
		{
			var piece = board[i][j];
			if (!piece.hasMine &&
				!piece.visible)
			{
				done = false;
			}
		}	
	}
	return done;
}

function revealMines()
{
	for (var i = 0; i < board.size; i++)
	{
		for (var j = 0; j < board.size; j++)
		{
			var piece = board[i][j];
			if (piece.hasMine &&
				!piece.visible)
			{
				setPieceText(piece, '&#149;');
				$(piece).css('color', '#ee3333');
			}
		}	
	}
}

function flagPiece(piece)
{
	if (!board.playable)
	{
		return;
	}
	piece.hasFlag = !piece.hasFlag;
	$(piece).children('span').text(piece.hasFlag ? '#' : '');
}

function pieceWasClicked(piece)
{
	if (!board.playable)
	{
		return;
	}
	if (piece.visible ||
		piece.hasFlag)
	{
		return;
	}
	if (piece.hasMine)
	{
		boom(piece);
		return;
	}
	else if (piece.count == 0)
	{
		clear(piece);
	}
	else
	{
		setPieceText(piece, piece.count);
	}
	if (gameIsOver())
	{
		board.playable = false;
		alert('You win!');
	}
}

function clear(piece)
{
	for (var i = piece.row - 1; i < piece.row + 2; i++)
	{
		if (i < 0 || i > (board.size - 1))
		{
			continue;
		}
		for (var j = piece.col - 1; j < piece.col + 2; j++)
		{
			if (j < 0 || j > (board.size - 1))
			{
				continue;
			}
			
			var p = board[i][j];
			
			if (p.visible ||
				p.hasFlag)
			{
				continue;
			}
			
			if (!p.hasMine)
			{
				setPieceText(p, p.count == 0 ? '' : p.count);
				if (p.count == 0)
				{
					clear(p);
				}
			}
		}
	}
}

function newGame()
{
	board = new Board(20);
	generateMines((board.size * board.size) / 10);

	// for (var i = 0; i < board.length; i++)
	// {
	// 	for (var j = 0; j < board[i].length; j++)
	// 	{
	// 		var p = board[i][j];
	// 		$(p).children('span').text(p.count);
	// 		if (p.hasMine)
	// 		{
	// 			$(p).children('span').text('*');
	// 		}
	// 	}
	// }	
}
