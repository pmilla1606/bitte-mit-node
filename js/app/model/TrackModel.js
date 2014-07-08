var TrackModel = Backbone.Model.extend({
  // uncomment this when testing on server XXXXXXX
  // url: 'http://www.bitte.io/sahne/backboneSahne.php', commented out jun 25 - trying ajax calls instead of backbone syncs
  defaults:{
    track_id: 0,
    track_name: 'blank name',
    track_artist: 'blank artist',
    track_uri: 'blank uri',
    party_name: 'blank party name',
    is_current: 0,
    has_changed: 0, // has_changed should be a unique string from DB.
    playlist_uri: 'blank playlist uri',
    position: 0,
    added_by: 'Jean Claude Van Damme'
  },

});
