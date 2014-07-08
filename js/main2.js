var Track = Backbone.Model.extend({
  //url: 'http://www.bitte.io/go/backbone.php',
  defaults:{
    track_id: 0,
    track_name: 'blank name',
    track_artist: 'blank artist',
    track_uri: 'blank uri',
    party_name: 'blank party name',
    is_current: 0,
    has_changed: 0,
    playlist_uri: 'blank playlist uri',
    position: 0
  }
});
// A List of People
var TrackCollection = Backbone.Collection.extend({
  model: Track
});
// View for all people
var TrackView = Backbone.View.extend({
  tagName: 'ul',
  render: function(){
      this.collection.each(function(person){
          var trackView = new TrackView({ model: Track });
          this.$el.append(trackView.render().el); // calling render method manually..
      }, this);
      return this; // returning this for chaining..
  }
});
// The View for a Person
var TrackView = Backbone.View.extend({
  tagName: 'li',
  template: _.template($('#temp_track').html()),
       //////////   initialize function is gone from there. So we need to call render method manually now..
  render: function(){
      this.$el.html( this.template(this.model.toJSON()));
      return this;  // returning this from render method..
  }
});
var trackCollection = new TrackCollection([ 
          {"track_id":1, "track_name":"Track name 1", "track_artist":"Track artist 1", "track_uri":"track uri goes here", "party_name":"party name here", "is_current":1, "has_changed":0, "playlist_uri":"playlist uri here", "position":1},
          {"track_id":2, "track_name":"Track name 2", "track_artist":"Track artist 2", "track_uri":"track uri goes here", "party_name":"party name here", "is_current":0, "has_changed":0, "playlist_uri":"playlist uri here", "position":2},
          {"track_id":3, "track_name":"Track name 3", "track_artist":"Track artist 3", "track_uri":"track uri goes here", "party_name":"party name here", "is_current":0, "has_changed":0, "playlist_uri":"playlist uri here", "position":3},
          {"track_id":4, "track_name":"Track name 4", "track_artist":"Track artist 4", "track_uri":"track uri goes here", "party_name":"party name here", "is_current":0, "has_changed":0, "playlist_uri":"playlist uri here", "position":4}]
);


var run = new TrackView({ collection: trackCollection });

$(document).ready(function(){
  $('.tracksWrapper').append(run.render().el)
})