var keyEnum = { W_Key:0, A_Key:1, S_Key:2, D_Key:3, SPACE:4 };
var keys = new Array(8);
var shots = new Array();
var width;

var max;
var waitTime = 17;

var timer;
var ballMachine;
var createLife;
var time;
var counter;
var multiple;
var highscore = 0;
var lives;
var going;
var ms = 0;

var bombs;
var doubleshot;
var power;
var level;
var killed;

// was coding quickly and there are too many magic numbers. not all
// the numbers are magic.
// most of them should probably be global constants.

function reset() {
	var player;
	if ($("player") == null) {
		player = document.createElement("div");
		player.setAttribute("id", "player");
		$("game").appendChild(player);
	}
	killed = 0;
	doubleshot = false;
	bombs = 1;
	power = 0;
	roamLeft = true;
	down = true;
	milestone = 0;
	ms = 0;
	counter = 0;
	level = 1;
	lives = 10;
	$("lives").innerHTML = "Lives: " + lives;
	$("bombs").innerHTML = "Bombs: " + bombs;
	clearInterval(timer);
	$("player").style.top = max + "px";
	var lefti = parseInt(window.getComputedStyle(game).width) / 2;
	$("player").style.left = lefti - width / 2 + "px";
	$("player").style.borderBottomColor = "white";
	invincible = 0;
	for (var i = 0; i < keys.length; i++) {
		keys[i] = false;
	}
	var things = document.querySelectorAll("#game div");
	for (var i = 0; i < things.length; i++) {
		if (things[i] != $("player")) {
			$("game").removeChild(things[i]);
		}
	}
}



window.onload = function() {
	going = false;
	width = parseInt(window.getComputedStyle(player).borderLeftWidth) * 2;
	max = parseInt(window.getComputedStyle(game).width) - width;
	reset();
	document.addEventListener("keydown", function(e) {
		if (e.keyCode == 87) {
			keys[keyEnum.W_Key] = true;
		} else if (e.keyCode == 65) {
			keys[keyEnum.A_Key] = true;
		} else if (e.keyCode == 83) {
			keys[keyEnum.S_Key] = true;
		} else if (e.keyCode == 68) {
			keys[keyEnum.D_Key] = true;
		} else if (e.keyCode == 32 && going) {
			keys[keyEnum.SPACE] = true;
			e.preventDefault();
			shoot();
		} else if (e.keyCode == 13) {
			start();
		} else if (e.keyCode == 80 && going) { // P
			pause();
		} else if (e.keyCode == 80) {
			unpause();
		} else if (e.keyCode == 66 && going) { // b button
			bomb();
		}
	});
	document.addEventListener("keyup", function(e) {
		if (e.keyCode == 87) {
			keys[keyEnum.W_Key] = false;
		} else if (e.keyCode == 65) {
			keys[keyEnum.A_Key] = false;
		} else if (e.keyCode == 83) {
			keys[keyEnum.S_Key] = false;
		} else if (e.keyCode == 68) {
			keys[keyEnum.D_Key] = false;
		} else if (e.keyCode == 32) {
			keys[keyEnum.SPACE] = false;
		} 
	});
}

function bomb() {
	if (bombs < 1) return;
	bombs--;
	$("bombs").innerHTML = "Bombs: " + bombs;
	var things = document.querySelectorAll("#game div");
	for (var i = 0; i < things.length; i++) {
		var t = things[i];
		if ((t != $("player")) && (t.className != "boss") && (t.className != "powerup")) {
			if (t.parentNode == document.querySelector("#game"))
				$("game").removeChild(t);
		}
	}
}

function pause() {
	clearInterval(timer);
	going = false;
}
function unpause() {
	timer = setInterval(move, 10);
	going = true;
}
function shoot() {
	if ($("player") == null) return;
	var player = $("player");
	var shot = document.createElement("div");
	shot.style.position = "absolute";
	shot.style.width = "4px";
	shot.style.height = "10px";
	shot.style.top = (parseInt(player.offsetTop) - 10) + "px";
	shot.style.left = (parseInt(player.offsetLeft) + (width / 2) - 2) + "px";
	shot.style.backgroundColor = "red";
	shot.className = "shot";
	if (doubleshot) {
		var left = $("player").offsetLeft;
		shot.style.left = parseInt(left) + 30 + "px";
		var clone = shot.cloneNode(true);
		clone.style.left = parseInt(left) + 10 + "px";
		$("game").appendChild(clone);
	}
	$("game").appendChild(shot);
}

