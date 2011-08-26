

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
var offsetX = 0;
var offsetY = 5;
var opacity = 100;
var toolTipSTYLE ;

function initToolTips(){
  if(document.getElementById){
          toolTipSTYLE = $("#toolTipLayer").attr("css");
  }
  if(is_ie || is_nav6up)
  {
    $('#toolTipLayer').hide();

    $("div").mousemove = moveToMousePos;
  }
}
function moveToMousePos(e)
{
  if(!is_ie){
    x = e.pageX - 20;
    y = e.pageY + 20;
  }else{
    x = event.x + document.body.scrollLeft - 20;
    y = event.y + document.body.scrollTop + 20;
  }

  toolTipSTYLE.left = x +'px';
  toolTipSTYLE.top = y +'px';
}


function toolTip(msg,id, fg, bg)
{
  toolTipSTYLE = $("#"+id);

  document.onmousemove = moveToMousePos;
  if(toolTip.arguments.length < 1) // if no arguments are passed then hide the tootip
  {

    if(is_nav4){
        toolTipSTYLE.visibility = "hidden";
        toolTipSTYLE.display = "none";
        $(".hover_txt").hide();
        $("#"+id).hide();
    }
    else{
        toolTipSTYLE.display = "none";
        $(".hover_txt").hide();
        $("#"+id).hide();
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

   if(is_nav4)
    {
      $("#"+id).css({'top':toolTipSTYLE.top,'left':toolTipSTYLE.left});
      toolTipSTYLE.document.write(content);
      $("#"+id).show();
    }

    else if(is_ie || is_nav6up)
    {
      $("#"+id).css({'top':toolTipSTYLE.top,'left':toolTipSTYLE.left});
      document.getElementById(id).innerHTML = content;
      $("#"+id).show();
    }
  }
}


