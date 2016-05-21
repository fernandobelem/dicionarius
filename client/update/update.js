Template.editmodal.events({
   
    'submit form': function(event, template){
        event.preventDefault();
        var newPalavra = $("#newPalavra").val();
        var newSignificado = $("#newSignificado").val();
        var newUrl = $("#newimg").attr("src");
        TablePalavras.update(this._id, {$set: {palavra: newPalavra, significado: newSignificado, url: newUrl, data: new Date()}});

        FS.Utility.eachFile(event, function(file) {
	        var fileObj = new FS.File(file);
	  	    Images.insert(fileObj);
	       
    	});

    	 Modal.hide();
    },

    'change .fileUploaderNew': function(event, temp) {
	     if (event.target.files && event.target.files[0]) {
		        var reader = new FileReader();
		        reader.onload = function (e) {
		            $('#newimg').attr('src', e.target.result);
		        }   
		        reader.readAsDataURL(event.target.files[0]);
		        $("#divnewimagem").show();
	     }      
    },
});

Template.editmodal.onRendered(function () {
  // Use the Packery jQuery plugin
    if(this.$("#newimg").attr('src') == '' || _.isUndefined(this.$("#newimg").attr('src'))){
        this.$('#newimg').attr('src', 'img/no-img.png');
    }
});