function start() {
	reset();
	timer = setInterval(move, 10);
	going = true;
}

function multi() {
	if (this.checked) {
		multiple = true;
		$("c2").style.display = "block";
	} else {
		multiple = false;
		$("c2").style.display = "none";
	}
}


function moveAllShots() {
	var temp = new Array();
	var bullets = document.querySelectorAll(".shot");
	var s = 13;
	if (document.querySelector(".shot") != null) {
		for (var i = 0; i < bullets.length; i++) {
			var b = bullets[i];
			var newTop = b.offsetTop - s;
			b.style.top = newTop + "px";
			if ((-15) > parseInt(b.offsetTop)) {
				$("game").removeChild(b);
			}
		}
	}
	if (document.querySelector(".eshot") != null) {
		var eshots = document.querySelectorAll(".eshot");
		for (var j = 0; j < eshots.length; j++) {
			var b = eshots[j];
			newTop = b.offsetTop + parseInt(b.innerHTML);
			b.style.top = newTop + "px";
			if ((615) < parseInt(b.offsetTop)) {
				$("game").removeChild(b);
			}
		}
	}
}

function gameover() {
	$("game").removeChild($("player"));
	var end = document.createElement("div");
	end.style.position = "absolute";
	end.style.left = 225 + "px";
	end.style.top = 225 + "px";
	end.style.textAlign = "center";
	end.style.backgroundColor = "white";
	end.style.width = "150px";
	end.className = "end";
	var s = "You Lost. Press enter to try again. Even though you didn't win, you lasted " + (ms * 10) / 1000 + " seconds";
	clearInterval(timer);
	$("game").appendChild(end);
	end.innerHTML = s;
}

function clearIt() {
	var end = document.querySelector(".end");
	if (end != null) {
		end.style.display = "none";
		$("game").removeChild(end);
	}
	start();
}

var invincible = 0;
function move() {
	ms++;
	var speed = 5;
	if ((playerCircleCollide(".shell") || playerCircleCollide(".diverL")
		|| playerCircleCollide(".diverR") || playerCircleCollide(".shooter")
		|| playerBulletCollide(".eshot") || playerCircleCollide(".suicide")
		|| playerRectangleCollide(".boss") || playerRectangleCollide(".tank")
		|| playerRectangleCollide(".laser") || playerRectangleCollide(".charging"))
		&& (invincible == 0)) {
	 	lives--;
	 	$("lives").innerHTML = "Lives: " + lives;
	 	if (lives == 0) {
	 		// This method does that
	 		gameover();
	 		return;
	 	} else {
			$("player").style.borderBottomColor = "purple";
		 	invincible = 1;
	 	}
	}
	if (invincible != 0 && invincible <= 300) {
		if (invincible % 2 == 0) {
			$("player").style.borderBottomColor = "gold";
		} else {
			$("player").style.borderBottomColor = "purple";
		}
		invincible++;
	} else if (invincible > 300) {
		invincible = 0;
			$("player").style.borderBottomColor = "white";
	}
	circleBulletCollide(".shell");
	circleBulletCollide(".diverL");
	circleBulletCollide(".diverR");
	circleBulletCollide(".shooter");
	circleBulletCollide(".suicide");
	rectangleBulletCollide(".tank");
	movePowerUps();
	powerup(powerupCollide());
	var ship = $("player");
	var left = ship.offsetLeft;
	var top = ship.offsetTop;
	if (keys[keyEnum.A_Key]) { // left
		if (left > -20) {
			ship.style.left = ((left - speed) + "px");
		}
	}
	if (keys[keyEnum.W_Key]) { // up
		if (top > 0) {
			ship.style.top = ((top - speed) + "px");
		}
	}
	if (keys[keyEnum.D_Key]) { // right
		if (left < max + 20) {
			ship.style.left = ((left + speed) + "px");
		}
	}
	if (keys[keyEnum.S_Key]) { // down
		if (top < max) {
			ship.style.top = ((top + speed) + "px")
		}
	}

	if (level == 1) {
		level1();
	} else if (level == 2) {
		level2();
	} else if (level == 3) {
		level3();
	} else if (level == 4) {
		level4();
	} else if (level == 5) {
		level5();
	} else if (level == 6) {
		level6();
	} else if (level == 7) {
		leveln();
	} else if (level == 8) {
		levelt();
	} else if (level == 9) {
		levelj();
	} else if (level == 10) {
		level7();
	} else {
		boss();
		moveBoss();
		if (document.querySelector(".boss") == null) {
			alert("you win. " + ms / 100 + " seconds. " + killed + " circles lasered.");
			bomb();
			bombs++;
			$("bombs").innerHTML = "Bombs: " + bombs;
			for (var i = 0; i < keys.length; i++) {
				keys[i] = false;
			}
		}
	}
	moveAllShots();
	counter++;
}

