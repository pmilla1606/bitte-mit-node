var Track=Backbone.Model.extend({defaults:{track_id:0,track_name:"blank name",track_artist:"blank artist",track_uri:"blank uri",party_name:"blank party name",is_current:0,has_changed:0,playlist_uri:"blank playlist uri",position:0}}),TrackCollection=Backbone.Collection.extend({model:Track}),TrackView=Backbone.View.extend({tagName:"ul",render:function(){return this.collection.each(function(a){var r=new TrackView({model:Track});this.$el.append(r.render().el)},this),this}}),TrackView=Backbone.View.extend({tagName:"li",template:_.template($("#temp_track").html()),render:function(){return this.$el.html(this.template(this.model.toJSON())),this}}),trackCollection=new TrackCollection([{track_id:1,track_name:"Track name 1",track_artist:"Track artist 1",track_uri:"track uri goes here",party_name:"party name here",is_current:1,has_changed:0,playlist_uri:"playlist uri here",position:1},{track_id:2,track_name:"Track name 2",track_artist:"Track artist 2",track_uri:"track uri goes here",party_name:"party name here",is_current:0,has_changed:0,playlist_uri:"playlist uri here",position:2},{track_id:3,track_name:"Track name 3",track_artist:"Track artist 3",track_uri:"track uri goes here",party_name:"party name here",is_current:0,has_changed:0,playlist_uri:"playlist uri here",position:3},{track_id:4,track_name:"Track name 4",track_artist:"Track artist 4",track_uri:"track uri goes here",party_name:"party name here",is_current:0,has_changed:0,playlist_uri:"playlist uri here",position:4}]),run=new TrackView({collection:trackCollection});$(document).ready(function(){$(".tracksWrapper").append(run.render().el)});