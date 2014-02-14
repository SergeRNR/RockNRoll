<?php
$items = array();
$items['music'] = array();
$pathToDir = '../music';
function collectFolderStuff($dir, &$items) {
	$folderContents = scandir($dir);
	if ($folderContents) {
		foreach ($folderContents as $item) {
			if ($item == '.' || $item == '..') {
				continue;
			}
			if (is_dir($dir . '/' . $item)) {
				$items[$item] = array();
				collectFolderStuff($dir . '/' . $item, $items[$item]);
			} else {
				$items[] = $item;
			}
		}
	}
}
collectFolderStuff($pathToDir, $items['music']);
$result =  json_encode($items);
$output = "var collection = ".$result.";";
touch("../scripts/collection.js");
chmod("../scripts/collection.js", 0755);
file_put_contents("../scripts/collection.js", $output);
echo $result;
?>