function boss() {
	if (document.querySelector(".boss") == null) {
		var a = document.createElement("div");
		a.style.position = "absolute";
		a.style.width = "400px";
		a.style.height = "50px";
		a.style.left = "100px";
		a.style.top = "-25px"
		a.innerHTML = "300";
		a.className = "boss";
		a.style.backgroundColor = "#B00000";
		a.style.color = "rgba(0, 0, 0, 0)";
		var b = document.createElement("div");
		b.className = "boss";
		b.style.position = "absolute";
		b.style.backgroundColor = "#DC143C";
		b.style.color = "rgba(0, 0, 0, 0)";
		b.style.width = "100px";
		b.style.height = "100px";
		b.style.top = "-25px";
		b.style.left = "250px";
		b.innerHTML = "200";
		a.style.borderRadius = "3%";
		b.setAttribute("id", "head");
		a.setAttribute("id", "body");
		// $("game").appendChild(a);
		$("game").appendChild(b);
	}
}

var roamLeft = true;
function moveBoss() {
	rectangleBulletCollide(".boss");
	moveShooters(2,1);
	if (document.querySelector(".boss") == null) {
		level = 1;
		counter = 0;
		return;
	}
	var boss = document.querySelectorAll(".boss");
	var broken = boss.length == 1;

	if (counter % 10 == 0) {
		boss.innerHTML = parseInt(boss[0].innerHTML) + 1;
	}
	if (milestone == 0) { // pick one
		counter = 0;
		milestone = parseInt(Math.random() * 3) + 1;
	}
	if (milestone == 1) {
		if (shouldThrow(4, 90)) {
			shooter();
		}
		roam(boss, broken);
	} else if (milestone == 2 && $("head") != null) {
		fireLaser(boss);
	} else if (milestone == 3 || milestone == 2) {
		slam();
	}
}

// Given the shots to be fired and the time between,
// the boss roams left and right and shoots off shots
function roam(boss, shots, ms) {
	var w = parseInt(window.getComputedStyle(boss[0]).width);
	var gw = parseInt(window.getComputedStyle($("game")).width);
	for (var i = 0; i < boss.length; i++) {
		var wid = parseInt(window.getComputedStyle(boss[i]).width);
		if (roamLeft) {
			boss[i].style.left = parseInt(boss[i].offsetLeft) - 2 + "px";
			if (boss[i].offsetLeft == 0 && (i == (boss.length - 1) || wid > 200)) {
				roamLeft = false;
			}
		} else {
			boss[i].style.left = parseInt(boss[i].offsetLeft) + 2 + "px";
			if (boss[i].offsetLeft + wid == gw && (i == (boss.length - 1) || wid > 200)) {
				roamLeft = true;
			}
		}
	}
	if (shouldThrow(40, 60)) {
		bShot(boss);
	}
	if ((document.querySelector(".shooter") == null) && ((boss[0].offsetLeft + (w / 2)) == (gw / 2))) {
		milestone = 0;
	}
}

function bShot(boss) {
	for (var i = 0; i < boss.length; i++) {
		var wid = parseInt(window.getComputedStyle(boss[i]).width);
		var h = parseInt(window.getComputedStyle(boss[i]).height);
		var shot = document.createElement("div");
		shot.style.position = "absolute";
		shot.style.width = "4px";
		shot.style.height = "15px";
		shot.style.top = (parseInt(boss[i].offsetTop) + h) + "px";
		shot.style.left = (parseInt(boss[i].offsetLeft) + (wid) - 2) + "px";
		shot.style.backgroundColor = "yellow";
		shot.style.color = "rgba(0, 0, 0, 0)";
		if (boss[i].innerHTML < 50) {
			shot.innerHTML = "10";
		} else {
			shot.innerHTML = "6";
		}
		shot.className = "eshot";
		var clone = shot.cloneNode(true);
		clone.style.left = parseInt(boss[i].offsetLeft) + "px";
		$("game").appendChild(shot);
		$("game").appendChild(clone);
	}
}

