Session.setDefault("counter", 0);
Meteor.subscribe("palavras");

Template.lista.helpers({
	counter : function(){
		Session.set("counter", TablePalavras.find().count());
		return Session.get("counter");
	},

	readPalavras : function(){
		return TablePalavras.find({}, { sort: { data:-1 } });
	},

	formataData : function(){
		return moment(this.data).format('DD/MM/YYYY HH:mm');

	},

  	tableSettings: function(){
      return {
          rowsPerPage: 1000,
          showFilter: true,
          showNavigation: 'auto',
          showRowCount: true,
          fields: [
              { key: '_id', label:'id', hidden:true},
              { key: 'likeit', label: 'Like It!', headerClass: 'thmedium', sortable:false,
                  fn: function() { return new Spacebars.SafeString('<a href="" ><img src="/img/like-icon.png" class="like" style="width:1%; margin-left: 10px; height:18px; width:20px;" title="Batman approves"> </a>')}},
              { key: 'palavra', label: 'Palavra' },
              { key: 'significado', label: 'Significado' },

              //---- image key settings 
	            { key: 'url', label: 'Imagem', sortable:false, headerClass: 'thurl',
	             fn: function (value) { 
  	             	var paramUrl = value;
  	             	if(paramUrl == '' || paramUrl == null) { 
  	             		paramUrl = "img/no-img.png"
  	            	} 
               		return new Spacebars.SafeString('<img src="' + paramUrl + '" class="" style="height:60px; width:60px;"  title="Referência">');
	             }, 

	             cellClass: function (value) {
  	             	var css = '';
  	             	if(value != 'img/no-img.png' && value != '' && value != null) { 
  	             		css = 'image';
  	             	}
  				        return css;
				       }				  
			       },
	          //---- image key settings 

              { key: 'likes', label: 'Likes', headerClass: 'thmedium', cellClass: function(value){ return 'centeredtext'}},
              {key: 'username', label: 'User', headerClass: 'thmedium'},
              { key: 'data', label: 'Data', sortOrder: 0, sortDirection: 'descending', headerClass:'thdata' , fn: function(value){return moment(value).format('DD/MM/YYYY HH:mm')}},
              { key: 'edit', label: 'Editar', sortable:false, headerClass: 'thicon',
                  fn: function () { return new Spacebars.SafeString('<img src="/img/edit.png" class="editbtn" style="width:1%; margin-left: 10px; height:18px; width:20px;"  title="Editar">')} },
              { key: 'delete', label: 'Excluir', sortable:false, headerClass: 'thicon', 
                  fn: function () { return new Spacebars.SafeString('<img src="/img/delete.png" class="deletebtn" style="width:1%; margin-left: 10px; height:18px; width:20px;" title="Excluir">')}}
          ],
          group: 'palavras'
      }
  	}
});




Template.lista.events({

 'click .reactive-table tbody tr': function(event){
        event.preventDefault();
        var palavra = this;
        if (event.target.className == "deletebtn") {
          if(palavra.userid == Meteor.userId()){
            TablePalavras.remove(palavra._id);
          } 
        } 

        if (event.target.className == "editbtn") {
          if(palavra.userid == Meteor.userId()){
            Modal.show('editmodal', function () {
                return TablePalavras.findOne(palavra._id);
            });
          } 
        } 

        if (event.target.className == "like") {
            var nan = isNaN(palavra.likes);
            if(nan){
              TablePalavras.update(this._id, {$set: {likes: 1}});
            } else {
               TablePalavras.update(this._id, {$set: {likes: palavra.likes + 1}});
            }
        }
    },

});

Template.lista.rendered = function(){
    //fix filter bar css
    $(".reactive-table-options").removeClass("pull-right");
    $(".reactive-table-filter").removeClass("pull-right");
    $(".reactive-table-options").css("margin-left", "-278px");

    //change filter text
    $("span.input-group-addon").text("Filtrar");

    //fix likes position
    $("td.likes").css("text-align", "center");


};


