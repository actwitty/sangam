//<script language="javascript" defer="false">
//browser detection
    var agt=navigator.userAgent.toLowerCase();
    var is_major = parseInt(navigator.appVersion);
    var is_minor = parseFloat(navigator.appVersion);

    var is_nav  = ((agt.indexOf('mozilla')!=-1) && (agt.indexOf('spoofer')==-1)
                && (agt.indexOf('compatible') == -1) && (agt.indexOf('opera')==-1)
                && (agt.indexOf('webtv')==-1) && (agt.indexOf('hotjava')==-1));
    var is_nav4 = (is_nav && (is_major == 4));
    var is_nav6 = (is_nav && (is_major == 5));
    var is_nav6up = (is_nav && (is_major >= 5));
    var is_ie     = ((agt.indexOf("msie") != -1) && (agt.indexOf("opera") == -1));
//</script>
//<script language="JavaScript">
//tooltip Position
var offsetX = 0;
var offsetY = 5;
var opacity = 100;
var toolTipSTYLE = $("#toolTipLayer");

function initToolTips(){
  if(document.getElementById){
          //toolTipSTYLE = document.getElementById("toolTipLayer").style;
          toolTipSTYLE = $("#toolTipLayer").attr("css");
  }
  if(is_ie || is_nav6up)
  {
    //toolTipSTYLE.visibility = "visible";
    //toolTipSTYLE.display = "none";
    $('#toolTipLayer').hide();
    //document.onmousemove = moveToMousePos;
    $("div").mousemove = moveToMousePos;
  }
}
function moveToMousePos(e)
{
  if(!is_ie){
    x = e.pageX;
    y = e.pageY;
  }else{
    //x = event.x + document.body.scrollLeft;
    //y = event.y + document.body.scrollTop;
    x = event.x +  $("div").scrollLeft;
    y = event.y + $("div").scrollTop;
  }

  toolTipSTYLE.left = x + offsetX+'px';
  toolTipSTYLE.top = y + offsetY+'px';
  return true;
}


function toolTip(msg, fg, bg)
{
  //alert(toolTipSTYLE);
  var ec = toolTipSTYLE;
  if(toolTip.arguments.length < 1) // if no arguments are passed then hide the tootip
  {
    if(is_nav4){
        //toolTipSTYLE.visibility = "hidden";
        //toolTipSTYLE.display = "none";
        //toolTipSTYLE.hide();
        $('#toolTipLayer').hide();
    }
    else{
        //toolTipSTYLE.display = "none";
        //toolTipSTYLE.hide();
        $('#toolTipLayer').hide();
    }
  }
  else // show
  {
    if(!fg) fg = "#777777";
    if(!bg) bg = "#ffffe5";
    var content = '<table border="0" cellspacing="0" cellpadding="0" class="toolTip"><tr><td bgcolor="' + fg + '">' +
                                  '<table border="0" cellspacing="1" cellpadding="0"<tr><td bgcolor="' + bg + '">'+
                                  '<font face="sans-serif" color="' + fg + '" size="2">' + msg +
                                  '</font></td></tr></table>'+
                                  '</td></tr></table>';

   //alert(toolTipSTYLE);                               
   if(is_nav4)
    {
      toolTipSTYLE.document.write(content);
      toolTipSTYLE.document.close();
      //toolTipSTYLE.append(content);
      //toolTipSTYLE.visibility = "visible";
      //toolTipSTYLE.show();
      $('#toolTipLayer').show();
    }

    else if(is_ie || is_nav6up)
    {
      document.getElementById("toolTipLayer").innerHTML = content;
      //toolTipSTYLE.append(content);
      //toolTipSTYLE.display='block'
      $('#toolTipLayer').show();
    }
  }
}

 //</script>
