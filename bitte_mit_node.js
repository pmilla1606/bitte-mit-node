var dummy = [
            {"track_id":"6","track_name":"If The Moon Rises","track_artist":"PAPA","track_uri":"spotify:track:3Dfs0kLsKAtnM304KsKPQE","party_name":"","is_current":1,"has_changed":"0","playlist_uri":"","position":"0","added_by":"Host"},
            {"track_id":"7","track_name":"Get Me Through The Night","track_artist":"PAPA","track_uri":"spotify:track:2HwaPOkklM2wLBiFgzxnrV","party_name":"","is_current":"0","has_changed":"0","playlist_uri":"","position":"0","added_by":"Host"},
            {"track_id":"9","track_name":"Tender Madness","track_artist":"PAPA","track_uri":"spotify:track:7bBnRjOgSI53XhAhT0vym8","party_name":"","is_current":"0","has_changed":"0","playlist_uri":"","position":"1","added_by":"Host"},
            {"track_id":"10","track_name":"Got To Move","track_artist":"PAPA","track_uri":"spotify:track:1YpTGlr4XtU0xrlEI60ori","party_name":"","is_current":"0","has_changed":"0","playlist_uri":"","position":"1","added_by":"Host"},
            {"track_id":"8","track_name":"If You\u2019re My Girl, Then I\u2019m Your Man","track_artist":"PAPA","track_uri":"spotify:track:7L7KEdJEetZZlXdOGjiPZR","party_name":"","is_current":"0","has_changed":"0","playlist_uri":"","position":"2","added_by":"Host"},
        
            {"track_id":"21","track_name":"Replacements (Curls In The Grass)","track_artist":"PAPA","track_uri":"spotify:track:0WXvxkxF7DrHbniMWFt3B5","party_name":"","is_current":"0","has_changed":"0","playlist_uri":"","position":"12","added_by":"Host"}];



var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(1337);

function handler (req, res) {
  
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

//run this on song-delete (maybe on add?)
// reset the position counts
function resetPositions(){
  for (var i=0; i<dummy.length; i++){
    if(dummy[i]['is_current'] == 1){
      dummy[i]['position'] = 'NA';
    }
    else{
      dummy[i]['position'] = Number(i);
    }
  }
}

//console.log(dummy);

io.on('connection', function (socket) {
  
  resetPositions();

  socket.emit('dummy', dummy);
  
  socket.on('upvote', function (data) {
    // we're getting track_id from the client side. Use that to find the correct song in the array
    
    resetPositions();

    var voted = dummy.filter(function( obj ) {
      return obj.track_id == data.voted.track_id;
    });
    var other = dummy.filter(function(obj){
      return obj.track_id == data.other.track_id;
    });

    //    console.log('voted position before ', voted[0]['position'])
    voted[0]['position'] = Number(voted[0]['position']-1);
    other[0]['position'] = Number(other[0]['position']+1);

    socket.emit('dummy', dummy);

  });

  socket.on('downvote', function(data){
        resetPositions();

    var voted = dummy.filter(function( obj ) {
      return obj.track_id == data.voted.track_id;
    });
    var other = dummy.filter(function(obj){
      return obj.track_id == data.other.track_id;
    });

    //    console.log('voted position before ', voted[0]['position'])
    voted[0]['position'] = Number(voted[0]['position']+1);
    other[0]['position'] = Number(other[0]['position']-1);

    socket.emit('dummy', dummy);

  });
  var dummyCounter = 1;
  socket.on('debugAddSong', function(){
    dummy.push({"track_id":"21","track_name":"Replacements (Curls In The Grass)","track_artist":"PAPA","track_uri":"spotify:track:0WXvxkxF7DrHbniMWFt3B5","party_name":"","is_current":"0","has_changed":"0","playlist_uri":"","position":"12","added_by":"Host"})
  });
  // socket.on('debugRemoveSong', function(){
  //   dummy.pop()
  // })
});