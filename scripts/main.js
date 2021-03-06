var rnr = window.rnr || {};

rnr = {
	// proprieties
	player : null,
	unsupported : null,
	currentUrl : null,
	music_root : "music",
	
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
	
};

rnr.helpers = {
	html : function(id){
		return document.getElementById(id);
	}
};

rnr.getCollectionItem = function(path){
	var el = collection.content;
	path = path.slice(1);
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

rnr.getNextItem = function(url){
	var url = url || "";
	var path = url.split("/");
	if(path.length > 0){
		var thisItem = path[path.length-1];
		var parentItemPath = path.slice(0,-1);
		var parentItem = rnr.getCollectionItem(parentItemPath);
		var getNext = false;
		for(var i in parentItem.content){
			if(getNext === true && parentItem.content[i].type === "flac"){
				getNext = false;
				return parentItem.content[i];
			}
			if(i === thisItem)
				getNext = true;
		}
		return null;
	}
};

rnr.renderNavigationItems = function(path){
	var path = path || [];
	var hash = rnr.getCollectionItem(path);
	hash = hash.content || hash;
	var html = "";
	var icon = path.length > 1 ? "arrow-up" : "music";
	var path_string = path.join("/");
	html += '<div class="nav_back" id="nav_back" parent="'+path_string+'"><span><i class="fa fa-'+icon+'"></i></span></div>';
	for(var i in hash){
		if(hash[i].type === "folder" || hash[i].type === "flac"){
			html += rnr.renderItem(hash[i]);
		}
	}
	
	rnr.helpers.html("nav_panel").innerHTML = html;	
};

rnr.renderItem = function(el){
	var html = "";
	switch(el.type){
		case "folder":
			html += '<div class="nav_item_folder" path="'+el.path+'"><span><i class="fa fa-folder-o"></i>&nbsp;</span>'+el.title+'</div>';
			break;
		case "flac":
			html += '<div class="nav_item_flac" path="'+el.path+'"><span><i class="fa fa-play-circle-o"></i>&nbsp;</span>'+el.title+'</div>';
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
};

rnr.startPlayer = function(url, DGPlayer){
	if (url) {
		DGPlayer.volume = 100;
		DGPlayer.fileDescription = url;
		if (rnr.player)
			rnr.player.disconnect();
            
		rnr.player = new DGAuroraPlayer(AV.Player.fromURL(url), DGPlayer);
		rnr.player.player.on("end", rnr.onend = function(){
			this.off("end", rnr.onend);
			rnr.playNext(rnr.currentUrl);
		});
		rnr.currentUrl = url;
	}
};

rnr.playNext = function(url){
	var nextItem = rnr.getNextItem(url);
	if(nextItem)
		rnr.startPlayer(nextItem.path, DGPlayer(rnr.helpers.html("dgplayer")));
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
			if(path !== "" && path !== rnr.music_root){
				path = path.split("/").slice(0,-1);
				rnr.renderNavigationItems(path);
			}
			break;
		case "nav_item_flac":
			var path = target.getAttribute("path") || "";
			if(path)
				rnr.startPlayer((path), DGPlayer(rnr.helpers.html("dgplayer")));
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