function fireLaser(boss) {
	for (var i = 0; i < boss.length; i++) {
		if (boss[i].offsetTop < 100 && counter < 175) {
			boss[i].style.top = boss[i].offsetTop + 1 + "px";
		} else {
			if (document.querySelector(".laser") == null && counter < 300) {
				makeLaser();
			} else {
				var l = document.querySelector(".laser");
				if (l != null) {
					var h = parseInt(window.getComputedStyle(l).height);
					l.style.height = h + 4 + "px";
					if (h + 4 > 600) {
						var op = window.getComputedStyle(l).opacity;
						l.style.opacity = op - .01;
						if (op -.01 <= .05) {
							$("game").removeChild(l);
						}
					}
				} else if ($("head").offsetTop >= -25 && i == 0) { // l is null
					if (!flyBoss("N", 3)) {
						milestone = 0;
					}
				} else if ($("head").offsetTop <= -25) {
					milestone = 0;
				}
			}
		}
	}
}

function makeLaser() {
	if (document.querySelector(".charging") == null) {
		var h = $("head");
		var headWidth = parseInt(window.getComputedStyle(h).width);

		var shot = document.createElement("div");
		shot.className = "charging";
		shot.style.position = "absolute";
		shot.style.width = headWidth + "px";
		shot.style.height = "15px";
		shot.style.top = "200px";
		shot.style.left = parseInt(h.offsetLeft) + "px";
		shot.style.backgroundColor = "yellow";
		shot.style.color = "rgba(0, 0, 0, 0)";
		$("game").appendChild(shot);
	} else {
		var shot = document.querySelector(".charging");
		if (counter % 3 == 0) {
			shot.style.backgroundColor = "yellow";
		} else if (counter % 3 == 1) {
			shot.style.backgroundColor = "orange";
		} else {
			shot.style.backgroundColor = "red";
		}
		shot.style.left = shot.offsetLeft - 2 + "px";
		var w = parseInt(window.getComputedStyle(shot).width);
		shot.style.width = w + 4 + "px";
		if (w + 6 > 650) {
			shot.className = "laser";
			shot.style.backgroundColor = "yellow";
			return true;
		}
	}
}

// returns true if boss moved in direction specified
function flyBoss(dir, speed) {
	if (document.querySelector(".boss") == null) {
		return false;
	}
	var boss = document.querySelectorAll(".boss");
	for (var i = 0; i < boss.length; i++) {
		if (dir == "N") {
			if (boss[i].offsetTop <= -25) {
				return false;
			} else {
				boss[i].style.top = boss[i].offsetTop - speed + "px";
			}
		} else if (dir == "S") {
			if (boss[i].offsetTop >= 600) {
				return false;
			} else {
				boss[i].style.top = boss[i].offsetTop + speed + "px";
			}
		}
	}
	return true;
}

function moveUpBoss() {
	if (document.querySelector(".boss") == null) {
		return;
	}
	var boss = document.querySelectorAll(".boss");
	for (var i = 0; i < boss.length; i++) {
		if (boss[i].offsetTop > 100) {
			boss[i].style.top = boss[i].offsetTop - 10 + "px";
		} else if (boss[i].offsetTop > -25) { 
			boss[i].style.top = boss[i].offsetTop - 1 + "px";
		}
	}
}


var down = true;
function slam() {
	if (down) {
		down = flyBoss("S", 7);
	} else {
		if (!flyBoss("N", 4)) {
			milestone = 0;
			down = true;
		}
	}
}

function playerRectangleCollide(className) {
	if (document.querySelector(className) == null) {
		return false;
	}
	var rects = document.querySelectorAll(className);
	var player = $("player");
	var xTop, yTop, xLeft, yLeft, xRight, yRight; // xy for each
	xTop = player.offsetLeft + (width / 2);
	yTop = player.offsetTop;
	xLeft = player.offsetLeft;
	yLeft = yTop + parseInt(window.getComputedStyle(player).borderBottomWidth);
	yRight = yLeft;
	xRight = xLeft + width;
	for (var i = 0; i < rects.length; i++) {
		var wid = parseInt(window.getComputedStyle(rects[i]).width);
		var height = parseInt(window.getComputedStyle(rects[i]).height);

		var r = rects[i];
		if (r.offsetTop + height > yTop && r.offsetTop < yTop) {
			if (r.offsetLeft + wid > xTop && r.offsetLeft < xTop) {
				return true;
			}
		}
		if (r.offsetTop + height > yLeft && r.offsetTop < yLeft) {
			if (r.offsetLeft + wid > xLeft && r.offsetLeft < xLeft) {
				return true;
			}
		}
		if (r.offsetTop + height > yRight && r.offsetTop < yRight) {
			if (r.offsetLeft + wid > xRight && r.offsetLeft < xRight) {
				return true;
			}
		}
	}
/////////collisions between circle class and triangle
	return false;
}

