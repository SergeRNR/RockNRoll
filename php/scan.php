<?php
include("cue_parser.php");
include("flac.class.php");

$items = array();
$items["type"] = "folder";
$items["content"] = array();
$pathToDir = "../music";

function processFilename($filename){
	return $filename;
}

function isFlac($filename){
	return (preg_match("/(\.flac)$/", $filename));
}

function collectFolderStuff($dir, &$items) {
	$folderContents = scandir($dir);
	if ($folderContents) {
		foreach ($folderContents as $item) {
			if ($item == '.' || $item == '..') {
				continue;
			}
			if (is_dir($dir . '/' . $item)) {
				$items[$item] = array();
				$items[$item]["type"] = "folder";
				$items[$item]["path"] = substr_replace($dir, '', 0, 3) . '/' . $item;
				$items[$item]["title"] = $item;
				$items[$item]["content"] = array();
				collectFolderStuff($dir . '/' . $item, $items[$item]["content"]);
			} else {
				if(isFlac($item)){
					$data = new Flac ($dir . '/' . $item);
					$comments = $data->vorbisComment;
					
					$items[$item] = array();
					$items[$item]["type"] = "flac";
					$items[$item]["path"] = substr_replace($dir, '', 0, 3) . '/' . $item;
					$items[$item]["artist"] = (isset($comments["comments"]) && isset($comments["comments"]["artist"])) ? $comments["comments"]["artist"][0] : "";
					$items[$item]["title"] = (isset($comments["comments"]) && isset($comments["comments"]["title"])) ? $comments["comments"]["title"][0] : $item;
				}
			}
		}
	}
}

collectFolderStuff($pathToDir, $items["content"]);

$result = json_encode($items);
$output = "var collection = ".$result.";console.log(collection);";
touch("../scripts/collection.js");
chmod("../scripts/collection.js", 0766);
file_put_contents("../scripts/collection.js", $output);
echo $result;

?>
