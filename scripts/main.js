var player = null,
	music_root = "http://192.168.3.130/RockNRoll/music/";
	
// Chrome doesn't support changing the sample rate, and uses whatever the hardware supports.
// We cheat here.  Instead of resampling on the fly, we're currently just loading two different
// files based on common hardware sample rates.
var _sampleRate = (function() {
    var AudioContext = (window.AudioContext || window.webkitAudioContext);
    if (!AudioContext)
        return 44100;
    
    return new AudioContext().sampleRate;
}());	
	
function init(){
}

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