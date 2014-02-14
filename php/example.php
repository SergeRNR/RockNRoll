<?php
include("flacTags.php");

$ftag=new flacTags("Syrinx.flac");

if($ftag->readTags()==false) {
  echo "ERROR:";
  echo $ftag->getError();
}
else {
  echo "Vendor String: ";
  echo $ftag->getVendorString();

  echo "<br><br>Title: ";
  echo $ftag->getComment("TITLE");

  echo "<br><br>All information:<br><br>";
  $infos=$ftag->getAllComments();
  print_r($infos);
}

?>