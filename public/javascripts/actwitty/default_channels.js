var g_default_channels=[
                         {name:'movie'},
                         {name:'music'},
                         {name:'family'},
                         {name:'food'},
                         {name:'school'},
                         {name:'college'},
                         {name:'work'},
                         {name:'religion'},
                         {name:'sprituality'},
                         {name:'science'},
                         {name:'technology'},
                         {name:'art'},
                         {name:'sports'},
                         {name:'soccer'},
                         {name:'football'},
                         {name:'basketball'},
                         {name:'stocks'},
                         {name:'shop'},
                         {name:'buy'},
                         {name:'bought'},
                         {name:'own'},
                         {name:'love'},
                         {name:'travel'},
                         {name:'watching'},
                         {name:'watch'},
                         {name:'watched'},
                         {name:'eat'},
                         {name:'ate'},
                         {name:'eating'},
                         {name:'listen'},
                         {name:'listening'},
                         {name:'tv'},
                         {name:'television'},
                         {name:'gadget'},
                         {name:'drawing'},
                         {name:'painting'},
                         {name:'drink'},
                         {name:'drinking'},
                         {name:'beer'}
                       ];
var g_user_channels = g_default_channels;

function get_user_channels(){
  return g_user_channels;
}


function fetch_user_channels(){
    var session_owner_id=$('#session_owner_id').attr("value");
    $.ajax({
        url: '/home/get_channels.json',
        type: 'GET',
        data: {user_id:session_owner_id, sort_order:1},
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
          $.each(data, function(i,channel){
            if( channel ){
              g_user_channels.push(channel);
            }

          });
        },
        error: function (error) {

        }
    }); 
}