function playerBulletCollide(className) {
	if (document.querySelector(className) == null) {
		return false;
	}
	var bullets = document.querySelectorAll(className);
	var height = parseInt(window.getComputedStyle(bullets[0]).height);
	// var wid = parseInt(window.getComputedStyle(bullets[0]).width);
	for (var i = 0; i < bullets.length; i++) {
		var b = bullets[i];
		var diff = $("player").offsetTop + 35 - b.offsetTop;
		if (diff < height && diff > 0) { // 35 is triangle height
			diff = $("player").offsetLeft - b.offsetLeft;
			if (diff < 0 && diff > -40) {
				return true;
			}
		}
	}
}

var milestone = 0;
function level1() {
	moveAllShells();
	if (milestone == 0) {
		tank();
		milestone++;
	}
	if (document.querySelector(".tank") == null) {
		level++;
		milestone = 0;
	}
}

function level2() {
	moveAllShells();

	update(".diverL", square, 3);
	update(".diverR", msquare, -3);
	if (milestone == 0) {
		counter = 0;
		tank();
		milestone++;
	}
	if (milestone == 1 && counter % 25 == 0 && counter < (25 * 10)) {
		createDiver("diverL", -50 + parseInt(Math.random() * 25));
		createDiver("diverR", 600 - parseInt(Math.random() * 25));
	}
	if (document.querySelector(".diverL") == null &&
		document.querySelector(".diverR") == null) {
		milestone++;
	}
	if (milestone == 3) {
		counter = 0;
		level++;
		milestone = 0;
	}
}

// when counter starts at 0. will throw up to n balls every
// 10 * seconds milliseconds
function shouldThrow(n, ms) {
	return counter % ms == 0 && counter < (ms * n);
}

// returns true if all other div elements are gone off the screen
// not counting the player div... which never leaves
function allClear() {
	return (document.querySelectorAll("#game div").length == 1);
}

function level3() {
	moveAllShells();
	update(".diverR", msquare, -4);
	moveShooters(2, 2);
	if (shouldThrow(8, 300)) {
		tank();
	}
	if (shouldThrow(16, 150)) {
		shooter();
	}
	if (shouldThrow(40, 60)) {
		createDiver("diverR", 600);
	}
	if (counter > 2400 && allClear()) {
		counter = 0;
		level++;
	}
}

function level4() {
	moveShooters(4, 2);
	moveAllShells();
	if (shouldThrow(22, 100)) {
		shooter();
	}
	if (shouldThrow(2, 500)) {
		tank();
	}
	if (counter > 2200 && allClear()) {
		counter = 0;
		level++;
	}
}

function level5() {
	update(".diverR", smsquare, -2);
	update(".diverL", ssquare, 2);
	moveKamikaze(3, 15);
	if (shouldThrow(15, 150)) {
		createDiver("diverR", 600);
		createDiver("diverL", -50);
	}
	if (shouldThrow(150, 15)) {
		spawnKamikaze();
	}
	if (counter > 2250 && allClear()) {
		counter = 0;
		level++;
	}
}

function level6() {
	moveAllShells();
	update(".diverR", msquare, -3);
	moveShooters(2, 1);
	moveKamikaze(2, 10);
	if (shouldThrow(50, 80)) {
		createDiver("diverR", 600);
	}
	if (shouldThrow(10, 400)) {
		tank();
	}
	if (shouldThrow(20, 200)) {
		spawnKamikaze();
	}
	if (shouldThrow(5, 800)) {
		shooter();
	}
	if (counter > 4000 && allClear()) {
		counter = 0;
		level++;
	}
}

function leveln() {
	moveShooters(1, 1);
	moveKamikaze(4, 4);
	update(".diverR", smsquare, -2);
	update(".diverL", square, 2);
	if (shouldThrow(40, 250)) {
		shooter();
	} if (shouldThrow(75, 125)) {
		spawnKamikaze();
	} if (shouldThrow(23, 400)) {
		createDiver("diverR", 600);
		createDiver("diverL", -50);	
	}
	if (counter > 10000 && allClear()) {
		counter = 0;
		level++;
	}
}


