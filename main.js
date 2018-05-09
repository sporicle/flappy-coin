
var coin = null, board = null;
var obstableSize = { width:35, height:420 }, cPos = { x: 80, y:100, h:40, w:50 };
var fallRate = 0.5, iniSpeed = -7, curSpeed = 0;
var score = 0, tmStep = 0, state = 0;

(function($) {})(jQuery);

function moveCoin() {
	curSpeed += fallRate;
	cPos.y = Math.max(cPos.y + curSpeed, 0);
	var ang = curSpeed * 5, mh = board.height()-cPos.h, m = -12, lo = 0, obstacle = $('.obs');
	coin.css({top: cPos.y});
	if (cPos.y > mh)
		return gameOver();
	for (var i = obstacle.length-1; i >= 0; i--) {
		var s = obstacle[i].style, x = parseInt(s.left), y = parseInt(s.top);
		lo = Math.max(lo, x);
		if (x+obstableSize.width +m < cPos.x || x > cPos.x+cPos.w+m)	continue;
		if (y+obstableSize.height+m < cPos.y || y > cPos.y+cPos.h+m) continue;
		return gameOver();
	}
	if (obstacle.length > 3 || lo > 300)
		return;
	var og = cPos.h * 2;
	var oh = og + Math.floor(Math.random() * (mh-og+1));
	var obs = $("<img/><img/>").addClass('c obs').css({left:480, zIndex:3}).css(obstableSize).attr('src', 'pics/vine.png')
		.appendTo(board).animate({left:-50}, Math.max(2000,3500), 'linear', function() { 
			$('#score').text(' Millions Earned: ' + (score += 1 ));
			this.remove();
		});
	obs[0].style.top = oh + 'px';
	obs[1].style.top = (oh - og - obstableSize.height) + "px";
}
function onTap() {
	if (state > 1) return;
	if (state == 0) {
		state = 1;
		$('#score').text(' Millions Earned: ' + (score = 0));
		Parallax($('#bGrnd'), 240);
		Parallax($('#fGrnd'), 80);
		$('#instr').hide();
		tmStep = window.setInterval(moveCoin, 30);
	}
	curSpeed = iniSpeed;
}

function gameOver() {
	state = 2;
	$(":animated").stop();
	if (tmStep) tmStep = window.clearInterval(tmStep);
	coin.animate({ top:board.height()-cPos.h}, 1000)
		.animate({ top:board.height()-cPos.h}, 500, function() {
			$('#score').text(' Millions Earned: ' + score);
			start();
		});
}

function Parallax(elm, tmo) {
	elm.css('left', 0).animate({left:-15360}, {
			duration:tmo*1100, easing:'linear', //step : PrlxStep,
			complete : function() { Parallax(elm, tmo); } 
	});
}

function start() {
	state = score = 0;					// not started
	cPos = { x: 80, y:100, h:40, w:50 };
	coin.css({left:cPos.x, top:cPos.y, width:cPos.w, height:cPos.h});
	$('.obs').remove();
	$('#instr').show();
}

$(document).ready(function() {
	coin = $('#coin');
	var evt = (typeof(coin[0].ontouchend) == "function") ? "touchstart" : "mousedown";
	board = $('#board').bind(evt, onTap);
	start();
});
