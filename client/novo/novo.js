

//__ FileStore

// ---> cfs:filesystem 
//var ImagesStore = new FS.Store.FileSystem('images-original');

// ---> cfs:gridfs 
var ImagesStore = new FS.Store.GridFS('images-original');


//__ FileCollection

Images = new FS.Collection('images', {
  stores: [ImagesStore],
  filter: {
    allow: {
      contentTypes: ['image/jpeg']
    }
  }
});

Meteor.subscribe('images');



Template.novo.events({
	"submit form": function(e, template){
		
		e.preventDefault();

		var palavra = $("#palavra").val();
		var significado = $("#significado").val();
		var url = $("#imgtag").attr("src");

    if(url == ''){
      url = 'img/no-img.png';
    }
		
		Meteor.call("adiciona", { 
			palavra: palavra,  
			significado: significado,
			url: url
		});

		$("#palavra").val("");
		$("#significado").val("");
		$("#fileopen").val("");
		$('#imgtag').attr('src',"");
    $("#divImagem").hide();	   
	}
});

Template.novo.rendered = function() {
  $("#divImagem").hide();
}

//__ Dropzone
Template.dropZone.events({

  'change .fileUploader': function(event, temp) {
     if (event.target.files && event.target.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#imgtag').attr('src', e.target.result);
        }   
        reader.readAsDataURL(event.target.files[0]);
        $("#divImagem").show();
    }      
   },

  'submit form': function(event, temp) {

    FS.Utility.eachFile(event, function(file) {
      var fileObj = new FS.File(file);
  	  Images.insert(fileObj);

    });
  }
});


//__ Filetable

Template.fileTable.helpers({
  files : function() {
    return Images.find({},{ sort: { uploadedAt:-1 } });
  },

  file : function() {
    return Images.findOne({},{ sort: { uploadedAt:-1 } });
  }
});





Template.fileTable.events({
  'click .remove': function(e,t){
  	console.log(t);
  	var id = $(".imgid").val();
    e.stopPropagation();
    e.preventDefault();
    if (confirm('Really Remove?')) {
      Images.remove(id);
    }
  }

})