function levelj() {
	moveShooters(4, 3);
	moveKamikaze(6, 5);
	update(".diverR", smsquare, -3);
	update(".diverL", square, 3);
	if (shouldThrow(80, 125)) {
		shooter();
	} if (shouldThrow(150, 63)) {
		spawnKamikaze();
	} if (shouldThrow(50, 250)) {
		createDiver("diverR", 600);
		createDiver("diverL", -50);	
	}
	if (counter > 12500 && allClear()) {
		counter = 0;
		level++;
	}
}

function levelt() {
	var speed;
	if (counter < 100) {
		speed = 4;
	} else if (counter < 500) {
		speed = 7;
	} else if (counter < 1000) {
		speed = 9;
	} else if (counter < 2000) {
		speed = 12;
	} else {
		speed = 15;
	}
	moveKamikaze(5, speed);
	moveAllShells();
	if (shouldThrow(200, 40)) {
		spawnKamikaze();
	}
	if (shouldThrow(40, 200)) {
		tank();
	}
	if (counter > 8000 && allClear()) {
		counter = 0;
		level++;
	}
}

function level7() {
	moveShooters(6, 2);
	if (shouldThrow(3, 1)) {
		shooter();
	}
	if (allClear()) {
		level++;
	}
}


function spawnKamikaze() {
	var c = document.createElement("div");
	c.className = "suicide";
	if (Math.random() < .5) {
		c.innerHTML = "L";
		c.style.left = "-40px"
	} else {
		c.innerHTML = "R";
		c.style.left = "600px";
	}
	var y = parseInt(Math.random() * 
		(parseInt(window.getComputedStyle($("game")).height) / 2));
	c.style.top = y + "px";
	$("game").appendChild(c);
}

function moveKamikaze(xspeed, yspeed) {
	if (document.querySelector(".suicide") == null) {
		return;
	}
	var balls = document.querySelectorAll(".suicide");
	for (var i = 0; i < balls.length; i++) {
		var b = balls[i];
		if (Math.abs($("player").offsetLeft - b.offsetLeft) < 40) {
			b.innerHTML = "D";
		}
		if (b.innerHTML == "D") {
			b.style.top = b.offsetTop + yspeed + "px";
		} else if (b.innerHTML == "L") {
			b.style.left = b.offsetLeft + xspeed + "px";
		} else if (b.innerHTML == "R") {
			b.style.left = b.offsetLeft - xspeed + "px";
		}
		if (b.offsetLeft < -50 || b.offsetLeft > 650
			|| b.offsetTop > 650) {
			$("game").removeChild(b);
		}
	}
}


function shooter() {
	var shooter = document.createElement("div");
	shooter.className = "shooter";
	shooter.style.left = parseInt(Math.random() * 600) + "px";
	if ((Math.random() * 2) < 1) {
		shooter.innerHTML = "L";
	} else {
		shooter.innerHTML = "R";
	}
	$("game").appendChild(shooter);
}

function tank() {
	var tank = document.createElement("div");
	tank.className = "tank";
	tank.innerHTML = 3;
	$("game").appendChild(tank);	
}

function createDiver(className, leftpos) {
	var diver = document.createElement("div");
	diver.className = className;
	diver.style.left = leftpos + "px";
	$("game").appendChild(diver);
}


function linearDiveLtoR(x) {
	return .5 * (x);
}

function linearDiveRtoL(x) {
	return -.5 * (x - 600);
}

function square(x) {
	return .005 * Math.pow(x, 2);
}

function msquare(x) {
	return (.005 * Math.pow(x - 600, 2));
}

function smsquare(x) {
	return (.0025 * Math.pow(x - 600, 2));
}

function ssquare(x) {
	return (.0025) * Math.pow(x, 2);
}

// returns true if player's left is within n pixels from x
// false otherwise
function playerLeftWithin(x, n) {
	return Math.abs(x - $("player").offsetLeft) < n;
}

function update(className, f, delta) {
	if (document.querySelector(className) == null) {
		return;
	}
	var divers = document.querySelectorAll(className);
	for (var i = 0; i < divers.length; i++) {
		var thing = divers[i];
		thing.style.top = f(thing.offsetLeft + delta) + "px";
		thing.style.left = thing.offsetLeft + delta + "px";
		if (thing.offsetTop > max + 50) {
			$("game").removeChild(thing);
		}
	}
}

