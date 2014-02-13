var player = null,
	music_root = "http://192.168.3.130/RockNRoll/music/";
	
function init(){
	document.querySelector("input[type=range]").oninput = function(e) {
		if(!player) return;

		player.volume = +e.target.value;
	};
}

/*        document.querySelector("input").onchange = function(e) {
	if (player) player.stop();

	player = AV.Player.fromFile(e.target.files[0]);
	player.on('error', function(e) { throw e });

	console.log(player)

	player.on('metadata', function(data) {
		console.log(data);

		// Show the album art
		if (data.coverArt)
			document.querySelector("img").src = data.coverArt.toBlobURL();
	});

	player.play();
}*/

player = AV.Player.fromURL(music_root + "01 - Bad Attitude Shuffle.flac");
player.on('error', function(e) { throw e });
console.log(player);

function play(){
	if(player)
		player.play();
}
function pause(){
	if(player)
		player.pause();
}
function stop(){
	if(player)
		player.stop();
}

window.onload = function(){ init(); };