Meteor.startup(function(){
	Meteor.publish("readPalavras", function(){
		return TablePalavras.find({});
	});
});

Accounts.config({
  forbidClientAccountCreation : true
});

//__ Debug
//FS.debug = true;

//__ FileStore
// ---> cfs:filesystem 
// var ImagesStore = new FS.Store.FileSystem('images-original');

// ---> cfs:gridfs 
var ImagesStore = new FS.Store.GridFS('images-original');

//__ FileCollection
Images = new FS.Collection('images', {
  stores: [ImagesStore],
  filter: {
    maxSize: 1048576 * 4, //in bytes
    allow: {
      contentTypes: ['image/jpeg'],
      extensions: ['jpg']
    }
  }
});

Images.allow({
  insert: function(userId, fileObj) {
    return true;
  },
  update: function(userId, fileObj) {
    return true;
  },
  remove: function(userId, fileObj) {
    return true;
  },
  download: function(userId, fileObj /*, shareId*/) {
    return true;
  },
  fetch: []
});

Meteor.publish('images', function() {
  return Images.find({}, { limit: 0 });
});

Meteor.publish("rooms", function () {
  return Rooms.find();
});

Meteor.publish("messages", function () {
  return Messages.find({}, {sort: {ts: -1}});
});


Meteor.methods({

	adiciona : function(obj){

		var user = Meteor.user();
		TablePalavras.insert({
			palavra: obj.palavra, 
			significado: obj.significado,
      url: obj.url,
			userid: this.userId, 
			username: user.emails[0].address,
      //likes: 0,
			data: new Date()
		});
	},

	remove : function(id){
		TablePalavras.remove({_id: id._id, userid: this.userId});
	},

  removeimage: function(urlParam){
    image = Images.findOne({url: urlParam});
    Images.remove({_id: image._id});    
  },

  insertMessage: function(paramMsg){
     Messages.insert({user: Meteor.user().emails[0].address, msg: paramMsg, ts: new Date(), room: "Chat"});
  }


	
	
});