function moveShooters(xspeed, yspeed) {
	if (document.querySelector(".shooter") != null) {
		var shooters = document.querySelectorAll(".shooter");
		for (var i = 0; i < shooters.length; i++) {
			var thing = shooters[i];
			if (playerLeftWithin(thing.offsetLeft + 
				(parseInt(window.getComputedStyle(thing).width) / 2), 50)) {
				createShot(thing, 7);
			}
			if (thing.offsetLeft < 0) {
				thing.innerHTML = "R";
			} else if (thing.offsetLeft > 575) {
				thing.innerHTML = "L";
			}
			thing.style.top = thing.offsetTop + yspeed + "px";
			if (thing.innerHTML == "R") {
				thing.style.left = thing.offsetLeft + xspeed + "px";
			} else {
				thing.style.left = thing.offsetLeft - xspeed + "px";
			}
			if (thing.offsetTop > 625) {
				$("game").removeChild(thing);
			}
		}
	}
}

// creates an enemy shot with downward speed speed. 
// shot comes from enemy thing
function createShot(thing, speed) {
	var w = parseInt(window.getComputedStyle(thing).width);
	var eshot = document.createElement("div");
	eshot.style.position = "absolute";
	eshot.style.width = "4px";
	eshot.style.height = "10px";
	eshot.className = "eshot";
	eshot.style.left = thing.offsetLeft + (w / 2) + "px";
	eshot.style.top = thing.offsetTop + w + "px";
	eshot.innerHTML = String(speed);
	eshot.style.backgroundColor = "white";
	eshot.style.color = "rgba(0, 0, 0, 0)";
	$("game").appendChild(eshot);
}

function moveAllShells() {
	if (document.querySelector(".tank") != null) {

		var tanks = document.querySelectorAll(".tank");
		for (var i = 0; i < tanks.length; i++) {
			var tank = tanks[i];
			var newLeft = tank.offsetLeft + 2;
			var r = parseInt(Math.random() * 25);
			if (r == 0) {
				var shell = document.createElement("div");
				shell.className = "shell";
				shell.style.left = tank.offsetLeft + "px";
				shell.style.top = tank.offsetTop + "px";
				$("game").appendChild(shell);
			}
			tank.style.left = newLeft + "px";
			if (newLeft > max + 200) {
				$("game").removeChild(tank);
			}
		}
	}
	if (document.querySelector(".shell") != null) {
		var shells = document.querySelectorAll(".shell");
		for (var i = 0; i < shells.length; i++) {
			var newTop = parseInt(shells[i].offsetTop) + 4;
			shells[i].style.top = newTop + "px";
			if (shells[i].offsetTop > max + 50) {
				$("game").removeChild(shells[i]);
			}
		}
	}
}

// ok so need to check collision for each enemy class
// probably it will have its own method.
// enemies check against shots and the player.
// die if shot and "alert" (change later. give the player lives).
// if hits the player.

// returns true if player dies. killls all enemies shot
function playerCircleCollide(className) {
	if (document.querySelector(className) == null) {
		return false;
	}
	var circles = document.querySelectorAll(className);
	var rad = parseInt(window.getComputedStyle(circles[0]).width) / 2;
	var player = $("player");
	var xTop, yTop, xLeft, yLeft, xRight, yRight; // xy for each
	xTop = player.offsetLeft + (width / 2);
	yTop = player.offsetTop;
	xLeft = player.offsetLeft;
	yLeft = yTop + parseInt(window.getComputedStyle(player).borderBottomWidth);
	yRight = yLeft;
	xRight = xLeft + width;
	for (var i = 0; i < circles.length; i++) {
		var c = circles[i];
		var x = c.offsetLeft + rad;
		var y = c.offsetTop + rad;
		if (Math.abs(x - xTop) - rad - width  < 0) { // might be collision
			var dx = x - xTop;
			var dy = y - yTop;
			var distance = Math.sqrt(dx * dx + dy * dy);
			if (distance < rad - 1) {
				return true;
			}
			dx = x - xLeft;
			dy = y - yLeft;
			distance = Math.sqrt(dx * dx + dy * dy);
			if (distance < rad - 1) {
				return true;
			}
			dx = x - xRight;
			dy = y - yRight;
			distance = Math.sqrt(dx * dx + dy * dy);
			if (distance < rad - 1) {
				return true;
			}
		}
	}
/////////collisions between circle class and triangle
	return false;
}



function powerup(which) {
	if (which == "B") {
		bombs++;
		$("bombs").innerHTML = "Bombs: " + bombs;
	} else if (which == "?") {
		power++;
		if (power > 3) {
			doubleshot = true;
		}
	} else if (which == "L") {
		lives = lives + 1;
		$("lives").innerHTML = "Lives: " + lives;
	}
}

