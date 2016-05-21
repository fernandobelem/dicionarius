if (Meteor.isClient) {


  Meteor.subscribe("rooms");
  Meteor.subscribe("messages");
  Session.setDefault("roomname", "Chat");

  Template.input.events({
    'click .sendMsg': function(e) {
      e.preventDefault();
       e.stopPropagation();
       _sendMessage();

    },
    'keyup #msg': function(e) {
      if (e.type == "keyup" && e.which == 13) {
        e.preventDefault();
        e.stopPropagation();
        _sendMessage();
      

      }
    },

  });

  _sendMessage = function() {
    var el = document.getElementById("msg");
    Meteor.call('insertMessage', el.value);
    el.value = "";
    el.focus();
  //  $(".messageDiv").scrollTop($(".messageDiv")[0].scrollHeight);
  };

 

  Template.messages.helpers({
    messages: function() {
      return Messages.find({room: Session.get("roomname")}, {sort: {ts: -1}});
    },
	  roomname: function() {
      return Session.get("roomname");
    }
  });
  
  Template.message.helpers({
    timestamp: function() {
      return this.ts.toLocaleString();
    },

   
  });

  Template.room.helpers({
	roomstyle: function() {
      return Session.equals("roomname", this.roomname) ? "font-weight: bold" : "";
    }
  });

  Template.chat.helpers({
    release: function() {
      return Meteor.release;
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    Messages.remove({});
    Rooms.remove({});
    if (Rooms.find().count() === 0) {
      ["Chat"].forEach(function(r) {
        Rooms.insert({roomname: r});
      });
    }

  });


  
  Rooms.deny({
    insert: function (userId, doc) {
      return true;
    },
    update: function (userId, doc, fieldNames, modifier) {
      return true;
    },
    remove: function (userId, doc) {
      return true;
    }
  });
  Messages.deny({
    insert: function (userId, doc) {
      return (userId === null);
    },
    update: function (userId, doc, fieldNames, modifier) {
      return true;
    },
    remove: function (userId, doc) {
      return true;
    }
  });
  Messages.allow({
    insert: function (userId, doc) {
      return (userId !== null);
    }
  });
  

}
