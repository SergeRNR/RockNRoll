var rnr = window.rnr || {};

rnr = {
	// proprieties
	player : null,
	unsupported : null,
//	music_root : "http://192.168.3.130/RockNRoll/music/",
	music_root : "music/",
	
	// methods
	init : function(){
		rnr.renderNavigationItems();
		rnr.helpers.html("nav_panel").addEventListener("click", rnr.onNavigationClick, false);
		if (!window.Audio || !('mozWriteAudio' in new Audio()) && !window.AudioContext && !window.webkitAudioContext) {
			rnr.unsupported = true;
			document.body.classList.add("unsupported");
		}
		rnr.initPlayer(DGPlayer(document.getElementById('dgplayer')));
	}
	
}

rnr.helpers = {
	html : function(id){
		return document.getElementById(id);
	}
}

rnr.getCollectionItem = function(path){
	var el = collection.content;
	for(var i=0; i<path.length; i++){
		//we return the last element itself, not its content
		el = (el[path[i]].content && i != path.length-1) ? el[path[i]].content : el[path[i]];
	}
	return el;
};

rnr.getCollectionItemFromHash = function(){
	var path = location.hash;
	path = path.replace(/#/, "");
	path = path.split("^");
	return rnr.getCollectionItem(path);
	
};

rnr.renderNavigationItems = function(path){
	var path = path || [];
	var hash = rnr.getCollectionItem(path);
	hash = hash.content || hash;
	var html = "";
	var icon = path.length ? "arrow-up" : "music";
	var path_string = path.join("/");
	html += '<div class="nav_back" id="nav_back" parent="'+path_string+'"><span><i class="fa fa-'+icon+'"></i></span></div>';
	for(var i in hash){
		if(hash[i].type === "folder" || hash[i].type === "flac"){
			var child_path = path_string ? path_string+"/"+i : i;
			html += rnr.renderItem(hash[i], child_path);
		}
	}
	
	rnr.helpers.html("nav_panel").innerHTML = html;	
};

rnr.renderItem = function(el, path){
	var html = "";
	switch(el.type){
		case "folder":
			html += '<div class="nav_item_folder" path="'+path+'"><span><i class="fa fa-folder-o"></i>&nbsp;</span>'+el.title+'</div>';
			break;
		case "flac":
			html += '<div class="nav_item_flac" path="'+path+'"><span><i class="fa fa-play-circle-o"></i>&nbsp;</span>'+el.title+'</div>';
			break;
	}
	return html;
};

rnr.initPlayer = function(DGPlayer){
	if (rnr.unsupported) return;

	DGPlayer.volume = 100;
/*
    var player, onplay;
    var url = '';

    DGPlayer.on('play', onplay = function(){
        if (player)
            player.disconnect();
            
        player = new DGAuroraPlayer(AV.Player.fromURL(url), DGPlayer);
        DGPlayer.off('play', onplay);
    });
    
    DGPlayer.on('file', function(file) {        
        if (file) {
            if (player)
                player.disconnect();
                
            player = new DGAuroraPlayer(AV.Player.fromFile(file), DGPlayer);
            DGPlayer.off('play', onplay);
        }
    });
*/    
}

rnr.startPlayer = function(url, DGPlayer){
	if (url) {
		DGPlayer.volume = 100;
		DGPlayer.fileDescription = url;
		if (rnr.player)
			rnr.player.disconnect();
            
		rnr.player = new DGAuroraPlayer(AV.Player.fromURL(rnr.music_root+url), DGPlayer);
	}
};

rnr.onNavigationClick = function(e, el){
	var target = el || (e.srcElement || e.target);
	var className = target.className || "";
	switch(className){
		case "nav_item_folder":
			var path = target.getAttribute("path") || "";
			path = path.split("/");
			rnr.renderNavigationItems(path);
			break;
		case "nav_back":
			var path = target.getAttribute("parent") || "";
			path = path.split("/").slice(0,-1);
			rnr.renderNavigationItems(path);
			break;
		case "nav_item_flac":
			var path = target.getAttribute("path") || "";
			if(path)
				rnr.startPlayer(path, DGPlayer(rnr.helpers.html("dgplayer")));
			break;
		default :
			if(target.parentNode)
				return rnr.onNavigationClick(e,target.parentNode);
	}
};
	
// Chrome doesn't support changing the sample rate, and uses whatever the hardware supports.
// We cheat here.  Instead of resampling on the fly, we're currently just loading two different
// files based on common hardware sample rates.
var _sampleRate = (function() {
	var AudioContext = (window.AudioContext || window.webkitAudioContext);
	if (!AudioContext)
		return 44100;

	return new AudioContext().sampleRate;
}());

window.onload = function(){ rnr.init(); };