function powerupCollide() {
	var className = ".powerup";
	if (document.querySelector(className) == null) {
		return false;
	}
	var circles = document.querySelectorAll(className);
	var rad = parseInt(window.getComputedStyle(circles[0]).width) / 2;
	var player = $("player");
	var xTop, yTop, xLeft, yLeft, xRight, yRight; // xy for each
	xTop = player.offsetLeft + (width / 2);
	yTop = player.offsetTop;
	xLeft = player.offsetLeft;
	yLeft = yTop + parseInt(window.getComputedStyle(player).borderBottomWidth);
	yRight = yLeft;
	xRight = xLeft + width;
	for (var i = 0; i < circles.length; i++) {
		var c = circles[i];
		var x = c.offsetLeft + rad;
		var y = c.offsetTop + rad;
		if (Math.abs(x - xTop) - rad - width  < 0) { // might be collision
			var dx = x - xTop;
			var dy = y - yTop;
			var distance = Math.sqrt(dx * dx + dy * dy);
			if (distance < rad - 1) {
				$("game").removeChild(c);
				return c.innerHTML;
			}
			dx = x - xLeft;
			dy = y - yLeft;
			distance = Math.sqrt(dx * dx + dy * dy);
			if (distance < rad - 1) {
				$("game").removeChild(c);
				return c.innerHTML;
			}
			dx = x - xRight;
			dy = y - yRight;
			distance = Math.sqrt(dx * dx + dy * dy);
			if (distance < rad - 1) {
				$("game").removeChild(c);
				return c.innerHTML;
			}
		}
	}
/////////collisions between circle class and triangle
	return false;
}

function rectangleBulletCollide(className) {
	if (document.querySelector(className) == null
		|| document.querySelector(".shot") == null) {
		return false;
	}
	var rectangles = document.querySelectorAll(className);
	var shots = document.querySelectorAll(".shot");
	for (var i = 0; i < rectangles.length; i++) {
		var height = parseInt(window.getComputedStyle(rectangles[i]).height);
		var w = parseInt(window.getComputedStyle(rectangles[i]).width);
		var r = rectangles[i];
		for (var j = 0; j < shots.length; j++) {
			var s = shots[j];
			if ((r.offsetTop + height) >= s.offsetTop) {
				if (Math.abs((r.offsetLeft + (w / 2)) - (s.offsetLeft + 3)) < (w / 2)) {
					if (s.parentNode == document.querySelector("#game")) {
						$("game").removeChild(s);
					}
					if (parseInt(r.innerHTML) == 1) {
						$("game").removeChild(r);
					} else {
						r.innerHTML = parseInt(r.innerHTML) - 1;
					}
				}
			}
		}
	}
}

function circleBulletCollide(className) {
	if (document.querySelector(className) == null
		|| document.querySelector(".shot") == null) {
		return false;
	}
	var circles = document.querySelectorAll(className);
	var rad = parseInt(window.getComputedStyle(circles[0]).width) / 2;
	var bullets = document.querySelectorAll(".shot");
	for (var i = 0; i < circles.length; i++) {
		var c = circles[i];
		for (var j = 0; j < bullets.length; j++) {
			var b = bullets[j];
			var x = c.offsetLeft + rad;
     		var y = c.offsetTop + rad;
			if (Math.abs(x - b.offsetLeft) - rad - 5 < 0) { // might be collision
				if (Math.abs(y - b.offsetTop) - rad - 12 < 0) {
					killed++;
					var r = parseInt(Math.random() * 100);
					var shouldUp = (killed % 128 == 0);
					if (r < 6 || (shouldUp)) {
						c.className = "powerup";
						if (shouldUp) {
							c.innerHTML = "?";
						} else if (r <= 1) {
							c.innerHTML = "B";
						} else {
							c.innerHTML = "L";
						}
					} else if (c.parentNode == document.querySelector("#game")) {
						$("game").removeChild(c);
					}
					if (b.parentNode == document.querySelector("#game")) {
						$("game").removeChild(b);
					}
				}
			}
		}
	}
	return false;
}

function movePowerUps() {
	if (document.querySelector(".powerup") == null) return;
	var ups = document.querySelectorAll(".powerup");
	for (var i = 0; i < ups.length; i++) {
		var p = ups[i];
		if (counter % 2 == 0) {
			p.style.top = p.offsetTop + 1 + "px";
		}
		if (p.offsetTop > 600) {
			$("game").removeChild(p);
		}
	}
}

function $(id) {
	return document.getElementById(id);
}