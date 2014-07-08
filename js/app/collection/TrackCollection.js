var TrackCollection = Backbone.Collection.extend({
  model: TrackModel,
  // uncomment this when testing on server XXXXXXX
  //url: 'http://www.bitte.io/sahne/updateSahne.php',
  initialize: function(){
    //this.reset();
    this.on('change', this.collChange, this);
    
  },
  collChange: function(){
  	console.log('coll change', this);
  },
  comparator: function(m){
	return Number(m.get('position'));
  }
});