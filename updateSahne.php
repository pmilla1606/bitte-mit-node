<?php

include_once('sqlSahne.php');

$query = "SELECT track_id, track_name, track_artist, track_uri, party_name, is_current, has_changed, playlist_uri, position, added_by FROM bitte_sahne ORDER BY position ASC";

$result = mysql_query($query);
if (!$result) { // add this check.
	die('Invalid query: ' . mysql_error());
}
// fetch tha data from the database
$rows = array();
while ($r = mysql_fetch_assoc($result)) {
	$data[] = $r;
	

};

$data[0][is_current] = 1;


echo json_encode($data, true);

?>


