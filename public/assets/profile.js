/*! Copyright (c) 2010 Brandon Aaron (http://brandonaaron.net)
* Licensed under the MIT License (LICENSE.txt).
*
* Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
* Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
* Thanks to: Seamus Leahy for adding deltaX and deltaY
*
* Version: 3.0.4
*
* Requires: 1.2.2+
*/

(function(d){function g(a){var b=a||window.event,i=[].slice.call(arguments,1),c=0,h=0,e=0;a=d.event.fix(b);a.type="mousewheel";if(a.wheelDelta)c=a.wheelDelta/120;if(a.detail)c=-a.detail/3;e=c;if(b.axis!==undefined&&b.axis===b.HORIZONTAL_AXIS){e=0;h=-1*c}if(b.wheelDeltaY!==undefined)e=b.wheelDeltaY/120;if(b.wheelDeltaX!==undefined)h=-1*b.wheelDeltaX/120;i.unshift(a,c,h,e);return d.event.handle.apply(this,i)}var f=["DOMMouseScroll","mousewheel"];d.event.special.mousewheel={setup:function(){if(this.addEventListener)for(var a=
f.length;a;)this.addEventListener(f[--a],g,false);else this.onmousewheel=g},teardown:function(){if(this.removeEventListener)for(var a=f.length;a;)this.removeEventListener(f[--a],g,false);else this.onmousewheel=null}};d.fn.extend({mousewheel:function(a){return a?this.bind("mousewheel",a):this.trigger("mousewheel")},unmousewheel:function(a){return this.unbind("mousewheel",a)}})})(jQuery);
/*
 * FancyBox - jQuery Plugin
 * Simple and fancy lightbox alternative
 *
 * Examples and documentation at: http://fancybox.net
 * 
 * Copyright (c) 2008 - 2010 Janis Skarnelis
 * That said, it is hardly a one-person project. Many people have submitted bugs, code, and offered their advice freely. Their support is greatly appreciated.
 * 
 * Version: 1.3.4 (11/11/2010)
 * Requires: jQuery v1.3+
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

;(function(b){var m,t,u,f,D,j,E,n,z,A,q=0,e={},o=[],p=0,d={},l=[],G=null,v=new Image,J=/\.(jpg|gif|png|bmp|jpeg)(.*)?$/i,W=/[^\.]\.(swf)\s*$/i,K,L=1,y=0,s="",r,i,h=false,B=b.extend(b("<div/>")[0],{prop:0}),M=b.browser.msie&&b.browser.version<7&&!window.XMLHttpRequest,N=function(){t.hide();v.onerror=v.onload=null;G&&G.abort();m.empty()},O=function(){if(false===e.onError(o,q,e)){t.hide();h=false}else{e.titleShow=false;e.width="auto";e.height="auto";m.html('<p id="fancybox-error">The requested content cannot be loaded.<br />Please try again later.</p>');
F()}},I=function(){var a=o[q],c,g,k,C,P,w;N();e=b.extend({},b.fn.fancybox.defaults,typeof b(a).data("fancybox")=="undefined"?e:b(a).data("fancybox"));w=e.onStart(o,q,e);if(w===false)h=false;else{if(typeof w=="object")e=b.extend(e,w);k=e.title||(a.nodeName?b(a).attr("title"):a.title)||"";if(a.nodeName&&!e.orig)e.orig=b(a).children("img:first").length?b(a).children("img:first"):b(a);if(k===""&&e.orig&&e.titleFromAlt)k=e.orig.attr("alt");c=e.href||(a.nodeName?b(a).attr("href"):a.href)||null;if(/^(?:javascript)/i.test(c)||
c=="#")c=null;if(e.type){g=e.type;if(!c)c=e.content}else if(e.content)g="html";else if(c)g=c.match(J)?"image":c.match(W)?"swf":b(a).hasClass("iframe")?"iframe":c.indexOf("#")===0?"inline":"ajax";if(g){if(g=="inline"){a=c.substr(c.indexOf("#"));g=b(a).length>0?"inline":"ajax"}e.type=g;e.href=c;e.title=k;if(e.autoDimensions)if(e.type=="html"||e.type=="inline"||e.type=="ajax"){e.width="auto";e.height="auto"}else e.autoDimensions=false;if(e.modal){e.overlayShow=true;e.hideOnOverlayClick=false;e.hideOnContentClick=
false;e.enableEscapeButton=false;e.showCloseButton=false}e.padding=parseInt(e.padding,10);e.margin=parseInt(e.margin,10);m.css("padding",e.padding+e.margin);b(".fancybox-inline-tmp").unbind("fancybox-cancel").bind("fancybox-change",function(){b(this).replaceWith(j.children())});switch(g){case "html":m.html(e.content);F();break;case "inline":if(b(a).parent().is("#fancybox-content")===true){h=false;break}b('<div class="fancybox-inline-tmp" />').hide().insertBefore(b(a)).bind("fancybox-cleanup",function(){b(this).replaceWith(j.children())}).bind("fancybox-cancel",
function(){b(this).replaceWith(m.children())});b(a).appendTo(m);F();break;case "image":h=false;b.fancybox.showActivity();v=new Image;v.onerror=function(){O()};v.onload=function(){h=true;v.onerror=v.onload=null;e.width=v.width;e.height=v.height;b("<img />").attr({id:"fancybox-img",src:v.src,alt:e.title}).appendTo(m);Q()};v.src=c;break;case "swf":e.scrolling="no";C='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="'+e.width+'" height="'+e.height+'"><param name="movie" value="'+c+
'"></param>';P="";b.each(e.swf,function(x,H){C+='<param name="'+x+'" value="'+H+'"></param>';P+=" "+x+'="'+H+'"'});C+='<embed src="'+c+'" type="application/x-shockwave-flash" width="'+e.width+'" height="'+e.height+'"'+P+"></embed></object>";m.html(C);F();break;case "ajax":h=false;b.fancybox.showActivity();e.ajax.win=e.ajax.success;G=b.ajax(b.extend({},e.ajax,{url:c,data:e.ajax.data||{},error:function(x){x.status>0&&O()},success:function(x,H,R){if((typeof R=="object"?R:G).status==200){if(typeof e.ajax.win==
"function"){w=e.ajax.win(c,x,H,R);if(w===false){t.hide();return}else if(typeof w=="string"||typeof w=="object")x=w}m.html(x);F()}}}));break;case "iframe":Q()}}else O()}},F=function(){var a=e.width,c=e.height;a=a.toString().indexOf("%")>-1?parseInt((b(window).width()-e.margin*2)*parseFloat(a)/100,10)+"px":a=="auto"?"auto":a+"px";c=c.toString().indexOf("%")>-1?parseInt((b(window).height()-e.margin*2)*parseFloat(c)/100,10)+"px":c=="auto"?"auto":c+"px";m.wrapInner('<div style="width:'+a+";height:"+c+
";overflow: "+(e.scrolling=="auto"?"auto":e.scrolling=="yes"?"scroll":"hidden")+';position:relative;"></div>');e.width=m.width();e.height=m.height();Q()},Q=function(){var a,c;t.hide();if(f.is(":visible")&&false===d.onCleanup(l,p,d)){b.event.trigger("fancybox-cancel");h=false}else{h=true;b(j.add(u)).unbind();b(window).unbind("resize.fb scroll.fb");b(document).unbind("keydown.fb");f.is(":visible")&&d.titlePosition!=="outside"&&f.css("height",f.height());l=o;p=q;d=e;if(d.overlayShow){u.css({"background-color":d.overlayColor,
opacity:d.overlayOpacity,cursor:d.hideOnOverlayClick?"pointer":"auto",height:b(document).height()});if(!u.is(":visible")){M&&b("select:not(#fancybox-tmp select)").filter(function(){return this.style.visibility!=="hidden"}).css({visibility:"hidden"}).one("fancybox-cleanup",function(){this.style.visibility="inherit"});u.show()}}else u.hide();i=X();s=d.title||"";y=0;n.empty().removeAttr("style").removeClass();if(d.titleShow!==false){if(b.isFunction(d.titleFormat))a=d.titleFormat(s,l,p,d);else a=s&&s.length?
d.titlePosition=="float"?'<table id="fancybox-title-float-wrap" cellpadding="0" cellspacing="0"><tr><td id="fancybox-title-float-left"></td><td id="fancybox-title-float-main">'+s+'</td><td id="fancybox-title-float-right"></td></tr></table>':'<div id="fancybox-title-'+d.titlePosition+'">'+s+"</div>":false;s=a;if(!(!s||s==="")){n.addClass("fancybox-title-"+d.titlePosition).html(s).appendTo("body").show();switch(d.titlePosition){case "inside":n.css({width:i.width-d.padding*2,marginLeft:d.padding,marginRight:d.padding});
y=n.outerHeight(true);n.appendTo(D);i.height+=y;break;case "over":n.css({marginLeft:d.padding,width:i.width-d.padding*2,bottom:d.padding}).appendTo(D);break;case "float":n.css("left",parseInt((n.width()-i.width-40)/2,10)*-1).appendTo(f);break;default:n.css({width:i.width-d.padding*2,paddingLeft:d.padding,paddingRight:d.padding}).appendTo(f)}}}n.hide();if(f.is(":visible")){b(E.add(z).add(A)).hide();a=f.position();r={top:a.top,left:a.left,width:f.width(),height:f.height()};c=r.width==i.width&&r.height==
i.height;j.fadeTo(d.changeFade,0.3,function(){var g=function(){j.html(m.contents()).fadeTo(d.changeFade,1,S)};b.event.trigger("fancybox-change");j.empty().removeAttr("filter").css({"border-width":d.padding,width:i.width-d.padding*2,height:e.autoDimensions?"auto":i.height-y-d.padding*2});if(c)g();else{B.prop=0;b(B).animate({prop:1},{duration:d.changeSpeed,easing:d.easingChange,step:T,complete:g})}})}else{f.removeAttr("style");j.css("border-width",d.padding);if(d.transitionIn=="elastic"){r=V();j.html(m.contents());
f.show();if(d.opacity)i.opacity=0;B.prop=0;b(B).animate({prop:1},{duration:d.speedIn,easing:d.easingIn,step:T,complete:S})}else{d.titlePosition=="inside"&&y>0&&n.show();j.css({width:i.width-d.padding*2,height:e.autoDimensions?"auto":i.height-y-d.padding*2}).html(m.contents());f.css(i).fadeIn(d.transitionIn=="none"?0:d.speedIn,S)}}}},Y=function(){if(d.enableEscapeButton||d.enableKeyboardNav)b(document).bind("keydown.fb",function(a){if(a.keyCode==27&&d.enableEscapeButton){a.preventDefault();b.fancybox.close()}else if((a.keyCode==
37||a.keyCode==39)&&d.enableKeyboardNav&&a.target.tagName!=="INPUT"&&a.target.tagName!=="TEXTAREA"&&a.target.tagName!=="SELECT"){a.preventDefault();b.fancybox[a.keyCode==37?"prev":"next"]()}});if(d.showNavArrows){if(d.cyclic&&l.length>1||p!==0)z.show();if(d.cyclic&&l.length>1||p!=l.length-1)A.show()}else{z.hide();A.hide()}},S=function(){if(!b.support.opacity){j.get(0).style.removeAttribute("filter");f.get(0).style.removeAttribute("filter")}e.autoDimensions&&j.css("height","auto");f.css("height","auto");
s&&s.length&&n.show();d.showCloseButton&&E.show();Y();d.hideOnContentClick&&j.bind("click",b.fancybox.close);d.hideOnOverlayClick&&u.bind("click",b.fancybox.close);b(window).bind("resize.fb",b.fancybox.resize);d.centerOnScroll&&b(window).bind("scroll.fb",b.fancybox.center);if(d.type=="iframe")b('<iframe id="fancybox-frame" name="fancybox-frame'+(new Date).getTime()+'" frameborder="0" hspace="0" '+(b.browser.msie?'allowtransparency="true""':"")+' scrolling="'+e.scrolling+'" src="'+d.href+'"></iframe>').appendTo(j);
f.show();h=false;b.fancybox.center();d.onComplete(l,p,d);var a,c;if(l.length-1>p){a=l[p+1].href;if(typeof a!=="undefined"&&a.match(J)){c=new Image;c.src=a}}if(p>0){a=l[p-1].href;if(typeof a!=="undefined"&&a.match(J)){c=new Image;c.src=a}}},T=function(a){var c={width:parseInt(r.width+(i.width-r.width)*a,10),height:parseInt(r.height+(i.height-r.height)*a,10),top:parseInt(r.top+(i.top-r.top)*a,10),left:parseInt(r.left+(i.left-r.left)*a,10)};if(typeof i.opacity!=="undefined")c.opacity=a<0.5?0.5:a;f.css(c);
j.css({width:c.width-d.padding*2,height:c.height-y*a-d.padding*2})},U=function(){return[b(window).width()-d.margin*2,b(window).height()-d.margin*2,b(document).scrollLeft()+d.margin,b(document).scrollTop()+d.margin]},X=function(){var a=U(),c={},g=d.autoScale,k=d.padding*2;c.width=d.width.toString().indexOf("%")>-1?parseInt(a[0]*parseFloat(d.width)/100,10):d.width+k;c.height=d.height.toString().indexOf("%")>-1?parseInt(a[1]*parseFloat(d.height)/100,10):d.height+k;if(g&&(c.width>a[0]||c.height>a[1]))if(e.type==
"image"||e.type=="swf"){g=d.width/d.height;if(c.width>a[0]){c.width=a[0];c.height=parseInt((c.width-k)/g+k,10)}if(c.height>a[1]){c.height=a[1];c.width=parseInt((c.height-k)*g+k,10)}}else{c.width=Math.min(c.width,a[0]);c.height=Math.min(c.height,a[1])}c.top=parseInt(Math.max(a[3]-20,a[3]+(a[1]-c.height-40)*0.5),10);c.left=parseInt(Math.max(a[2]-20,a[2]+(a[0]-c.width-40)*0.5),10);return c},V=function(){var a=e.orig?b(e.orig):false,c={};if(a&&a.length){c=a.offset();c.top+=parseInt(a.css("paddingTop"),
10)||0;c.left+=parseInt(a.css("paddingLeft"),10)||0;c.top+=parseInt(a.css("border-top-width"),10)||0;c.left+=parseInt(a.css("border-left-width"),10)||0;c.width=a.width();c.height=a.height();c={width:c.width+d.padding*2,height:c.height+d.padding*2,top:c.top-d.padding-20,left:c.left-d.padding-20}}else{a=U();c={width:d.padding*2,height:d.padding*2,top:parseInt(a[3]+a[1]*0.5,10),left:parseInt(a[2]+a[0]*0.5,10)}}return c},Z=function(){if(t.is(":visible")){b("div",t).css("top",L*-40+"px");L=(L+1)%12}else clearInterval(K)};
b.fn.fancybox=function(a){if(!b(this).length)return this;b(this).data("fancybox",b.extend({},a,b.metadata?b(this).metadata():{})).unbind("click.fb").bind("click.fb",function(c){c.preventDefault();if(!h){h=true;b(this).blur();o=[];q=0;c=b(this).attr("rel")||"";if(!c||c==""||c==="nofollow")o.push(this);else{o=b("a[rel="+c+"], area[rel="+c+"]");q=o.index(this)}I()}});return this};b.fancybox=function(a,c){var g;if(!h){h=true;g=typeof c!=="undefined"?c:{};o=[];q=parseInt(g.index,10)||0;if(b.isArray(a)){for(var k=
0,C=a.length;k<C;k++)if(typeof a[k]=="object")b(a[k]).data("fancybox",b.extend({},g,a[k]));else a[k]=b({}).data("fancybox",b.extend({content:a[k]},g));o=jQuery.merge(o,a)}else{if(typeof a=="object")b(a).data("fancybox",b.extend({},g,a));else a=b({}).data("fancybox",b.extend({content:a},g));o.push(a)}if(q>o.length||q<0)q=0;I()}};b.fancybox.showActivity=function(){clearInterval(K);t.show();K=setInterval(Z,66)};b.fancybox.hideActivity=function(){t.hide()};b.fancybox.next=function(){return b.fancybox.pos(p+
1)};b.fancybox.prev=function(){return b.fancybox.pos(p-1)};b.fancybox.pos=function(a){if(!h){a=parseInt(a);o=l;if(a>-1&&a<l.length){q=a;I()}else if(d.cyclic&&l.length>1){q=a>=l.length?0:l.length-1;I()}}};b.fancybox.cancel=function(){if(!h){h=true;b.event.trigger("fancybox-cancel");N();e.onCancel(o,q,e);h=false}};b.fancybox.close=function(){function a(){u.fadeOut("fast");n.empty().hide();f.hide();b.event.trigger("fancybox-cleanup");j.empty();d.onClosed(l,p,d);l=e=[];p=q=0;d=e={};h=false}if(!(h||f.is(":hidden"))){h=
true;if(d&&false===d.onCleanup(l,p,d))h=false;else{N();b(E.add(z).add(A)).hide();b(j.add(u)).unbind();b(window).unbind("resize.fb scroll.fb");b(document).unbind("keydown.fb");j.find("iframe").attr("src",M&&/^https/i.test(window.location.href||"")?"javascript:void(false)":"about:blank");d.titlePosition!=="inside"&&n.empty();f.stop();if(d.transitionOut=="elastic"){r=V();var c=f.position();i={top:c.top,left:c.left,width:f.width(),height:f.height()};if(d.opacity)i.opacity=1;n.empty().hide();B.prop=1;
b(B).animate({prop:0},{duration:d.speedOut,easing:d.easingOut,step:T,complete:a})}else f.fadeOut(d.transitionOut=="none"?0:d.speedOut,a)}}};b.fancybox.resize=function(){u.is(":visible")&&u.css("height",b(document).height());b.fancybox.center(true)};b.fancybox.center=function(a){var c,g;if(!h){g=a===true?1:0;c=U();!g&&(f.width()>c[0]||f.height()>c[1])||f.stop().animate({top:parseInt(Math.max(c[3]-20,c[3]+(c[1]-j.height()-40)*0.5-d.padding)),left:parseInt(Math.max(c[2]-20,c[2]+(c[0]-j.width()-40)*0.5-
d.padding))},typeof a=="number"?a:200)}};b.fancybox.init=function(){if(!b("#fancybox-wrap").length){b("body").append(m=b('<div id="fancybox-tmp"></div>'),t=b('<div id="fancybox-loading"><div></div></div>'),u=b('<div id="fancybox-overlay"></div>'),f=b('<div id="fancybox-wrap"></div>'));D=b('<div id="fancybox-outer"></div>').append('<div class="fancybox-bg" id="fancybox-bg-n"></div><div class="fancybox-bg" id="fancybox-bg-ne"></div><div class="fancybox-bg" id="fancybox-bg-e"></div><div class="fancybox-bg" id="fancybox-bg-se"></div><div class="fancybox-bg" id="fancybox-bg-s"></div><div class="fancybox-bg" id="fancybox-bg-sw"></div><div class="fancybox-bg" id="fancybox-bg-w"></div><div class="fancybox-bg" id="fancybox-bg-nw"></div>').appendTo(f);
D.append(j=b('<div id="fancybox-content"></div>'),E=b('<a id="fancybox-close"></a>'),n=b('<div id="fancybox-title"></div>'),z=b('<a href="javascript:;" id="fancybox-left"><span class="fancy-ico" id="fancybox-left-ico"></span></a>'),A=b('<a href="javascript:;" id="fancybox-right"><span class="fancy-ico" id="fancybox-right-ico"></span></a>'));E.click(b.fancybox.close);t.click(b.fancybox.cancel);z.click(function(a){a.preventDefault();b.fancybox.prev()});A.click(function(a){a.preventDefault();b.fancybox.next()});
b.fn.mousewheel&&f.bind("mousewheel.fb",function(a,c){if(h)a.preventDefault();else if(b(a.target).get(0).clientHeight==0||b(a.target).get(0).scrollHeight===b(a.target).get(0).clientHeight){a.preventDefault();b.fancybox[c>0?"prev":"next"]()}});b.support.opacity||f.addClass("fancybox-ie");if(M){t.addClass("fancybox-ie6");f.addClass("fancybox-ie6");b('<iframe id="fancybox-hide-sel-frame" src="'+(/^https/i.test(window.location.href||"")?"javascript:void(false)":"about:blank")+'" scrolling="no" border="0" frameborder="0" tabindex="-1"></iframe>').prependTo(D)}}};
b.fn.fancybox.defaults={padding:10,margin:40,opacity:false,modal:false,cyclic:false,scrolling:"auto",width:560,height:340,autoScale:true,autoDimensions:true,centerOnScroll:false,ajax:{},swf:{wmode:"transparent"},hideOnOverlayClick:true,hideOnContentClick:false,overlayShow:true,overlayOpacity:0.7,overlayColor:"#777",titleShow:true,titlePosition:"float",titleFormat:null,titleFromAlt:false,transitionIn:"fade",transitionOut:"fade",speedIn:300,speedOut:300,changeSpeed:300,changeFade:"fast",easingIn:"swing",
easingOut:"swing",showCloseButton:true,showNavArrows:true,enableEscapeButton:true,enableKeyboardNav:true,onStart:function(){},onCancel:function(){},onComplete:function(){},onCleanup:function(){},onClosed:function(){},onError:function(){}};b(document).ready(function(){b.fancybox.init()})})(jQuery);
/**
*	@name							Elastic
*	@descripton						Elastic is jQuery plugin that grow and shrink your textareas automatically
*	@version						1.6.10
*	@requires						jQuery 1.2.6+
*
*	@author							Jan Jarfalk
*	@author-email					jan.jarfalk@unwrongest.com
*	@author-website					http://www.unwrongest.com
*
*	@licence						MIT License - http://www.opensource.org/licenses/mit-license.php
*/

(function(jQuery){ 
	jQuery.fn.extend({  
		elastic: function() {
		
			//	We will create a div clone of the textarea
			//	by copying these attributes from the textarea to the div.
			var mimics = [
				'paddingTop',
				'paddingRight',
				'paddingBottom',
				'paddingLeft',
				'fontSize',
				'lineHeight',
				'fontFamily',
				'width',
				'fontWeight',
				'border-top-width',
				'border-right-width',
				'border-bottom-width',
				'border-left-width',
				'borderTopStyle',
				'borderTopColor',
				'borderRightStyle',
				'borderRightColor',
				'borderBottomStyle',
				'borderBottomColor',
				'borderLeftStyle',
				'borderLeftColor'
				];
			
			return this.each( function() {
				
				// Elastic only works on textareas
				if ( this.type !== 'textarea' ) {
					return false;
				}
					
			var $textarea	= jQuery(this),
				$twin		= jQuery('<div />').css({'position': 'absolute','display':'none','word-wrap':'break-word'}),
				lineHeight	= parseInt($textarea.css('line-height'),10) || parseInt($textarea.css('font-size'),'10'),
				minheight	= parseInt($textarea.css('height'),10) || lineHeight*3,
				maxheight	= parseInt($textarea.css('max-height'),10) || Number.MAX_VALUE,
				goalheight	= 0;
				
				// Opera returns max-height of -1 if not set
				if (maxheight < 0) { maxheight = Number.MAX_VALUE; }
					
				// Append the twin to the DOM
				// We are going to meassure the height of this, not the textarea.
				$twin.appendTo($textarea.parent());
				
				// Copy the essential styles (mimics) from the textarea to the twin
				var i = mimics.length;
				while(i--){
					$twin.css(mimics[i].toString(),$textarea.css(mimics[i].toString()));
				}
				
				// Updates the width of the twin. (solution for textareas with widths in percent)
				function setTwinWidth(){
					curatedWidth = Math.floor(parseInt($textarea.width(),10));
					if($twin.width() !== curatedWidth){
						$twin.css({'width': curatedWidth + 'px'});
						
						// Update height of textarea
						update(true);
					}
				}
				
				// Sets a given height and overflow state on the textarea
				function setHeightAndOverflow(height, overflow){
				
					var curratedHeight = Math.floor(parseInt(height,10));
					if($textarea.height() !== curratedHeight){
						$textarea.css({'height': curratedHeight + 'px','overflow':overflow});
						
						// Fire the custom event resize
						$textarea.trigger('resize');
						
					}
				}
				
				// This function will update the height of the textarea if necessary 
				function update(forced) {
					
					// Get curated content from the textarea.
					var textareaContent = $textarea.val().replace(/&/g,'&amp;').replace(/ {2}/g, '&nbsp;').replace(/<|>/g, '&gt;').replace(/\n/g, '<br />');
					
					// Compare curated content with curated twin.
					var twinContent = $twin.html().replace(/<br>/ig,'<br />');
					
					if(forced || textareaContent+'&nbsp;' !== twinContent){
					
						// Add an extra white space so new rows are added when you are at the end of a row.
						$twin.html(textareaContent+'&nbsp;');
						
						// Change textarea height if twin plus the height of one line differs more than 3 pixel from textarea height
						if(Math.abs($twin.height() + lineHeight - $textarea.height()) > 3){
							
							var goalheight = $twin.height()+lineHeight;
							if(goalheight >= maxheight) {
								setHeightAndOverflow(maxheight,'auto');
							} else if(goalheight <= minheight) {
								setHeightAndOverflow(minheight,'hidden');
							} else {
								setHeightAndOverflow(goalheight,'hidden');
							}
							
						}
						
					}
					
				}
				
				// Hide scrollbars
				$textarea.css({'overflow':'hidden'});
				
				// Update textarea size on keyup, change, cut and paste
				$textarea.bind('keyup change cut paste', function(){
					update(); 
				});
				
				// Update width of twin if browser or textarea is resized (solution for textareas with widths in percent)
				$(window).bind('resize', setTwinWidth);
				$textarea.bind('resize', setTwinWidth);
				$textarea.bind('update', update);
				
				// Compact textarea on blur
				$textarea.bind('blur',function(){
					if($twin.height() < maxheight){
						if($twin.height() > minheight) {
							$textarea.height($twin.height());
						} else {
							$textarea.height(minheight);
						}
					}
				});
				
				// And this line is to catch the browser paste event
				$textarea.bind('input paste',function(e){ setTimeout( update, 250); });				
				
				// Run update once when elastic is initialized
				update();
				
			});
			
        } 
    }); 
})(jQuery);
/*
 * timeago: a jQuery plugin, version: 0.9.3 (2011-01-21)
 * @requires jQuery v1.2.3 or later
 *
 * Timeago is a jQuery plugin that makes it easy to support automatically
 * updating fuzzy timestamps (e.g. "4 minutes ago" or "about 1 day ago").
 *
 * For usage and examples, visit:
 * http://timeago.yarp.com/
 *
 * Licensed under the MIT:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright (c) 2008-2011, Ryan McGeary (ryanonjavascript -[at]- mcgeary [*dot*] org)
 */
(function($) {
  $.timeago = function(timestamp) {
    if (timestamp instanceof Date) {
      return inWords(timestamp);
    } else if (typeof timestamp === "string") {
      return inWords($.timeago.parse(timestamp));
    } else {
      return inWords($.timeago.datetime(timestamp));
    }
  };
  var $t = $.timeago;

  $.extend($.timeago, {
    settings: {
      refreshMillis: 60000,
      allowFuture: false,
      strings: {
        prefixAgo: null,
        prefixFromNow: null,
        suffixAgo: "ago",
        suffixFromNow: "from now",
        seconds: "less than a minute",
        minute: "about a minute",
        minutes: "%d minutes",
        hour: "about an hour",
        hours: "about %d hours",
        day: "a day",
        days: "%d days",
        month: "about a month",
        months: "%d months",
        year: "about a year",
        years: "%d years",
        numbers: []
      }
    },
    inWords: function(distanceMillis) {
      var $l = this.settings.strings;
      var prefix = $l.prefixAgo;
      var suffix = $l.suffixAgo;
      if (this.settings.allowFuture) {
        if (distanceMillis < 0) {
          prefix = $l.prefixFromNow;
          suffix = $l.suffixFromNow;
        }
        distanceMillis = Math.abs(distanceMillis);
      }

      var seconds = distanceMillis / 1000;
      var minutes = seconds / 60;
      var hours = minutes / 60;
      var days = hours / 24;
      var years = days / 365;

      function substitute(stringOrFunction, number) {
        var string = $.isFunction(stringOrFunction) ? stringOrFunction(number, distanceMillis) : stringOrFunction;
        var value = ($l.numbers && $l.numbers[number]) || number;
        return string.replace(/%d/i, value);
      }

      var words = seconds < 45 && substitute($l.seconds, Math.round(seconds)) ||
        seconds < 90 && substitute($l.minute, 1) ||
        minutes < 45 && substitute($l.minutes, Math.round(minutes)) ||
        minutes < 90 && substitute($l.hour, 1) ||
        hours < 24 && substitute($l.hours, Math.round(hours)) ||
        hours < 48 && substitute($l.day, 1) ||
        days < 30 && substitute($l.days, Math.floor(days)) ||
        days < 60 && substitute($l.month, 1) ||
        days < 365 && substitute($l.months, Math.floor(days / 30)) ||
        years < 2 && substitute($l.year, 1) ||
        substitute($l.years, Math.floor(years));

      return $.trim([prefix, words, suffix].join(" "));
    },
    parse: function(iso8601) {
      var s = $.trim(iso8601);
      s = s.replace(/\.\d\d\d+/,""); // remove milliseconds
      s = s.replace(/-/,"/").replace(/-/,"/");
      s = s.replace(/T/," ").replace(/Z/," UTC");
      s = s.replace(/([\+\-]\d\d)\:?(\d\d)/," $1$2"); // -04:00 -> -0400
      return new Date(s);
    },
    datetime: function(elem) {
      // jQuery's `is()` doesn't play well with HTML5 in IE
      var isTime = $(elem).get(0).tagName.toLowerCase() === "time"; // $(elem).is("time");
      var iso8601 = isTime ? $(elem).attr("datetime") : $(elem).attr("title");
      return $t.parse(iso8601);
    }
  });

  $.fn.timeago = function() {
    var self = this;
    self.each(refresh);

    var $s = $t.settings;
    if ($s.refreshMillis > 0) {
      setInterval(function() { self.each(refresh); }, $s.refreshMillis);
    }
    return self;
  };

  function refresh() {
    var data = prepareData(this);
    if (!isNaN(data.datetime)) {
      $(this).text(inWords(data.datetime));
    }
    return this;
  }

  function prepareData(element) {
    element = $(element);
    if (!element.data("timeago")) {
      element.data("timeago", { datetime: $t.datetime(element) });
      var text = $.trim(element.text());
      if (text.length > 0) {
        element.attr("title", text);
      }
    }
    return element.data("timeago");
  }

  function inWords(date) {
    return $t.inWords(distance(date));
  }

  function distance(date) {
    return (new Date().getTime() - date.getTime());
  }

  // fix for IE6 suckage
  document.createElement("abbr");
  document.createElement("time");
}(jQuery));

/**
 * Version: 1.0 Alpha-1 
 * Build Date: 13-Nov-2007
 * Copyright (c) 2006-2007, Coolite Inc. (http://www.coolite.com/). All rights reserved.
 * License: Licensed under The MIT License. See license.txt and http://www.datejs.com/license/. 
 * Website: http://www.datejs.com/ or http://www.coolite.com/datejs/
 */
Date.CultureInfo={name:"en-US",englishName:"English (United States)",nativeName:"English (United States)",dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],abbreviatedDayNames:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],shortestDayNames:["Su","Mo","Tu","We","Th","Fr","Sa"],firstLetterDayNames:["S","M","T","W","T","F","S"],monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],abbreviatedMonthNames:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],amDesignator:"AM",pmDesignator:"PM",firstDayOfWeek:0,twoDigitYearMax:2029,dateElementOrder:"mdy",formatPatterns:{shortDate:"M/d/yyyy",longDate:"dddd, MMMM dd, yyyy",shortTime:"h:mm tt",longTime:"h:mm:ss tt",fullDateTime:"dddd, MMMM dd, yyyy h:mm:ss tt",sortableDateTime:"yyyy-MM-ddTHH:mm:ss",universalSortableDateTime:"yyyy-MM-dd HH:mm:ssZ",rfc1123:"ddd, dd MMM yyyy HH:mm:ss GMT",monthDay:"MMMM dd",yearMonth:"MMMM, yyyy"},regexPatterns:{jan:/^jan(uary)?/i,feb:/^feb(ruary)?/i,mar:/^mar(ch)?/i,apr:/^apr(il)?/i,may:/^may/i,jun:/^jun(e)?/i,jul:/^jul(y)?/i,aug:/^aug(ust)?/i,sep:/^sep(t(ember)?)?/i,oct:/^oct(ober)?/i,nov:/^nov(ember)?/i,dec:/^dec(ember)?/i,sun:/^su(n(day)?)?/i,mon:/^mo(n(day)?)?/i,tue:/^tu(e(s(day)?)?)?/i,wed:/^we(d(nesday)?)?/i,thu:/^th(u(r(s(day)?)?)?)?/i,fri:/^fr(i(day)?)?/i,sat:/^sa(t(urday)?)?/i,future:/^next/i,past:/^last|past|prev(ious)?/i,add:/^(\+|after|from)/i,subtract:/^(\-|before|ago)/i,yesterday:/^yesterday/i,today:/^t(oday)?/i,tomorrow:/^tomorrow/i,now:/^n(ow)?/i,millisecond:/^ms|milli(second)?s?/i,second:/^sec(ond)?s?/i,minute:/^min(ute)?s?/i,hour:/^h(ou)?rs?/i,week:/^w(ee)?k/i,month:/^m(o(nth)?s?)?/i,day:/^d(ays?)?/i,year:/^y((ea)?rs?)?/i,shortMeridian:/^(a|p)/i,longMeridian:/^(a\.?m?\.?|p\.?m?\.?)/i,timezone:/^((e(s|d)t|c(s|d)t|m(s|d)t|p(s|d)t)|((gmt)?\s*(\+|\-)\s*\d\d\d\d?)|gmt)/i,ordinalSuffix:/^\s*(st|nd|rd|th)/i,timeContext:/^\s*(\:|a|p)/i},abbreviatedTimeZoneStandard:{GMT:"-000",EST:"-0400",CST:"-0500",MST:"-0600",PST:"-0700"},abbreviatedTimeZoneDST:{GMT:"-000",EDT:"-0500",CDT:"-0600",MDT:"-0700",PDT:"-0800"}};
Date.getMonthNumberFromName=function(name){var n=Date.CultureInfo.monthNames,m=Date.CultureInfo.abbreviatedMonthNames,s=name.toLowerCase();for(var i=0;i<n.length;i++){if(n[i].toLowerCase()==s||m[i].toLowerCase()==s){return i;}}
return-1;};Date.getDayNumberFromName=function(name){var n=Date.CultureInfo.dayNames,m=Date.CultureInfo.abbreviatedDayNames,o=Date.CultureInfo.shortestDayNames,s=name.toLowerCase();for(var i=0;i<n.length;i++){if(n[i].toLowerCase()==s||m[i].toLowerCase()==s){return i;}}
return-1;};Date.isLeapYear=function(year){return(((year%4===0)&&(year%100!==0))||(year%400===0));};Date.getDaysInMonth=function(year,month){return[31,(Date.isLeapYear(year)?29:28),31,30,31,30,31,31,30,31,30,31][month];};Date.getTimezoneOffset=function(s,dst){return(dst||false)?Date.CultureInfo.abbreviatedTimeZoneDST[s.toUpperCase()]:Date.CultureInfo.abbreviatedTimeZoneStandard[s.toUpperCase()];};Date.getTimezoneAbbreviation=function(offset,dst){var n=(dst||false)?Date.CultureInfo.abbreviatedTimeZoneDST:Date.CultureInfo.abbreviatedTimeZoneStandard,p;for(p in n){if(n[p]===offset){return p;}}
return null;};Date.prototype.clone=function(){return new Date(this.getTime());};Date.prototype.compareTo=function(date){if(isNaN(this)){throw new Error(this);}
if(date instanceof Date&&!isNaN(date)){return(this>date)?1:(this<date)?-1:0;}else{throw new TypeError(date);}};Date.prototype.equals=function(date){return(this.compareTo(date)===0);};Date.prototype.between=function(start,end){var t=this.getTime();return t>=start.getTime()&&t<=end.getTime();};Date.prototype.addMilliseconds=function(value){this.setMilliseconds(this.getMilliseconds()+value);return this;};Date.prototype.addSeconds=function(value){return this.addMilliseconds(value*1000);};Date.prototype.addMinutes=function(value){return this.addMilliseconds(value*60000);};Date.prototype.addHours=function(value){return this.addMilliseconds(value*3600000);};Date.prototype.addDays=function(value){return this.addMilliseconds(value*86400000);};Date.prototype.addWeeks=function(value){return this.addMilliseconds(value*604800000);};Date.prototype.addMonths=function(value){var n=this.getDate();this.setDate(1);this.setMonth(this.getMonth()+value);this.setDate(Math.min(n,this.getDaysInMonth()));return this;};Date.prototype.addYears=function(value){return this.addMonths(value*12);};Date.prototype.add=function(config){if(typeof config=="number"){this._orient=config;return this;}
var x=config;if(x.millisecond||x.milliseconds){this.addMilliseconds(x.millisecond||x.milliseconds);}
if(x.second||x.seconds){this.addSeconds(x.second||x.seconds);}
if(x.minute||x.minutes){this.addMinutes(x.minute||x.minutes);}
if(x.hour||x.hours){this.addHours(x.hour||x.hours);}
if(x.month||x.months){this.addMonths(x.month||x.months);}
if(x.year||x.years){this.addYears(x.year||x.years);}
if(x.day||x.days){this.addDays(x.day||x.days);}
return this;};Date._validate=function(value,min,max,name){if(typeof value!="number"){throw new TypeError(value+" is not a Number.");}else if(value<min||value>max){throw new RangeError(value+" is not a valid value for "+name+".");}
return true;};Date.validateMillisecond=function(n){return Date._validate(n,0,999,"milliseconds");};Date.validateSecond=function(n){return Date._validate(n,0,59,"seconds");};Date.validateMinute=function(n){return Date._validate(n,0,59,"minutes");};Date.validateHour=function(n){return Date._validate(n,0,23,"hours");};Date.validateDay=function(n,year,month){return Date._validate(n,1,Date.getDaysInMonth(year,month),"days");};Date.validateMonth=function(n){return Date._validate(n,0,11,"months");};Date.validateYear=function(n){return Date._validate(n,1,9999,"seconds");};Date.prototype.set=function(config){var x=config;if(!x.millisecond&&x.millisecond!==0){x.millisecond=-1;}
if(!x.second&&x.second!==0){x.second=-1;}
if(!x.minute&&x.minute!==0){x.minute=-1;}
if(!x.hour&&x.hour!==0){x.hour=-1;}
if(!x.day&&x.day!==0){x.day=-1;}
if(!x.month&&x.month!==0){x.month=-1;}
if(!x.year&&x.year!==0){x.year=-1;}
if(x.millisecond!=-1&&Date.validateMillisecond(x.millisecond)){this.addMilliseconds(x.millisecond-this.getMilliseconds());}
if(x.second!=-1&&Date.validateSecond(x.second)){this.addSeconds(x.second-this.getSeconds());}
if(x.minute!=-1&&Date.validateMinute(x.minute)){this.addMinutes(x.minute-this.getMinutes());}
if(x.hour!=-1&&Date.validateHour(x.hour)){this.addHours(x.hour-this.getHours());}
if(x.month!==-1&&Date.validateMonth(x.month)){this.addMonths(x.month-this.getMonth());}
if(x.year!=-1&&Date.validateYear(x.year)){this.addYears(x.year-this.getFullYear());}
if(x.day!=-1&&Date.validateDay(x.day,this.getFullYear(),this.getMonth())){this.addDays(x.day-this.getDate());}
if(x.timezone){this.setTimezone(x.timezone);}
if(x.timezoneOffset){this.setTimezoneOffset(x.timezoneOffset);}
return this;};Date.prototype.clearTime=function(){this.setHours(0);this.setMinutes(0);this.setSeconds(0);this.setMilliseconds(0);return this;};Date.prototype.isLeapYear=function(){var y=this.getFullYear();return(((y%4===0)&&(y%100!==0))||(y%400===0));};Date.prototype.isWeekday=function(){return!(this.is().sat()||this.is().sun());};Date.prototype.getDaysInMonth=function(){return Date.getDaysInMonth(this.getFullYear(),this.getMonth());};Date.prototype.moveToFirstDayOfMonth=function(){return this.set({day:1});};Date.prototype.moveToLastDayOfMonth=function(){return this.set({day:this.getDaysInMonth()});};Date.prototype.moveToDayOfWeek=function(day,orient){var diff=(day-this.getDay()+7*(orient||+1))%7;return this.addDays((diff===0)?diff+=7*(orient||+1):diff);};Date.prototype.moveToMonth=function(month,orient){var diff=(month-this.getMonth()+12*(orient||+1))%12;return this.addMonths((diff===0)?diff+=12*(orient||+1):diff);};Date.prototype.getDayOfYear=function(){return Math.floor((this-new Date(this.getFullYear(),0,1))/86400000);};Date.prototype.getWeekOfYear=function(firstDayOfWeek){var y=this.getFullYear(),m=this.getMonth(),d=this.getDate();var dow=firstDayOfWeek||Date.CultureInfo.firstDayOfWeek;var offset=7+1-new Date(y,0,1).getDay();if(offset==8){offset=1;}
var daynum=((Date.UTC(y,m,d,0,0,0)-Date.UTC(y,0,1,0,0,0))/86400000)+1;var w=Math.floor((daynum-offset+7)/7);if(w===dow){y--;var prevOffset=7+1-new Date(y,0,1).getDay();if(prevOffset==2||prevOffset==8){w=53;}else{w=52;}}
return w;};Date.prototype.isDST=function(){console.log('isDST');return this.toString().match(/(E|C|M|P)(S|D)T/)[2]=="D";};Date.prototype.getTimezone=function(){return Date.getTimezoneAbbreviation(this.getUTCOffset,this.isDST());};Date.prototype.setTimezoneOffset=function(s){var here=this.getTimezoneOffset(),there=Number(s)*-6/10;this.addMinutes(there-here);return this;};Date.prototype.setTimezone=function(s){return this.setTimezoneOffset(Date.getTimezoneOffset(s));};Date.prototype.getUTCOffset=function(){var n=this.getTimezoneOffset()*-10/6,r;if(n<0){r=(n-10000).toString();return r[0]+r.substr(2);}else{r=(n+10000).toString();return"+"+r.substr(1);}};Date.prototype.getDayName=function(abbrev){return abbrev?Date.CultureInfo.abbreviatedDayNames[this.getDay()]:Date.CultureInfo.dayNames[this.getDay()];};Date.prototype.getMonthName=function(abbrev){return abbrev?Date.CultureInfo.abbreviatedMonthNames[this.getMonth()]:Date.CultureInfo.monthNames[this.getMonth()];};Date.prototype._toString=Date.prototype.toString;Date.prototype.toString=function(format){var self=this;var p=function p(s){return(s.toString().length==1)?"0"+s:s;};return format?format.replace(/dd?d?d?|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?|tt?|zz?z?/g,function(format){switch(format){case"hh":return p(self.getHours()<13?self.getHours():(self.getHours()-12));case"h":return self.getHours()<13?self.getHours():(self.getHours()-12);case"HH":return p(self.getHours());case"H":return self.getHours();case"mm":return p(self.getMinutes());case"m":return self.getMinutes();case"ss":return p(self.getSeconds());case"s":return self.getSeconds();case"yyyy":return self.getFullYear();case"yy":return self.getFullYear().toString().substring(2,4);case"dddd":return self.getDayName();case"ddd":return self.getDayName(true);case"dd":return p(self.getDate());case"d":return self.getDate().toString();case"MMMM":return self.getMonthName();case"MMM":return self.getMonthName(true);case"MM":return p((self.getMonth()+1));case"M":return self.getMonth()+1;case"t":return self.getHours()<12?Date.CultureInfo.amDesignator.substring(0,1):Date.CultureInfo.pmDesignator.substring(0,1);case"tt":return self.getHours()<12?Date.CultureInfo.amDesignator:Date.CultureInfo.pmDesignator;case"zzz":case"zz":case"z":return"";}}):this._toString();};
Date.now=function(){return new Date();};Date.today=function(){return Date.now().clearTime();};Date.prototype._orient=+1;Date.prototype.next=function(){this._orient=+1;return this;};Date.prototype.last=Date.prototype.prev=Date.prototype.previous=function(){this._orient=-1;return this;};Date.prototype._is=false;Date.prototype.is=function(){this._is=true;return this;};Number.prototype._dateElement="day";Number.prototype.fromNow=function(){var c={};c[this._dateElement]=this;return Date.now().add(c);};Number.prototype.ago=function(){var c={};c[this._dateElement]=this*-1;return Date.now().add(c);};(function(){var $D=Date.prototype,$N=Number.prototype;var dx=("sunday monday tuesday wednesday thursday friday saturday").split(/\s/),mx=("january february march april may june july august september october november december").split(/\s/),px=("Millisecond Second Minute Hour Day Week Month Year").split(/\s/),de;var df=function(n){return function(){if(this._is){this._is=false;return this.getDay()==n;}
return this.moveToDayOfWeek(n,this._orient);};};for(var i=0;i<dx.length;i++){$D[dx[i]]=$D[dx[i].substring(0,3)]=df(i);}
var mf=function(n){return function(){if(this._is){this._is=false;return this.getMonth()===n;}
return this.moveToMonth(n,this._orient);};};for(var j=0;j<mx.length;j++){$D[mx[j]]=$D[mx[j].substring(0,3)]=mf(j);}
var ef=function(j){return function(){if(j.substring(j.length-1)!="s"){j+="s";}
return this["add"+j](this._orient);};};var nf=function(n){return function(){this._dateElement=n;return this;};};for(var k=0;k<px.length;k++){de=px[k].toLowerCase();$D[de]=$D[de+"s"]=ef(px[k]);$N[de]=$N[de+"s"]=nf(de);}}());Date.prototype.toJSONString=function(){return this.toString("yyyy-MM-ddThh:mm:ssZ");};Date.prototype.toShortDateString=function(){return this.toString(Date.CultureInfo.formatPatterns.shortDatePattern);};Date.prototype.toLongDateString=function(){return this.toString(Date.CultureInfo.formatPatterns.longDatePattern);};Date.prototype.toShortTimeString=function(){return this.toString(Date.CultureInfo.formatPatterns.shortTimePattern);};Date.prototype.toLongTimeString=function(){return this.toString(Date.CultureInfo.formatPatterns.longTimePattern);};Date.prototype.getOrdinal=function(){switch(this.getDate()){case 1:case 21:case 31:return"st";case 2:case 22:return"nd";case 3:case 23:return"rd";default:return"th";}};
(function(){Date.Parsing={Exception:function(s){this.message="Parse error at '"+s.substring(0,10)+" ...'";}};var $P=Date.Parsing;var _=$P.Operators={rtoken:function(r){return function(s){var mx=s.match(r);if(mx){return([mx[0],s.substring(mx[0].length)]);}else{throw new $P.Exception(s);}};},token:function(s){return function(s){return _.rtoken(new RegExp("^\s*"+s+"\s*"))(s);};},stoken:function(s){return _.rtoken(new RegExp("^"+s));},until:function(p){return function(s){var qx=[],rx=null;while(s.length){try{rx=p.call(this,s);}catch(e){qx.push(rx[0]);s=rx[1];continue;}
break;}
return[qx,s];};},many:function(p){return function(s){var rx=[],r=null;while(s.length){try{r=p.call(this,s);}catch(e){return[rx,s];}
rx.push(r[0]);s=r[1];}
return[rx,s];};},optional:function(p){return function(s){var r=null;try{r=p.call(this,s);}catch(e){return[null,s];}
return[r[0],r[1]];};},not:function(p){return function(s){try{p.call(this,s);}catch(e){return[null,s];}
throw new $P.Exception(s);};},ignore:function(p){return p?function(s){var r=null;r=p.call(this,s);return[null,r[1]];}:null;},product:function(){var px=arguments[0],qx=Array.prototype.slice.call(arguments,1),rx=[];for(var i=0;i<px.length;i++){rx.push(_.each(px[i],qx));}
return rx;},cache:function(rule){var cache={},r=null;return function(s){try{r=cache[s]=(cache[s]||rule.call(this,s));}catch(e){r=cache[s]=e;}
if(r instanceof $P.Exception){throw r;}else{return r;}};},any:function(){var px=arguments;return function(s){var r=null;for(var i=0;i<px.length;i++){if(px[i]==null){continue;}
try{r=(px[i].call(this,s));}catch(e){r=null;}
if(r){return r;}}
throw new $P.Exception(s);};},each:function(){var px=arguments;return function(s){var rx=[],r=null;for(var i=0;i<px.length;i++){if(px[i]==null){continue;}
try{r=(px[i].call(this,s));}catch(e){throw new $P.Exception(s);}
rx.push(r[0]);s=r[1];}
return[rx,s];};},all:function(){var px=arguments,_=_;return _.each(_.optional(px));},sequence:function(px,d,c){d=d||_.rtoken(/^\s*/);c=c||null;if(px.length==1){return px[0];}
return function(s){var r=null,q=null;var rx=[];for(var i=0;i<px.length;i++){try{r=px[i].call(this,s);}catch(e){break;}
rx.push(r[0]);try{q=d.call(this,r[1]);}catch(ex){q=null;break;}
s=q[1];}
if(!r){throw new $P.Exception(s);}
if(q){throw new $P.Exception(q[1]);}
if(c){try{r=c.call(this,r[1]);}catch(ey){throw new $P.Exception(r[1]);}}
return[rx,(r?r[1]:s)];};},between:function(d1,p,d2){d2=d2||d1;var _fn=_.each(_.ignore(d1),p,_.ignore(d2));return function(s){var rx=_fn.call(this,s);return[[rx[0][0],r[0][2]],rx[1]];};},list:function(p,d,c){d=d||_.rtoken(/^\s*/);c=c||null;return(p instanceof Array?_.each(_.product(p.slice(0,-1),_.ignore(d)),p.slice(-1),_.ignore(c)):_.each(_.many(_.each(p,_.ignore(d))),px,_.ignore(c)));},set:function(px,d,c){d=d||_.rtoken(/^\s*/);c=c||null;return function(s){var r=null,p=null,q=null,rx=null,best=[[],s],last=false;for(var i=0;i<px.length;i++){q=null;p=null;r=null;last=(px.length==1);try{r=px[i].call(this,s);}catch(e){continue;}
rx=[[r[0]],r[1]];if(r[1].length>0&&!last){try{q=d.call(this,r[1]);}catch(ex){last=true;}}else{last=true;}
if(!last&&q[1].length===0){last=true;}
if(!last){var qx=[];for(var j=0;j<px.length;j++){if(i!=j){qx.push(px[j]);}}
p=_.set(qx,d).call(this,q[1]);if(p[0].length>0){rx[0]=rx[0].concat(p[0]);rx[1]=p[1];}}
if(rx[1].length<best[1].length){best=rx;}
if(best[1].length===0){break;}}
if(best[0].length===0){return best;}
if(c){try{q=c.call(this,best[1]);}catch(ey){throw new $P.Exception(best[1]);}
best[1]=q[1];}
return best;};},forward:function(gr,fname){return function(s){return gr[fname].call(this,s);};},replace:function(rule,repl){return function(s){var r=rule.call(this,s);return[repl,r[1]];};},process:function(rule,fn){return function(s){var r=rule.call(this,s);return[fn.call(this,r[0]),r[1]];};},min:function(min,rule){return function(s){var rx=rule.call(this,s);if(rx[0].length<min){throw new $P.Exception(s);}
return rx;};}};var _generator=function(op){return function(){var args=null,rx=[];if(arguments.length>1){args=Array.prototype.slice.call(arguments);}else if(arguments[0]instanceof Array){args=arguments[0];}
if(args){for(var i=0,px=args.shift();i<px.length;i++){args.unshift(px[i]);rx.push(op.apply(null,args));args.shift();return rx;}}else{return op.apply(null,arguments);}};};var gx="optional not ignore cache".split(/\s/);for(var i=0;i<gx.length;i++){_[gx[i]]=_generator(_[gx[i]]);}
var _vector=function(op){return function(){if(arguments[0]instanceof Array){return op.apply(null,arguments[0]);}else{return op.apply(null,arguments);}};};var vx="each any all".split(/\s/);for(var j=0;j<vx.length;j++){_[vx[j]]=_vector(_[vx[j]]);}}());(function(){var flattenAndCompact=function(ax){var rx=[];for(var i=0;i<ax.length;i++){if(ax[i]instanceof Array){rx=rx.concat(flattenAndCompact(ax[i]));}else{if(ax[i]){rx.push(ax[i]);}}}
return rx;};Date.Grammar={};Date.Translator={hour:function(s){return function(){this.hour=Number(s);};},minute:function(s){return function(){this.minute=Number(s);};},second:function(s){return function(){this.second=Number(s);};},meridian:function(s){return function(){this.meridian=s.slice(0,1).toLowerCase();};},timezone:function(s){return function(){var n=s.replace(/[^\d\+\-]/g,"");if(n.length){this.timezoneOffset=Number(n);}else{this.timezone=s.toLowerCase();}};},day:function(x){var s=x[0];return function(){this.day=Number(s.match(/\d+/)[0]);};},month:function(s){return function(){this.month=((s.length==3)?Date.getMonthNumberFromName(s):(Number(s)-1));};},year:function(s){return function(){var n=Number(s);this.year=((s.length>2)?n:(n+(((n+2000)<Date.CultureInfo.twoDigitYearMax)?2000:1900)));};},rday:function(s){return function(){switch(s){case"yesterday":this.days=-1;break;case"tomorrow":this.days=1;break;case"today":this.days=0;break;case"now":this.days=0;this.now=true;break;}};},finishExact:function(x){x=(x instanceof Array)?x:[x];var now=new Date();this.year=now.getFullYear();this.month=now.getMonth();this.day=1;this.hour=0;this.minute=0;this.second=0;for(var i=0;i<x.length;i++){if(x[i]){x[i].call(this);}}
this.hour=(this.meridian=="p"&&this.hour<13)?this.hour+12:this.hour;if(this.day>Date.getDaysInMonth(this.year,this.month)){throw new RangeError(this.day+" is not a valid value for days.");}
var r=new Date(this.year,this.month,this.day,this.hour,this.minute,this.second);if(this.timezone){r.set({timezone:this.timezone});}else if(this.timezoneOffset){r.set({timezoneOffset:this.timezoneOffset});}
return r;},finish:function(x){x=(x instanceof Array)?flattenAndCompact(x):[x];if(x.length===0){return null;}
for(var i=0;i<x.length;i++){if(typeof x[i]=="function"){x[i].call(this);}}
if(this.now){return new Date();}
var today=Date.today();var method=null;var expression=!!(this.days!=null||this.orient||this.operator);if(expression){var gap,mod,orient;orient=((this.orient=="past"||this.operator=="subtract")?-1:1);if(this.weekday){this.unit="day";gap=(Date.getDayNumberFromName(this.weekday)-today.getDay());mod=7;this.days=gap?((gap+(orient*mod))%mod):(orient*mod);}
if(this.month){this.unit="month";gap=(this.month-today.getMonth());mod=12;this.months=gap?((gap+(orient*mod))%mod):(orient*mod);this.month=null;}
if(!this.unit){this.unit="day";}
if(this[this.unit+"s"]==null||this.operator!=null){if(!this.value){this.value=1;}
if(this.unit=="week"){this.unit="day";this.value=this.value*7;}
this[this.unit+"s"]=this.value*orient;}
return today.add(this);}else{if(this.meridian&&this.hour){this.hour=(this.hour<13&&this.meridian=="p")?this.hour+12:this.hour;}
if(this.weekday&&!this.day){this.day=(today.addDays((Date.getDayNumberFromName(this.weekday)-today.getDay()))).getDate();}
if(this.month&&!this.day){this.day=1;}
return today.set(this);}}};var _=Date.Parsing.Operators,g=Date.Grammar,t=Date.Translator,_fn;g.datePartDelimiter=_.rtoken(/^([\s\-\.\,\/\x27]+)/);g.timePartDelimiter=_.stoken(":");g.whiteSpace=_.rtoken(/^\s*/);g.generalDelimiter=_.rtoken(/^(([\s\,]|at|on)+)/);var _C={};g.ctoken=function(keys){var fn=_C[keys];if(!fn){var c=Date.CultureInfo.regexPatterns;var kx=keys.split(/\s+/),px=[];for(var i=0;i<kx.length;i++){px.push(_.replace(_.rtoken(c[kx[i]]),kx[i]));}
fn=_C[keys]=_.any.apply(null,px);}
return fn;};g.ctoken2=function(key){return _.rtoken(Date.CultureInfo.regexPatterns[key]);};g.h=_.cache(_.process(_.rtoken(/^(0[0-9]|1[0-2]|[1-9])/),t.hour));g.hh=_.cache(_.process(_.rtoken(/^(0[0-9]|1[0-2])/),t.hour));g.H=_.cache(_.process(_.rtoken(/^([0-1][0-9]|2[0-3]|[0-9])/),t.hour));g.HH=_.cache(_.process(_.rtoken(/^([0-1][0-9]|2[0-3])/),t.hour));g.m=_.cache(_.process(_.rtoken(/^([0-5][0-9]|[0-9])/),t.minute));g.mm=_.cache(_.process(_.rtoken(/^[0-5][0-9]/),t.minute));g.s=_.cache(_.process(_.rtoken(/^([0-5][0-9]|[0-9])/),t.second));g.ss=_.cache(_.process(_.rtoken(/^[0-5][0-9]/),t.second));g.hms=_.cache(_.sequence([g.H,g.mm,g.ss],g.timePartDelimiter));g.t=_.cache(_.process(g.ctoken2("shortMeridian"),t.meridian));g.tt=_.cache(_.process(g.ctoken2("longMeridian"),t.meridian));g.z=_.cache(_.process(_.rtoken(/^(\+|\-)?\s*\d\d\d\d?/),t.timezone));g.zz=_.cache(_.process(_.rtoken(/^(\+|\-)\s*\d\d\d\d/),t.timezone));g.zzz=_.cache(_.process(g.ctoken2("timezone"),t.timezone));g.timeSuffix=_.each(_.ignore(g.whiteSpace),_.set([g.tt,g.zzz]));g.time=_.each(_.optional(_.ignore(_.stoken("T"))),g.hms,g.timeSuffix);g.d=_.cache(_.process(_.each(_.rtoken(/^([0-2]\d|3[0-1]|\d)/),_.optional(g.ctoken2("ordinalSuffix"))),t.day));g.dd=_.cache(_.process(_.each(_.rtoken(/^([0-2]\d|3[0-1])/),_.optional(g.ctoken2("ordinalSuffix"))),t.day));g.ddd=g.dddd=_.cache(_.process(g.ctoken("sun mon tue wed thu fri sat"),function(s){return function(){this.weekday=s;};}));g.M=_.cache(_.process(_.rtoken(/^(1[0-2]|0\d|\d)/),t.month));g.MM=_.cache(_.process(_.rtoken(/^(1[0-2]|0\d)/),t.month));g.MMM=g.MMMM=_.cache(_.process(g.ctoken("jan feb mar apr may jun jul aug sep oct nov dec"),t.month));g.y=_.cache(_.process(_.rtoken(/^(\d\d?)/),t.year));g.yy=_.cache(_.process(_.rtoken(/^(\d\d)/),t.year));g.yyy=_.cache(_.process(_.rtoken(/^(\d\d?\d?\d?)/),t.year));g.yyyy=_.cache(_.process(_.rtoken(/^(\d\d\d\d)/),t.year));_fn=function(){return _.each(_.any.apply(null,arguments),_.not(g.ctoken2("timeContext")));};g.day=_fn(g.d,g.dd);g.month=_fn(g.M,g.MMM);g.year=_fn(g.yyyy,g.yy);g.orientation=_.process(g.ctoken("past future"),function(s){return function(){this.orient=s;};});g.operator=_.process(g.ctoken("add subtract"),function(s){return function(){this.operator=s;};});g.rday=_.process(g.ctoken("yesterday tomorrow today now"),t.rday);g.unit=_.process(g.ctoken("minute hour day week month year"),function(s){return function(){this.unit=s;};});g.value=_.process(_.rtoken(/^\d\d?(st|nd|rd|th)?/),function(s){return function(){this.value=s.replace(/\D/g,"");};});g.expression=_.set([g.rday,g.operator,g.value,g.unit,g.orientation,g.ddd,g.MMM]);_fn=function(){return _.set(arguments,g.datePartDelimiter);};g.mdy=_fn(g.ddd,g.month,g.day,g.year);g.ymd=_fn(g.ddd,g.year,g.month,g.day);g.dmy=_fn(g.ddd,g.day,g.month,g.year);g.date=function(s){return((g[Date.CultureInfo.dateElementOrder]||g.mdy).call(this,s));};g.format=_.process(_.many(_.any(_.process(_.rtoken(/^(dd?d?d?|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?|tt?|zz?z?)/),function(fmt){if(g[fmt]){return g[fmt];}else{throw Date.Parsing.Exception(fmt);}}),_.process(_.rtoken(/^[^dMyhHmstz]+/),function(s){return _.ignore(_.stoken(s));}))),function(rules){return _.process(_.each.apply(null,rules),t.finishExact);});var _F={};var _get=function(f){return _F[f]=(_F[f]||g.format(f)[0]);};g.formats=function(fx){if(fx instanceof Array){var rx=[];for(var i=0;i<fx.length;i++){rx.push(_get(fx[i]));}
return _.any.apply(null,rx);}else{return _get(fx);}};g._formats=g.formats(["yyyy-MM-ddTHH:mm:ss","ddd, MMM dd, yyyy H:mm:ss tt","ddd MMM d yyyy HH:mm:ss zzz","d"]);g._start=_.process(_.set([g.date,g.time,g.expression],g.generalDelimiter,g.whiteSpace),t.finish);g.start=function(s){try{var r=g._formats.call({},s);if(r[1].length===0){return r;}}catch(e){}
return g._start.call({},s);};}());Date._parse=Date.parse;Date.parse=function(s){var r=null;if(!s){return null;}
try{r=Date.Grammar.start.call({},s);}catch(e){return null;}
return((r[1].length===0)?r[0]:null);};Date.getParseFunction=function(fx){var fn=Date.Grammar.formats(fx);return function(s){var r=null;try{r=fn.call({},s);}catch(e){return null;}
return((r[1].length===0)?r[0]:null);};};Date.parseExact=function(s,fx){return Date.getParseFunction(fx)(s);};


/* Copyright (c) 2006 Brandon Aaron (http://brandonaaron.net)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) 
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * $LastChangedDate: 2007-07-22 01:45:56 +0200 (Son, 22 Jul 2007) $
 * $Rev: 2447 $
 *
 * Version 2.1.1
 */
(function($){$.fn.bgIframe=$.fn.bgiframe=function(s){if($.browser.msie&&/6.0/.test(navigator.userAgent)){s=$.extend({top:'auto',left:'auto',width:'auto',height:'auto',opacity:true,src:'javascript:false;'},s||{});var prop=function(n){return n&&n.constructor==Number?n+'px':n;},html='<iframe class="bgiframe"frameborder="0"tabindex="-1"src="'+s.src+'"'+'style="display:block;position:absolute;z-index:-1;'+(s.opacity!==false?'filter:Alpha(Opacity=\'0\');':'')+'top:'+(s.top=='auto'?'expression(((parseInt(this.parentNode.currentStyle.borderTopWidth)||0)*-1)+\'px\')':prop(s.top))+';'+'left:'+(s.left=='auto'?'expression(((parseInt(this.parentNode.currentStyle.borderLeftWidth)||0)*-1)+\'px\')':prop(s.left))+';'+'width:'+(s.width=='auto'?'expression(this.parentNode.offsetWidth+\'px\')':prop(s.width))+';'+'height:'+(s.height=='auto'?'expression(this.parentNode.offsetHeight+\'px\')':prop(s.height))+';'+'"/>';return this.each(function(){if($('> iframe.bgiframe',this).length==0)this.insertBefore(document.createElement(html),this.firstChild);});}return this;};})(jQuery);
/**
 * Ajax Queue Plugin
 * 
 * Homepage: http://jquery.com/plugins/project/ajaxqueue
 * Documentation: http://docs.jquery.com/AjaxQueue
 */

/**

<script>
$(function(){
	jQuery.ajaxQueue({
		url: "test.php",
		success: function(html){ jQuery("ul").append(html); }
	});
	jQuery.ajaxQueue({
		url: "test.php",
		success: function(html){ jQuery("ul").append(html); }
	});
	jQuery.ajaxSync({
		url: "test.php",
		success: function(html){ jQuery("ul").append("<b>"+html+"</b>"); }
	});
	jQuery.ajaxSync({
		url: "test.php",
		success: function(html){ jQuery("ul").append("<b>"+html+"</b>"); }
	});
});
</script>
<ul style="position: absolute; top: 5px; right: 5px;"></ul>

 */
/*
 * Queued Ajax requests.
 * A new Ajax request won't be started until the previous queued 
 * request has finished.
 */

/*
 * Synced Ajax requests.
 * The Ajax request will happen as soon as you call this method, but
 * the callbacks (success/error/complete) won't fire until all previous
 * synced requests have been completed.
 */


(function($) {
	
	var ajax = $.ajax;
	
	var pendingRequests = {};
	
	var synced = [];
	var syncedData = [];
	
	$.ajax = function(settings) {
		// create settings for compatibility with ajaxSetup
		settings = jQuery.extend(settings, jQuery.extend({}, jQuery.ajaxSettings, settings));
		
		var port = settings.port;
		
		switch(settings.mode) {
		case "abort": 
			if ( pendingRequests[port] ) {
				pendingRequests[port].abort();
			}
			return pendingRequests[port] = ajax.apply(this, arguments);
		case "queue": 
			var _old = settings.complete;
			settings.complete = function(){
				if ( _old )
					_old.apply( this, arguments );
				jQuery([ajax]).dequeue("ajax" + port );;
			};
		
			jQuery([ ajax ]).queue("ajax" + port, function(){
				ajax( settings );
			});
			return;
		case "sync":
			var pos = synced.length;
	
			synced[ pos ] = {
				error: settings.error,
				success: settings.success,
				complete: settings.complete,
				done: false
			};
		
			syncedData[ pos ] = {
				error: [],
				success: [],
				complete: []
			};
		
			settings.error = function(){ syncedData[ pos ].error = arguments; };
			settings.success = function(){ syncedData[ pos ].success = arguments; };
			settings.complete = function(){
				syncedData[ pos ].complete = arguments;
				synced[ pos ].done = true;
		
				if ( pos == 0 || !synced[ pos-1 ] )
					for ( var i = pos; i < synced.length && synced[i].done; i++ ) {
						if ( synced[i].error ) synced[i].error.apply( jQuery, syncedData[i].error );
						if ( synced[i].success ) synced[i].success.apply( jQuery, syncedData[i].success );
						if ( synced[i].complete ) synced[i].complete.apply( jQuery, syncedData[i].complete );
		
						synced[i] = null;
						syncedData[i] = null;
					}
			};
		}
		return ajax.apply(this, arguments);
	};
	
})(jQuery);
/*
 * Thickbox 3 - One Box To Rule Them All.
 * By Cody Lindley (http://www.codylindley.com)
 * Copyright (c) 2007 cody lindley
 * Licensed under the MIT License: http://www.opensource.org/licenses/mit-license.php
*/

var tb_pathToImage = "images/loadingAnimation.gif";

eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('$(o).2S(9(){1u(\'a.18, 3n.18, 3i.18\');1w=1p 1t();1w.L=2H});9 1u(b){$(b).s(9(){6 t=X.Q||X.1v||M;6 a=X.u||X.23;6 g=X.1N||P;19(t,a,g);X.2E();H P})}9 19(d,f,g){3m{3(2t o.v.J.2i==="2g"){$("v","11").r({A:"28%",z:"28%"});$("11").r("22","2Z");3(o.1Y("1F")===M){$("v").q("<U 5=\'1F\'></U><4 5=\'B\'></4><4 5=\'8\'></4>");$("#B").s(G)}}n{3(o.1Y("B")===M){$("v").q("<4 5=\'B\'></4><4 5=\'8\'></4>");$("#B").s(G)}}3(1K()){$("#B").1J("2B")}n{$("#B").1J("2z")}3(d===M){d=""}$("v").q("<4 5=\'K\'><1I L=\'"+1w.L+"\' /></4>");$(\'#K\').2y();6 h;3(f.O("?")!==-1){h=f.3l(0,f.O("?"))}n{h=f}6 i=/\\.2s$|\\.2q$|\\.2m$|\\.2l$|\\.2k$/;6 j=h.1C().2h(i);3(j==\'.2s\'||j==\'.2q\'||j==\'.2m\'||j==\'.2l\'||j==\'.2k\'){1D="";1G="";14="";1z="";1x="";R="";1n="";1r=P;3(g){E=$("a[@1N="+g+"]").36();25(D=0;((D<E.1c)&&(R===""));D++){6 k=E[D].u.1C().2h(i);3(!(E[D].u==f)){3(1r){1z=E[D].Q;1x=E[D].u;R="<1e 5=\'1X\'>&1d;&1d;<a u=\'#\'>2T &2R;</a></1e>"}n{1D=E[D].Q;1G=E[D].u;14="<1e 5=\'1U\'>&1d;&1d;<a u=\'#\'>&2O; 2N</a></1e>"}}n{1r=1b;1n="1t "+(D+1)+" 2L "+(E.1c)}}}S=1p 1t();S.1g=9(){S.1g=M;6 a=2x();6 x=a[0]-1M;6 y=a[1]-1M;6 b=S.z;6 c=S.A;3(b>x){c=c*(x/b);b=x;3(c>y){b=b*(y/c);c=y}}n 3(c>y){b=b*(y/c);c=y;3(b>x){c=c*(x/b);b=x}}13=b+30;1a=c+2G;$("#8").q("<a u=\'\' 5=\'1L\' Q=\'1o\'><1I 5=\'2F\' L=\'"+f+"\' z=\'"+b+"\' A=\'"+c+"\' 23=\'"+d+"\'/></a>"+"<4 5=\'2D\'>"+d+"<4 5=\'2C\'>"+1n+14+R+"</4></4><4 5=\'2A\'><a u=\'#\' 5=\'Z\' Q=\'1o\'>1l</a> 1k 1j 1s</4>");$("#Z").s(G);3(!(14==="")){9 12(){3($(o).N("s",12)){$(o).N("s",12)}$("#8").C();$("v").q("<4 5=\'8\'></4>");19(1D,1G,g);H P}$("#1U").s(12)}3(!(R==="")){9 1i(){$("#8").C();$("v").q("<4 5=\'8\'></4>");19(1z,1x,g);H P}$("#1X").s(1i)}o.1h=9(e){3(e==M){I=2w.2v}n{I=e.2u}3(I==27){G()}n 3(I==3k){3(!(R=="")){o.1h="";1i()}}n 3(I==3j){3(!(14=="")){o.1h="";12()}}};16();$("#K").C();$("#1L").s(G);$("#8").r({Y:"T"})};S.L=f}n{6 l=f.2r(/^[^\\?]+\\??/,\'\');6 m=2p(l);13=(m[\'z\']*1)+30||3h;1a=(m[\'A\']*1)+3g||3f;W=13-30;V=1a-3e;3(f.O(\'2j\')!=-1){1E=f.1B(\'3d\');$("#15").C();3(m[\'1A\']!="1b"){$("#8").q("<4 5=\'2f\'><4 5=\'1H\'>"+d+"</4><4 5=\'2e\'><a u=\'#\' 5=\'Z\' Q=\'1o\'>1l</a> 1k 1j 1s</4></4><U 1W=\'0\' 2d=\'0\' L=\'"+1E[0]+"\' 5=\'15\' 1v=\'15"+1f.2c(1f.1y()*2b)+"\' 1g=\'1m()\' J=\'z:"+(W+29)+"p;A:"+(V+17)+"p;\' > </U>")}n{$("#B").N();$("#8").q("<U 1W=\'0\' 2d=\'0\' L=\'"+1E[0]+"\' 5=\'15\' 1v=\'15"+1f.2c(1f.1y()*2b)+"\' 1g=\'1m()\' J=\'z:"+(W+29)+"p;A:"+(V+17)+"p;\'> </U>")}}n{3($("#8").r("Y")!="T"){3(m[\'1A\']!="1b"){$("#8").q("<4 5=\'2f\'><4 5=\'1H\'>"+d+"</4><4 5=\'2e\'><a u=\'#\' 5=\'Z\'>1l</a> 1k 1j 1s</4></4><4 5=\'F\' J=\'z:"+W+"p;A:"+V+"p\'></4>")}n{$("#B").N();$("#8").q("<4 5=\'F\' 3c=\'3b\' J=\'z:"+W+"p;A:"+V+"p;\'></4>")}}n{$("#F")[0].J.z=W+"p";$("#F")[0].J.A=V+"p";$("#F")[0].3a=0;$("#1H").11(d)}}$("#Z").s(G);3(f.O(\'37\')!=-1){$("#F").q($(\'#\'+m[\'26\']).1T());$("#8").24(9(){$(\'#\'+m[\'26\']).q($("#F").1T())});16();$("#K").C();$("#8").r({Y:"T"})}n 3(f.O(\'2j\')!=-1){16();3($.1q.35){$("#K").C();$("#8").r({Y:"T"})}}n{$("#F").34(f+="&1y="+(1p 33().32()),9(){16();$("#K").C();1u("#F a.18");$("#8").r({Y:"T"})})}}3(!m[\'1A\']){o.21=9(e){3(e==M){I=2w.2v}n{I=e.2u}3(I==27){G()}}}}31(e){}}9 1m(){$("#K").C();$("#8").r({Y:"T"})}9 G(){$("#2Y").N("s");$("#Z").N("s");$("#8").2X("2W",9(){$(\'#8,#B,#1F\').2V("24").N().C()});$("#K").C();3(2t o.v.J.2i=="2g"){$("v","11").r({A:"1Z",z:"1Z"});$("11").r("22","")}o.1h="";o.21="";H P}9 16(){$("#8").r({2U:\'-\'+20((13/2),10)+\'p\',z:13+\'p\'});3(!(1V.1q.2Q&&1V.1q.2P<7)){$("#8").r({38:\'-\'+20((1a/2),10)+\'p\'})}}9 2p(a){6 b={};3(!a){H b}6 c=a.1B(/[;&]/);25(6 i=0;i<c.1c;i++){6 d=c[i].1B(\'=\');3(!d||d.1c!=2){39}6 e=2a(d[0]);6 f=2a(d[1]);f=f.2r(/\\+/g,\' \');b[e]=f}H b}9 2x(){6 a=o.2M;6 w=1S.2o||1R.2o||(a&&a.1Q)||o.v.1Q;6 h=1S.1P||1R.1P||(a&&a.2n)||o.v.2n;1O=[w,h];H 1O}9 1K(){6 a=2K.2J.1C();3(a.O(\'2I\')!=-1&&a.O(\'3o\')!=-1){H 1b}}',62,211,'|||if|div|id|var||TB_window|function||||||||||||||else|document|px|append|css|click||href|body||||width|height|TB_overlay|remove|TB_Counter|TB_TempArray|TB_ajaxContent|tb_remove|return|keycode|style|TB_load|src|null|unbind|indexOf|false|title|TB_NextHTML|imgPreloader|block|iframe|ajaxContentH|ajaxContentW|this|display|TB_closeWindowButton||html|goPrev|TB_WIDTH|TB_PrevHTML|TB_iframeContent|tb_position||thickbox|tb_show|TB_HEIGHT|true|length|nbsp|span|Math|onload|onkeydown|goNext|Esc|or|close|tb_showIframe|TB_imageCount|Close|new|browser|TB_FoundURL|Key|Image|tb_init|name|imgLoader|TB_NextURL|random|TB_NextCaption|modal|split|toLowerCase|TB_PrevCaption|urlNoQuery|TB_HideSelect|TB_PrevURL|TB_ajaxWindowTitle|img|addClass|tb_detectMacXFF|TB_ImageOff|150|rel|arrayPageSize|innerHeight|clientWidth|self|window|children|TB_prev|jQuery|frameborder|TB_next|getElementById|auto|parseInt|onkeyup|overflow|alt|unload|for|inlineId||100||unescape|1000|round|hspace|TB_closeAjaxWindow|TB_title|undefined|match|maxHeight|TB_iframe|bmp|gif|png|clientHeight|innerWidth|tb_parseQuery|jpeg|replace|jpg|typeof|which|keyCode|event|tb_getPageSize|show|TB_overlayBG|TB_closeWindow|TB_overlayMacFFBGHack|TB_secondLine|TB_caption|blur|TB_Image|60|tb_pathToImage|mac|userAgent|navigator|of|documentElement|Prev|lt|version|msie|gt|ready|Next|marginLeft|trigger|fast|fadeOut|TB_imageOff|hidden||catch|getTime|Date|load|safari|get|TB_inline|marginTop|continue|scrollTop|TB_modal|class|TB_|45|440|40|630|input|188|190|substr|try|area|firefox'.split('|'),0,{}))
/*
 * jQuery Autocomplete plugin 1.1
 *
 * Copyright (c) 2009 Jörn Zaefferer
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Revision: $Id: jquery.autocomplete.js 15 2009-08-22 10:30:27Z joern.zaefferer $
 */

;(function($) {
	
$.fn.extend({
	autocomplete: function(urlOrData, options) {
		var isUrl = typeof urlOrData == "string";
		options = $.extend({}, $.Autocompleter.defaults, {
			url: isUrl ? urlOrData : null,
			data: isUrl ? null : urlOrData,
			delay: isUrl ? $.Autocompleter.defaults.delay : 10,
			max: options && !options.scroll ? 10 : 150
		}, options);
		
		// if highlight is set to false, replace it with a do-nothing function
		options.highlight = options.highlight || function(value) { return value; };
		
		// if the formatMatch option is not specified, then use formatItem for backwards compatibility
		options.formatMatch = options.formatMatch || options.formatItem;
		
		return this.each(function() {
			new $.Autocompleter(this, options);
		});
	},
	result: function(handler) {
		return this.bind("result", handler);
	},
	search: function(handler) {
		return this.trigger("search", [handler]);
	},
	flushCache: function() {
		return this.trigger("flushCache");
	},
	setOptions: function(options){
		return this.trigger("setOptions", [options]);
	},
	unautocomplete: function() {
		return this.trigger("unautocomplete");
	}
});

$.Autocompleter = function(input, options) {

	var KEY = {
		UP: 38,
		DOWN: 40,
		DEL: 46,
		TAB: 9,
		RETURN: 13,
		ESC: 27,
		COMMA: 188,
		PAGEUP: 33,
		PAGEDOWN: 34,
		BACKSPACE: 8
	};

	// Create $ object for input element
	var $input = $(input).attr("autocomplete", "off").addClass(options.inputClass);

	var timeout;
	var previousValue = "";
	var cache = $.Autocompleter.Cache(options);
	var hasFocus = 0;
	var lastKeyPressCode;
	var config = {
		mouseDownOnSelect: false
	};
	var select = $.Autocompleter.Select(options, input, selectCurrent, config);
	
	var blockSubmit;
	
	// prevent form submit in opera when selecting with return key
	$.browser.opera && $(input.form).bind("submit.autocomplete", function() {
		if (blockSubmit) {
			blockSubmit = false;
			return false;
		}
	});
	
	// only opera doesn't trigger keydown multiple times while pressed, others don't work with keypress at all
	$input.bind(($.browser.opera ? "keypress" : "keydown") + ".autocomplete", function(event) {
		// a keypress means the input has focus
		// avoids issue where input had focus before the autocomplete was applied
		hasFocus = 1;
		// track last key pressed
		lastKeyPressCode = event.keyCode;
		switch(event.keyCode) {
		
			case KEY.UP:
				event.preventDefault();
				if ( select.visible() ) {
					select.prev();
				} else {
					onChange(0, true);
				}
				break;
				
			case KEY.DOWN:
				event.preventDefault();
				if ( select.visible() ) {
					select.next();
				} else {
					onChange(0, true);
				}
				break;
				
			case KEY.PAGEUP:
				event.preventDefault();
				if ( select.visible() ) {
					select.pageUp();
				} else {
					onChange(0, true);
				}
				break;
				
			case KEY.PAGEDOWN:
				event.preventDefault();
				if ( select.visible() ) {
					select.pageDown();
				} else {
					onChange(0, true);
				}
				break;
			
			// matches also semicolon
			case options.multiple && $.trim(options.multipleSeparator) == "," && KEY.COMMA:
			case KEY.TAB:
			case KEY.RETURN:
				if( selectCurrent() ) {
					// stop default to prevent a form submit, Opera needs special handling
					event.preventDefault();
					blockSubmit = true;
					return false;
				}
				break;
				
			case KEY.ESC:
				select.hide();
				break;
				
			default:
				clearTimeout(timeout);
				timeout = setTimeout(onChange, options.delay);
				break;
		}
	}).focus(function(){
		// track whether the field has focus, we shouldn't process any
		// results if the field no longer has focus
		hasFocus++;
	}).blur(function() {
		hasFocus = 0;
		if (!config.mouseDownOnSelect) {
			hideResults();
		}
	}).click(function() {
		// show select when clicking in a focused field
		if ( hasFocus++ > 1 && !select.visible() ) {
			onChange(0, true);
		}
	}).bind("search", function() {
		// TODO why not just specifying both arguments?
		var fn = (arguments.length > 1) ? arguments[1] : null;
		function findValueCallback(q, data) {
			var result;
			if( data && data.length ) {
				for (var i=0; i < data.length; i++) {
					if( data[i].result.toLowerCase() == q.toLowerCase() ) {
						result = data[i];
						break;
					}
				}
			}
			if( typeof fn == "function" ) fn(result);
			else $input.trigger("result", result && [result.data, result.value]);
		}
		$.each(trimWords($input.val()), function(i, value) {
			request(value, findValueCallback, findValueCallback);
		});
	}).bind("flushCache", function() {
		cache.flush();
	}).bind("setOptions", function() {
		$.extend(options, arguments[1]);
		// if we've updated the data, repopulate
		if ( "data" in arguments[1] )
			cache.populate();
	}).bind("unautocomplete", function() {
		select.unbind();
		$input.unbind();
		$(input.form).unbind(".autocomplete");
	});
	
	
	function selectCurrent() {
		var selected = select.selected();
		if( !selected )
			return false;
		
		var v = selected.result;
		previousValue = v;
		
		if ( options.multiple ) {
			var words = trimWords($input.val());
			if ( words.length > 1 ) {
				var seperator = options.multipleSeparator.length;
				var cursorAt = $(input).selection().start;
				var wordAt, progress = 0;
				$.each(words, function(i, word) {
					progress += word.length;
					if (cursorAt <= progress) {
						wordAt = i;
						return false;
					}
					progress += seperator;
				});
				words[wordAt] = v;
				// TODO this should set the cursor to the right position, but it gets overriden somewhere
				//$.Autocompleter.Selection(input, progress + seperator, progress + seperator);
				v = words.join( options.multipleSeparator );
			}
			v += options.multipleSeparator;
		}
		
		$input.val(v);
		hideResultsNow();
		$input.trigger("result", [selected.data, selected.value]);
		return true;
	}
	
	function onChange(crap, skipPrevCheck) {
		if( lastKeyPressCode == KEY.DEL ) {
			select.hide();
			return;
		}
		
		var currentValue = $input.val();
		
		if ( !skipPrevCheck && currentValue == previousValue )
			return;
		
		previousValue = currentValue;
		
		currentValue = lastWord(currentValue);
		if ( currentValue.length >= options.minChars) {
			$input.addClass(options.loadingClass);
			if (!options.matchCase)
				currentValue = currentValue.toLowerCase();
			request(currentValue, receiveData, hideResultsNow);
		} else {
			stopLoading();
			select.hide();
		}
	};
	
	function trimWords(value) {
		if (!value)
			return [""];
		if (!options.multiple)
			return [$.trim(value)];
		return $.map(value.split(options.multipleSeparator), function(word) {
			return $.trim(value).length ? $.trim(word) : null;
		});
	}
	
	function lastWord(value) {
		if ( !options.multiple )
			return value;
		var words = trimWords(value);
		if (words.length == 1) 
			return words[0];
		var cursorAt = $(input).selection().start;
		if (cursorAt == value.length) {
			words = trimWords(value)
		} else {
			words = trimWords(value.replace(value.substring(cursorAt), ""));
		}
		return words[words.length - 1];
	}
	
	// fills in the input box w/the first match (assumed to be the best match)
	// q: the term entered
	// sValue: the first matching result
	function autoFill(q, sValue){
		// autofill in the complete box w/the first match as long as the user hasn't entered in more data
		// if the last user key pressed was backspace, don't autofill
		if( options.autoFill && (lastWord($input.val()).toLowerCase() == q.toLowerCase()) && lastKeyPressCode != KEY.BACKSPACE ) {
			// fill in the value (keep the case the user has typed)
			$input.val($input.val() + sValue.substring(lastWord(previousValue).length));
			// select the portion of the value not typed by the user (so the next character will erase)
			$(input).selection(previousValue.length, previousValue.length + sValue.length);
		}
	};

	function hideResults() {
		clearTimeout(timeout);
		timeout = setTimeout(hideResultsNow, 200);
	};

	function hideResultsNow() {
		var wasVisible = select.visible();
		select.hide();
		clearTimeout(timeout);
		stopLoading();
		if (options.mustMatch) {
			// call search and run callback
			$input.search(
				function (result){
					// if no value found, clear the input box
					if( !result ) {
						if (options.multiple) {
							var words = trimWords($input.val()).slice(0, -1);
							$input.val( words.join(options.multipleSeparator) + (words.length ? options.multipleSeparator : "") );
						}
						else {
							$input.val( "" );
							$input.trigger("result", null);
						}
					}
				}
			);
		}
	};

	function receiveData(q, data) {
		if ( data && data.length && hasFocus ) {
			stopLoading();
			select.display(data, q);
			autoFill(q, data[0].value);
			select.show();
		} else {
			hideResultsNow();
		}
	};

	function request(term, success, failure) {
		if (!options.matchCase)
			term = term.toLowerCase();
		var data = cache.load(term);
		// recieve the cached data
		if (data && data.length) {
			success(term, data);
		// if an AJAX url has been supplied, try loading the data now
		} else if( (typeof options.url == "string") && (options.url.length > 0) ){
			
			var extraParams = {
				timestamp: +new Date()
			};
			$.each(options.extraParams, function(key, param) {
				extraParams[key] = typeof param == "function" ? param() : param;
			});
			
			$.ajax({
				// try to leverage ajaxQueue plugin to abort previous requests
				mode: "abort",
				// limit abortion to this input
				port: "autocomplete" + input.name,
				dataType: options.dataType,
				url: options.url,
				data: $.extend({
					q: lastWord(term),
					limit: options.max
				}, extraParams),
				success: function(data) {
					var parsed = options.parse && options.parse(data) || parse(data);
					cache.add(term, parsed);
					success(term, parsed);
				}
			});
		} else {
			// if we have a failure, we need to empty the list -- this prevents the the [TAB] key from selecting the last successful match
			select.emptyList();
			failure(term);
		}
	};
	
	function parse(data) {
		var parsed = [];
		var rows = data.split("\n");
		for (var i=0; i < rows.length; i++) {
			var row = $.trim(rows[i]);
			if (row) {
				row = row.split("|");
				parsed[parsed.length] = {
					data: row,
					value: row[0],
					result: options.formatResult && options.formatResult(row, row[0]) || row[0]
				};
			}
		}
		return parsed;
	};

	function stopLoading() {
		$input.removeClass(options.loadingClass);
	};

};

$.Autocompleter.defaults = {
	inputClass: "ac_input",
	resultsClass: "ac_results",
	loadingClass: "ac_loading",
	minChars: 1,
	delay: 400,
	matchCase: false,
	matchSubset: true,
	matchContains: false,
	cacheLength: 10,
	max: 100,
	mustMatch: false,
	extraParams: {},
	selectFirst: true,
	formatItem: function(row) { return row[0]; },
	formatMatch: null,
	autoFill: false,
	width: 0,
	multiple: false,
	multipleSeparator: ", ",
	highlight: function(value, term) {
		return value.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + term.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi, "\\$1") + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>");
	},
    scroll: true,
    scrollHeight: 180
};

$.Autocompleter.Cache = function(options) {

	var data = {};
	var length = 0;
	
	function matchSubset(s, sub) {
		if (!options.matchCase) 
			s = s.toLowerCase();
		var i = s.indexOf(sub);
		if (options.matchContains == "word"){
			i = s.toLowerCase().search("\\b" + sub.toLowerCase());
		}
		if (i == -1) return false;
		return i == 0 || options.matchContains;
	};
	
	function add(q, value) {
		if (length > options.cacheLength){
			flush();
		}
		if (!data[q]){ 
			length++;
		}
		data[q] = value;
	}
	
	function populate(){
		if( !options.data ) return false;
		// track the matches
		var stMatchSets = {},
			nullData = 0;

		// no url was specified, we need to adjust the cache length to make sure it fits the local data store
		if( !options.url ) options.cacheLength = 1;
		
		// track all options for minChars = 0
		stMatchSets[""] = [];
		
		// loop through the array and create a lookup structure
		for ( var i = 0, ol = options.data.length; i < ol; i++ ) {
			var rawValue = options.data[i];
			// if rawValue is a string, make an array otherwise just reference the array
			rawValue = (typeof rawValue == "string") ? [rawValue] : rawValue;
			
			var value = options.formatMatch(rawValue, i+1, options.data.length);
			if ( value === false )
				continue;
				
			var firstChar = value.charAt(0).toLowerCase();
			// if no lookup array for this character exists, look it up now
			if( !stMatchSets[firstChar] ) 
				stMatchSets[firstChar] = [];

			// if the match is a string
			var row = {
				value: value,
				data: rawValue,
				result: options.formatResult && options.formatResult(rawValue) || value
			};
			
			// push the current match into the set list
			stMatchSets[firstChar].push(row);

			// keep track of minChars zero items
			if ( nullData++ < options.max ) {
				stMatchSets[""].push(row);
			}
		};

		// add the data items to the cache
		$.each(stMatchSets, function(i, value) {
			// increase the cache size
			options.cacheLength++;
			// add to the cache
			add(i, value);
		});
	}
	
	// populate any existing data
	setTimeout(populate, 25);
	
	function flush(){
		data = {};
		length = 0;
	}
	
	return {
		flush: flush,
		add: add,
		populate: populate,
		load: function(q) {
			if (!options.cacheLength || !length)
				return null;
			/* 
			 * if dealing w/local data and matchContains than we must make sure
			 * to loop through all the data collections looking for matches
			 */
			if( !options.url && options.matchContains ){
				// track all matches
				var csub = [];
				// loop through all the data grids for matches
				for( var k in data ){
					// don't search through the stMatchSets[""] (minChars: 0) cache
					// this prevents duplicates
					if( k.length > 0 ){
						var c = data[k];
						$.each(c, function(i, x) {
							// if we've got a match, add it to the array
							if (matchSubset(x.value, q)) {
								csub.push(x);
							}
						});
					}
				}				
				return csub;
			} else 
			// if the exact item exists, use it
			if (data[q]){
				return data[q];
			} else
			if (options.matchSubset) {
				for (var i = q.length - 1; i >= options.minChars; i--) {
					var c = data[q.substr(0, i)];
					if (c) {
						var csub = [];
						$.each(c, function(i, x) {
							if (matchSubset(x.value, q)) {
								csub[csub.length] = x;
							}
						});
						return csub;
					}
				}
			}
			return null;
		}
	};
};

$.Autocompleter.Select = function (options, input, select, config) {
	var CLASSES = {
		ACTIVE: "ac_over"
	};
	
	var listItems,
		active = -1,
		data,
		term = "",
		needsInit = true,
		element,
		list;
	
	// Create results
	function init() {
		if (!needsInit)
			return;
		element = $("<div/>")
		.hide()
		.addClass(options.resultsClass)
		.css("position", "absolute")
		.appendTo(document.body);
	
		list = $("<ul/>").appendTo(element).mouseover( function(event) {
			if(target(event).nodeName && target(event).nodeName.toUpperCase() == 'LI') {
	            active = $("li", list).removeClass(CLASSES.ACTIVE).index(target(event));
			    $(target(event)).addClass(CLASSES.ACTIVE);            
	        }
		}).click(function(event) {
			$(target(event)).addClass(CLASSES.ACTIVE);
			select();
			// TODO provide option to avoid setting focus again after selection? useful for cleanup-on-focus
			input.focus();
			return false;
		}).mousedown(function() {
			config.mouseDownOnSelect = true;
		}).mouseup(function() {
			config.mouseDownOnSelect = false;
		});
		
		if( options.width > 0 )
			element.css("width", options.width);
			
		needsInit = false;
	} 
	
	function target(event) {
		var element = event.target;
		while(element && element.tagName != "LI")
			element = element.parentNode;
		// more fun with IE, sometimes event.target is empty, just ignore it then
		if(!element)
			return [];
		return element;
	}

	function moveSelect(step) {
		listItems.slice(active, active + 1).removeClass(CLASSES.ACTIVE);
		movePosition(step);
        var activeItem = listItems.slice(active, active + 1).addClass(CLASSES.ACTIVE);
        if(options.scroll) {
            var offset = 0;
            listItems.slice(0, active).each(function() {
				offset += this.offsetHeight;
			});
            if((offset + activeItem[0].offsetHeight - list.scrollTop()) > list[0].clientHeight) {
                list.scrollTop(offset + activeItem[0].offsetHeight - list.innerHeight());
                list.scrollTop(offset);
            } else if(offset < list.scrollTop()) {
                list.scrollTop(offset);
            }
        }
	};
	
	function movePosition(step) {
		active += step;
		if (active < 0) {
			active = listItems.size() - 1;
		} else if (active >= listItems.size()) {
			active = 0;
		}
	}
	
	function limitNumberOfItems(available) {
		return options.max && options.max < available
			? options.max
			: available;
	}
	
	function fillList() {
		list.empty();
		var max = limitNumberOfItems(data.length);
		for (var i=0; i < max; i++) {
			if (!data[i])
				continue;
			var formatted = options.formatItem(data[i].data, i+1, max, data[i].value, term);
			if ( formatted === false )
				continue;
			var li = $("<li/>").html( options.highlight(formatted, term) ).addClass(i%2 == 0 ? "ac_even" : "ac_even").appendTo(list)[0];
			$.data(li, "ac_data", data[i]);
		}
		listItems = list.find("li");
		if ( options.selectFirst ) {
			listItems.slice(0, 1).addClass(CLASSES.ACTIVE);
			active = 0;
		}
		// apply bgiframe if available
		if ( $.fn.bgiframe )
			list.bgiframe();
	}
	
	return {
		display: function(d, q) {
			init();
			data = d;
			term = q;
			fillList();
		},
		next: function() {
			moveSelect(1);
		},
		prev: function() {
			moveSelect(-1);
		},
		pageUp: function() {
			if (active != 0 && active - 8 < 0) {
				moveSelect( -active );
			} else {
				moveSelect(-8);
			}
		},
		pageDown: function() {
			if (active != listItems.size() - 1 && active + 8 > listItems.size()) {
				moveSelect( listItems.size() - 1 - active );
			} else {
				moveSelect(8);
			}
		},
		hide: function() {
			element && element.hide();
			listItems && listItems.removeClass(CLASSES.ACTIVE);
			active = -1;
		},
		visible : function() {
			return element && element.is(":visible");
		},
		current: function() {
			return this.visible() && (listItems.filter("." + CLASSES.ACTIVE)[0] || options.selectFirst && listItems[0]);
		},
		show: function() {
			var offset = $(input).offset();
			element.css({
				width: typeof options.width == "string" || options.width > 0 ? options.width : $(input).width(),
				top: offset.top + input.offsetHeight,
				left: offset.left
			}).show();
            if(options.scroll) {
                list.scrollTop(0);
                list.css({
					maxHeight: options.scrollHeight,
					overflow: 'auto'
				});
				
                if($.browser.msie && typeof document.body.style.maxHeight === "undefined") {
					var listHeight = 0;
					listItems.each(function() {
						listHeight += this.offsetHeight;
					});
					var scrollbarsVisible = listHeight > options.scrollHeight;
                    list.css('height', scrollbarsVisible ? options.scrollHeight : listHeight );//pramod
					if (!scrollbarsVisible) {
						// IE doesn't recalculate width when scrollbar disappears
						listItems.width( list.width() - parseInt(listItems.css("padding-left")) - parseInt(listItems.css("padding-right")) );
					}
                }
                
            }
		},
		selected: function() {
			var selected = listItems && listItems.filter("." + CLASSES.ACTIVE).removeClass(CLASSES.ACTIVE);
			return selected && selected.length && $.data(selected[0], "ac_data");
		},
		emptyList: function (){
			list && list.empty();
		},
		unbind: function() {
			element && element.remove();
		}
	};
};

$.fn.selection = function(start, end) {
	if (start !== undefined) {
		return this.each(function() {
			if( this.createTextRange ){
				var selRange = this.createTextRange();
				if (end === undefined || start == end) {
					selRange.move("character", start);
					selRange.select();
				} else {
					selRange.collapse(true);
					selRange.moveStart("character", start);
					selRange.moveEnd("character", end);
					selRange.select();
				}
			} else if( this.setSelectionRange ){
				this.setSelectionRange(start, end);
			} else if( this.selectionStart ){
				this.selectionStart = start;
				this.selectionEnd = end;
			}
		});
	}
	var field = this[0];
	if ( field.createTextRange ) {
		var range = document.selection.createRange(),
			orig = field.value,
			teststring = "<->",
			textLength = range.text.length;
		range.text = teststring;
		var caretAt = field.value.indexOf(teststring);
		field.value = orig;
		this.selection(caretAt, caretAt + textLength);
		return {
			start: caretAt,
			end: caretAt + textLength
		}
	} else if( field.selectionStart !== undefined ){
		return {
			start: field.selectionStart,
			end: field.selectionEnd
		}
	}
};

})(jQuery);

/**
 * plupload.js
 *
 * Copyright 2009, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 */

// JSLint defined globals
/*global window:false, escape:false */

/*!@@version@@*/

(function() {
	var count = 0, runtimes = [], i18n = {}, mimes = {},
		xmlEncodeChars = {'<' : 'lt', '>' : 'gt', '&' : 'amp', '"' : 'quot', '\'' : '#39'},
		xmlEncodeRegExp = /[<>&\"\']/g, undef, delay = window.setTimeout,
		// A place to store references to event handlers
		eventhash = {},
		uid;

	// IE W3C like event funcs
	function preventDefault() {
		this.returnValue = false;
	}

	function stopPropagation() {
		this.cancelBubble = true;
	}

	// Parses the default mime types string into a mimes lookup map
	(function(mime_data) {
		var items = mime_data.split(/,/), i, y, ext;

		for (i = 0; i < items.length; i += 2) {
			ext = items[i + 1].split(/ /);

			for (y = 0; y < ext.length; y++) {
				mimes[ext[y]] = items[i];
			}
		}
	})(
		"application/msword,doc dot," +
		"application/pdf,pdf," +
		"application/pgp-signature,pgp," +
		"application/postscript,ps ai eps," +
		"application/rtf,rtf," +
		"application/vnd.ms-excel,xls xlb," +
		"application/vnd.ms-powerpoint,ppt pps pot," +
		"application/zip,zip," +
		"application/x-shockwave-flash,swf swfl," +
		"application/vnd.openxmlformats,docx pptx xlsx," +
		"audio/mpeg,mpga mpega mp2 mp3," +
		"audio/x-wav,wav," +
		"audio/mp4,m4a," +
		"image/bmp,bmp," +
		"image/gif,gif," +
		"image/jpeg,jpeg jpg jpe," +
		"image/png,png," +
		"image/svg+xml,svg svgz," +
		"image/tiff,tiff tif," +
		"text/html,htm html xhtml," +
		"text/rtf,rtf," +
		"video/mpeg,mpeg mpg mpe," +
		"video/quicktime,qt mov," +
		"video/mp4,mp4," +
		"video/x-m4v,m4v," +
		"video/x-flv,flv," +
		"video/vnd.rn-realvideo,rv," +
		"text/csv,csv," +
		"text/plain,asc txt text diff log," +
		"application/octet-stream,exe"
	);

	/**
	 * Plupload class with some global constants and functions.
	 *
	 * @example
	 * // Encode entities
	 * console.log(plupload.xmlEncode("My string &lt;&gt;"));
	 *
	 * // Generate unique id
	 * console.log(plupload.guid());
	 *
	 * @static
	 * @class plupload
	 */
	var plupload = {
		/**
		 * Plupload version will be replaced on build.
		 */
		VERSION : '@@version@@',

		/**
		 * Inital state of the queue and also the state ones it's finished all it's uploads.
		 *
		 * @property STOPPED
		 * @final
		 */
		STOPPED : 1,

		/**
		 * Upload process is running
		 *
		 * @property STARTED
		 * @final
		 */
		STARTED : 2,

		/**
		 * File is queued for upload
		 *
		 * @property QUEUED
		 * @final
		 */
		QUEUED : 1,

		/**
		 * File is being uploaded
		 *
		 * @property UPLOADING
		 * @final
		 */
		UPLOADING : 2,

		/**
		 * File has failed to be uploaded
		 *
		 * @property FAILED
		 * @final
		 */
		FAILED : 4,

		/**
		 * File has been uploaded successfully
		 *
		 * @property DONE
		 * @final
		 */
		DONE : 5,

		// Error constants used by the Error event

		/**
		 * Generic error for example if an exception is thrown inside Silverlight.
		 *
		 * @property GENERIC_ERROR
		 * @final
		 */
		GENERIC_ERROR : -100,

		/**
		 * HTTP transport error. For example if the server produces a HTTP status other than 200.
		 *
		 * @property HTTP_ERROR
		 * @final
		 */
		HTTP_ERROR : -200,

		/**
		 * Generic I/O error. For exampe if it wasn't possible to open the file stream on local machine.
		 *
		 * @property IO_ERROR
		 * @final
		 */
		IO_ERROR : -300,

		/**
		 * Generic I/O error. For exampe if it wasn't possible to open the file stream on local machine.
		 *
		 * @property SECURITY_ERROR
		 * @final
		 */
		SECURITY_ERROR : -400,

		/**
		 * Initialization error. Will be triggered if no runtime was initialized.
		 *
		 * @property INIT_ERROR
		 * @final
		 */
		INIT_ERROR : -500,

		/**
		 * File size error. If the user selects a file that is to large it will be blocked and an error of this type will be triggered.
		 *
		 * @property FILE_SIZE_ERROR
		 * @final
		 */
		FILE_SIZE_ERROR : -600,

		/**
		 * File extension error. If the user selects a file that isn't valid according to the filters setting.
		 *
		 * @property FILE_EXTENSION_ERROR
		 * @final
		 */
		FILE_EXTENSION_ERROR : -601,

		/**
		 * Runtime will try to detect if image is proper one. Otherwise will throw this error.
		 *
		 * @property IMAGE_FORMAT_ERROR
		 * @final
		 */
		IMAGE_FORMAT_ERROR : -700,

		/**
		 * While working on the image runtime will try to detect if the operation may potentially run out of memeory and will throw this error.
		 *
		 * @property IMAGE_MEMORY_ERROR
		 * @final
		 */
		IMAGE_MEMORY_ERROR : -701,

		/**
		 * Each runtime has an upper limit on a dimension of the image it can handle. If bigger, will throw this error.
		 *
		 * @property IMAGE_DIMENSIONS_ERROR
		 * @final
		 */
		IMAGE_DIMENSIONS_ERROR : -702,


		/**
		 * Mime type lookup table.
		 *
		 * @property mimeTypes
		 * @type Object
		 * @final
		 */
		mimeTypes : mimes,

		/**
		 * Extends the specified object with another object.
		 *
		 * @method extend
		 * @param {Object} target Object to extend.
		 * @param {Object..} obj Multiple objects to extend with.
		 * @return {Object} Same as target, the extended object.
		 */
		extend : function(target) {
			plupload.each(arguments, function(arg, i) {
				if (i > 0) {
					plupload.each(arg, function(value, key) {
						target[key] = value;
					});
				}
			});

			return target;
		},

		/**
		 * Cleans the specified name from national characters (diacritics). The result will be a name with only a-z, 0-9 and _.
		 *
		 * @method cleanName
		 * @param {String} s String to clean up.
		 * @return {String} Cleaned string.
		 */
		cleanName : function(name) {
			var i, lookup;

			// Replace diacritics
			lookup = [
				/[\300-\306]/g, 'A', /[\340-\346]/g, 'a', 
				/\307/g, 'C', /\347/g, 'c',
				/[\310-\313]/g, 'E', /[\350-\353]/g, 'e',
				/[\314-\317]/g, 'I', /[\354-\357]/g, 'i',
				/\321/g, 'N', /\361/g, 'n',
				/[\322-\330]/g, 'O', /[\362-\370]/g, 'o',
				/[\331-\334]/g, 'U', /[\371-\374]/g, 'u'
			];

			for (i = 0; i < lookup.length; i += 2) {
				name = name.replace(lookup[i], lookup[i + 1]);
			}

			// Replace whitespace
			name = name.replace(/\s+/g, '_');

			// Remove anything else
			name = name.replace(/[^a-z0-9_\-\.]+/gi, '');

			return name;
		},

		/**
		 * Adds a specific upload runtime like for example flash or gears.
		 *
		 * @method addRuntime
		 * @param {String} name Runtime name for example flash.
		 * @param {Object} obj Object containing init/destroy method.
		 */
		addRuntime : function(name, runtime) {			
			runtime.name = name;
			runtimes[name] = runtime;
			runtimes.push(runtime);

			return runtime;
		},

		/**
		 * Generates an unique ID. This is 99.99% unique since it takes the current time and 5 random numbers.
		 * The only way a user would be able to get the same ID is if the two persons at the same exact milisecond manages
		 * to get 5 the same random numbers between 0-65535 it also uses a counter so each call will be guaranteed to be page unique.
		 * It's more probable for the earth to be hit with an ansteriod. You can also if you want to be 100% sure set the plupload.guidPrefix property
		 * to an user unique key.
		 *
		 * @method guid
		 * @return {String} Virtually unique id.
		 */
		guid : function() {
			var guid = new Date().getTime().toString(32), i;

			for (i = 0; i < 5; i++) {
				guid += Math.floor(Math.random() * 65535).toString(32);
			}

			return (plupload.guidPrefix || 'p') + guid + (count++).toString(32);
		},

		/**
		 * Builds a full url out of a base URL and an object with items to append as query string items.
		 *
		 * @param {String} url Base URL to append query string items to.
		 * @param {Object} items Name/value object to serialize as a querystring.
		 * @return {String} String with url + serialized query string items.
		 */
		buildUrl : function(url, items) {
			var query = '';

			plupload.each(items, function(value, name) {
				query += (query ? '&' : '') + encodeURIComponent(name) + '=' + encodeURIComponent(value);
			});

			if (query) {
				url += (url.indexOf('?') > 0 ? '&' : '?') + query;
			}

			return url;
		},

		/**
		 * Executes the callback function for each item in array/object. If you return false in the
		 * callback it will break the loop.
		 *
		 * @param {Object} obj Object to iterate.
		 * @param {function} callback Callback function to execute for each item.
		 */
		each : function(obj, callback) {
			var length, key, i;

			if (obj) {
				length = obj.length;

				if (length === undef) {
					// Loop object items
					for (key in obj) {
						if (obj.hasOwnProperty(key)) {
							if (callback(obj[key], key) === false) {
								return;
							}
						}
					}
				} else {
					// Loop array items
					for (i = 0; i < length; i++) {
						if (callback(obj[i], i) === false) {
							return;
						}
					}
				}
			}
		},

		/**
		 * Formats the specified number as a size string for example 1024 becomes 1 KB.
		 *
		 * @method formatSize
		 * @param {Number} size Size to format as string.
		 * @return {String} Formatted size string.
		 */
		formatSize : function(size) {
			if (size === undef || /\D/.test(size)) {
				return plupload.translate('N/A');
			}

			// GB
			if (size > 1073741824) {
				return Math.round(size / 1073741824, 1) + " GB";
			}

			// MB
			if (size > 1048576) {
				return Math.round(size / 1048576, 1) + " MB";
			}

			// KB
			if (size > 1024) {
				return Math.round(size / 1024, 1) + " KB";
			}

			return size + " b";
		},

		/**
		 * Returns the absolute x, y position of an Element. The position will be returned in a object with x, y fields.
		 *
		 * @method getPos
		 * @param {Element} node HTML element or element id to get x, y position from.
		 * @param {Element} root Optional root element to stop calculations at.
		 * @return {object} Absolute position of the specified element object with x, y fields.
		 */
		 getPos : function(node, root) {
			var x = 0, y = 0, parent, doc = document, nodeRect, rootRect;

			node = node;
			root = root || doc.body;

			// Returns the x, y cordinate for an element on IE 6 and IE 7
			function getIEPos(node) {
				var bodyElm, rect, x = 0, y = 0;

				if (node) {
					rect = node.getBoundingClientRect();
					bodyElm = doc.compatMode === "CSS1Compat" ? doc.documentElement : doc.body;
					x = rect.left + bodyElm.scrollLeft;
					y = rect.top + bodyElm.scrollTop;
				}

				return {
					x : x,
					y : y
				};
			}

			// Use getBoundingClientRect on IE 6 and IE 7 but not on IE 8 in standards mode
			if (node && node.getBoundingClientRect && (navigator.userAgent.indexOf('MSIE') > 0 && doc.documentMode !== 8)) {
				nodeRect = getIEPos(node);
				rootRect = getIEPos(root);

				return {
					x : nodeRect.x - rootRect.x,
					y : nodeRect.y - rootRect.y
				};
			}

			parent = node;
			while (parent && parent != root && parent.nodeType) {
				x += parent.offsetLeft || 0;
				y += parent.offsetTop || 0;
				parent = parent.offsetParent;
			}

			parent = node.parentNode;
			while (parent && parent != root && parent.nodeType) {
				x -= parent.scrollLeft || 0;
				y -= parent.scrollTop || 0;
				parent = parent.parentNode;
			}

			return {
				x : x,
				y : y
			};
		},

		/**
		 * Returns the size of the specified node in pixels.
		 *
		 * @param {Node} node Node to get the size of.
		 * @return {Object} Object with a w and h property.
		 */
		getSize : function(node) {
			return {
				w : node.offsetWidth || node.clientWidth,
				h : node.offsetHeight || node.clientHeight
			};
		},

		/**
		 * Parses the specified size string into a byte value. For example 10kb becomes 10240.
		 *
		 * @method parseSize
		 * @param {String/Number} size String to parse or number to just pass through.
		 * @return {Number} Size in bytes.
		 */
		parseSize : function(size) {
			var mul;

			if (typeof(size) == 'string') {
				size = /^([0-9]+)([mgk]+)$/.exec(size.toLowerCase().replace(/[^0-9mkg]/g, ''));
				mul = size[2];
				size = +size[1];

				if (mul == 'g') {
					size *= 1073741824;
				}

				if (mul == 'm') {
					size *= 1048576;
				}

				if (mul == 'k') {
					size *= 1024;
				}
			}

			return size;
		},

		/**
		 * Encodes the specified string.
		 *
		 * @method xmlEncode
		 * @param {String} s String to encode.
		 * @return {String} Encoded string.
		 */
		xmlEncode : function(str) {
			return str ? ('' + str).replace(xmlEncodeRegExp, function(chr) {
				return xmlEncodeChars[chr] ? '&' + xmlEncodeChars[chr] + ';' : chr;
			}) : str;
		},

		/**
		 * Forces anything into an array.
		 *
		 * @method toArray
		 * @param {Object} obj Object with length field.
		 * @return {Array} Array object containing all items.
		 */
		toArray : function(obj) {
			var i, arr = [];

			for (i = 0; i < obj.length; i++) {
				arr[i] = obj[i];
			}

			return arr;
		},

		/**
		 * Extends the language pack object with new items.
		 *
		 * @param {Object} pack Language pack items to add.
		 * @return {Object} Extended language pack object.
		 */
		addI18n : function(pack) {
			return plupload.extend(i18n, pack);
		},

		/**
		 * Translates the specified string by checking for the english string in the language pack lookup.
		 *
		 * @param {String} str String to look for.
		 * @return {String} Translated string or the input string if it wasn't found.
		 */
		translate : function(str) {
			return i18n[str] || str;
		},

		/**
		 * Checks if object is empty.
		 *
		 * @param {Object} obj Object to check.
		 * @return {Boolean}
		 */
		isEmptyObj : function(obj) {
			if (obj === undef) return true;

			for (var prop in obj) {
				return false;	
			}
			return true;
		},

		/**
		 * Checks if specified DOM element has specified class.
		 *
		 * @param {Object} obj DOM element like object to add handler to.
		 * @param {String} name Class name
		 */
		hasClass : function(obj, name) {
			var regExp;

			if (obj.className == '') {
				return false;
			}

			regExp = new RegExp("(^|\\s+)"+name+"(\\s+|$)");

			return regExp.test(obj.className);
		},

		/**
		 * Adds specified className to specified DOM element.
		 *
		 * @param {Object} obj DOM element like object to add handler to.
		 * @param {String} name Class name
		 */
		addClass : function(obj, name) {
			if (!plupload.hasClass(obj, name)) {
				obj.className = obj.className == '' ? name : obj.className.replace(/\s+$/, '')+' '+name;
			}
		},

		/**
		 * Removes specified className from specified DOM element.
		 *
		 * @param {Object} obj DOM element like object to add handler to.
		 * @param {String} name Class name
		 */
		removeClass : function(obj, name) {
			var regExp = new RegExp("(^|\\s+)"+name+"(\\s+|$)");

			obj.className = obj.className.replace(regExp, function($0, $1, $2) {
				return $1 === ' ' && $2 === ' ' ? ' ' : '';
			});
		},
    
		/**
		 * Returns a given computed style of a DOM element.
		 *
		 * @param {Object} obj DOM element like object.
		 * @param {String} name Style you want to get from the DOM element
		 */
		getStyle : function(obj, name) {
			if (obj.currentStyle) {
				return obj.currentStyle[name];
			} else if (window.getComputedStyle) {
				return window.getComputedStyle(obj, null)[name];
			}
		},

		/**
		 * Adds an event handler to the specified object and store reference to the handler
		 * in objects internal Plupload registry (@see removeEvent).
		 *
		 * @param {Object} obj DOM element like object to add handler to.
		 * @param {String} name Name to add event listener to.
		 * @param {Function} callback Function to call when event occurs.
		 * @param {String} (optional) key that might be used to add specifity to the event record.
		 */
		addEvent : function(obj, name, callback) {
			var func, events, types, key;

			// if passed in, event will be locked with this key - one would need to provide it to removeEvent
			key = arguments[3];

			name = name.toLowerCase();

			// Initialize unique identifier if needed
			if (uid === undef) {
				uid = 'Plupload_' + plupload.guid();
			}

			// Add event listener
			if (obj.attachEvent) {

				func = function() {
					var evt = window.event;

					if (!evt.target) {
						evt.target = evt.srcElement;
					}

					evt.preventDefault = preventDefault;
					evt.stopPropagation = stopPropagation;

					callback(evt);
				};
				obj.attachEvent('on' + name, func);

			} else if (obj.addEventListener) {
				func = callback;

				obj.addEventListener(name, func, false);
			}

			// Log event handler to objects internal Plupload registry
			if (obj[uid] === undef) {
				obj[uid] = plupload.guid();
			}

			if (!eventhash.hasOwnProperty(obj[uid])) {
				eventhash[obj[uid]] = {};
			}

			events = eventhash[obj[uid]];

			if (!events.hasOwnProperty(name)) {
				events[name] = [];
			}

			events[name].push({
				func: func,
				orig: callback, // store original callback for IE
				key: key
			});
		},


		/**
		 * Remove event handler from the specified object. If third argument (callback)
		 * is not specified remove all events with the specified name.
		 *
		 * @param {Object} obj DOM element to remove event listener(s) from.
		 * @param {String} name Name of event listener to remove.
		 * @param {Function|String} (optional) might be a callback or unique key to match.
		 */
		removeEvent: function(obj, name) {
			var type, callback, key;

			// match the handler either by callback or by key	
			if (typeof(arguments[2]) == "function") {
				callback = arguments[2];
			} else {
				key = arguments[2];
			}

			name = name.toLowerCase();

			if (obj[uid] && eventhash[obj[uid]] && eventhash[obj[uid]][name]) {
				type = eventhash[obj[uid]][name];
			} else {
				return;
			}


			for (var i=type.length-1; i>=0; i--) {
				// undefined or not, key should match			
				if (type[i].key === key || type[i].orig === callback) {

					if (obj.detachEvent) {
						obj.detachEvent('on'+name, type[i].func);
					} else if (obj.removeEventListener) {
						obj.removeEventListener(name, type[i].func, false);		
					}

					type[i].orig = null;
					type[i].func = null;

					type.splice(i, 1);

					// If callback was passed we are done here, otherwise proceed
					if (callback !== undef) {
						break;
					}
				}			
			}	

			// If event array got empty, remove it
			if (!type.length) {
				delete eventhash[obj[uid]][name];
			}

			// If Plupload registry has become empty, remove it
			if (plupload.isEmptyObj(eventhash[obj[uid]])) {
				delete eventhash[obj[uid]];

				// IE doesn't let you remove DOM object property with - delete
				try {
					delete obj[uid];
				} catch(e) {
					obj[uid] = undef;
				}
			}
		},


		/**
		 * Remove all kind of events from the specified object
		 *
		 * @param {Object} obj DOM element to remove event listeners from.
		 * @param {String} (optional) unique key to match, when removing events.
		 */
		removeAllEvents: function(obj) {
			var key = arguments[1];

			if (obj[uid] === undef || !obj[uid]) {
				return;
			}

			plupload.each(eventhash[obj[uid]], function(events, name) {
				plupload.removeEvent(obj, name, key);
			});		
		}		
	};


	/**
	 * Uploader class, an instance of this class will be created for each upload field.
	 *
	 * @example
	 * var uploader = new plupload.Uploader({
	 *     runtimes : 'gears,html5,flash',
	 *     browse_button : 'button_id'
	 * });
	 *
	 * uploader.bind('Init', function(up) {
	 *     alert('Supports drag/drop: ' + (!!up.features.dragdrop));
	 * });
	 *
	 * uploader.bind('FilesAdded', function(up, files) {
	 *     alert('Selected files: ' + files.length);
	 * });
	 *
	 * uploader.bind('QueueChanged', function(up) {
	 *     alert('Queued files: ' + uploader.files.length);
	 * });
	 *
	 * uploader.init();
	 *
	 * @class plupload.Uploader
	 */

	/**
	 * Constructs a new uploader instance.
	 *
	 * @constructor
	 * @method Uploader
	 * @param {Object} settings Initialization settings, to be used by the uploader instance and runtimes.
	 */
	plupload.Uploader = function(settings) {
		var events = {}, total, files = [], startTime;

		// Inital total state
		total = new plupload.QueueProgress();

		// Default settings
		settings = plupload.extend({
			chunk_size : 0,
			multipart : true,
			multi_selection : true,
			file_data_name : 'file',
			filters : []
		}, settings);

		// Private methods
		function uploadNext() {
			var file, count = 0, i;

			if (this.state == plupload.STARTED) {
				// Find first QUEUED file
				for (i = 0; i < files.length; i++) {
					if (!file && files[i].status == plupload.QUEUED) {
						file = files[i];
						file.status = plupload.UPLOADING;
						this.trigger("BeforeUpload", file);
						this.trigger("UploadFile", file);
					} else {
						count++;
					}
				}

				// All files are DONE or FAILED
				if (count == files.length) {
					this.trigger("UploadComplete", files);
					this.stop();
				}
			}
		}

		function calc() {
			var i, file;

			// Reset stats
			total.reset();

			// Check status, size, loaded etc on all files
			for (i = 0; i < files.length; i++) {
				file = files[i];

				if (file.size !== undef) {
					total.size += file.size;
					total.loaded += file.loaded;
				} else {
					total.size = undef;
				}

				if (file.status == plupload.DONE) {
					total.uploaded++;
				} else if (file.status == plupload.FAILED) {
					total.failed++;
				} else {
					total.queued++;
				}
			}

			// If we couldn't calculate a total file size then use the number of files to calc percent
			if (total.size === undef) {
				total.percent = files.length > 0 ? Math.ceil(total.uploaded / files.length * 100) : 0;
			} else {
				total.bytesPerSec = Math.ceil(total.loaded / ((+new Date() - startTime || 1) / 1000.0));
				total.percent = total.size > 0 ? Math.ceil(total.loaded / total.size * 100) : 0;
			}
		}

		// Add public methods
		plupload.extend(this, {
			/**
			 * Current state of the total uploading progress. This one can either be plupload.STARTED or plupload.STOPPED.
			 * These states are controlled by the stop/start methods. The default value is STOPPED.
			 *
			 * @property state
			 * @type Number
			 */
			state : plupload.STOPPED,

			/**
			 * Current runtime name.
			 *
			 * @property runtime
			 * @type String
			 */
			runtime: '',

			/**
			 * Map of features that are available for the uploader runtime. Features will be filled
			 * before the init event is called, these features can then be used to alter the UI for the end user.
			 * Some of the current features that might be in this map is: dragdrop, chunks, jpgresize, pngresize.
			 *
			 * @property features
			 * @type Object
			 */
			features : {},

			/**
			 * Current upload queue, an array of File instances.
			 *
			 * @property files
			 * @type Array
			 * @see plupload.File
			 */
			files : files,

			/**
			 * Object with name/value settings.
			 *
			 * @property settings
			 * @type Object
			 */
			settings : settings,

			/**
			 * Total progess information. How many files has been uploaded, total percent etc.
			 *
			 * @property total
			 * @type plupload.QueueProgress
			 */
			total : total,

			/**
			 * Unique id for the Uploader instance.
			 *
			 * @property id
			 * @type String
			 */
			id : plupload.guid(),

			/**
			 * Initializes the Uploader instance and adds internal event listeners.
			 *
			 * @method init
			 */
			init : function() {
				var self = this, i, runtimeList, a, runTimeIndex = 0, items;

				if (typeof(settings.preinit) == "function") {
					settings.preinit(self);
				} else {
					plupload.each(settings.preinit, function(func, name) {
						self.bind(name, func);
					});
				}

				settings.page_url = settings.page_url || document.location.pathname.replace(/\/[^\/]+$/g, '/');

				// If url is relative force it absolute to the current page
				if (!/^(\w+:\/\/|\/)/.test(settings.url)) {
					settings.url = settings.page_url + settings.url;
				}

				// Convert settings
				settings.chunk_size = plupload.parseSize(settings.chunk_size);
				settings.max_file_size = plupload.parseSize(settings.max_file_size);

				// Add files to queue
				self.bind('FilesAdded', function(up, selected_files) {
					var i, file, count = 0, extensionsRegExp, filters = settings.filters;

					// Convert extensions to regexp
					if (filters && filters.length) {
						extensionsRegExp = [];

						plupload.each(filters, function(filter) {
							plupload.each(filter.extensions.split(/,/), function(ext) {
								if (/^\s*\*\s*$/.test(ext)) {
									extensionsRegExp.push('\\.*');
								} else {
									extensionsRegExp.push('\\.' + ext.replace(new RegExp('[' + ('/^$.*+?|()[]{}\\'.replace(/./g, '\\$&')) + ']', 'g'), '\\$&'));
								}
							});
						});

						extensionsRegExp = new RegExp(extensionsRegExp.join('|') + '$', 'i');
					}

					for (i = 0; i < selected_files.length; i++) {
						file = selected_files[i];
						file.loaded = 0;
						file.percent = 0;
						file.status = plupload.QUEUED;

						// Invalid file extension
						if (extensionsRegExp && !extensionsRegExp.test(file.name)) {
							up.trigger('Error', {
								code : plupload.FILE_EXTENSION_ERROR,
								message : plupload.translate('File extension error.'),
								file : file
							});

							continue;
						}

						// Invalid file size
						if (file.size !== undef && file.size > settings.max_file_size) {
							up.trigger('Error', {
								code : plupload.FILE_SIZE_ERROR,
								message : plupload.translate('File size error.'),
								file : file
							});

							continue;
						}

						// Add valid file to list
						files.push(file);
						count++;
					}

					// Only trigger QueueChanged event if any files where added
					if (count) {
						delay(function() {
							self.trigger("QueueChanged");
							self.refresh();
						}, 1);
					} else {
						return false; // Stop the FilesAdded event from immediate propagation
					}
				});

				// Generate unique target filenames
				if (settings.unique_names) {
					self.bind("UploadFile", function(up, file) {
						var matches = file.name.match(/\.([^.]+)$/), ext = "tmp";

						if (matches) {
							ext = matches[1];
						}

						file.target_name = file.id + '.' + ext;
					});
				}

				self.bind('UploadProgress', function(up, file) {
					file.percent = file.size > 0 ? Math.ceil(file.loaded / file.size * 100) : 100;
					calc();
				});

				self.bind('StateChanged', function(up) {
					if (up.state == plupload.STARTED) {
						// Get start time to calculate bps
						startTime = (+new Date());

					} else if (up.state == plupload.STOPPED) {
						// Reset currently uploading files
						for (i = up.files.length - 1; i >= 0; i--) {
							if (up.files[i].status == plupload.UPLOADING) {
								up.files[i].status = plupload.QUEUED;
								calc();
							}
						}
					}
				});

				self.bind('QueueChanged', calc);

				self.bind("Error", function(up, err) {
					// Set failed status if an error occured on a file
					if (err.file) {
						err.file.status = plupload.FAILED;
						calc();

						// Upload next file but detach it from the error event
						// since other custom listeners might want to stop the queue
						if (up.state == plupload.STARTED) {
							delay(function() {
								uploadNext.call(self);
							}, 1);
						}
					}
				});

				self.bind("FileUploaded", function(up, file) {
					file.status = plupload.DONE;
					file.loaded = file.size;
					up.trigger('UploadProgress', file);

					// Upload next file but detach it from the error event
					// since other custom listeners might want to stop the queue
					delay(function() {
						uploadNext.call(self);
					}, 1);
				});

				// Setup runtimeList
				if (settings.runtimes) {
					runtimeList = [];
					items = settings.runtimes.split(/\s?,\s?/);

					for (i = 0; i < items.length; i++) {
						if (runtimes[items[i]]) {
							runtimeList.push(runtimes[items[i]]);
						}
					}
				} else {
					runtimeList = runtimes;
				}

				// Call init on each runtime in sequence
				function callNextInit() {
					var runtime = runtimeList[runTimeIndex++], features, requiredFeatures, i;

					if (runtime) {
						features = runtime.getFeatures();

						// Check if runtime supports required features
						requiredFeatures = self.settings.required_features;
						if (requiredFeatures) {
							requiredFeatures = requiredFeatures.split(',');

							for (i = 0; i < requiredFeatures.length; i++) {
								// Specified feature doesn't exist
								if (!features[requiredFeatures[i]]) {
									callNextInit();
									return;
								}
							}
						}

						// Try initializing the runtime
						runtime.init(self, function(res) {
							if (res && res.success) {
								// Successful initialization
								self.features = features;
								self.runtime = runtime.name;
								self.trigger('Init', {runtime : runtime.name});
								self.trigger('PostInit');
								self.refresh();
							} else {
								callNextInit();
							}
						});
					} else {
						// Trigger an init error if we run out of runtimes
						self.trigger('Error', {
							code : plupload.INIT_ERROR,
							message : plupload.translate('Init error.')
						});
					}
				}

				callNextInit();

				if (typeof(settings.init) == "function") {
					settings.init(self);
				} else {
					plupload.each(settings.init, function(func, name) {
						self.bind(name, func);
					});
				}
			},

			/**
			 * Refreshes the upload instance by dispatching out a refresh event to all runtimes.
			 * This would for example reposition flash/silverlight shims on the page.
			 *
			 * @method refresh
			 */
			refresh : function() {
				this.trigger("Refresh");
			},

			/**
			 * Starts uploading the queued files.
			 *
			 * @method start
			 */
			start : function() {
				if (this.state != plupload.STARTED) {
					this.state = plupload.STARTED;
					this.trigger("StateChanged");	

					uploadNext.call(this);				
				}
			},

			/**
			 * Stops the upload of the queued files.
			 *
			 * @method stop
			 */
			stop : function() {
				if (this.state != plupload.STOPPED) {
					this.state = plupload.STOPPED;					
					this.trigger("StateChanged");
				}
			},

			/**
			 * Returns the specified file object by id.
			 *
			 * @method getFile
			 * @param {String} id File id to look for.
			 * @return {plupload.File} File object or undefined if it wasn't found;
			 */
			getFile : function(id) {
				var i;

				for (i = files.length - 1; i >= 0; i--) {
					if (files[i].id === id) {
						return files[i];
					}
				}
			},

			/**
			 * Removes a specific file.
			 *
			 * @method removeFile
			 * @param {plupload.File} file File to remove from queue.
			 */
			removeFile : function(file) {
				var i;

				for (i = files.length - 1; i >= 0; i--) {
					if (files[i].id === file.id) {
						return this.splice(i, 1)[0];
					}
				}
			},

			/**
			 * Removes part of the queue and returns the files removed. This will also trigger the FilesRemoved and QueueChanged events.
			 *
			 * @method splice
			 * @param {Number} start (Optional) Start index to remove from.
			 * @param {Number} length (Optional) Lengh of items to remove.
			 * @return {Array} Array of files that was removed.
			 */
			splice : function(start, length) {
				var removed;

				// Splice and trigger events
				removed = files.splice(start === undef ? 0 : start, length === undef ? files.length : length);

				this.trigger("FilesRemoved", removed);
				this.trigger("QueueChanged");

				return removed;
			},

			/**
			 * Dispatches the specified event name and it's arguments to all listeners.
			 *
			 *
			 * @method trigger
			 * @param {String} name Event name to fire.
			 * @param {Object..} Multiple arguments to pass along to the listener functions.
			 */
			trigger : function(name) {
				var list = events[name.toLowerCase()], i, args;

				// console.log(name, arguments);

				if (list) {
					// Replace name with sender in args
					args = Array.prototype.slice.call(arguments);
					args[0] = this;

					// Dispatch event to all listeners
					for (i = 0; i < list.length; i++) {
						// Fire event, break chain if false is returned
						if (list[i].func.apply(list[i].scope, args) === false) {
							return false;
						}
					}
				}

				return true;
			},

			/**
			 * Adds an event listener by name.
			 *
			 * @method bind
			 * @param {String} name Event name to listen for.
			 * @param {function} func Function to call ones the event gets fired.
			 * @param {Object} scope Optional scope to execute the specified function in.
			 */
			bind : function(name, func, scope) {
				var list;

				name = name.toLowerCase();
				list = events[name] || [];
				list.push({func : func, scope : scope || this});
				events[name] = list;
			},

			/**
			 * Removes the specified event listener.
			 *
			 * @method unbind
			 * @param {String} name Name of event to remove.
			 * @param {function} func Function to remove from listener.
			 */
			unbind : function(name) {
				name = name.toLowerCase();

				var list = events[name], i, func = arguments[1];

				if (list) {
					if (func !== undef) {
						for (i = list.length - 1; i >= 0; i--) {
							if (list[i].func === func) {
								list.splice(i, 1);
									break;
							}
						}
					} else {
						list = [];
					}

					// delete event list if it has become empty
					if (!list.length) {
						delete events[name];
					}
				}
			},

			/**
			 * Removes all event listeners.
			 *
			 * @method unbindAll
			 */
			unbindAll : function() {
				var self = this;

				plupload.each(events, function(list, name) {
					self.unbind(name);
				});
			},

			/**
			 * Destroys Plupload instance and cleans after itself.
			 *
			 * @method destroy
			 */
			destroy : function() {							
				this.trigger('Destroy');

				// Clean-up after uploader itself
				this.unbindAll();
			}

			/**
			 * Fires when the current RunTime has been initialized.
			 *
			 * @event Init
			 * @param {plupload.Uploader} uploader Uploader instance sending the event.
			 */

			/**
			 * Fires after the init event incase you need to perform actions there.
			 *
			 * @event PostInit
			 * @param {plupload.Uploader} uploader Uploader instance sending the event.
			 */

			/**
			 * Fires when the silverlight/flash or other shim needs to move.
			 *
			 * @event Refresh
			 * @param {plupload.Uploader} uploader Uploader instance sending the event.
			 */

			/**
			 * Fires when the overall state is being changed for the upload queue.
			 *
			 * @event StateChanged
			 * @param {plupload.Uploader} uploader Uploader instance sending the event.
			 */

			/**
			 * Fires when a file is to be uploaded by the runtime.
			 *
			 * @event UploadFile
			 * @param {plupload.Uploader} uploader Uploader instance sending the event.
			 * @param {plupload.File} file File to be uploaded.
			 */

			/**
			 * Fires when just before a file is uploaded. This event enables you to override settings
			 * on the uploader instance before the file is uploaded.
			 *
			 * @event BeforeUpload
			 * @param {plupload.Uploader} uploader Uploader instance sending the event.
			 * @param {plupload.File} file File to be uploaded.
			 */

			/**
			 * Fires when the file queue is changed. In other words when files are added/removed to the files array of the uploader instance.
			 *
			 * @event QueueChanged
			 * @param {plupload.Uploader} uploader Uploader instance sending the event.
			 */

			/**
			 * Fires while a file is being uploaded. Use this event to update the current file upload progress.
			 *
			 * @event UploadProgress
			 * @param {plupload.Uploader} uploader Uploader instance sending the event.
			 * @param {plupload.File} file File that is currently being uploaded.
			 */

			/**
			 * Fires while a file was removed from queue.
			 *
			 * @event FilesRemoved
			 * @param {plupload.Uploader} uploader Uploader instance sending the event.
			 * @param {Array} files Array of files that got removed.
			 */

			/**
			 * Fires while when the user selects files to upload.
			 *
			 * @event FilesAdded
			 * @param {plupload.Uploader} uploader Uploader instance sending the event.
			 * @param {Array} files Array of file objects that was added to queue/selected by the user.
			 */

			/**
			 * Fires when a file is successfully uploaded.
			 *
			 * @event FileUploaded
			 * @param {plupload.Uploader} uploader Uploader instance sending the event.
			 * @param {plupload.File} file File that was uploaded.
			 * @param {Object} response Object with response properties.
			 */

			/**
			 * Fires when file chunk is uploaded.
			 *
			 * @event ChunkUploaded
			 * @param {plupload.Uploader} uploader Uploader instance sending the event.
			 * @param {plupload.File} file File that the chunk was uploaded for.
			 * @param {Object} response Object with response properties.
			 */

			/**
			 * Fires when all files in a queue are uploaded.
			 *
			 * @event UploadComplete
			 * @param {plupload.Uploader} uploader Uploader instance sending the event.
			 * @param {Array} files Array of file objects that was added to queue/selected by the user.
			 */

			/**
			 * Fires when a error occurs.
			 *
			 * @event Error
			 * @param {plupload.Uploader} uploader Uploader instance sending the event.
			 * @param {Object} error Contains code, message and sometimes file and other details.
			 */

			 /**
			 * Fires when destroy method is called.
			 *
			 * @event Destroy
			 * @param {plupload.Uploader} uploader Uploader instance sending the event.
			 */
		});
	};

	/**
	 * File instance.
	 *
	 * @class plupload.File
	 * @param {String} name Name of the file.
	 * @param {Number} size File size.
	 */

	/**
	 * Constructs a new file instance.
	 *
	 * @constructor
	 * @method File
	 * @param {String} id Unique file id.
	 * @param {String} name File name.
	 * @param {Number} size File size in bytes.
	 */
	plupload.File = function(id, name, size) {
		var self = this; // Setup alias for self to reduce code size when it's compressed

		/**
		 * File id this is a globally unique id for the specific file.
		 *
		 * @property id
		 * @type String
		 */
		self.id = id;

		/**
		 * File name for example "myfile.gif".
		 *
		 * @property name
		 * @type String
		 */
		self.name = name;

		/**
		 * File size in bytes.
		 *
		 * @property size
		 * @type Number
		 */
		self.size = size;

		/**
		 * Number of bytes uploaded of the files total size.
		 *
		 * @property loaded
		 * @type Number
		 */
		self.loaded = 0;

		/**
		 * Number of percentage uploaded of the file.
		 *
		 * @property percent
		 * @type Number
		 */
		self.percent = 0;

		/**
		 * Status constant matching the plupload states QUEUED, UPLOADING, FAILED, DONE.
		 *
		 * @property status
		 * @type Number
		 * @see plupload
		 */
		self.status = 0;
	};

	/**
	 * Runtime class gets implemented by each upload runtime.
	 *
	 * @class plupload.Runtime
	 * @static
	 */
	plupload.Runtime = function() {
		/**
		 * Returns a list of supported features for the runtime.
		 *
		 * @return {Object} Name/value object with supported features.
		 */
		this.getFeatures = function() {
		};

		/**
		 * Initializes the upload runtime. This method should add necessary items to the DOM and register events needed for operation. 
		 *
		 * @method init
		 * @param {plupload.Uploader} uploader Uploader instance that needs to be initialized.
		 * @param {function} callback Callback function to execute when the runtime initializes or fails to initialize. If it succeeds an object with a parameter name success will be set to true.
		 */
		this.init = function(uploader, callback) {
		};
	};

	/**
	 * Runtime class gets implemented by each upload runtime.
	 *
	 * @class plupload.QueueProgress
	 */

	/**
	 * Constructs a queue progress.
	 *
	 * @constructor
	 * @method QueueProgress
	 */
	 plupload.QueueProgress = function() {
		var self = this; // Setup alias for self to reduce code size when it's compressed

		/**
		 * Total queue file size.
		 *
		 * @property size
		 * @type Number
		 */
		self.size = 0;

		/**
		 * Total bytes uploaded.
		 *
		 * @property loaded
		 * @type Number
		 */
		self.loaded = 0;

		/**
		 * Number of files uploaded.
		 *
		 * @property uploaded
		 * @type Number
		 */
		self.uploaded = 0;

		/**
		 * Number of files failed to upload.
		 *
		 * @property failed
		 * @type Number
		 */
		self.failed = 0;

		/**
		 * Number of files yet to be uploaded.
		 *
		 * @property queued
		 * @type Number
		 */
		self.queued = 0;

		/**
		 * Total percent of the uploaded bytes.
		 *
		 * @property percent
		 * @type Number
		 */
		self.percent = 0;

		/**
		 * Bytes uploaded per second.
		 *
		 * @property bytesPerSec
		 * @type Number
		 */
		self.bytesPerSec = 0;

		/**
		 * Resets the progress to it's initial values.
		 *
		 * @method reset
		 */
		self.reset = function() {
			self.size = self.loaded = self.uploaded = self.failed = self.queued = self.percent = self.bytesPerSec = 0;
		};
	};

	// Create runtimes namespace
	plupload.runtimes = {};

	// Expose plupload namespace
	window.plupload = plupload;
})();


/*1.4.3.2*/
(function(){var f=0,l=[],n={},j={},a={"<":"lt",">":"gt","&":"amp",'"':"quot","'":"#39"},m=/[<>&\"\']/g,b,c=window.setTimeout,d={},e;function h(){this.returnValue=false}function k(){this.cancelBubble=true}(function(o){var p=o.split(/,/),q,s,r;for(q=0;q<p.length;q+=2){r=p[q+1].split(/ /);for(s=0;s<r.length;s++){j[r[s]]=p[q]}}})("application/msword,doc dot,application/pdf,pdf,application/pgp-signature,pgp,application/postscript,ps ai eps,application/rtf,rtf,application/vnd.ms-excel,xls xlb,application/vnd.ms-powerpoint,ppt pps pot,application/zip,zip,application/x-shockwave-flash,swf swfl,application/vnd.openxmlformats,docx pptx xlsx,audio/mpeg,mpga mpega mp2 mp3,audio/x-wav,wav,audio/mp4,m4a,image/bmp,bmp,image/gif,gif,image/jpeg,jpeg jpg jpe,image/png,png,image/svg+xml,svg svgz,image/tiff,tiff tif,text/html,htm html xhtml,text/rtf,rtf,video/mpeg,mpeg mpg mpe,video/quicktime,qt mov,video/mp4,mp4,video/x-m4v,m4v,video/x-flv,flv,video/vnd.rn-realvideo,rv,text/plain,asc txt text diff log,application/octet-stream,exe");var g={VERSION:"1.4.3.2",STOPPED:1,STARTED:2,QUEUED:1,UPLOADING:2,FAILED:4,DONE:5,GENERIC_ERROR:-100,HTTP_ERROR:-200,IO_ERROR:-300,SECURITY_ERROR:-400,INIT_ERROR:-500,FILE_SIZE_ERROR:-600,FILE_EXTENSION_ERROR:-601,IMAGE_FORMAT_ERROR:-700,IMAGE_MEMORY_ERROR:-701,IMAGE_DIMENSIONS_ERROR:-702,mimeTypes:j,extend:function(o){g.each(arguments,function(p,q){if(q>0){g.each(p,function(s,r){o[r]=s})}});return o},cleanName:function(o){var p,q;q=[/[\300-\306]/g,"A",/[\340-\346]/g,"a",/\307/g,"C",/\347/g,"c",/[\310-\313]/g,"E",/[\350-\353]/g,"e",/[\314-\317]/g,"I",/[\354-\357]/g,"i",/\321/g,"N",/\361/g,"n",/[\322-\330]/g,"O",/[\362-\370]/g,"o",/[\331-\334]/g,"U",/[\371-\374]/g,"u"];for(p=0;p<q.length;p+=2){o=o.replace(q[p],q[p+1])}o=o.replace(/\s+/g,"_");o=o.replace(/[^a-z0-9_\-\.]+/gi,"");return o},addRuntime:function(o,p){p.name=o;l[o]=p;l.push(p);return p},guid:function(){var o=new Date().getTime().toString(32),p;for(p=0;p<5;p++){o+=Math.floor(Math.random()*65535).toString(32)}return(g.guidPrefix||"p")+o+(f++).toString(32)},buildUrl:function(p,o){var q="";g.each(o,function(s,r){q+=(q?"&":"")+encodeURIComponent(r)+"="+encodeURIComponent(s)});if(q){p+=(p.indexOf("?")>0?"&":"?")+q}return p},each:function(r,s){var q,p,o;if(r){q=r.length;if(q===b){for(p in r){if(r.hasOwnProperty(p)){if(s(r[p],p)===false){return}}}}else{for(o=0;o<q;o++){if(s(r[o],o)===false){return}}}}},formatSize:function(o){if(o===b||/\D/.test(o)){return g.translate("N/A")}if(o>1073741824){return Math.round(o/1073741824,1)+" GB"}if(o>1048576){return Math.round(o/1048576,1)+" MB"}if(o>1024){return Math.round(o/1024,1)+" KB"}return o+" b"},getPos:function(p,t){var u=0,s=0,w,v=document,q,r;p=p;t=t||v.body;function o(C){var A,B,z=0,D=0;if(C){B=C.getBoundingClientRect();A=v.compatMode==="CSS1Compat"?v.documentElement:v.body;z=B.left+A.scrollLeft;D=B.top+A.scrollTop}return{x:z,y:D}}if(p&&p.getBoundingClientRect&&(navigator.userAgent.indexOf("MSIE")>0&&v.documentMode!==8)){q=o(p);r=o(t);return{x:q.x-r.x,y:q.y-r.y}}w=p;while(w&&w!=t&&w.nodeType){u+=w.offsetLeft||0;s+=w.offsetTop||0;w=w.offsetParent}w=p.parentNode;while(w&&w!=t&&w.nodeType){u-=w.scrollLeft||0;s-=w.scrollTop||0;w=w.parentNode}return{x:u,y:s}},getSize:function(o){return{w:o.offsetWidth||o.clientWidth,h:o.offsetHeight||o.clientHeight}},parseSize:function(o){var p;if(typeof(o)=="string"){o=/^([0-9]+)([mgk]+)$/.exec(o.toLowerCase().replace(/[^0-9mkg]/g,""));p=o[2];o=+o[1];if(p=="g"){o*=1073741824}if(p=="m"){o*=1048576}if(p=="k"){o*=1024}}return o},xmlEncode:function(o){return o?(""+o).replace(m,function(p){return a[p]?"&"+a[p]+";":p}):o},toArray:function(q){var p,o=[];for(p=0;p<q.length;p++){o[p]=q[p]}return o},addI18n:function(o){return g.extend(n,o)},translate:function(o){return n[o]||o},isEmptyObj:function(o){if(o===b){return true}for(var p in o){return false}return true},hasClass:function(q,p){var o;if(q.className==""){return false}o=new RegExp("(^|\\s+)"+p+"(\\s+|$)");return o.test(q.className)},addClass:function(p,o){if(!g.hasClass(p,o)){p.className=p.className==""?o:p.className.replace(/\s+$/,"")+" "+o}},removeClass:function(q,p){var o=new RegExp("(^|\\s+)"+p+"(\\s+|$)");q.className=q.className.replace(o,function(s,r,t){return r===" "&&t===" "?" ":""})},getStyle:function(p,o){if(p.currentStyle){return p.currentStyle[o]}else{if(window.getComputedStyle){return window.getComputedStyle(p,null)[o]}}},addEvent:function(t,o,u){var s,r,q,p;p=arguments[3];o=o.toLowerCase();if(e===b){e="Plupload_"+g.guid()}if(t.attachEvent){s=function(){var v=window.event;if(!v.target){v.target=v.srcElement}v.preventDefault=h;v.stopPropagation=k;u(v)};t.attachEvent("on"+o,s)}else{if(t.addEventListener){s=u;t.addEventListener(o,s,false)}}if(t[e]===b){t[e]=g.guid()}if(!d.hasOwnProperty(t[e])){d[t[e]]={}}r=d[t[e]];if(!r.hasOwnProperty(o)){r[o]=[]}r[o].push({func:s,orig:u,key:p})},removeEvent:function(t,o){var r,u,q;if(typeof(arguments[2])=="function"){u=arguments[2]}else{q=arguments[2]}o=o.toLowerCase();if(t[e]&&d[t[e]]&&d[t[e]][o]){r=d[t[e]][o]}else{return}for(var p=r.length-1;p>=0;p--){if(r[p].key===q||r[p].orig===u){if(t.detachEvent){t.detachEvent("on"+o,r[p].func)}else{if(t.removeEventListener){t.removeEventListener(o,r[p].func,false)}}r[p].orig=null;r[p].func=null;r.splice(p,1);if(u!==b){break}}}if(!r.length){delete d[t[e]][o]}if(g.isEmptyObj(d[t[e]])){delete d[t[e]];try{delete t[e]}catch(s){t[e]=b}}},removeAllEvents:function(p){var o=arguments[1];if(p[e]===b||!p[e]){return}g.each(d[p[e]],function(r,q){g.removeEvent(p,q,o)})}};g.Uploader=function(r){var p={},u,t=[],q;u=new g.QueueProgress();r=g.extend({chunk_size:0,multipart:true,multi_selection:true,file_data_name:"file",filters:[]},r);function s(){var w,x=0,v;if(this.state==g.STARTED){for(v=0;v<t.length;v++){if(!w&&t[v].status==g.QUEUED){w=t[v];w.status=g.UPLOADING;this.trigger("BeforeUpload",w);this.trigger("UploadFile",w)}else{x++}}if(x==t.length){this.trigger("UploadComplete",t);this.stop()}}}function o(){var w,v;u.reset();for(w=0;w<t.length;w++){v=t[w];if(v.size!==b){u.size+=v.size;u.loaded+=v.loaded}else{u.size=b}if(v.status==g.DONE){u.uploaded++}else{if(v.status==g.FAILED){u.failed++}else{u.queued++}}}if(u.size===b){u.percent=t.length>0?Math.ceil(u.uploaded/t.length*100):0}else{u.bytesPerSec=Math.ceil(u.loaded/((+new Date()-q||1)/1000));u.percent=u.size>0?Math.ceil(u.loaded/u.size*100):0}}g.extend(this,{state:g.STOPPED,runtime:"",features:{},files:t,settings:r,total:u,id:g.guid(),init:function(){var A=this,B,x,w,z=0,y;if(typeof(r.preinit)=="function"){r.preinit(A)}else{g.each(r.preinit,function(D,C){A.bind(C,D)})}r.page_url=r.page_url||document.location.pathname.replace(/\/[^\/]+$/g,"/");if(!/^(\w+:\/\/|\/)/.test(r.url)){r.url=r.page_url+r.url}r.chunk_size=g.parseSize(r.chunk_size);r.max_file_size=g.parseSize(r.max_file_size);A.bind("FilesAdded",function(C,F){var E,D,H=0,I,G=r.filters;if(G&&G.length){I=[];g.each(G,function(J){g.each(J.extensions.split(/,/),function(K){if(/^\s*\*\s*$/.test(K)){I.push("\\.*")}else{I.push("\\."+K.replace(new RegExp("["+("/^$.*+?|()[]{}\\".replace(/./g,"\\$&"))+"]","g"),"\\$&"))}})});I=new RegExp(I.join("|")+"$","i")}for(E=0;E<F.length;E++){D=F[E];D.loaded=0;D.percent=0;D.status=g.QUEUED;if(I&&!I.test(D.name)){C.trigger("Error",{code:g.FILE_EXTENSION_ERROR,message:g.translate("File extension error."),file:D});continue}if(D.size!==b&&D.size>r.max_file_size){C.trigger("Error",{code:g.FILE_SIZE_ERROR,message:g.translate("File size error."),file:D});continue}t.push(D);H++}if(H){c(function(){A.trigger("QueueChanged");A.refresh()},1)}else{return false}});if(r.unique_names){A.bind("UploadFile",function(C,D){var F=D.name.match(/\.([^.]+)$/),E="tmp";if(F){E=F[1]}D.target_name=D.id+"."+E})}A.bind("UploadProgress",function(C,D){D.percent=D.size>0?Math.ceil(D.loaded/D.size*100):100;o()});A.bind("StateChanged",function(C){if(C.state==g.STARTED){q=(+new Date())}else{if(C.state==g.STOPPED){for(B=C.files.length-1;B>=0;B--){if(C.files[B].status==g.UPLOADING){C.files[B].status=g.QUEUED;o()}}}}});A.bind("QueueChanged",o);A.bind("Error",function(C,D){if(D.file){D.file.status=g.FAILED;o();if(C.state==g.STARTED){c(function(){s.call(A)},1)}}});A.bind("FileUploaded",function(C,D){D.status=g.DONE;D.loaded=D.size;C.trigger("UploadProgress",D);c(function(){s.call(A)},1)});if(r.runtimes){x=[];y=r.runtimes.split(/\s?,\s?/);for(B=0;B<y.length;B++){if(l[y[B]]){x.push(l[y[B]])}}}else{x=l}function v(){var F=x[z++],E,C,D;if(F){E=F.getFeatures();C=A.settings.required_features;if(C){C=C.split(",");for(D=0;D<C.length;D++){if(!E[C[D]]){v();return}}}F.init(A,function(G){if(G&&G.success){A.features=E;A.runtime=F.name;A.trigger("Init",{runtime:F.name});A.trigger("PostInit");A.refresh()}else{v()}})}else{A.trigger("Error",{code:g.INIT_ERROR,message:g.translate("Init error.")})}}v();if(typeof(r.init)=="function"){r.init(A)}else{g.each(r.init,function(D,C){A.bind(C,D)})}},refresh:function(){this.trigger("Refresh")},start:function(){if(this.state!=g.STARTED){this.state=g.STARTED;this.trigger("StateChanged");s.call(this)}},stop:function(){if(this.state!=g.STOPPED){this.state=g.STOPPED;this.trigger("StateChanged")}},getFile:function(w){var v;for(v=t.length-1;v>=0;v--){if(t[v].id===w){return t[v]}}},removeFile:function(w){var v;for(v=t.length-1;v>=0;v--){if(t[v].id===w.id){return this.splice(v,1)[0]}}},splice:function(x,v){var w;w=t.splice(x===b?0:x,v===b?t.length:v);this.trigger("FilesRemoved",w);this.trigger("QueueChanged");return w},trigger:function(w){var y=p[w.toLowerCase()],x,v;if(y){v=Array.prototype.slice.call(arguments);v[0]=this;for(x=0;x<y.length;x++){if(y[x].func.apply(y[x].scope,v)===false){return false}}}return true},bind:function(v,x,w){var y;v=v.toLowerCase();y=p[v]||[];y.push({func:x,scope:w||this});p[v]=y},unbind:function(v){v=v.toLowerCase();var y=p[v],w,x=arguments[1];if(y){if(x!==b){for(w=y.length-1;w>=0;w--){if(y[w].func===x){y.splice(w,1);break}}}else{y=[]}if(!y.length){delete p[v]}}},unbindAll:function(){var v=this;g.each(p,function(x,w){v.unbind(w)})},destroy:function(){this.trigger("Destroy");this.unbindAll()}})};g.File=function(r,p,q){var o=this;o.id=r;o.name=p;o.size=q;o.loaded=0;o.percent=0;o.status=0};g.Runtime=function(){this.getFeatures=function(){};this.init=function(o,p){}};g.QueueProgress=function(){var o=this;o.size=0;o.loaded=0;o.uploaded=0;o.failed=0;o.queued=0;o.percent=0;o.bytesPerSec=0;o.reset=function(){o.size=o.loaded=o.uploaded=o.failed=o.queued=o.percent=o.bytesPerSec=0}};g.runtimes={};window.plupload=g})();(function(){if(window.google&&google.gears){return}var a=null;if(typeof GearsFactory!="undefined"){a=new GearsFactory()}else{try{a=new ActiveXObject("Gears.Factory");if(a.getBuildInfo().indexOf("ie_mobile")!=-1){a.privateSetGlobalObject(this)}}catch(b){if((typeof navigator.mimeTypes!="undefined")&&navigator.mimeTypes["application/x-googlegears"]){a=document.createElement("object");a.style.display="none";a.width=0;a.height=0;a.type="application/x-googlegears";document.documentElement.appendChild(a)}}}if(!a){return}if(!window.google){window.google={}}if(!google.gears){google.gears={factory:a}}})();(function(e,b,c,d){var f={};function a(h,k,m){var g,j,l,o;j=google.gears.factory.create("beta.canvas");try{j.decode(h);if(!k.width){k.width=j.width}if(!k.height){k.height=j.height}o=Math.min(width/j.width,height/j.height);if(o<1||(o===1&&m==="image/jpeg")){j.resize(Math.round(j.width*o),Math.round(j.height*o));if(k.quality){return j.encode(m,{quality:k.quality/100})}return j.encode(m)}}catch(n){}return h}c.runtimes.Gears=c.addRuntime("gears",{getFeatures:function(){return{dragdrop:true,jpgresize:true,pngresize:true,chunks:true,progress:true,multipart:true}},init:function(j,l){var k;if(!e.google||!google.gears){return l({success:false})}try{k=google.gears.factory.create("beta.desktop")}catch(h){return l({success:false})}function g(o){var n,m,p=[],q;for(m=0;m<o.length;m++){n=o[m];q=c.guid();f[q]=n.blob;p.push(new c.File(q,n.name,n.blob.length))}j.trigger("FilesAdded",p)}j.bind("PostInit",function(){var n=j.settings,m=b.getElementById(n.drop_element);if(m){c.addEvent(m,"dragover",function(o){k.setDropEffect(o,"copy");o.preventDefault()},j.id);c.addEvent(m,"drop",function(p){var o=k.getDragData(p,"application/x-gears-files");if(o){g(o.files)}p.preventDefault()},j.id);m=0}c.addEvent(b.getElementById(n.browse_button),"click",function(s){var r=[],p,o,q;s.preventDefault();for(p=0;p<n.filters.length;p++){q=n.filters[p].extensions.split(",");for(o=0;o<q.length;o++){r.push("."+q[o])}}k.openFiles(g,{singleFile:!n.multi_selection,filter:r})},j.id)});j.bind("UploadFile",function(s,p){var u=0,t,q,r=0,o=s.settings.resize,m;if(o&&/\.(png|jpg|jpeg)$/i.test(p.name)){f[p.id]=a(f[p.id],o,/\.png$/i.test(p.name)?"image/png":"image/jpeg")}p.size=f[p.id].length;q=s.settings.chunk_size;m=q>0;t=Math.ceil(p.size/q);if(!m){q=p.size;t=1}function n(){var z,B,w=s.settings.multipart,v=0,A={name:p.target_name||p.name},x=s.settings.url;function y(D){var C,I="----pluploadboundary"+c.guid(),F="--",H="\r\n",E,G;if(w){z.setRequestHeader("Content-Type","multipart/form-data; boundary="+I);C=google.gears.factory.create("beta.blobbuilder");c.each(c.extend(A,s.settings.multipart_params),function(K,J){C.append(F+I+H+'Content-Disposition: form-data; name="'+J+'"'+H+H);C.append(K+H)});G=c.mimeTypes[p.name.replace(/^.+\.([^.]+)/,"$1").toLowerCase()]||"application/octet-stream";C.append(F+I+H+'Content-Disposition: form-data; name="'+s.settings.file_data_name+'"; filename="'+p.name+'"'+H+"Content-Type: "+G+H+H);C.append(D);C.append(H+F+I+F+H);E=C.getAsBlob();v=E.length-D.length;D=E}z.send(D)}if(p.status==c.DONE||p.status==c.FAILED||s.state==c.STOPPED){return}if(m){A.chunk=u;A.chunks=t}B=Math.min(q,p.size-(u*q));if(!w){x=c.buildUrl(s.settings.url,A)}z=google.gears.factory.create("beta.httprequest");z.open("POST",x);if(!w){z.setRequestHeader("Content-Disposition",'attachment; filename="'+p.name+'"');z.setRequestHeader("Content-Type","application/octet-stream")}c.each(s.settings.headers,function(D,C){z.setRequestHeader(C,D)});z.upload.onprogress=function(C){p.loaded=r+C.loaded-v;s.trigger("UploadProgress",p)};z.onreadystatechange=function(){var C;if(z.readyState==4){if(z.status==200){C={chunk:u,chunks:t,response:z.responseText,status:z.status};s.trigger("ChunkUploaded",p,C);if(C.cancelled){p.status=c.FAILED;return}r+=B;if(++u>=t){p.status=c.DONE;s.trigger("FileUploaded",p,{response:z.responseText,status:z.status})}else{n()}}else{s.trigger("Error",{code:c.HTTP_ERROR,message:c.translate("HTTP Error."),file:p,chunk:u,chunks:t,status:z.status})}}};if(u<t){y(f[p.id].slice(u*q,B))}}n()});j.bind("Destroy",function(m){var n,o,p={browseButton:m.settings.browse_button,dropElm:m.settings.drop_element};for(n in p){o=b.getElementById(p[n]);if(o){c.removeAllEvents(o,m.id)}}});l({success:true})}})})(window,document,plupload);(function(g,b,d,e){var a={},h={};function c(o){var n,m=typeof o,j,l,k;if(m==="string"){n="\bb\tt\nn\ff\rr\"\"''\\\\";return'"'+o.replace(/([\u0080-\uFFFF\x00-\x1f\"])/g,function(r,q){var p=n.indexOf(q);if(p+1){return"\\"+n.charAt(p+1)}r=q.charCodeAt().toString(16);return"\\u"+"0000".substring(r.length)+r})+'"'}if(m=="object"){j=o.length!==e;n="";if(j){for(l=0;l<o.length;l++){if(n){n+=","}n+=c(o[l])}n="["+n+"]"}else{for(k in o){if(o.hasOwnProperty(k)){if(n){n+=","}n+=c(k)+":"+c(o[k])}}n="{"+n+"}"}return n}if(o===e){return"null"}return""+o}function f(s){var v=false,j=null,o=null,k,l,m,u,n,q=0;try{try{o=new ActiveXObject("AgControl.AgControl");if(o.IsVersionSupported(s)){v=true}o=null}catch(r){var p=navigator.plugins["Silverlight Plug-In"];if(p){k=p.description;if(k==="1.0.30226.2"){k="2.0.30226.2"}l=k.split(".");while(l.length>3){l.pop()}while(l.length<4){l.push(0)}m=s.split(".");while(m.length>4){m.pop()}do{u=parseInt(m[q],10);n=parseInt(l[q],10);q++}while(q<m.length&&u===n);if(u<=n&&!isNaN(u)){v=true}}}}catch(t){v=false}return v}d.silverlight={trigger:function(n,k){var m=a[n],l,j;if(m){j=d.toArray(arguments).slice(1);j[0]="Silverlight:"+k;setTimeout(function(){m.trigger.apply(m,j)},0)}}};d.runtimes.Silverlight=d.addRuntime("silverlight",{getFeatures:function(){return{jpgresize:true,pngresize:true,chunks:true,progress:true,multipart:true}},init:function(p,q){var o,m="",n=p.settings.filters,l,k=b.body;if(!f("2.0.31005.0")||(g.opera&&g.opera.buildNumber)){q({success:false});return}h[p.id]=false;a[p.id]=p;o=b.createElement("div");o.id=p.id+"_silverlight_container";d.extend(o.style,{position:"absolute",top:"0px",background:p.settings.shim_bgcolor||"transparent",zIndex:99999,width:"100px",height:"100px",overflow:"hidden",opacity:p.settings.shim_bgcolor||b.documentMode>8?"":0.01});o.className="plupload silverlight";if(p.settings.container){k=b.getElementById(p.settings.container);if(d.getStyle(k,"position")==="static"){k.style.position="relative"}}k.appendChild(o);for(l=0;l<n.length;l++){m+=(m!=""?"|":"")+n[l].title+" | *."+n[l].extensions.replace(/,/g,";*.")}o.innerHTML='<object id="'+p.id+'_silverlight" data="data:application/x-silverlight," type="application/x-silverlight-2" style="outline:none;" width="1024" height="1024"><param name="source" value="'+p.settings.silverlight_xap_url+'"/><param name="background" value="Transparent"/><param name="windowless" value="true"/><param name="enablehtmlaccess" value="true"/><param name="initParams" value="id='+p.id+",filter="+m+",multiselect="+p.settings.multi_selection+'"/></object>';function j(){return b.getElementById(p.id+"_silverlight").content.Upload}p.bind("Silverlight:Init",function(){var r,s={};if(h[p.id]){return}h[p.id]=true;p.bind("Silverlight:StartSelectFiles",function(t){r=[]});p.bind("Silverlight:SelectFile",function(t,w,u,v){var x;x=d.guid();s[x]=w;s[w]=x;r.push(new d.File(x,u,v))});p.bind("Silverlight:SelectSuccessful",function(){if(r.length){p.trigger("FilesAdded",r)}});p.bind("Silverlight:UploadChunkError",function(t,w,u,x,v){p.trigger("Error",{code:d.IO_ERROR,message:"IO Error.",details:v,file:t.getFile(s[w])})});p.bind("Silverlight:UploadFileProgress",function(t,x,u,w){var v=t.getFile(s[x]);if(v.status!=d.FAILED){v.size=w;v.loaded=u;t.trigger("UploadProgress",v)}});p.bind("Refresh",function(t){var u,v,w;u=b.getElementById(t.settings.browse_button);if(u){v=d.getPos(u,b.getElementById(t.settings.container));w=d.getSize(u);d.extend(b.getElementById(t.id+"_silverlight_container").style,{top:v.y+"px",left:v.x+"px",width:w.w+"px",height:w.h+"px"})}});p.bind("Silverlight:UploadChunkSuccessful",function(t,w,u,z,y){var x,v=t.getFile(s[w]);x={chunk:u,chunks:z,response:y};t.trigger("ChunkUploaded",v,x);if(v.status!=d.FAILED){j().UploadNextChunk()}if(u==z-1){v.status=d.DONE;t.trigger("FileUploaded",v,{response:y})}});p.bind("Silverlight:UploadSuccessful",function(t,w,u){var v=t.getFile(s[w]);v.status=d.DONE;t.trigger("FileUploaded",v,{response:u})});p.bind("FilesRemoved",function(t,v){var u;for(u=0;u<v.length;u++){j().RemoveFile(s[v[u].id])}});p.bind("UploadFile",function(t,v){var w=t.settings,u=w.resize||{};j().UploadFile(s[v.id],t.settings.url,c({name:v.target_name||v.name,mime:d.mimeTypes[v.name.replace(/^.+\.([^.]+)/,"$1").toLowerCase()]||"application/octet-stream",chunk_size:w.chunk_size,image_width:u.width,image_height:u.height,image_quality:u.quality||90,multipart:!!w.multipart,multipart_params:w.multipart_params||{},file_data_name:w.file_data_name,headers:w.headers}))});p.bind("Silverlight:MouseEnter",function(t){var u,v;u=b.getElementById(p.settings.browse_button);v=t.settings.browse_button_hover;if(u&&v){d.addClass(u,v)}});p.bind("Silverlight:MouseLeave",function(t){var u,v;u=b.getElementById(p.settings.browse_button);v=t.settings.browse_button_hover;if(u&&v){d.removeClass(u,v)}});p.bind("Silverlight:MouseLeftButtonDown",function(t){var u,v;u=b.getElementById(p.settings.browse_button);v=t.settings.browse_button_active;if(u&&v){d.addClass(u,v);d.addEvent(b.body,"mouseup",function(){d.removeClass(u,v)})}});p.bind("Sliverlight:StartSelectFiles",function(t){var u,v;u=b.getElementById(p.settings.browse_button);v=t.settings.browse_button_active;if(u&&v){d.removeClass(u,v)}});p.bind("Destroy",function(t){var u;d.removeAllEvents(b.body,t.id);delete h[t.id];delete a[t.id];u=b.getElementById(t.id+"_silverlight_container");if(u){k.removeChild(u)}});q({success:true})})}})})(window,document,plupload);(function(f,b,d,e){var a={},g={};function c(){var h;try{h=navigator.plugins["Shockwave Flash"];h=h.description}catch(k){try{h=new ActiveXObject("ShockwaveFlash.ShockwaveFlash").GetVariable("$version")}catch(j){h="0.0"}}h=h.match(/\d+/g);return parseFloat(h[0]+"."+h[1])}d.flash={trigger:function(k,h,j){setTimeout(function(){var n=a[k],m,l;if(n){n.trigger("Flash:"+h,j)}},0)}};d.runtimes.Flash=d.addRuntime("flash",{getFeatures:function(){return{jpgresize:true,pngresize:true,maxWidth:8091,maxHeight:8091,chunks:true,progress:true,multipart:true}},init:function(k,p){var o,j,l,q=0,h=b.body;if(c()<10){p({success:false});return}g[k.id]=false;a[k.id]=k;o=b.getElementById(k.settings.browse_button);j=b.createElement("div");j.id=k.id+"_flash_container";d.extend(j.style,{position:"absolute",top:"0px",background:k.settings.shim_bgcolor||"transparent",zIndex:99999,width:"100%",height:"100%"});j.className="plupload flash";if(k.settings.container){h=b.getElementById(k.settings.container);if(d.getStyle(h,"position")==="static"){h.style.position="relative"}}h.appendChild(j);l="id="+escape(k.id);j.innerHTML='<object id="'+k.id+'_flash" width="100%" height="100%" style="outline:0" type="application/x-shockwave-flash" data="'+k.settings.flash_swf_url+'"><param name="movie" value="'+k.settings.flash_swf_url+'" /><param name="flashvars" value="'+l+'" /><param name="wmode" value="transparent" /><param name="allowscriptaccess" value="always" /></object>';function n(){return b.getElementById(k.id+"_flash")}function m(){if(q++>5000){p({success:false});return}if(!g[k.id]){setTimeout(m,1)}}m();o=j=null;k.bind("Flash:Init",function(){var s={},r;n().setFileFilters(k.settings.filters,k.settings.multi_selection);if(g[k.id]){return}g[k.id]=true;k.bind("UploadFile",function(t,v){var w=t.settings,u=k.settings.resize||{};n().uploadFile(s[v.id],w.url,{name:v.target_name||v.name,mime:d.mimeTypes[v.name.replace(/^.+\.([^.]+)/,"$1").toLowerCase()]||"application/octet-stream",chunk_size:w.chunk_size,width:u.width,height:u.height,quality:u.quality,multipart:w.multipart,multipart_params:w.multipart_params||{},file_data_name:w.file_data_name,format:/\.(jpg|jpeg)$/i.test(v.name)?"jpg":"png",headers:w.headers,urlstream_upload:w.urlstream_upload})});k.bind("Flash:UploadProcess",function(u,t){var v=u.getFile(s[t.id]);if(v.status!=d.FAILED){v.loaded=t.loaded;v.size=t.size;u.trigger("UploadProgress",v)}});k.bind("Flash:UploadChunkComplete",function(t,v){var w,u=t.getFile(s[v.id]);w={chunk:v.chunk,chunks:v.chunks,response:v.text};t.trigger("ChunkUploaded",u,w);if(u.status!=d.FAILED){n().uploadNextChunk()}if(v.chunk==v.chunks-1){u.status=d.DONE;t.trigger("FileUploaded",u,{response:v.text})}});k.bind("Flash:SelectFiles",function(t,w){var v,u,x=[],y;for(u=0;u<w.length;u++){v=w[u];y=d.guid();s[y]=v.id;s[v.id]=y;x.push(new d.File(y,v.name,v.size))}if(x.length){k.trigger("FilesAdded",x)}});k.bind("Flash:SecurityError",function(t,u){k.trigger("Error",{code:d.SECURITY_ERROR,message:d.translate("Security error."),details:u.message,file:k.getFile(s[u.id])})});k.bind("Flash:GenericError",function(t,u){k.trigger("Error",{code:d.GENERIC_ERROR,message:d.translate("Generic error."),details:u.message,file:k.getFile(s[u.id])})});k.bind("Flash:IOError",function(t,u){k.trigger("Error",{code:d.IO_ERROR,message:d.translate("IO error."),details:u.message,file:k.getFile(s[u.id])})});k.bind("Flash:ImageError",function(t,u){k.trigger("Error",{code:parseInt(u.code,10),message:d.translate("Image error."),file:k.getFile(s[u.id])})});k.bind("Flash:StageEvent:rollOver",function(t){var u,v;u=b.getElementById(k.settings.browse_button);v=t.settings.browse_button_hover;if(u&&v){d.addClass(u,v)}});k.bind("Flash:StageEvent:rollOut",function(t){var u,v;u=b.getElementById(k.settings.browse_button);v=t.settings.browse_button_hover;if(u&&v){d.removeClass(u,v)}});k.bind("Flash:StageEvent:mouseDown",function(t){var u,v;u=b.getElementById(k.settings.browse_button);v=t.settings.browse_button_active;if(u&&v){d.addClass(u,v);d.addEvent(b.body,"mouseup",function(){d.removeClass(u,v)},t.id)}});k.bind("Flash:StageEvent:mouseUp",function(t){var u,v;u=b.getElementById(k.settings.browse_button);v=t.settings.browse_button_active;if(u&&v){d.removeClass(u,v)}});k.bind("QueueChanged",function(t){k.refresh()});k.bind("FilesRemoved",function(t,v){var u;for(u=0;u<v.length;u++){n().removeFile(s[v[u].id])}});k.bind("StateChanged",function(t){k.refresh()});k.bind("Refresh",function(t){var u,v,w;n().setFileFilters(k.settings.filters,k.settings.multi_selection);u=b.getElementById(t.settings.browse_button);if(u){v=d.getPos(u,b.getElementById(t.settings.container));w=d.getSize(u);d.extend(b.getElementById(t.id+"_flash_container").style,{top:v.y+"px",left:v.x+"px",width:w.w+"px",height:w.h+"px"})}});k.bind("Destroy",function(t){var u;d.removeAllEvents(b.body,t.id);delete g[t.id];delete a[t.id];u=b.getElementById(t.id+"_flash_container");if(u){h.removeChild(u)}});p({success:true})})}})})(window,document,plupload);(function(a){a.runtimes.BrowserPlus=a.addRuntime("browserplus",{getFeatures:function(){return{dragdrop:true,jpgresize:true,pngresize:true,chunks:true,progress:true,multipart:true}},init:function(g,j){var e=window.BrowserPlus,h={},d=g.settings,c=d.resize;function f(o){var n,m,k=[],l,p;for(m=0;m<o.length;m++){l=o[m];p=a.guid();h[p]=l;k.push(new a.File(p,l.name,l.size))}if(m){g.trigger("FilesAdded",k)}}function b(){g.bind("PostInit",function(){var n,l=d.drop_element,p=g.id+"_droptarget",k=document.getElementById(l),m;function q(s,r){e.DragAndDrop.AddDropTarget({id:s},function(t){e.DragAndDrop.AttachCallbacks({id:s,hover:function(u){if(!u&&r){r()}},drop:function(u){if(r){r()}f(u)}},function(){})})}function o(){document.getElementById(p).style.top="-1000px"}if(k){if(document.attachEvent&&(/MSIE/gi).test(navigator.userAgent)){n=document.createElement("div");n.setAttribute("id",p);a.extend(n.style,{position:"absolute",top:"-1000px",background:"red",filter:"alpha(opacity=0)",opacity:0});document.body.appendChild(n);a.addEvent(k,"dragenter",function(s){var r,t;r=document.getElementById(l);t=a.getPos(r);a.extend(document.getElementById(p).style,{top:t.y+"px",left:t.x+"px",width:r.offsetWidth+"px",height:r.offsetHeight+"px"})});q(p,o)}else{q(l)}}a.addEvent(document.getElementById(d.browse_button),"click",function(w){var u=[],s,r,v=d.filters,t;w.preventDefault();for(s=0;s<v.length;s++){t=v[s].extensions.split(",");for(r=0;r<t.length;r++){u.push(a.mimeTypes[t[r]])}}e.FileBrowse.OpenBrowseDialog({mimeTypes:u},function(x){if(x.success){f(x.value)}})});k=n=null});g.bind("UploadFile",function(n,k){var m=h[k.id],s={},l=n.settings.chunk_size,o,p=[];function r(t,v){var u;if(k.status==a.FAILED){return}s.name=k.target_name||k.name;if(l){s.chunk=""+t;s.chunks=""+v}u=p.shift();e.Uploader.upload({url:n.settings.url,files:{file:u},cookies:document.cookies,postvars:a.extend(s,n.settings.multipart_params),progressCallback:function(y){var x,w=0;o[t]=parseInt(y.filePercent*u.size/100,10);for(x=0;x<o.length;x++){w+=o[x]}k.loaded=w;n.trigger("UploadProgress",k)}},function(x){var w,y;if(x.success){w=x.value.statusCode;if(l){n.trigger("ChunkUploaded",k,{chunk:t,chunks:v,response:x.value.body,status:w})}if(p.length>0){r(++t,v)}else{k.status=a.DONE;n.trigger("FileUploaded",k,{response:x.value.body,status:w});if(w>=400){n.trigger("Error",{code:a.HTTP_ERROR,message:a.translate("HTTP Error."),file:k,status:w})}}}else{n.trigger("Error",{code:a.GENERIC_ERROR,message:a.translate("Generic Error."),file:k,details:x.error})}})}function q(t){k.size=t.size;if(l){e.FileAccess.chunk({file:t,chunkSize:l},function(w){if(w.success){var x=w.value,u=x.length;o=Array(u);for(var v=0;v<u;v++){o[v]=0;p.push(x[v])}r(0,u)}})}else{o=Array(1);p.push(t);r(0,1)}}if(c&&/\.(png|jpg|jpeg)$/i.test(k.name)){BrowserPlus.ImageAlter.transform({file:m,quality:c.quality||90,actions:[{scale:{maxwidth:c.width,maxheight:c.height}}]},function(t){if(t.success){q(t.value.file)}})}else{q(m)}});j({success:true})}if(e){e.init(function(l){var k=[{service:"Uploader",version:"3"},{service:"DragAndDrop",version:"1"},{service:"FileBrowse",version:"1"},{service:"FileAccess",version:"2"}];if(c){k.push({service:"ImageAlter",version:"4"})}if(l.success){e.require({services:k},function(m){if(m.success){b()}else{j()}})}else{j()}})}else{j()}}})})(plupload);(function(g,j,h,d){var f;if(g.Uint8Array&&g.ArrayBuffer&&!XMLHttpRequest.prototype.sendAsBinary){XMLHttpRequest.prototype.sendAsBinary=function(o){var m=new Uint8Array(o.length);for(var n=0;n<o.length;n++){m[n]=(o.charCodeAt(n)&255)}this.send(m.buffer)}}function l(n,o){var m;if("FileReader" in g){m=new FileReader();m.readAsDataURL(n);m.onload=function(){o(m.result)}}else{return o(n.getAsDataURL())}}function k(n,o){var m;if("FileReader" in g){m=new FileReader();m.readAsBinaryString(n);m.onload=function(){o(m.result)}}else{return o(n.getAsBinary())}}function c(q,o,r,t){var n,p,m,s;l(q,function(u){n=j.createElement("canvas");n.style.display="none";j.body.appendChild(n);p=n.getContext("2d");m=new Image();m.onerror=m.onabort=function(){t({success:false})};m.onload=function(){var z,v,x,w,y;if(!o.width){o.width=m.width}if(!o.height){o.height=m.height}s=Math.min(o.width/m.width,o.height/m.height);if(s<1||(s===1&&r==="image/jpeg")){z=Math.round(m.width*s);v=Math.round(m.height*s);n.width=z;n.height=v;p.drawImage(m,0,0,z,v);if(r==="image/jpeg"){w=new e(atob(u.substring(u.indexOf("base64,")+7)));if(w.headers&&w.headers.length){y=new a();if(y.init(w.get("exif")[0])){y.setExif("PixelXDimension",z);y.setExif("PixelYDimension",v);w.set("exif",y.getBinary())}}if(o.quality){try{u=n.toDataURL(r,o.quality/100)}catch(A){u=n.toDataURL(r)}}}else{u=n.toDataURL(r)}u=u.substring(u.indexOf("base64,")+7);u=atob(u);if(w.headers&&w.headers.length){u=w.restore(u);w.purge()}n.parentNode.removeChild(n);t({success:true,data:u})}else{t({success:false})}};m.src=u})}h.runtimes.Html5=h.addRuntime("html5",{getFeatures:function(){var r,n,q,o,m,p=g;n=q=o=m=false;if(p.XMLHttpRequest){r=new XMLHttpRequest();q=!!r.upload;n=!!(r.sendAsBinary||r.upload)}if(n){o=!!(File&&(File.prototype.getAsDataURL||p.FileReader)&&r.sendAsBinary);m=!!(File&&File.prototype.slice)}f=navigator.userAgent.indexOf("Safari")>0&&navigator.vendor.indexOf("Apple")!==-1;return{html5:n,dragdrop:p.mozInnerScreenX!==d||m||f,jpgresize:o,pngresize:o,multipart:o||!!p.FileReader||!!p.FormData,progress:q,chunks:m||o,canOpenDialog:navigator.userAgent.indexOf("WebKit")!==-1}},init:function(p,q){var m={},n;function o(v){var t,s,u=[],w,r={};for(s=0;s<v.length;s++){t=v[s];if(r[t.name]){continue}r[t.name]=true;w=h.guid();m[w]=t;u.push(new h.File(w,t.fileName,t.fileSize||t.size))}if(u.length){p.trigger("FilesAdded",u)}}n=this.getFeatures();if(!n.html5){q({success:false});return}p.bind("Init",function(v){var F,E,B=[],u,C,s=v.settings.filters,t,A,r=j.body,D;F=j.createElement("div");F.id=v.id+"_html5_container";h.extend(F.style,{position:"absolute",background:p.settings.shim_bgcolor||"transparent",width:"100px",height:"100px",overflow:"hidden",zIndex:99999,opacity:p.settings.shim_bgcolor?"":0});F.className="plupload html5";if(p.settings.container){r=j.getElementById(p.settings.container);if(h.getStyle(r,"position")==="static"){r.style.position="relative"}}r.appendChild(F);no_type_restriction:for(u=0;u<s.length;u++){t=s[u].extensions.split(/,/);for(C=0;C<t.length;C++){if(t[C]==="*"){B=[];break no_type_restriction}A=h.mimeTypes[t[C]];if(A){B.push(A)}}}F.innerHTML='<input id="'+p.id+'_html5" style="width:100%;height:100%;font-size:99px" type="file" accept="'+B.join(",")+'" '+(p.settings.multi_selection?'multiple="multiple"':"")+" />";D=j.getElementById(p.id+"_html5");D.onchange=function(){o(this.files);this.value=""};E=j.getElementById(v.settings.browse_button);if(E){var x=v.settings.browse_button_hover,z=v.settings.browse_button_active,w=v.features.canOpenDialog?E:F;if(x){h.addEvent(w,"mouseover",function(){h.addClass(E,x)},v.id);h.addEvent(w,"mouseout",function(){h.removeClass(E,x)},v.id)}if(z){h.addEvent(w,"mousedown",function(){h.addClass(E,z)},v.id);h.addEvent(j.body,"mouseup",function(){h.removeClass(E,z)},v.id)}if(v.features.canOpenDialog){h.addEvent(E,"click",function(y){j.getElementById(v.id+"_html5").click();y.preventDefault()},v.id)}}});p.bind("PostInit",function(){var r=j.getElementById(p.settings.drop_element);if(r){if(f){h.addEvent(r,"dragenter",function(v){var u,s,t;u=j.getElementById(p.id+"_drop");if(!u){u=j.createElement("input");u.setAttribute("type","file");u.setAttribute("id",p.id+"_drop");u.setAttribute("multiple","multiple");h.addEvent(u,"change",function(){o(this.files);h.removeEvent(u,"change",p.id);u.parentNode.removeChild(u)},p.id);r.appendChild(u)}s=h.getPos(r,j.getElementById(p.settings.container));t=h.getSize(r);if(h.getStyle(r,"position")==="static"){h.extend(r.style,{position:"relative"})}h.extend(u.style,{position:"absolute",display:"block",top:0,left:0,width:t.w+"px",height:t.h+"px",opacity:0})},p.id);return}h.addEvent(r,"dragover",function(s){s.preventDefault()},p.id);h.addEvent(r,"drop",function(t){var s=t.dataTransfer;if(s&&s.files){o(s.files)}t.preventDefault()},p.id)}});p.bind("Refresh",function(r){var s,u,v,w,t;s=j.getElementById(p.settings.browse_button);if(s){u=h.getPos(s,j.getElementById(r.settings.container));v=h.getSize(s);w=j.getElementById(p.id+"_html5_container");h.extend(w.style,{top:u.y+"px",left:u.x+"px",width:v.w+"px",height:v.h+"px"});if(p.features.canOpenDialog){t=parseInt(s.parentNode.style.zIndex,10);if(isNaN(t)){t=0}h.extend(s.style,{zIndex:t});if(h.getStyle(s,"position")==="static"){h.extend(s.style,{position:"relative"})}h.extend(w.style,{zIndex:t-1})}}});p.bind("UploadFile",function(r,t){var u=r.settings,w,s;function v(x){var A=0,z=0;function y(){var H=x,O,P,K,L,M=0,D="----pluploadboundary"+h.guid(),G,I,E,F="--",N="\r\n",J="",C,B=r.settings.url;if(t.status==h.DONE||t.status==h.FAILED||r.state==h.STOPPED){return}L={name:t.target_name||t.name};if(u.chunk_size&&n.chunks){G=u.chunk_size;K=Math.ceil(t.size/G);I=Math.min(G,t.size-(A*G));if(typeof(x)=="string"){H=x.substring(A*G,A*G+I)}else{H=x.slice(A*G,I)}L.chunk=A;L.chunks=K}else{I=t.size}O=new XMLHttpRequest();P=O.upload;if(P){P.onprogress=function(Q){t.loaded=Math.min(t.size,z+Q.loaded-M);r.trigger("UploadProgress",t)}}if(!r.settings.multipart||!n.multipart){B=h.buildUrl(r.settings.url,L)}else{L.name=t.target_name||t.name}O.open("post",B,true);O.onreadystatechange=function(){var Q,S;if(O.readyState==4){try{Q=O.status}catch(R){Q=0}if(Q>=400){r.trigger("Error",{code:h.HTTP_ERROR,message:h.translate("HTTP Error."),file:t,status:Q})}else{if(K){S={chunk:A,chunks:K,response:O.responseText,status:Q};r.trigger("ChunkUploaded",t,S);z+=I;if(S.cancelled){t.status=h.FAILED;return}t.loaded=Math.min(t.size,(A+1)*G)}else{t.loaded=t.size}r.trigger("UploadProgress",t);if(!K||++A>=K){t.status=h.DONE;r.trigger("FileUploaded",t,{response:O.responseText,status:Q});w=x=m[t.id]=null}else{y()}}O=H=E=J=null}};h.each(r.settings.headers,function(R,Q){O.setRequestHeader(Q,R)});if(r.settings.multipart&&n.multipart){if(!O.sendAsBinary){E=new FormData();h.each(h.extend(L,r.settings.multipart_params),function(R,Q){E.append(Q,R)});E.append(r.settings.file_data_name,H);O.send(E);return}O.setRequestHeader("Content-Type","multipart/form-data; boundary="+D);h.each(h.extend(L,r.settings.multipart_params),function(R,Q){J+=F+D+N+'Content-Disposition: form-data; name="'+Q+'"'+N+N;J+=unescape(encodeURIComponent(R))+N});C=h.mimeTypes[t.name.replace(/^.+\.([^.]+)/,"$1").toLowerCase()]||"application/octet-stream";J+=F+D+N+'Content-Disposition: form-data; name="'+r.settings.file_data_name+'"; filename="'+unescape(encodeURIComponent(t.name))+'"'+N+"Content-Type: "+C+N+N+H+N+F+D+F+N;M=J.length-H.length;H=J}else{O.setRequestHeader("Content-Type","application/octet-stream")}if(O.sendAsBinary){O.sendAsBinary(H)}else{O.send(H)}}y()}w=m[t.id];s=r.settings.resize;if(n.jpgresize){if(s&&/\.(png|jpg|jpeg)$/i.test(t.name)){c(w,s,/\.png$/i.test(t.name)?"image/png":"image/jpeg",function(x){if(x.success){t.size=x.data.length;v(x.data)}else{k(w,v)}})}else{k(w,v)}}else{v(w)}});p.bind("Destroy",function(r){var t,u,s=j.body,v={inputContainer:r.id+"_html5_container",inputFile:r.id+"_html5",browseButton:r.settings.browse_button,dropElm:r.settings.drop_element};for(t in v){u=j.getElementById(v[t]);if(u){h.removeAllEvents(u,r.id)}}h.removeAllEvents(j.body,r.id);if(r.settings.container){s=j.getElementById(r.settings.container)}s.removeChild(j.getElementById(v.inputContainer))});q({success:true})}});function b(){var p=false,n;function q(s,u){var r=p?0:-8*(u-1),v=0,t;for(t=0;t<u;t++){v|=(n.charCodeAt(s+t)<<Math.abs(r+t*8))}return v}function m(t,r,s){var s=arguments.length===3?s:n.length-r-1;n=n.substr(0,r)+t+n.substr(s+r)}function o(s,t,v){var w="",r=p?0:-8*(v-1),u;for(u=0;u<v;u++){w+=String.fromCharCode((t>>Math.abs(r+u*8))&255)}m(w,s,v)}return{II:function(r){if(r===d){return p}else{p=r}},init:function(r){p=false;n=r},SEGMENT:function(r,t,s){switch(arguments.length){case 1:return n.substr(r,n.length-r-1);case 2:return n.substr(r,t);case 3:m(s,r,t);break;default:return n}},BYTE:function(r){return q(r,1)},SHORT:function(r){return q(r,2)},LONG:function(r,s){if(s===d){return q(r,4)}else{o(r,s,4)}},SLONG:function(r){var s=q(r,4);return(s>2147483647?s-4294967296:s)},STRING:function(r,s){var t="";for(s+=r;r<s;r++){t+=String.fromCharCode(q(r,1))}return t}}}function e(r){var t={65505:{app:"EXIF",name:"APP1",signature:"Exif\0"},65506:{app:"ICC",name:"APP2",signature:"ICC_PROFILE\0"},65517:{app:"IPTC",name:"APP13",signature:"Photoshop 3.0\0"}},s=[],q,m,o=d,p=0,n;q=new b();q.init(r);if(q.SHORT(0)!==65496){return}m=2;n=Math.min(1048576,r.length);while(m<=n){o=q.SHORT(m);if(o>=65488&&o<=65495){m+=2;continue}if(o===65498||o===65497){break}p=q.SHORT(m+2)+2;if(t[o]&&q.STRING(m+4,t[o].signature.length)===t[o].signature){s.push({hex:o,app:t[o].app.toUpperCase(),name:t[o].name.toUpperCase(),start:m,length:p,segment:q.SEGMENT(m,p)})}m+=p}q.init(null);return{headers:s,restore:function(w){q.init(w);if(q.SHORT(0)!==65496){return false}m=q.SHORT(2)==65504?4+q.SHORT(4):2;for(var v=0,u=s.length;v<u;v++){q.SEGMENT(m,0,s[v].segment);m+=s[v].length}return q.SEGMENT()},get:function(w){var x=[];for(var v=0,u=s.length;v<u;v++){if(s[v].app===w.toUpperCase()){x.push(s[v].segment)}}return x},set:function(x,w){var y=[];if(typeof(w)==="string"){y.push(w)}else{y=w}for(var v=ii=0,u=s.length;v<u;v++){if(s[v].app===x.toUpperCase()){s[v].segment=y[ii];s[v].length=y[ii].length;ii++}if(ii>=y.length){break}}},purge:function(){s=[];q.init(null)}}}function a(){var p,m,n={},s;p=new b();m={tiff:{274:"Orientation",34665:"ExifIFDPointer",34853:"GPSInfoIFDPointer"},exif:{36864:"ExifVersion",40961:"ColorSpace",40962:"PixelXDimension",40963:"PixelYDimension",36867:"DateTimeOriginal",33434:"ExposureTime",33437:"FNumber",34855:"ISOSpeedRatings",37377:"ShutterSpeedValue",37378:"ApertureValue",37383:"MeteringMode",37384:"LightSource",37385:"Flash",41986:"ExposureMode",41987:"WhiteBalance",41990:"SceneCaptureType",41988:"DigitalZoomRatio",41992:"Contrast",41993:"Saturation",41994:"Sharpness"},gps:{0:"GPSVersionID",1:"GPSLatitudeRef",2:"GPSLatitude",3:"GPSLongitudeRef",4:"GPSLongitude"}};s={ColorSpace:{1:"sRGB",0:"Uncalibrated"},MeteringMode:{0:"Unknown",1:"Average",2:"CenterWeightedAverage",3:"Spot",4:"MultiSpot",5:"Pattern",6:"Partial",255:"Other"},LightSource:{1:"Daylight",2:"Fliorescent",3:"Tungsten",4:"Flash",9:"Fine weather",10:"Cloudy weather",11:"Shade",12:"Daylight fluorescent (D 5700 - 7100K)",13:"Day white fluorescent (N 4600 -5400K)",14:"Cool white fluorescent (W 3900 - 4500K)",15:"White fluorescent (WW 3200 - 3700K)",17:"Standard light A",18:"Standard light B",19:"Standard light C",20:"D55",21:"D65",22:"D75",23:"D50",24:"ISO studio tungsten",255:"Other"},Flash:{0:"Flash did not fire.",1:"Flash fired.",5:"Strobe return light not detected.",7:"Strobe return light detected.",9:"Flash fired, compulsory flash mode",13:"Flash fired, compulsory flash mode, return light not detected",15:"Flash fired, compulsory flash mode, return light detected",16:"Flash did not fire, compulsory flash mode",24:"Flash did not fire, auto mode",25:"Flash fired, auto mode",29:"Flash fired, auto mode, return light not detected",31:"Flash fired, auto mode, return light detected",32:"No flash function",65:"Flash fired, red-eye reduction mode",69:"Flash fired, red-eye reduction mode, return light not detected",71:"Flash fired, red-eye reduction mode, return light detected",73:"Flash fired, compulsory flash mode, red-eye reduction mode",77:"Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",79:"Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",89:"Flash fired, auto mode, red-eye reduction mode",93:"Flash fired, auto mode, return light not detected, red-eye reduction mode",95:"Flash fired, auto mode, return light detected, red-eye reduction mode"},ExposureMode:{0:"Auto exposure",1:"Manual exposure",2:"Auto bracket"},WhiteBalance:{0:"Auto white balance",1:"Manual white balance"},SceneCaptureType:{0:"Standard",1:"Landscape",2:"Portrait",3:"Night scene"},Contrast:{0:"Normal",1:"Soft",2:"Hard"},Saturation:{0:"Normal",1:"Low saturation",2:"High saturation"},Sharpness:{0:"Normal",1:"Soft",2:"Hard"},GPSLatitudeRef:{N:"North latitude",S:"South latitude"},GPSLongitudeRef:{E:"East longitude",W:"West longitude"}};function o(t,B){var v=p.SHORT(t),y,E,F,A,z,u,w,C,D=[],x={};for(y=0;y<v;y++){w=u=t+12*y+2;F=B[p.SHORT(w)];if(F===d){continue}A=p.SHORT(w+=2);z=p.LONG(w+=2);w+=4;D=[];switch(A){case 1:case 7:if(z>4){w=p.LONG(w)+n.tiffHeader}for(E=0;E<z;E++){D[E]=p.BYTE(w+E)}break;case 2:if(z>4){w=p.LONG(w)+n.tiffHeader}x[F]=p.STRING(w,z-1);continue;case 3:if(z>2){w=p.LONG(w)+n.tiffHeader}for(E=0;E<z;E++){D[E]=p.SHORT(w+E*2)}break;case 4:if(z>1){w=p.LONG(w)+n.tiffHeader}for(E=0;E<z;E++){D[E]=p.LONG(w+E*4)}break;case 5:w=p.LONG(w)+n.tiffHeader;for(E=0;E<z;E++){D[E]=p.LONG(w+E*4)/p.LONG(w+E*4+4)}break;case 9:w=p.LONG(w)+n.tiffHeader;for(E=0;E<z;E++){D[E]=p.SLONG(w+E*4)}break;case 10:w=p.LONG(w)+n.tiffHeader;for(E=0;E<z;E++){D[E]=p.SLONG(w+E*4)/p.SLONG(w+E*4+4)}break;default:continue}C=(z==1?D[0]:D);if(s.hasOwnProperty(F)&&typeof C!="object"){x[F]=s[F][C]}else{x[F]=C}}return x}function r(){var u=d,t=n.tiffHeader;p.II(p.SHORT(t)==18761);if(p.SHORT(t+=2)!==42){return false}n.IFD0=n.tiffHeader+p.LONG(t+=2);u=o(n.IFD0,m.tiff);n.exifIFD=("ExifIFDPointer" in u?n.tiffHeader+u.ExifIFDPointer:d);n.gpsIFD=("GPSInfoIFDPointer" in u?n.tiffHeader+u.GPSInfoIFDPointer:d);return true}function q(v,t,y){var A,x,w,z=0;if(typeof(t)==="string"){var u=m[v.toLowerCase()];for(hex in u){if(u[hex]===t){t=hex;break}}}A=n[v.toLowerCase()+"IFD"];x=p.SHORT(A);for(i=0;i<x;i++){w=A+12*i+2;if(p.SHORT(w)==t){z=w+8;break}}if(!z){return false}p.LONG(z,y);return true}return{init:function(t){n={tiffHeader:10};if(t===d||!t.length){return false}p.init(t);if(p.SHORT(0)===65505&&p.STRING(4,5).toUpperCase()==="EXIF\0"){return r()}return false},EXIF:function(){var t;t=o(n.exifIFD,m.exif);t.ExifVersion=String.fromCharCode(t.ExifVersion[0],t.ExifVersion[1],t.ExifVersion[2],t.ExifVersion[3]);return t},GPS:function(){var t;t=o(n.gpsIFD,m.gps);t.GPSVersionID=t.GPSVersionID.join(".");return t},setExif:function(t,u){if(t!=="PixelXDimension"&&t!=="PixelYDimension"){return false}return q("exif",t,u)},getBinary:function(){return p.SEGMENT()}}}})(window,document,plupload);(function(d,a,b,c){function e(f){return a.getElementById(f)}b.runtimes.Html4=b.addRuntime("html4",{getFeatures:function(){return{multipart:true,canOpenDialog:navigator.userAgent.indexOf("WebKit")!==-1}},init:function(f,g){f.bind("Init",function(p){var j=a.body,n,h="javascript",k,x,q,z=[],r=/MSIE/.test(navigator.userAgent),t=[],m=p.settings.filters,o,l,s,w;no_type_restriction:for(o=0;o<m.length;o++){l=m[o].extensions.split(/,/);for(w=0;w<l.length;w++){if(l[w]==="*"){t=[];break no_type_restriction}s=b.mimeTypes[l[w]];if(s){t.push(s)}}}t=t.join(",");function v(){var C,A,y,B;q=b.guid();z.push(q);C=a.createElement("form");C.setAttribute("id","form_"+q);C.setAttribute("method","post");C.setAttribute("enctype","multipart/form-data");C.setAttribute("encoding","multipart/form-data");C.setAttribute("target",p.id+"_iframe");C.style.position="absolute";A=a.createElement("input");A.setAttribute("id","input_"+q);A.setAttribute("type","file");A.setAttribute("accept",t);A.setAttribute("size",1);B=e(p.settings.browse_button);if(p.features.canOpenDialog&&B){b.addEvent(e(p.settings.browse_button),"click",function(D){A.click();D.preventDefault()},p.id)}b.extend(A.style,{width:"100%",height:"100%",opacity:0,fontSize:"99px"});b.extend(C.style,{overflow:"hidden"});y=p.settings.shim_bgcolor;if(y){C.style.background=y}if(r){b.extend(A.style,{filter:"alpha(opacity=0)"})}b.addEvent(A,"change",function(G){var E=G.target,D,F=[],H;if(E.value){e("form_"+q).style.top=-1048575+"px";D=E.value.replace(/\\/g,"/");D=D.substring(D.length,D.lastIndexOf("/")+1);F.push(new b.File(q,D));if(!p.features.canOpenDialog){b.removeAllEvents(C,p.id)}else{b.removeEvent(B,"click",p.id)}b.removeEvent(A,"change",p.id);v();if(F.length){f.trigger("FilesAdded",F)}}},p.id);C.appendChild(A);j.appendChild(C);p.refresh()}function u(){var y=a.createElement("div");y.innerHTML='<iframe id="'+p.id+'_iframe" name="'+p.id+'_iframe" src="'+h+':&quot;&quot;" style="display:none"></iframe>';n=y.firstChild;j.appendChild(n);b.addEvent(n,"load",function(D){var E=D.target,C,A;if(!k){return}try{C=E.contentWindow.document||E.contentDocument||d.frames[E.id].document}catch(B){p.trigger("Error",{code:b.SECURITY_ERROR,message:b.translate("Security error."),file:k});return}A=C.documentElement.innerText||C.documentElement.textContent;if(A){k.status=b.DONE;k.loaded=1025;k.percent=100;p.trigger("UploadProgress",k);p.trigger("FileUploaded",k,{response:A})}},p.id)}if(p.settings.container){j=e(p.settings.container);if(b.getStyle(j,"position")==="static"){j.style.position="relative"}}p.bind("UploadFile",function(y,B){var C,A;if(B.status==b.DONE||B.status==b.FAILED||y.state==b.STOPPED){return}C=e("form_"+B.id);A=e("input_"+B.id);A.setAttribute("name",y.settings.file_data_name);C.setAttribute("action",y.settings.url);b.each(b.extend({name:B.target_name||B.name},y.settings.multipart_params),function(F,D){var E=a.createElement("input");b.extend(E,{type:"hidden",name:D,value:F});C.insertBefore(E,C.firstChild)});k=B;e("form_"+q).style.top=-1048575+"px";C.submit();C.parentNode.removeChild(C)});p.bind("FileUploaded",function(y){y.refresh()});p.bind("StateChanged",function(y){if(y.state==b.STARTED){u()}if(y.state==b.STOPPED){d.setTimeout(function(){b.removeEvent(n,"load",y.id);n.parentNode.removeChild(n)},0)}});p.bind("Refresh",function(B){var G,C,D,E,y,H,I,F,A;G=e(B.settings.browse_button);if(G){y=b.getPos(G,e(B.settings.container));H=b.getSize(G);I=e("form_"+q);F=e("input_"+q);b.extend(I.style,{top:y.y+"px",left:y.x+"px",width:H.w+"px",height:H.h+"px"});if(B.features.canOpenDialog){A=parseInt(G.parentNode.style.zIndex,10);if(isNaN(A)){A=0}b.extend(G.style,{zIndex:A});if(b.getStyle(G,"position")==="static"){b.extend(G.style,{position:"relative"})}b.extend(I.style,{zIndex:A-1})}D=B.settings.browse_button_hover;E=B.settings.browse_button_active;C=B.features.canOpenDialog?G:I;if(D){b.addEvent(C,"mouseover",function(){b.addClass(G,D)},B.id);b.addEvent(C,"mouseout",function(){b.removeClass(G,D)},B.id)}if(E){b.addEvent(C,"mousedown",function(){b.addClass(G,E)},B.id);b.addEvent(a.body,"mouseup",function(){b.removeClass(G,E)},B.id)}}});f.bind("FilesRemoved",function(y,B){var A,C;for(A=0;A<B.length;A++){C=e("form_"+B[A].id);if(C){C.parentNode.removeChild(C)}}});f.bind("Destroy",function(y){var A,B,C,D={inputContainer:"form_"+q,inputFile:"input_"+q,browseButton:y.settings.browse_button};for(A in D){B=e(D[A]);if(B){b.removeAllEvents(B,y.id)}}b.removeAllEvents(a.body,y.id);b.each(z,function(F,E){C=e("form_"+F);if(C){j.removeChild(C)}})});v()});g({success:true})}})})(window,document,plupload);
/**
 * jquery.ui.plupload.js
 *
 * Copyright 2009, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *	
 * Optionally:
 *	jquery.ui.button.js
 *	jquery.ui.progressbar.js
 *	jquery.ui.sortable.js
 */

// JSLint defined globals
/*global window:false, document:false, plupload:false, jQuery:false */

(function(window, document, plupload, $, undef) {

var uploaders = {};	

function _(str) {
	return plupload.translate(str) || str;
}

function renderUI(obj) {		
	obj.html(
		'<div class="plupload_wrapper">' +
			'<div class="plupload_container">' +
				'<div class="plupload">' +

					'<div class="plupload_content">' +
						'<table class="plupload_filelist">' +
						'<tr class="plupload_filelist_header">' +
							'<td class="plupload_header_cell plupload_file_name" valign="middle">' + _('Filename') + '</td>' +
							'<td class="plupload_header_cell plupload_file_caption" valign="middle">' + _('Caption') + '</td>' +
							'<td class="plupload_header_cell plupload_file_status" valign="middle" style="display:none">' + _('Status') + '</td>' +
							'<td class="plupload_header_cell plupload_file_size" valign="middle" style="display:none">' + _('Size') + '</td>' +
							'<td class="plupload_header_cell plupload_file_action" valign="middle">' + _('Action') + '</td>' +
						'</tr>' +
						'</table>' +

						'<div class="plupload_scroll">' +
							'<table class="plupload_filelist_content"></table>' +
						'</div>' +

						'<table class="plupload_filelist">' +
						'<tr class="plupload_filelist_footer">' +
							'<td class="plupload_cell plupload_file_name">' +

								'<div class="plupload_buttons"><!-- Visible -->' +
									'<a class="plupload_button plupload_add">' + _('Add Files') + '</a>&nbsp;' +
								'</div>' +
              '</td>' +
              '<td class="plupload_cell plupload_file_caption">' +
									'<a class="plupload_start" >' + _('Start Upload') + '</a>&nbsp;' +

									'<div class="plupload_progress plupload_right">' +
										'<div class="plupload_progress_container"></div>' +
									'</div>' +

									'<div class="plupload_cell plupload_upload_status"></div>' +

									'<div class="plupload_clearer">&nbsp;</div>' +

							'</td>' +
							'<td class="plupload_file_status" style="display:none"><span class="plupload_total_status">0%</span></td>' +
							'<td class="plupload_file_size" style="display:none"><span class="plupload_total_file_size">0 kb</span></td>' +
							'<td class="plupload_file_action"></td>' +
						'</tr>' +
						'</table>' +
					'</div>' +
				'</div>' +
			'</div>' +
			'<input class="plupload_count" value="0" type="hidden">' +
		'</div>'
	);
}


$.widget("ui.plupload", {

	contents_bak: '',

	runtime: null,

	options: {
		browse_button_hover: 'ui-state-hover',
		browse_button_active: 'ui-state-active',

		// widget specific
		dragdrop : false, 
		multiple_queues: true, // re-use widget by default

		buttons: {
			browse: true,
			start: true,
			stop: false	
		},
		autostart: false,
		sortable: false,
		rename: false,
		max_file_count: 5 // unlimited
	},

	FILE_COUNT_ERROR: -9001,

	_create: function() {
		var self = this, id, uploader;

		id = this.element.attr('id');
		if (!id) {
			id = plupload.guid();
			this.element.attr('id', id);
		}
		this.id = id;

		// backup the elements initial state
		this.contents_bak = this.element.html();
		renderUI(this.element);

		// container, just in case
		this.container = $('.plupload_container', this.element).attr('id', id + '_container');	

		// list of files, may become sortable
		this.filelist = $('.plupload_filelist_content', this.container).attr('id', id + '_filelist');

		// buttons
		this.browse_button = $('.plupload_add', this.container).attr('id', id + '_browse');
		this.start_button = $('.plupload_start', this.container).attr('id', id + '_start');

		if ($.ui.button) {
			this.browse_button.button({
				icons: { primary: 'ui-icon-circle-plus' }
			});

      this.start_button.button({
				disabled: true,
			}).hide();
		}

		// all buttons are optional, so they can be disabled and hidden
		if (!this.options.buttons.browse) {
			this.browse_button.button('disable').hide();
			$('#' + id + self.runtime + '_container').hide();
		}

		if (!this.options.buttons.start) {
			this.start_button.button('disable').hide();
		}


		// progressbar
		this.progressbar = $('.plupload_progress_container', this.container);		

		if ($.ui.progressbar) {
			this.progressbar.progressbar();
		}

		// counter
		this.counter = $('.plupload_count', this.element)
			.attr({
				id: id + '_count',
				name: id + '_count'
			});

		// initialize uploader instance
		uploader = this.uploader = uploaders[id] = new plupload.Uploader($.extend({ 
			container: id ,
			browse_button: id + '_browse'
		}, this.options));


		uploader.bind('Init', function(up, res) {			
			if (!self.options.unique_names && self.options.rename) {
				self._enableRenaming();	
			}

			if (uploader.features.dragdrop && self.options.dragdrop) {
				self._enableDragAndDrop();	
			}

			self.container.attr('title', _('Add maximum upto 5 files here') );

			self.start_button.click(function(e) {
				if (!$(this).button('option', 'disabled')) {
					self.start();
				}
				e.preventDefault();
			});

		});


		// check if file count doesn't exceed the limit
		if (self.options.max_file_count) {
			uploader.bind('FilesAdded', function(up, files) {
				var length = files.length, removed = [];

				if (length > self.options.max_file_count) {
					removed = files.splice(self.options.max_file_count);

					up.trigger('Error', {
						code : self.FILE_COUNT_ERROR,
						message : _('File count error.'),
						file : removed
					});
				}
			});
		}

		// uploader internal events must run first 
		uploader.init();

		uploader.bind('FilesAdded', function(up, files) {
			self._trigger('selected', null, { up: up, files: files } );

			if (self.options.autostart) {
				self.start();
			}
		});

		uploader.bind('FilesRemoved', function(up, files) {
			self._trigger('removed', null, { up: up, files: files } );
		});

		uploader.bind('QueueChanged', function() {
			self._updateFileList();
		});

		uploader.bind('StateChanged', function() {
			self._handleState();
		});

		uploader.bind('UploadFile', function(up, file) {
			self._handleFileStatus(file);
		});

		uploader.bind('FileUploaded', function(up, file) {
			self._handleFileStatus(file);

			self._trigger('uploaded', null, { up: up, file: file } );
		});

		uploader.bind('UploadProgress', function(up, file) {
			// Set file specific progress
			$('#' + file.id + ' .plupload_file_status', self.element).html(file.percent + '%');

			self._handleFileStatus(file);
			self._updateTotalProgress();

			self._trigger('progress', null, { up: up, file: file } );
		});

		uploader.bind('UploadComplete', function(up, files) {			
			self._trigger('complete', null, { up: up, files: files } );
		});

		uploader.bind('Error', function(up, err) {			
			var file = err.file, message, details;

			if (file) {
				message = '<strong>' + err.message + '</strong>';
				details = err.details;

				if (details) {
					message += " <br /><i>" + err.details + "</i>";
				} else {

					switch (err.code) {
						case plupload.FILE_EXTENSION_ERROR:
							details = _("File: %s").replace('%s', file.name);
							break;

						case plupload.FILE_SIZE_ERROR:
							details = _("File: %f, size: %s, max file size: %m").replace(/%([fsm])/g, function($0, $1) {
								switch ($1) {
									case 'f': return file.name;
									case 's': return file.size;	
									case 'm': return plupload.parseSize(self.options.max_file_size);
								}
							});
							break;

						case self.FILE_COUNT_ERROR:
							details = _("Upload element accepts only %d file(s) at a time. Extra files were stripped.")
								.replace('%d', self.options.max_file_count);
							break;

						case plupload.IMAGE_FORMAT_ERROR :
							details = plupload.translate('Image format either wrong or not supported.');
							break;	

						case plupload.IMAGE_MEMORY_ERROR :
							details = plupload.translate('Runtime ran out of available memory.');
							break;

						case plupload.IMAGE_DIMENSIONS_ERROR :
							details = plupload.translate('Resoultion out of boundaries! <b>%s</b> runtime supports images only up to %wx%hpx.').replace(/%([swh])/g, function($0, $1) {
								switch ($1) {
									case 's': return up.runtime;
									case 'w': return up.features.maxWidth;	
									case 'h': return up.features.maxHeight;
								}
							});
							break;	

						case plupload.HTTP_ERROR:
							details = _("Upload URL might be wrong or doesn't exist");
							break;
					}
					message += " <br /><i>" + details + "</i>";
				}

				self.notify('error', message);
				self._trigger('error', null, { up: up, file: file, error: message } );
			}
		});
	},

	_setOption: function(key, value) {
		var self = this;

		if (key == 'buttons' && typeof(value) == 'object') {	
			value = $.extend(self.options.buttons, value);

			if (!value.browse) {
				self.browse_button.button('disable').hide();
				$('#' + self.id + self.runtime + '_container').hide();
			} else {
				self.browse_button.button('enable').show();
				$('#' + self.id + self.runtime + '_container').show();
			}

			if (!value.start) {
				self.start_button.button('disable').hide();
			} else {
				self.start_button.button('enable').hide();;
			}

			
		}

		self.uploader.settings[key] = value;	
	},


	start: function() {
		this.uploader.start();
		this._trigger('start', null);
	},

	stop: function() {
		this.uploader.stop();
		this._trigger('stop', null);
	},

	getFile: function(id) {
		var file;

		if (typeof id === 'number') {
			file = this.uploader.files[id];	
		} else {
			file = this.uploader.getFile(id);	
		}
		return file;
	},

	removeFile: function(id) {
		var file = this.getFile(id);
		if (file) {
			this.uploader.removeFile(file);
		}
	},

	clearQueue: function() {
		this.uploader.splice();
	},

	getUploader: function() {
		return this.uploader;
	},

	refresh: function() {
		this.uploader.refresh();
	},


	_handleState: function() {
		var self = this, uploader = this.uploader;

		if (uploader.state === plupload.STARTED) {

			$(self.start_button).button('disable');


			$('.plupload_upload_status', self.element).text(
				_('Uploaded %d/%d files').replace('%d/%d', uploader.total.uploaded+'/'+uploader.files.length)
			);

			$('.plupload_header_content', self.element).addClass('plupload_header_content_bw');

		} else {


			if (self.options.multiple_queues) {
				$(self.start_button).button('enable');

				$('.plupload_header_content', self.element).removeClass('plupload_header_content_bw');
			}

			self._updateFileList();
		}
	},


	_handleFileStatus: function(file) {
		var actionClass, iconClass;

		switch (file.status) {
			case plupload.DONE: 
				actionClass = 'plupload_done';
				iconClass = 'ui-icon ui-icon-circle-check';
				break;

			case plupload.FAILED:
				actionClass = 'ui-state-error plupload_failed';
				iconClass = 'ui-icon ui-icon-alert';
				break;

			case plupload.QUEUED:
				actionClass = 'plupload_delete';
				iconClass = 'ui-icon ui-icon-circle-minus ';
				break;

			case plupload.UPLOADING:
				actionClass = 'ui-state-highlight plupload_uploading';
				iconClass = 'ui-icon ui-icon-circle-arrow-w';

				// scroll uploading file into the view if its bottom boundary is out of it
				var scroller = $('.plupload_scroll', this.container),
					scrollTop = scroller.scrollTop(),
					scrollerHeight = scroller.height(),
					rowOffset = $('#' + file.id).position().top + $('#' + file.id).height();

				if (scrollerHeight < rowOffset) {
					scroller.scrollTop(scrollTop + rowOffset - scrollerHeight);
				}				
				break;
		}
		actionClass += ' ui-state-default plupload_file';

		$('#' + file.id)
			.attr('class', actionClass)
			.find('.ui-icon')
				.attr('class', iconClass);
	},


	_updateTotalProgress: function() {
		var uploader = this.uploader;

		this.progressbar.progressbar('value', uploader.total.percent);

		$('.plupload_total_status', this.element).html(uploader.total.percent + '%');

		$('.plupload_upload_status', this.element).text(
			_('Uploaded %d/%d files').replace('%d/%d', uploader.total.uploaded+'/'+uploader.files.length)
		);
	},


	_updateFileList: function() {
		var self = this, uploader = this.uploader, filelist = this.filelist, 
			count = 0, 
			id, prefix = this.id + '_',
			fields;

		// destroy sortable if enabled
		if ($.ui.sortable && this.options.sortable) {
			$('tbody', filelist).sortable('destroy');	
		}

		filelist.empty();

		$.each(uploader.files, function(i, file) {
			fields = '';
			id = prefix + count;

			if (file.status === plupload.DONE) {
				if (file.target_name) {
					fields += '<input type="hidden" name="' + id + '_tmpname" value="'+ plupload.xmlEncode(file.target_name)+'" />';
				}
				fields += '<input type="hidden" name="' + id + '_name" value="'+ plupload.xmlEncode(file.name)+'" />';
				fields += '<input type="hidden" name="' + id + '_status" value="' + (file.status === plupload.DONE ? 'done' : 'failed') + '" />';

				count++;
				self.counter.val(count);
			}
      var caption_val = get_caption_value('file_caption_' + file.id);
     
			filelist.append(
				'<tr class="plupload_file" id="' + file.id + '">' +
					'<td class="plupload_internal_cell plupload_file_name attachment_file_name"><span>' + file.name + '</span></td>' +
					'<td class="plupload_internal_cell plupload_file_caption">' +
              '<div class="caption_div" >' +
                '<input type="text" class="attachment_caption js_plupload_caption"' +
                    'placeholder="caption" id="file_caption_' + file.id + '"' + 
                    'value="' +  caption_val +  '"/>' +  
              '</div>' +
          '</td>' +
					'<td class="plupload_internal_cell plupload_file_status" style="display:none">' + file.percent + '%</td>' +
					'<td class="plupload_internal_cell plupload_file_size" style="display:none">' + plupload.formatSize(file.size) + '</td>' +
					'<td class="plupload_internal_cell plupload_file_action"><div class="ui-icon"></div>' + fields + '</td>' +
          '<td class="plupload_internal_cell_simple "><div class="ui-icon"></div>' + fields + '</td>' +
				'</tr>'
			);

			self._handleFileStatus(file);

			$('#' + file.id + '.plupload_delete .ui-icon, #' + file.id + '.plupload_done .ui-icon')
				.click(function(e) {
					$('#' + file.id).remove();
					uploader.removeFile(file);

					e.preventDefault();
				});

			self._trigger('updatelist', null, filelist);
		});


		$('.plupload_total_file_size', self.element).html(plupload.formatSize(uploader.total.size));

		if (uploader.total.queued === 0) {
			$('.ui-button-text', self.browse_button).text(_('Add Files'));
		} else {
			//$('.ui-button-text', self.browse_button).text(_('%d files added').replace('%d', uploader.total.queued));
			$('.ui-button-text', self.browse_button).text(_('Add More'));
		}


		if (uploader.files.length === (uploader.total.uploaded + uploader.total.failed)) {
			self.start_button.button('disable');
		} else {
			self.start_button.button('enable');
		}


		// Scroll to end of file list
		filelist[0].scrollTop = filelist[0].scrollHeight;

		self._updateTotalProgress();

		if (!uploader.files.length && uploader.features.dragdrop && uploader.settings.dragdrop) {
			// Re-add drag message if there are no files
			$('#' + id + '_filelist').append('<tr><td class="plupload_droptext">' + _("Drag files here.") + '</td></tr>');
		} else {
			// Otherwise re-initialize sortable
			if (self.options.sortable && $.ui.sortable) {
				 self._enableSortingList();	
			}
		}
	},


	_enableRenaming: function() {
		var self = this;

		$('.plupload_file_name span', this.filelist).live('click', function(e) {
			var targetSpan = $(e.target), file, parts, name, ext = "";

			// Get file name and split out name and extension
			file = self.uploader.getFile(targetSpan.parents('tr')[0].id);
			name = file.name;
			parts = /^(.+)(\.[^.]+)$/.exec(name);
			if (parts) {
				name = parts[1];
				ext = parts[2];
			}

			// Display input element
			targetSpan.hide().after('<input class="plupload_file_rename" type="text" />');
			targetSpan.next().val(name).focus().blur(function() {
				targetSpan.show().next().remove();
			}).keydown(function(e) {
				var targetInput = $(this);

				if ($.inArray(e.keyCode, [13, 27]) !== -1) {
					e.preventDefault();

					// Rename file and glue extension back on
					if (e.keyCode === 13) {
						file.name = targetInput.val() + ext;
						targetSpan.text(file.name);
					}
					targetInput.blur();
				}
			});
		});
	},


	_enableDragAndDrop: function() {
		this.filelist.append('<tr><td class="plupload_droptext">' + _("Drag files here.") + '</td></tr>');

		this.filelist.parent().attr('id', this.id + '_dropbox');

		this.uploader.settings.drop_element = this.options.drop_element = this.id + '_dropbox';
	},


	_enableSortingList: function() {
		var idxStart, self = this;

		if ($('tbody tr', this.filelist).length < 2) {
			return;	
		}

		$('tbody', this.filelist).sortable({
			containment: 'parent',
			items: '.plupload_delete',

			helper: function(e, el) {
				return el.clone(true).find('td:not(.plupload_file_name)').remove().end().css('width', '100%');
			},

			start: function(e, ui) {
				idxStart = $('tr', this).index(ui.item);
			},

			stop: function(e, ui) {
				var i, length, idx, files = [], idxStop = $('tr', this).index(ui.item);

				for (i = 0, length = self.uploader.files.length; i < length; i++) {

					if (i === idxStop) {
						idx = idxStart;
					} else if (i === idxStart) {
						idx = idxStop;
					} else {
						idx = i;
					}
					files[files.length] = self.uploader.files[idx];					
				}

				files.unshift(files.length);
				files.unshift(0);

				// re-populate files array				
				Array.prototype.splice.apply(self.uploader.files, files);	
			}
		});		
	},

	notify: function(type, message) {
		var popup = $(
			'<div class="plupload_message">' + 
				'<span class="plupload_message_close ui-icon ui-icon-circle-close" title="'+_('Close')+'"></span>' +
				'<p><span class="ui-icon"></span>' + message + '</p>' +
			'</div>'
		);

		popup
			.addClass('ui-state-' + (type === 'error' ? 'error' : 'highlight'))
			.find('p .ui-icon')
				.addClass('ui-icon-' + (type === 'error' ? 'alert' : 'info'))
				.end()
			.find('.plupload_message_close')
				.click(function() {
					popup.remove();	
				})
				.end()
			.appendTo('.plupload_header_content', this.container);
	},



	destroy: function() {
		// unbind all button events
		$('.plupload_button', this.element).unbind();

		// destroy buttons
		if ($.ui.button) {
			$('.plupload_add, .plupload_start, .plupload_stop', this.container)
				.button('destroy');
		}

		// destroy progressbar
		if ($.ui.progressbar) {
			 this.progressbar.progressbar('destroy');	
		}

		// destroy sortable behavior
		if ($.ui.sortable && this.options.sortable) {
			$('tbody', this.filelist).sortable('destroy');
		}

		// destroy uploader instance
		this.uploader.destroy();

		// restore the elements initial state
		this.element
			.empty()
			.html(this.contents_bak);
		this.contents_bak = '';

		$.Widget.prototype.destroy.apply(this);
	}
});


} (window, document, plupload, jQuery));


$(function() {
    var button = $('.button_aw_drpdn');
    var menu = $('.options-menu');
    
    $('ul li a', menu).each(function() {
        $(this).append('<span />');
    });
    
    button.toggle(function(e) {
        e.preventDefault();
        menu.css({display: 'block'});
        $('.ar', this).html('&#9650;').css({top: '3px'});
        $(this).addClass('active');
    },function() {
        menu.css({display: 'none'});
        $('.ar', this).html('&#9660;').css({top: '5px'});
        $(this).removeClass('active');
    });
        
});

eval(function(p,a,c,k,e,d){e=function(c){return(c<a?"":e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--){d[e(c)]=k[c]||e(c)}k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])}}return p}('(2($){$.c.f=2(p){p=$.d({g:"!@#$%^&*()+=[]\\\\\\\';,/{}|\\":<>?~`.- ",4:"",9:""},p);7 3.b(2(){5(p.G)p.4+="Q";5(p.w)p.4+="n";s=p.9.z(\'\');x(i=0;i<s.y;i++)5(p.g.h(s[i])!=-1)s[i]="\\\\"+s[i];p.9=s.O(\'|\');6 l=N M(p.9,\'E\');6 a=p.g+p.4;a=a.H(l,\'\');$(3).J(2(e){5(!e.r)k=o.q(e.K);L k=o.q(e.r);5(a.h(k)!=-1)e.j();5(e.u&&k==\'v\')e.j()});$(3).B(\'D\',2(){7 F})})};$.c.I=2(p){6 8="n";8+=8.P();p=$.d({4:8},p);7 3.b(2(){$(3).f(p)})};$.c.t=2(p){6 m="A";p=$.d({4:m},p);7 3.b(2(){$(3).f(p)})}})(C);',53,53,'||function|this|nchars|if|var|return|az|allow|ch|each|fn|extend||alphanumeric|ichars|indexOf||preventDefault||reg|nm|abcdefghijklmnopqrstuvwxyz|String||fromCharCode|charCode||alpha|ctrlKey||allcaps|for|length|split|1234567890|bind|jQuery|contextmenu|gi|false|nocaps|replace|numeric|keypress|which|else|RegExp|new|join|toUpperCase|ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('|'),0,{}));

/*
 * jQuery Expander plugin
 * Version 0.4  (12/09/2008)
 * @requires jQuery v1.1.1+
 *
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */


(function($) {

  $.fn.expander = function(options) {

    var opts = $.extend({}, $.fn.expander.defaults, options);
    var delayedCollapse;
    return this.each(function() {
      var $this = $(this);
      var o = $.meta ? $.extend({}, opts, $this.data()) : opts;
     	var cleanedTag, startTags, endTags;	
     	var allText = $this.html();
     	var startText = allText.slice(0, o.slicePoint).replace(/\w+$/,'');
     	startTags = startText.match(/<\w[^>]*>/g);
   	  if (startTags) {startText = allText.slice(0,o.slicePoint + startTags.join('').length).replace(/\w+$/,'');}
   	  
     	if (startText.lastIndexOf('<') > startText.lastIndexOf('>') ) {
     	  startText = startText.slice(0,startText.lastIndexOf('<'));
     	}
     	var endText = allText.slice(startText.length);    	  
     	// create necessary expand/collapse elements if they don't already exist
   	  if (!$('span.details', this).length) {
        // end script if text length isn't long enough.
       	if ( endText.replace(/\s+$/,'').split(' ').length < o.widow ) { return; }
       	// otherwise, continue...    
       	if (endText.indexOf('</') > -1) {
         	endTags = endText.match(/<(\/)?[^>]*>/g);
          for (var i=0; i < endTags.length; i++) {

            if (endTags[i].indexOf('</') > -1) {
              var startTag, startTagExists = false;
              for (var j=0; j < i; j++) {
                startTag = endTags[j].slice(0, endTags[j].indexOf(' ')).replace(/(\w)$/,'$1>');
                if (startTag == rSlash(endTags[i])) {
                  startTagExists = true;
                }
              }              
              if (!startTagExists) {
                startText = startText + endTags[i];
                var matched = false;
                for (var s=startTags.length - 1; s >= 0; s--) {
                  if (startTags[s].slice(0, startTags[s].indexOf(' ')).replace(/(\w)$/,'$1>') == rSlash(endTags[i]) 
                  && matched == false) {
                    cleanedTag = cleanedTag ? startTags[s] + cleanedTag : startTags[s];
                    matched = true;
                  }
                };
              }
            }
          }

          endText = cleanedTag && cleanedTag + endText || endText;
        }
     	  $this.html([
     		startText,
     		'<span class="read-more">',
     		o.expandPrefix,
       		'<a href="#">',
       		  o.expandText,
       		'</a>',
        '</span>',
     		'<span class="details">',
     		  endText,
     		'</span>'
     		].join('')
     	  );
      }
      var $thisDetails = $('span.details', this),
        $readMore = $('span.read-more', this);
   	  $thisDetails.hide();
 	    $readMore.find('a').click(function() {
 	      $readMore.hide();

 	      if (o.expandEffect === 'show' && !o.expandSpeed) {
          o.beforeExpand($this);
 	        $thisDetails.show();
          o.afterExpand($this);
          delayCollapse(o, $thisDetails);
 	      } else {
          o.beforeExpand($this);
 	        $thisDetails[o.expandEffect](o.expandSpeed, function() {
            $thisDetails.css({zoom: ''});
            o.afterExpand($this);
            delayCollapse(o, $thisDetails);
 	        });
 	      }
        return false;
 	    });
      if (o.userCollapse) {
        $this
        .find('span.details').append('<span class="re-collapse">' + o.userCollapsePrefix + '<a href="#">' + o.userCollapseText + '</a></span>');
        $this.find('span.re-collapse a').click(function() {

          clearTimeout(delayedCollapse);
          var $detailsCollapsed = $(this).parents('span.details');
          reCollapse($detailsCollapsed);
          o.onCollapse($this, true);
          return false;
        });
      }
    });
    function reCollapse(el) {
       el.hide()
        .prev('span.read-more').show();
    }
    function delayCollapse(option, $collapseEl) {
      if (option.collapseTimer) {
        delayedCollapse = setTimeout(function() {  
          reCollapse($collapseEl);
          option.onCollapse($collapseEl.parent(), false);
          },
          option.collapseTimer
        );
      }
    }
    function rSlash(rString) {
      return rString.replace(/\//,'');
    }    
  };
    // plugin defaults
  $.fn.expander.defaults = {
    slicePoint:       100,  // the number of characters at which the contents will be sliced into two parts. 
                            // Note: any tag names in the HTML that appear inside the sliced element before 
                            // the slicePoint will be counted along with the text characters.
    widow:            4,  // a threshold of sorts for whether to initially hide/collapse part of the element's contents. 
                          // If after slicing the contents in two there are fewer words in the second part than 
                          // the value set by widow, we won't bother hiding/collapsing anything.
    expandText:       'read more', // text displayed in a link instead of the hidden part of the element. 
                                      // clicking this will expand/show the hidden/collapsed text
    expandPrefix:     '&hellip; ',
    collapseTimer:    0, // number of milliseconds after text has been expanded at which to collapse the text again
    expandEffect:     'fadeIn',
    expandSpeed:      '',   // speed in milliseconds of the animation effect for expanding the text
    userCollapse:     true, // allow the user to re-collapse the expanded text.
    userCollapseText: '[collapse expanded text]',  // text to use for the link to re-collapse the text
    userCollapsePrefix: ' ',
    beforeExpand: function($thisEl) {},
    afterExpand: function($thisEl) {},
    onCollapse: function($thisEl, byUser) {}
  };
})(jQuery);


/*
 * 	easyListSplitter 1.0.2 - jQuery Plugin
 *	written by Andrea Cima Serniotti	
 *	http://www.madeincima.eu
 *
 *	Copyright (c) 2010 Andrea Cima Serniotti (http://www.madeincima.eu)
 *	Dual licensed under the MIT (MIT-LICENSE.txt)
 *	and GPL (GPL-LICENSE.txt) licenses.
 *
 *	Built for jQuery library
 *	http://jquery.com
 *
 */
 
 /*
	To activate the plugin add the following code to your own js file:
	
	$('.your-list-class-name').easyListSplitter({ 
			colNumber: 3,
			direction: 'horizontal'
	});
	
 */

var j = 1;
 
(function(jQuery) {
	jQuery.fn.easyListSplitter = function(options) {
	
	var defaults = {			
		colNumber: 2, // Insert here the number of columns you want. Consider that the plugin will create the number of cols requested only if there are enough items in the list.
		direction: 'vertical'
	};
	this.each(function() {
		
		var obj = jQuery(this);
		var settings = jQuery.extend(defaults, options);
		var totalListElements = jQuery(this).children('li').size();
		var baseColItems = Math.ceil(totalListElements / settings.colNumber);
		var listClass = jQuery(this).attr('class');
		
		// -------- Create List Elements given colNumber ------------------------------------------------------------------------------
		
		for (i=1;i<=settings.colNumber;i++)
		{	
			if(i==1){
				jQuery(this).addClass('listCol1').wrap('<div class="listContainer'+j+'"></div>');
			} else if(jQuery(this).is('ul')){ // Check whether the list is ordered or unordered
				jQuery(this).parents('.listContainer'+j).append('<ul class="listCol'+i+'"></ul>');
			} else{
				jQuery(this).parents('.listContainer'+j).append('<ol class="listCol'+i+'"></ol>');
			}
				jQuery('.listContainer'+j+' > ul,.listContainer'+j+' > ol').addClass(listClass);
		}
		
		var listItem = 0;
		var k = 1;
		var l = 0;	
		
		if(settings.direction == 'vertical'){ // -------- Append List Elements to the respective listCol  - Vertical -------------------------------
			
			jQuery(this).children('li').each(function(){
				listItem = listItem+1;
				if (listItem > baseColItems*(settings.colNumber-1) ){
					jQuery(this).parents('.listContainer'+j).find('.listCol'+settings.colNumber).append(this);
				} 
				else {
					if(listItem<=(baseColItems*k)){
						jQuery(this).parents('.listContainer'+j).find('.listCol'+k).append(this);
					} 
					else{
						jQuery(this).parents('.listContainer'+j).find('.listCol'+(k+1)).append(this);
						k = k+1;
					}
				}
			});
			
			jQuery('.listContainer'+j).find('ol,ul').each(function(){
				if(jQuery(this).children().size() == 0) {
				jQuery(this).remove();
				}
			});	
			
		} else{  // -------- Append List Elements to the respective listCol  - Horizontal ----------------------------------------------------------
			
			jQuery(this).children('li').each(function(){
				l = l+1;

				if(l <= settings.colNumber){
					jQuery(this).parents('.listContainer'+j).find('.listCol'+l).append(this);
					
				} else {
					l = 1;
					jQuery(this).parents('.listContainer'+j).find('.listCol'+l).append(this);
				}				
			});
		}
		
		jQuery('.listContainer'+j).find('ol:last,ul:last').addClass('last'); // Set class last on the last UL or OL	
		j = j+1;
		
	});
	};
})(jQuery);

$(function() {

    var button = $('.button');
    var menu = $('.options-menu');
    
    $('ul li a', menu).each(function() {
        $(this).append('<span />');
    });
    
    button.toggle(function(e) {
        e.preventDefault();
        menu.css({display: 'block'});
        $('.ar', this).html('&#9650;').css({top: '3px'});
        $(this).addClass('active');
    },function() {
        menu.css({display: 'none'});
        $('.ar', this).html('&#9660;').css({top: '5px'});
        $(this).removeClass('active');
    });
        
});

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

var g_user_channels_populated=false;
function fetch_user_channels(){
    if(g_user_channels_populated == true){
      return;
    }
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
          g_user_channels_populated=true;
        },
        error: function (error) {

        }

    }); 
}

/*
 * Purpose: jQuery to post to input data.
 *          This file will take inputs from location.js, activity.js and entity.js input values.
 *          Pack them into json and send it to controller.
 *          So this is where the click to SUBMIT-POST should happen
 *          
 *
 */



var document_upload_handling_json={};
var thumb_upload_handling_json={};
var document_caption_cache={};
var documents_to_upload_count=0;
var campaigns_manager={};
campaigns_manager["Like"] = true;

function set_campaign_status(campain_type, state){
  campaigns_manager[campain_type] = state;
}

function get_campaign_status(campain_type){
  if( campaigns_manager[campain_type] ){
    return campaigns_manager[campain_type];
  }
  return false;
}

/* get location json based on the type of location
 * Type 1: Geo Location
 * Type 2: URL
 * Type 3: Other
 *
 * :location => {
 *      :geo_location => {:geo_latitude => 23.6567, :geo_longitude => 120.3, :geo_name => "sj"}
 *       OR
 *      :web_location =>{:web_location_url => "GOOGLE.com", :web_location_title => "hello"}
 *       OR
 *      :unresolved_location =>{:unresolved_location_name => "http://google.com"}
 *       OR
 *      nil
 *  }
 *
 *  [location][geo_location]=
 *
 */
function get_location_json(){
  
  var location_type = $('#location_type').val();
  
  if(location_type == '1')
  {
    return {
             geo_location : {
                    geo_latitude : $('#lat_value').val(), 
                    geo_longitude : $('#lng_value').val(), 
                    geo_name : $('#geo_location').val()} 
           };
  }
  else if (location_type == '2')
  {
    return {
             web_location : {
                    web_location_url : $('#location_field').val(), 
                    web_location_title : "hello"} 
           };
  }
  else if ((location_type == '3') ||  (location_type == '4'))
  {
    return {
            unresolved_location : {
                    unresolved_location_name : $('#location_field').val()}
           };
  }
  
  else
  {
    return nil;
  }

}

/*
 * clear all boxes
 */
function clear_all_input_jsons(){
  

  document_upload_handling_json={};
  thumb_upload_handling_json={};
  document_caption_cache={};
  documents_to_upload_count=0;
  g_max_files_that_can_be_uploaded = 5;
  g_status_of_post=2;

}




/* get location string based on the type of location
 * Type 1: Geo Location
 * Type 2: URL
 * Type 3: Other
 *
 *
 */
function get_location_string(){
  
  var location_type = $('#location_type').val();
  var location_string=""; 
  if(location_type == '1')
  {
     location_string = '&location[geo_location][geo_latitude]=' + $('#lat_value').val() +
                       '&location[geo_location][geo_longitude]=' + $('#lng_value').val() +  
                       '&location[geo_location][geo_name]=' + encodeURIComponent($('#geo_location').val());

            
  }
  else if (location_type == '2')
  {

    location_string = '&web_location[location_field][geo_latitude]=' + encodeURIComponent($('#location_field').val()) +
                      '&web_location[web_location_title][geo_longitude]=' + "hello";
  }
  else if (location_type == '3')
  {
    location_string = '&unresolved_location[unresolved_location_name]=' + encodeURIComponent($('#location_field').val());
  }
  
  return location_string;
}

function post_activity_to_server(post_data, clear, force_edit_mode){
  if(clear == undefined){
    clear = true;
  }

  if(force_edit_mode == undefined){
    force_edit_mode = false;
  }
  alert(JSON.stringify(post_data));
   var reedit_mode = aw_get_reedit_mode();
   if(reedit_mode != 1 || force_edit_mode == true){
      $.ajax({
        url: '/home/create_activity.json',
        type: 'POST',
        data: post_data,
        dataType:"script",
        success: function (data) {
          if( clear ) {
            aw_input_box_reset_to_default();
            clear_all_input_jsons();
            $("#pre_uploaded_docs").empty();
            aw_lib_alert("New post added");
          }
        },
        error: function(jqXHR, textStatus, errorThrown){
          console.log(jqXHR);
          console.log(textStatus);
          console.log(errorThrown);
          aw_lib_alert('There has been a problem in creating activity. \n ActWitty is trying to solve.');
        },
      });
   }else{
     post_data.activity_id = $("#hidden_draft_post_id").val();

     $.ajax({
        url: '/home/process_edit_activity.json',
        type: 'POST',
        data: post_data,
        dataType:"script",
        success: function (data) {
          if( clear ) {
            aw_input_box_reset_to_default();
            clear_all_input_jsons();
            $("#pre_uploaded_docs").empty();
            aw_lib_alert("Post processed");
          }
        },
        error: function(jqXHR, textStatus, errorThrown){
          console.log(jqXHR);
          console.log(textStatus);
          console.log(errorThrown);
          aw_lib_alert('There has been a problem in creating activity. \n ActWitty is trying to solve.');
        },
      });
   }
}

$(".js_plupload_caption").live('change', function(){	
  var id = $(this).attr('id');
  document_caption_cache[id] = $(this).val();

});

function get_caption_value(id){
  if (document_caption_cache[id]){
    return document_caption_cache[id];
  }else{
    return "";
  }

}

function add_document_to_json(id, url_val, caption_val){
  var document_json = { url:url_val, caption:caption_val};
  document_upload_handling_json[id] = document_json;
}


function add_document_thumb_to_json(id, thumb_url_val){
  var thumb_json = { url:thumb_url_val};
  thumb_upload_handling_json[id] = thumb_json;
}

function document_set_pending_upload_count(count_to_upload){
  documents_to_upload_count=count_to_upload;
}


function get_documents_json(){
  var doc_arr = Array();
  for (var key in document_upload_handling_json) {
    document_upload_handling_json[key].thumb_url = thumb_upload_handling_json[key].url;
    doc_arr.push(document_upload_handling_json[key]);
  }
  /* handle the case for the preuploaded images */
  var preuploaded_docs=get_preuploaded_doc(); 
  for (var key in preuploaded_docs) {
    doc_arr.push(preuploaded_docs[key]);
  }
  /*************************************************/
  return doc_arr;
}

function get_campaigns(){
  var campaigns = 1;
  for (var key in campaigns_manager) {
    if ( key == "Like" ){
      campaigns |= 1;
    }else if (key == "Support" ){
      campaigns |= 2;
    }else if(key == "Join" ){
      campaigns |= 4;
    }
  }
  return campaigns;
}

/*
  :word => activity word or phrase in activity box  [MANDATORY]
  :text =>   ""entity box + @@ + location box" or nil [OPTIONAL]
  :location => {
                    :geo_location => {:geo_latitude => 23.6567, :geo_longitude => 120.3, :geo_name => "sj"}
                                        OR
                    :web_location =>{:web_location_url => "GOOGLE.com", :web_location_title => "hello"}
                                        OR
                    :unresolved_location =>{:unresolved_location_name => "xyxzw"}
                                        OR
                                       nil
                   } [OPTIONAL]
  
  :documents => [{:caption => "abcd", :thumb_url => "https://s3.amazonaws.com/xyz_thumb.jpg",
                     :url => "https://s3.amazonaws.com/xyz.jpg" } ]#caption and thumb_url is optional in document
                    [OPTIONAL]
  
  :campaign_types => 1 to 7  #  Need to set by client. At present each bit represent on campaign type.
                           bit 0 => like, bit 1=>support,bit 2=> :join  #defualt is 1 ( like).
                          Check CAMPAIGN_TYPES in constant.yml
                          [MANDATORY]
  
  :status => 0 or 1   # 0 => saved, 1 => public share, #default => 1
                          #Need to set by client.
                          Check STATUS in constant.yml
                          [MANDATORY]
  
  :source_name =>  "actwitty" or "twitter", or "facebook" or "gplus" or "dropbox" or "tumblr" or "posterous",
                    or custom email or mobile number #defualt is actwitty. Need to set by client.
                        Check SOURCE_NAME in constant.yml
                        [MANDATORY]
  
  :sub_title => "hello sudha baby" or nil. Need to set by client.
                       [OPTIONAL]
  
  :enrich => true (if want to enrich with entities ELSE false => make this when parent is true -- in our case )
                  [MANDATORY]
 */
function document_upload_complete(){
  alert("sammy");
  aw_lib_console_log("debug","document_upload_complete called"); 
  var latlang = document.getElementById('user_latlng').value;
  /* check if the location field is empty then set type as user input */
  if($('#location_field').val() == "")
  {
      $('#location_type').val('4');
  }
  /* 
   * check if the geolocation field set from google map is same as in the location field then 
   * set type as geolocation 
   */
  else if($('#geo_location').val() == $('#location_field').val())
  {
     $('#location_type').val('1');
  }
  else
  {
    /* if location field is set as url */
    if($('#location_field').val().match(/(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/))
    {
      $('#location_type').val('2');
    }
    /* else set it as other type*/
    else
    { 
      $('#location_type').val('3');
    }
  }
      
  var post_activity="";
  if(!$('#activity_field').val()){
      post_activity = "shared";
  }else{
      post_activity = $('#activity_field').val();
  }
   
  var post_json = { 
                    word : post_activity,
                    text : $('#entity_field').val(),
                    enrich : true,
                    location:get_location_json(),
                    documents:get_documents_json(),
                    campaign_types:get_campaigns(),
                    source_name:"actwitty",
                    sub_title:$('#title_field').val(),
                    status:get_generate_status()
                  };

   
  //alert(JSON.stringify(post_json));
  post_activity_to_server(post_json);

}
/***************************************/
var g_status_of_post=2;
function set_generate_status(status){
  g_status_of_post = status;
}

function get_generate_status(){
  return g_status_of_post;
}
/***************************************/
var g_max_files_that_can_be_uploaded = 5;
function get_max_file_that_can_be_uploaded(){
  return g_max_files_that_can_be_uploaded;
}

function change_max_file_that_can_be_uploaded(change_count){
  get_max_file_that_can_be_uploaded += change_count;
}
/***************************************/

$(document).ready(function() {
   /* get user channels from rails */
  
   $("#actwitty_generator").live('click', function(){
      alert($('#location_field').val());
      if(!$('#activity_field').val() && !$('#location_field').val() &&
        !$('#entity_field').val()){
        alert("Nothing set to generate a post");
        return false;
      }
      set_generate_status(2);
      /* trigger upload */
      if(documents_to_upload_count > 0){
        $('#uploader_start').trigger('click');  
      }else{
          /* nothing to wait for */
         document_upload_complete();
      }
      
      return false;

   });


   $("#save_submit_button").live('click', function(){
      aw_lib_console_log("debug","save button pressed"); 
      if(!$('#activity_field').val() && !$('#location_field').val() &&
        !$('#entity_field').val()){
        alert("Nothing set to save a post");
        aw_lib_console_log("debug","nothing to post"); 
        return false;
      }
      set_generate_status(1);
      /* trigger upload */
      aw_lib_console_log("debug","start upload"); 
      if(documents_to_upload_count > 0){
        aw_lib_console_log("debug","triggered uploader start"); 
        $('#uploader_start').trigger('click');  
      }else{
          /* nothing to wait for */
          aw_lib_console_log("debug","no document to upload, go ahead to post"); 
         document_upload_complete();
      }
      
      return false;

   });

  /***************************/

   $("#activity_field").live('keyup.autocomplete', function() {
    fetch_user_channels();
    var json_data = get_user_channels();
    //TODO: check why JSON is not working here
    
      $(this).autocomplete(json_data, {
     	  minChars: 0,
		    matchContains: true,
		    highlightItem: false,
        formatItem: function(activity) {
          return activity.name;
        }
      });
    });
   /******************************/
   
});

function aw_input_box_reset_to_default(){
  $('#location_field').val("");
  $('#lat_value').val("");
  $('#geo_location').val("");
  $('#location_field').val("");
  $('#activity_field').val("");
  $('#entity_field').val("");
  $('#title_field').val("");
  
  if ($('.home_page_inputs').is(':visible')) {
    $(".p-i-c").trigger('click');
    if($("#input-attachments-section").is(':visible')){
      $("#input-attachments-section").slideToggle("medium");
    }
  }

          

}


$(document).ready(function(){
  $(window).scroll(function(){

   //$(".p-st-filter").css("top",Math.max(0,230-$(this).scrollTop()));
    //var totalHeight = $("#p-ch-st-tab").height() + $("#input-box").height();
    var totalHeight = $("#input-box").height();
    //if($(this).scrollTop() > ( $("#top-bar").height() + $("#input-box").height() )
    if($(this).scrollTop() > totalHeight )
    {
      $(".p-st-filter").css("position","fixed");
      $(".p-st-filter").css("top",98);
      
      $(".p-l-fltr-1").css("position","fixed");
      $(".p-l-fltr-1").css("top",100);
      
      $(".p-l-fltr-2").css("position","fixed");
      $(".p-l-fltr-2").css("top",100);
    
      $(".p-r-fltr-st").css("position","fixed");
      $(".p-r-fltr-st").css("top",100);
  
      $(".p-r-search-fltr").css("position","fixed");
      $(".p-r-search-fltr").css("top",260);
      
      /*
      $("ul.p-cstab").css("position","fixed");
      $("ul.p-cstab").css("top",50);
      */
      $("#p-ch-st-tab-proxy").css("position","fixed");
      $("#p-ch-st-tab-proxy").css("top",50);

      //alert(totalHeight);

    }
    else
    {
      $(".p-st-filter").css("position","absolute");
      $(".p-st-filter").css("top","");
      
      $(".p-l-fltr-1").css("position","absolute");
      $(".p-l-fltr-1").css("top","");
      
      $(".p-l-fltr-2").css("position","absolute");
      $(".p-l-fltr-2").css("top","");

      $(".p-r-fltr-st").css("position","absolute");
      $(".p-r-fltr-st").css("top","");
  
      $(".p-r-search-fltr").css("position","absolute");
      $(".p-r-search-fltr").css("top","");
      /*
      $("ul.p-cstab").css("position","absolute");
      $("ul.p-cstab").css("top","");
      */
      $("#p-ch-st-tab-proxy").css("position","absolute");
      $("#p-ch-st-tab-proxy").css("top","");

    }
  });
  
    /* Note: There are some hardcoded strings used in following 2 functions
     * If in case you are changing any of them, plz make sure to change it in input_box partial
     * as well
     * */
    $("#attachment").live("click",function(){
        $("#input-attachments-section").slideToggle("medium");
        var $image = $(this).children("img");
        if ($image.attr("src") == "/images/alpha/camera_icon.png")
            $image.attr("src", "/images/alpha/camera_pressed_button.png");
        else
            $image.attr("src", "/images/alpha/camera_icon.png");

        var $span = $(this).children("span");
        if ($span.text() == "Add Images")
            $span.text("Close Images");
        else
            $span.text("Add Images");  
    });

    $("#add_subtitle").live("click",function(){
        $("#subtitle-div").slideToggle("medium");
        var $image = $(this).children("img");
        if ($image.attr("src") == "/images/alpha/title_normal_button.png")
            $image.attr("src", "/images/alpha/title_pressed_button.png");
        else
            $image.attr("src", "/images/alpha/title_normal_button.png");
       
        var $span = $(this).children("span");
        if ($span.text() == "Add Title")
            $span.text("Close Title");
        else
            $span.text("Add Title");  

    });


    /* to display the comment input system for inputting comments.  like google+ */ 
    $(".add-comment").live("click",function(){
      $(this).next().show();
      $(this).hide();
    });
  
    $(".cancel-comment-btn").live("click",function(){
      var parentTag = $(this).parent().prev().show();
      $(this).parent().hide();
    });




    /*
    $(".trigger-feedback").click(function(){
		  $(".panel").toggle("fast");
		  $(this).toggleClass("active");
		  return false;
	  });*/
    
    $(".trigger-feedback").click(function(){
		  $(".panel").show();
		  $(this).hide();
		  return false;
	  });
    $(".cancel-feedback").click(function(){
      $(".panel").hide();
      $(".trigger-feedback").show();
    });
   

    $(".post-like-link").click(function() {
        $(".liking-it").css('display','block');
    });
   
    /*
     *  JQuery for enabling character counter on input boxes
     *  Activity input box:32 characters, Location Box:60 characters, Entity Box:600 characters
     *  Idea is to take the maxlength from html attribute and checking the length
     *  Same placeholder to show remaining character is used for all 3 boxes
     *
     */
     
    

    $(".dropdown").click(function () {
        /*$("ul.the_menu").slideToggle("medium");*/
    });


   
    $("#menu_class").click(function () {
        /*$("ul.the_menu").slideToggle("medium");*/
    });
   
    $(".show-summary-post").click(function () {
        $(this).parent().next().slideToggle("medium");
    });


    /* to display the input system for creating posts.....*/ 
    $(".add-page-input").click(function(event){
      $(this).hide();
      $(".home_page_inputs").slideToggle("medium");
    });

    $(".p-i-c").click(function(event){
      $(".home_page_inputs").slideToggle("medium");
      $(".add-page-input").show();
    });


   
    /*
     *  JQuery for enabling character counter on input boxes
     *  Activity input box:32 characters, Location Box:60 characters, Entity Box:600 characters
     *  Idea is to take the maxlength from html attribute and checking the length
     *  Same placeholder to show remaining character is used for all 3 boxes
     *
     */
     
    

    $(".count-enable").blur(function() {
        $("#input-char-count").hide();
    });
    
    $(".count-enable").bind('focus keyup', function() {
        $("#input-char-count").show();
        var maxlength = $(this).attr("maxlength");
        $(this).val($(this).val().slice(0,maxlength));
        var remaining_length = maxlength - $(this).val().length;
        $("#char-count").text(": "+ remaining_length);

    });


    $(".campaign-btn").click(function () {
        var state = get_campaign_status($(this).val());
        if(state == false){
          $(this).addClass('selected-camp');
          $(this).prev().show();
          set_campaign_status($(this).val(), true);
        }
        return false;
    });

    $(".del-camp").click(function () {
        var state = get_campaign_status($(this).next().val());
        if(state == true){
          $(this).next().removeClass('selected-camp');
          $(this).hide();
          set_campaign_status($(this).next().val(), false);
        }else{
          this.hide();
        }
        return false;
    });

    /*enable auto increase of textarea*/
    $('#entity_field').elastic();
		$('#entity_field').trigger('update');

    /* to make sure that only alphanumeric characters are allowed in activity field*/
    $("#activity_field").alphanumeric();

    $("#aw_login_open").click(function(){
      $("#aw_home_header_signin_box").slideToggle();
    }); 

});



function get_trim_text (str_value,len,end_with) {
  var str = str_value;
  if(str.length > len){
        str = str.substring(0,len) + end_with ;
  }
  return str;

}



$(document).ready(function(){
//    alert("aw_Slider is ready");
    $('div.aw_slider').live('mousemove',function(e){
      var div = $(this);
      var ul = $(this).children('ul.aw_slider');
      var ulPadding = 15;
      var divWidth = div.width();
      //Find last image container
      var lastLi = ul.find('li:last-child');

      var ulWidth = lastLi[0].offsetLeft + lastLi.outerWidth() + ulPadding;
      var left = (e.pageX - div.offset().left) * (ulWidth-divWidth) / divWidth;
      div.scrollLeft(left);
    });

  }); /* ready ends here */


  


/*
* Major jsons for handling events and data
*/
var the_big_json_tab_manager={};
var the_big_json_tab_close={};

  
var the_big_json_renderers={
                              "image" : function aw_boxer_render_image(data, internal_id, new_tab_id){
                                                 return render_image_internal( data, internal_id, new_tab_id);
                                                },
                               "video" : function aw_boxer_render_video(data, internal_id, new_tab_id){
                                                return render_video_internal( data, internal_id, new_tab_id);
                                                },
                               "related_friends" : function aw_boxer_render_friends( data, internal_id, new_tab_id){
                                                return aw_render_friends_related_internal(data, internal_id, new_tab_id);
                                               },
                              "entities" : function aw_boxer_render_entities(data, internal_id, new_tab_id){
                                                return aw_render_entities_internal(data, internal_id, new_tab_id);
                                               },
                              "locations" : function aw_boxer_render_locations(data, internal_id, new_tab_id){
                                                return aw_render_locations_internal(data, internal_id, new_tab_id);
                                               },
                               "channels" : function aw_boxer_render_channels(data, internal_id, new_tab_id){
                                                return aw_render_channels_internal(data, internal_id, new_tab_id);
                                               },
                               "subscriber" : function aw_boxer_render_subscribers(data, internal_id, new_tab_id){
                                                return aw_render_subscriber_internal(data, internal_id, new_tab_id);
                                               },
                               "subscription" : function aw_boxer_render_subscriptions(data, internal_id, new_tab_id){
                                                return aw_render_subscription_internal(data, internal_id, new_tab_id);
                                               },


                              

                           };


/*
 *
 */
function  render_internal_html(data, internal_id, type, new_tab_id){
  var html = "";
    
  if( the_big_json_renderers[type] ){
    html = the_big_json_renderers[type]( data, internal_id, new_tab_id);
  }

  return html;
}
  
/*
 * Handle individual tab
 */
function addtab(box_id, position, data, type, boxer_class)
{
  var new_tab_id = box_id + '_aw_tab_' + position;
  var box = $("#" + box_id);

  /* add a new tab */
  var html = '<div id="' + new_tab_id + '" class="ntabs js_aw_ntabs ' + boxer_class +  '">' +
  //'style="height:100px;width:150px;">' + 
             '</div>';
  box.append(html);
  tab = $("#" + new_tab_id);

  var internal_id = new_tab_id + "_" + type;

  data.internal_html_id = internal_id;
  var close_btn_id = new_tab_id + '_close';
  data.close_html_id = close_btn_id;
  var content_html = render_internal_html( data, internal_id, type, new_tab_id);

  tab.append(content_html);

  the_big_json_tab_close[close_btn_id]={tab:new_tab_id, box:box_id};
  var close_html = '<div class="boxer_close">'+
                     '<a href="" id="' + close_btn_id + '" class="close js_aw_ntabs_close">' +
                        '<img src="/images/alpha/close.png">' +
                      '</a>'
                   '</div>';

 
  tab.append(close_html);		
  
  
  the_big_json_tab_manager[box_id][new_tab_id] = data;
  if(position == 0){
    $("#"+new_tab_id).addClass("ctab");
  }
  
}


/*
* Main api to render boxes
*/
function aw_boxer_render_tabs(box_id, data_json){
  the_big_json_tab_manager[box_id]={};
  $("#" + box_id).removeClass("ctab");
  $.each(data_json.data, function(i,data){
    addtab(box_id,i,data, data_json.type, data_json.class);					
	});
	
}

 

$(document).ready(function(){
  //render_tabs("tabul", get_base_json_unit_test());


 $(".js_aw_ntabs").live("click", function() {
    $(".js_aw_ntabs").removeClass("ctab");
    $(this).addClass("ctab");
    //$("#c"+count).fadeIn('slow');
  });
                
  $(".js_aw_ntabs_close").live("click", function() {
    $(".js_aw_ntabs").removeClass("ctab");
    var json_id = $(this).attr("id");
    var tab_id = the_big_json_tab_close[json_id].tab;
    $("#" + json_id).parent().prev().addClass("ctab");
    $("#" + json_id).parent().remove();   
    delete  the_big_json_tab_close[json_id];
    var box_id = the_big_json_tab_close[json_id].box;
    var internal_id = the_big_json_tab_manager[box_id][new_tab_id].internal_html_id;


    return false;
  });
  
 
 
});


function aw_notify_profile_image(main, thumb){
  var post_json = { 
                      word : 'ProfilePic',
                      enrich : true,
                      source_name:"actwitty",
                      text : "changed the profile picture.",
                      status:2,
                      documents:[{url:main, thumb_url:thumb, caption:"Profile Picture"}]
                    };
  post_activity_to_server(post_json, false, true);

  $("#profile_profile_photo_l").val(main);   
  $("#profile_profile_photo_s").val(thumb);
  $("#user_settings_image").attr("src", main);
}

function aw_lib_get_session_owner_id(){
 var session_owner_id=$('#session_owner_id').attr("value");
 return session_owner_id;
}

function aw_lib_get_page_owner_id(){
 var page_owner_id=$('#page_owner_id').attr("value");
 return page_owner_id;
}

function aw_lib_get_page_owner_photo(){
 var page_owner_photo=$('#page_owner_photo').attr("value");
 return page_owner_photo;
}

function aw_lib_get_page_owner_name(){
 var page_owner_name=$('#page_owner_name').attr("value");
 return page_owner_name;
}


function aw_lib_get_cache_cookie_id(){
 var cache_cookie_id=$('#cache_cookie_id').attr("value");
 return cache_cookie_id;
}

function aw_lib_get_base_url(){
 var url = "http://www.actwitty.com";
 return url;
}

jQuery.fn.log = function (msg) {
                                  console.log("%s: %o", msg, this);
                                  return this;
                              };

function aw_lib_console_log(level, msg){
  console.log(msg);

}

function aw_lib_alert(msg){
  alert(msg);
}


/*
 * classes
 * div.js_aw_info_parent_container
 *  div.js_aw_info_container
 *  input.js_aw_info_more
 *  
 *
 */
/***********************************************/

var g_aw_stream_modes=[
                                  'js_streams_list',

                                  'js_images_list',

                                  'js_videos_list',

                                  'js_drafts_list'

                              ];

var g_aw_current_active_mode = 'js_streams_list'; 
/***********************************************/
/*
 * Deselect all other sections on streams page
 * Select the specific scope
 */ 
function aw_toggle_scope_on_stream_page(id){
  aw_lib_console_log("debug", "toggle_scope_on_summary_page");
  var found = false;
  $.each(g_aw_stream_modes, function(index, key) {
    $("#" + key).hide();
    if ( key == id ){
      found = true;
    }
  });
  /* go to stream list if its a bad setting */
  if( !found ){ 
    id = 'js_streams_list';
  }
  $("#" + id).show();
  g_aw_current_active_mode = id;
}
/***********************************************/
function aw_stream_select_mode_on_load(){
  g_aw_current_active_mode = $("#stream_page_mode").val();
}
/***********************************************/
function aw_get_current_stream_mode(){
  return g_aw_current_active_mode;
}
/***********************************************/
function clear_all_stream_modes(){
  $("#streams_list_parent").html('');
  $("#streams_list_parent").html('<div class="p-awp-post-stream" id="streams_list"> </div>');
  $("#more_streams_cookie").val("");

  $("#streams_drafts_list_parent").html('');
  $("#streams_drafts_list_parent").html('<div class="p-awp-post-stream" id="streams_drafts_list"> </div>');
  $("#more_streams_drafts_cookie").val("");


  $("#streams_images_list_parent").html('');
  $("#streams_images_list_parent").html('<div class="p-awp-post-stream" id="streams_images_list"> </div>');
  $("#more_streams_images_cookie").val("");


  $("#streams_videos_list_parent").html('');
  $("#streams_videos_list_parent").html('<div class="p-awp-post-stream" id="streams_videos_list"> </div>');
  $("#more_streams_videos_cookie").val("");
}

/*****************************************************************/
/*
 *
 */
function aw_redirect_to_streams_filtered_of_other_user(page_owner_id){
    params='id=' + page_owner_id +'&mode=filtered&stream_mode=' + g_aw_current_active_mode + "&" + get_long_string_filter();
    window.location.href ='/home/show?' + params;
}


/*****************************************************************/

/*
 * On change of filter we need to do all these
 * On load of page as well we need to do all these
 */
function aw_reload_streams_on_viewed_user(){
  /* we are working on browser cache so we can delete the context on DOM */
  clear_all_stream_modes();
  aw_stream_clear_stream_jsons();

  /*
   * pick up the specific mode
   */
  if( g_aw_current_active_mode == 'js_images_list'){
    show_all_images(); 
  }else if( g_aw_current_active_mode == 'js_videos_list'){
    show_all_videos(); 
  }else if( g_aw_current_active_mode == 'js_drafts_list'){
    show_all_drafts();
  }else {
    append_stream(aw_lib_get_page_owner_id(), 
                  aw_lib_get_session_owner_id());
  }

  clear_related_entities();
  list_related_entities(aw_lib_get_page_owner_id());

  clear_related_locations();
  list_related_locations(aw_lib_get_page_owner_id());

  clear_related_friends();
  if( aw_lib_get_session_owner_id()){ 
    list_related_friends();
  }
  
  

}
/*****************************************************************/
$(document).ready(function(){
  

  
  /*
   * Go back to streams mode
   */
  $("#cont-typ-fltr-all").click(function(){
    aw_toggle_scope_on_stream_page('js_streams_list');
    clear_all_stream_modes();
    aw_stream_clear_stream_jsons();
    append_stream(aw_lib_get_page_owner_id(), 
                  aw_lib_get_session_owner_id());
    $("#cont-typ-fltr-all").css('background-image', 'url(/images/alpha/all2.jpg)');
    $("#cont-typ-fltr-drafts").css('background-image', 'url(/images/alpha/draft1.jpg)');
    $("#cont-typ-fltr-videos").css('background-image', 'url(/images/alpha/Video1.jpg)');
    $("#cont-typ-fltr-images").css('background-image', 'url(/images/alpha/Images1.jpg)');
    $("#cont-typ-fltr-twitter").css('background-image', 'url(/images/alpha/Twitter1.jpg)');
   
  });
  
  /*
   * Go to drafts mode
   */
  $("#cont-typ-fltr-drafts").click(function(){
    
    aw_toggle_scope_on_stream_page('js_drafts_list');
    clear_all_stream_modes();
    aw_stream_clear_stream_jsons();
    show_all_drafts();

    $("#cont-typ-fltr-all").css('background-image', 'url(/images/alpha/all1.jpg)');
    $("#cont-typ-fltr-drafts").css('background-image', 'url(/images/alpha/draft2.jpg)');
    $("#cont-typ-fltr-videos").css('background-image', 'url(/images/alpha/Video1.jpg)');
    $("#cont-typ-fltr-images").css('background-image', 'url(/images/alpha/Images1.jpg)');
    $("#cont-typ-fltr-twitter").css('background-image', 'url(/images/alpha/Twitter1.jpg)');

  });

  /*
   * Go to videos mode
   */
  $("#cont-typ-fltr-videos").click(function(){
    aw_toggle_scope_on_stream_page('js_videos_list');
    clear_all_stream_modes();
    aw_stream_clear_stream_jsons();
    show_all_videos(); 

    $("#cont-typ-fltr-all").css('background-image', 'url(/images/alpha/all1.jpg)');
    $("#cont-typ-fltr-drafts").css('background-image', 'url(/images/alpha/draft1.jpg)');
    $("#cont-typ-fltr-videos").css('background-image', 'url(/images/alpha/Video2.jpg)');
    $("#cont-typ-fltr-images").css('background-image', 'url(/images/alpha/Images1.jpg)');
    $("#cont-typ-fltr-twitter").css('background-image', 'url(/images/alpha/Twitter1.jpg)');

  });

  /*
   * Go to images mode
   */
  $("#cont-typ-fltr-images").click(function(){
    aw_toggle_scope_on_stream_page('js_images_list');
    clear_all_stream_modes();
    aw_stream_clear_stream_jsons();
    show_all_images(); 

    $("#cont-typ-fltr-all").css('background-image', 'url(/images/alpha/all1.jpg)');
    $("#cont-typ-fltr-drafts").css('background-image', 'url(/images/alpha/draft1.jpg)');
    $("#cont-typ-fltr-videos").css('background-image', 'url(/images/alpha/Video1.jpg)');
    $("#cont-typ-fltr-images").css('background-image', 'url(/images/alpha/Images2.jpg)');
    $("#cont-typ-fltr-twitter").css('background-image', 'url(/images/alpha/Twitter1.jpg)');

  });

  /*
   * Go to twitter mode
   */
  $("#cont-typ-fltr-twitter").click(function(){
    aw_toggle_scope_on_stream_page('js_images_list');
    clear_all_stream_modes();
    aw_stream_clear_stream_jsons();

    $("#cont-typ-fltr-all").css('background-image', 'url(/images/alpha/all1.jpg)');
    $("#cont-typ-fltr-drafts").css('background-image', 'url(/images/alpha/draft1.jpg)');
    $("#cont-typ-fltr-videos").css('background-image', 'url(/images/alpha/Video1.jpg)');
    $("#cont-typ-fltr-images").css('background-image', 'url(/images/alpha/Images1.jpg)');
    $("#cont-typ-fltr-twitter").css('background-image', 'url(/images/alpha/Twitter2.jpg)'); 

  });
   
});

/*****************************************************************/


/*
 * NOTE: suggested file name for this file profile_helpers.js
 *
 */
 
 
 
 
 
 
 /*
 * Api's for enabling fancybox on attachments in streams as well as channels.
 * Fancy box is used to show the gallery of attachments which when clicked opens the
 * attachments in modal.
 *
 * There are many ways to show images using fancybox.
 * The current version in place is to show image gallery with prev and next button
 */

var g_current_user_channels_json = {};
var g_channel_ignore_auto_complete=false;
function get_channels_for_theme(userid){
    /*
     * Get data on ready
     */

    if( g_current_user_channels_json.length){
      g_channel_ignore_auto_complete = false;
      return g_current_user_channels_json;
    }
    $.ajax({
        url: '/home/get_channels.json',
        type: 'GET',
        data: {
               user_id:userid, 
               sort_order:1,
               aw_cache_time:aw_lib_get_cache_cookie_id()
              },
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
          g_current_user_channels_json = data;
          g_channel_ignore_auto_complete = false;
          return g_current_user_channels_json;

        },
        error: function (error) {

        }
    });
    
}

function setup_on_start(element_id){
  alert(element_id);
  alert($("#" + element_id).val());
}


var g_show_theme_selector = false;
var g_theme_channel_id = 0;
var g_theme_doc_id = 0;
function activate_fancybox_group(post_group){

    $('a[rel=fnc_group_'+post_group+']').fancybox({
				'transitionIn'		: 'none',
				'transitionOut'		: 'none',
				'titlePosition' 	: 'over',
				'titleFormat'		: function( title, currentArray, currentIndex, currentOpts) {
          var image_theme_selector =  "";
          if (g_show_theme_selector == true){
            image_theme_selector =  '<div class="js_theme_base" >' +
                                       '<a  class="js_set_as_theme p-awp-st-set-theme" > Set As Theme <img src="/images/alpha/shares/plus.png" width="10" height="10"/>' +
                                      '</a>' +
                                      '<div>' +
                                        '<input type="text" placeholder="Select Channel" class="js_theme_on_channels p-awp-st-theme-input" />' +
                                      '</div>' +
                                    '</div>';
           
          }
					var fb_html = '<span id="fancybox-title-over">' +
                          'Image ' + (currentIndex + 1) + ' / ' + currentArray.length + (title.length ? ' &nbsp; ' + title : '') +
                            image_theme_selector +
                        '</span>' ;
          return fb_html;
				},
        'onStart' : function(selectedArray, selectedIndex, selectedOpts){
          var obj = selectedArray[ selectedIndex ];
          if($(obj).parent().find(".js_theme_doc_id").length){
            g_show_theme_selector = true;
            g_theme_channel_id = $(obj).parent().find(".js_theme_user_id").val();
            g_theme_doc_id =  $(obj).parent().find(".js_theme_doc_id").val();
          }else{
            g_show_theme_selector = false;
            g_theme_channel_id = 0;
            g_theme_doc_id = 0;
          }
        }
	});
}



/*
 * API for read more expander plugin
 */
function setup_readmore(content_class,slice_at) {
  $(content_class).expander({
      slicePoint:slice_at,  // default is 100
      expandText:'read more', // default is 'read more...'
      userCollapseText: '...less'  // default is '[collapse expanded text]'
  });
}


function create_theme_from_attachment(doc_id, channel_id){
   $.ajax({
        url: '/home/create_theme.json',
        type: 'POST',
        data: {
                  'summary_id' : channel_id,
                  'document_id' : doc_id
              },
        dataType: 'json',
        success: function (data) {
          g_channel_ignore_auto_complete = true; 
        },
        error:function(XMLHttpRequest,textStatus, errorThrown) {
        }
    });
}


$(document).ready(function(){
  
  $(".js_theme_on_channels").live('keyup.autocomplete', function() {
    var json_data = get_channels_for_theme(aw_lib_get_session_owner_id());
    $(this).autocomplete(json_data, {
     	minChars: 0,
		  width: 310,
		  matchContains: true,
		  highlightItem: false,
      formatItem: function(channel) {
        return channel.name;
      }

    }).result(function(e, channel) {
      if (g_channel_ignore_auto_complete == false){
          g_channel_ignore_auto_complete=true;
          create_theme_from_attachment(g_theme_doc_id, channel.summary_id);
          $(this).hide('slow'); 
          $(this).closest(".js_theme_base").find('img').attr("src", "/images/alpha/shares/plus.png");
          $(this).val("");

        }
    });
  });


  $(".js_set_as_theme").live('click', function(){

    var channels_setter = $(this).parent().find(".js_theme_on_channels");
    if(channels_setter.css('display') == 'none'){ 
      //get_social_counter(post_id, $(this));
      channels_setter.show('slow'); 
      $(this).find('img').attr("src", "/images/alpha/shares/minus.png");
    } else { 
      channels_setter.hide('slow'); 
      $(this).find('img').attr("src", "/images/alpha/shares/plus.png");
    }

  });

});





/***********************************************************/
var g_channel_scope = 1;
var g_stream_scope = 1;
/***********************************************************/

function modify_filter(filter_json, reload){
  if ( reload === undefined ){
    reload=true;
  }

  var page_owner_id=aw_lib_get_page_owner_id();
  var session_owner_id=aw_lib_get_session_owner_id();
  var need_redirect = false;
  /* Decide on which user to go to */
  if (filter_json.user){
    if( filter_json.user != page_owner_id){
      need_redirect=true;
      page_owner_id = filter_json.user;
    }
  }

  if( filter_json.channel_id && filter_json.channel_name ){
    $("#filter_channel_id").attr("value", filter_json.channel_id); 
    $("#filter_channel_name").attr("value", filter_json.channel_name);  
  }

  if( filter_json.location_id && filter_json.location_name){
    $("#filter_location_id").attr("value", filter_json.location_id); 
    $("#filter_location_name").attr("value", filter_json.location_name);  
  }

  if( filter_json.thing_id && filter_json.thing_name){
    $("#filter_thing_id").attr("value", filter_json.thing_id); 
    $("#filter_thing_name").attr("value", filter_json.thing_name);  
  }

  /* remove display of all filter disengage buttons */

  /* Channel */
  if ($("#filter_channel_id").attr("value").length > 0 && $("#filter_channel_name").attr("value").length>0){
    //var html = '<input type="button" id="channel_filter_drop" value="'+ $("#filter_channel_name").attr("value") +' X"/>'; 
    $("#fltr_channel_id").html($("#filter_channel_name").attr("value"));
    $("#fltr_channel_id").parent().addClass('p-st-flt-channel');
    $('#channel_filter_drop').show();
  }else{
    if ($("#fltr_channel_id").parent().is('.p-st-flt-channel')) {
      $("#fltr_channel_id").parent().removeClass('p-st-flt-channel');
    }
    $("#fltr_channel_id").html("all channels");
    $('#channel_filter_drop').hide();
  }

  /* Thing */
  if ($("#filter_thing_id").attr("value").length > 0 && $("#filter_thing_name").attr("value").length>0){
   //var html = '<input type="button" id="thing_filter_drop" value="'+ $("#filter_thing_name").attr("value") +' X"/>'; 
   $("#fltr_entity_id").html($("#filter_thing_name").attr("value"));
   $("#fltr_entity_id").parent().addClass('p-st-flt-entity');
    $('#thing_filter_drop').show();
  }else{
    if ($("#fltr_entity_id").parent().is('.p-st-flt-entity')) {
      $("#fltr_entity_id").parent().removeClass('p-st-flt-entity');
      $("#fltr_entity_id").html("all mentions");
    $('#thing_filter_drop').hide();
    }
  }



  /* Location */
  if ($("#filter_location_id").attr("value").length > 0 && $("#filter_location_name").attr("value").length>0){
    //var html = '<input type="button" id="location_filter_drop" value="'+ $("#filter_location_name").attr("value") +' X"/>'; 
   $("#fltr_location_id").html($("#filter_location_name").attr("value"));
   $("#fltr_location_id").parent().addClass('p-st-flt-location');
    $('#location_filter_drop').show();
  }else{
    if ($("#fltr_location_id").parent().is('.p-st-flt-location')) {
      $("#fltr_location_id").parent().removeClass('p-st-flt-location');
    }
      $("#fltr_location_id").html("all locations");
    $('#location_filter_drop').hide();
  }
  if(reload==true){
      if ( need_redirect == true){
        /* simple case redirect to stream tab of new user */
        aw_redirect_to_streams_filtered_of_other_user(filter_json.user);
      }else{
        /* stay on current user and apply the new filter */
        set_stream_to_focus_on_filter_change();
        aw_reload_streams_on_viewed_user();
      }
  }
  

}
/***********************************************************/

function reset_filter(reload){
  if ( reload === undefined ){
    reload=true;
  }
  $("#filter_channel_name").attr("value", "");
  $("#filter_channel_id").attr("value", "");
  $("#filter_thing_name").attr("value", "");
  $("#filter_thing_id").attr("value", "");
  $("#filter_location_name").attr("value", "");
  $("#filter_location_id").attr("value", "");
  modify_filter({}, reload);
}

/***********************************************************/

function get_filter(){
  return { 
           word_id:$("#filter_channel_id").attr("value"),
           entity_id:$("#filter_thing_id").attr("value"),
           location_id:$("#filter_location_id").attr("value")
         }; 
}
/***********************************************************/

function get_long_string_filter(){
  var filter= 'c_id=' + encodeURIComponent( $("#filter_channel_id").attr("value")) +
              '&c_name=' + encodeURIComponent( $("#filter_channel_name").attr("value")) +
              '&e_id=' + encodeURIComponent( $("#filter_thing_id").attr("value")) +
              '&e_name=' + encodeURIComponent( $("#filter_thing_name").attr("value")) +
              '&l_id=' + encodeURIComponent( $("#filter_location_id").attr("value")) +
              '&l_name=' + encodeURIComponent( $("#filter_location_name").attr("value"));
  return filter;

}

/***********************************************************/

function get_empty_filter(){
  return { 
           word_id:"",
           entity_id:"",
           location_id:""
         }; 
}

/***********************************************************/

function get_others_filter_state(){
}
/***********************************************************/

/***********************************************************/
function aw_get_channel_scope(){
  return g_channel_scope;
}
/***********************************************************/
function aw_get_stream_scope(){
  return g_stream_scope;
}
/***********************************************************/
function profile_filter_init(){
    if(aw_lib_get_page_owner_id() == aw_lib_get_session_owner_id()){
      $("#p-channelp-tab-mine").addClass("p-channelp-selected");
      $("#stream_mine").addClass("p-r-fltr-mine-active");
      g_channel_scope = 1;
      g_stream_scope = 1;
    }else{
      $("#p-channelp-tab-mine").addClass("p-channelp-selected");
      $("#stream_mine").addClass("p-r-fltr-mine-active");
      g_channel_scope = 1;
      g_stream_scope = 1;
    }
    modify_filter({},false);
}
/***********************************************************/
$(document).ready(function(){
    /* enable others mode */
    $('#channel_filter_drop').live("click",function(){
      $("#filter_channel_name").attr("value", "");
      $("#filter_channel_id").attr("value", "");
      modify_filter({});
    });
    /***********************************************************/

    $('#thing_filter_drop').live("click",function(){
      $("#filter_thing_name").attr("value", "");
      $("#filter_thing_id").attr("value", "");
      modify_filter({});
    });
    /***********************************************************/

    $('#location_filter_drop').live("click",function(){
      $("#filter_location_name").attr("value", "");
      $("#filter_location_id").attr("value", "");
      modify_filter({});
    });
    /***********************************************************/
    
    $('.js_channel_scope').click(function () {
      $(".p-channelp-tab").removeClass("p-channelp-selected"); 
      $(this).addClass("p-channelp-selected");
      if( $(this).attr("id") == "p-channelp-tab-all" ){
        g_channel_scope = 3;
      }else if ( $(this).attr("id") == "p-channelp-tab-subscribed" ){
        g_channel_scope = 2;
      }else if ( $(this).attr("id") == "p-channelp-tab-mine" ){
        g_channel_scope = 1;
      }
      
      aw_summary_reload_tab(aw_lib_get_page_owner_id());
       
    });
    /***********************************************************/
    $('.js_stream_scope').click(function() {
      var stream_scope_select = $(this).attr("id");
       
      if( stream_scope_select == "stream_mine"){
        g_stream_scope = 1;
        $("#stream_all").removeClass("p-r-fltr-all-active");
        $("#stream_subscribed").removeClass("p-r-fltr-subscribed-active");
        $("#stream_mine").addClass("p-r-fltr-mine-active");

      }else if ( stream_scope_select == "stream_subscribed"){
        g_stream_scope = 2;
        $("#stream_all").removeClass("p-r-fltr-all-active");
        $("#stream_subscribed").addClass("p-r-fltr-subscribed-active");
        $("#stream_mine").removeClass("p-r-fltr-mine-active");

      }else if ( stream_scope_select == "stream_all"){
        g_stream_scope = 3;
        $("#stream_all").addClass("p-r-fltr-all-active");
        $("#stream_subscribed").removeClass("p-r-fltr-subscribed-active");
        $("#stream_mine").removeClass("p-r-fltr-mine-active");

      }
      aw_reload_streams_on_viewed_user();
    });

    

    /***********************************************************/
    



});

/*
 * Main json that will hold all the data for rendering of modal screen
 */
var modal_registration_prefix="JS_AW_MODAL_";


var the_big_modal_manager_json = {
    /* Related friends modal configuration */
    "JS_AW_MODAL_related_friends"  :  {
                                          renderer_fn:function aw_modal_related_friends_caller(win_id, trigger_id){
                                            return aw_friends_render_related_modal(win_id, trigger_id);
                                          },
                                          title:"Related Friends",
                                          top:50,
                                          left:300,
                                          width:650,
                                          height:400,
                                          data_json:{},

                                      },
    /* Related entities modal configuration */
    "JS_AW_MODAL_related_entities"  :  {
                                          renderer_fn:function aw_modal_related_entities_caller(win_id, trigger_id){
                                            return aw_entities_render_related_modal(win_id, trigger_id);
                                          },
                                          title:"Related Entities",
                                          top:50,
                                          left:300,
                                          width:650,
                                          height:400,
                                          data_json:{}

                                      },
    /* All entities modal configuration */
    "JS_AW_MODAL_all_entities"  :  {
                                          renderer_fn:function aw_modal_all_entities_caller(win_id, trigger_id){
                                            return aw_entities_render_all_modal(win_id, trigger_id);
                                          },
                                          title:"All Entities",
                                          top:50,
                                          left:300,
                                          width:650,
                                          height:400,
                                          data_json:{}

                                      },
                                      
    /* Related locations modal configuration */
     "JS_AW_MODAL_related_locations"  :  {
                                          renderer_fn:function aw_modal_related_locations_caller(win_id, trigger_id){
                                            return aw_locations_render_related_modal(win_id, trigger_id);
                                          },
                                          title:"Related Locations",
                                          top:50,
                                          left:300,
                                          width:650,
                                          height:400,
                                          data_json:{}

                                      },
    /* All locations modal configuration */
     "JS_AW_MODAL_all_locations"  :  {
                                          renderer_fn:function aw_modal_all_locations_caller(win_id, trigger_id){
                                            //alert("calling related locations renderer");
                                            return aw_locations_render_all_modal(win_id, trigger_id);
                                          },
                                          title:"All Locations",
                                          top:50,
                                          left:200,
                                          width:750,
                                          height:400,
                                          data_json:{}

                                     
                                     },
    /* All channels modal configuration */
    "JS_AW_MODAL_all_channels" : {
                                          renderer_fn:function aw_modal_all_channels_caller(win_id, trigger_id){
                                            //alert("calling related locations renderer");
                                            return aw_channels_render_all_modal(win_id, trigger_id);
                                          },
                                          title:"All Channels",
                                          top:50,
                                          left:300,
                                          width:650,
                                          height:400,
                                          data_json:{}

                                     
                                   },
     "JS_AW_MODAL_image" : {
                                          renderer_fn:function aw_modal_image(win_id, trigger_id){
                                            //alert("calling related locations renderer");
                                            return aw_channels_render_image(win_id, trigger_id);
                                          },
                                          title:"All Channels",
                                          top:50,
                                          left:350,
                                          width:450,
                                          height:200,
                                          data_json:{}

                                     
                                   },
    "JS_AW_MODAL_like" : {
                                          renderer_fn:function aw_modal_like(win_id, trigger_id){
                                            //alert("calling related locations renderer");
                                            return aw_channels_render_like(win_id, trigger_id);
                                          },
                                          title:"All Channels",
                                          top:50,
                                          left:390,
                                          width:450,
                                          height:200,
                                          data_json:{}

                                     
                                   },
    "JS_AW_MODAL_subscriber" : {
                                          renderer_fn:function aw_modal_subscribers(win_id, trigger_id){
                                            return aw_subscriber_modal(win_id, trigger_id);
                                          },
                                          title:"Subscribers",
                                          top:50,
                                          left:300,
                                          width:650,
                                          height:400,
                                          data_json:{}


                                     
                                   },
    "JS_AW_MODAL_subscription" : {
                                          renderer_fn:function aw_modal_subscriptions(win_id, trigger_id){
                                            return aw_subscription_modal(win_id, trigger_id);
                                          },
                                           title:"Subscriptions",
                                          top:50,
                                          left:300,
                                          width:650,
                                          height:400,
                                          data_json:{}

                                     
                                   }        
                                  };



/*
 * set the data json for the modal
 */
function aw_modal_set_data( registered_modal_id, json_data){
  if(the_big_modal_manager_json[registered_modal_id]){
    the_big_modal_manager_json[registered_modal_id].data_json = json_data;
  }else{
    alert("There is a problem in caching modal rendering data. \n Actwitty is trying to solve the problem");
  }
}
/*
 * get data json for the modal
 */
function aw_modal_get_data( registered_modal_id){
  if(the_big_modal_manager_json[registered_modal_id]){
    return the_big_modal_manager_json[registered_modal_id].data_json;
  }else{
    return {};
  }
}

/*
 * Call the target renderer of internal modal
 */
function aw_modal_dialog_maker(registered_modal_id, container_window_id, trigger_id){
  if(the_big_modal_manager_json[registered_modal_id]){
    if(the_big_modal_manager_json[registered_modal_id].renderer_fn){
      var ret_val =  the_big_modal_manager_json[registered_modal_id].renderer_fn(container_window_id,trigger_id);
      if ( ret_val == true){
        $("html,body").css("overflow","hidden");
      }
      return ret_val;
    }else{
      return false;
    }
    
  }else{
    alert("There is a problem in rendering modal screen. \n Actwitty is trying to solve the problem");
    return false;
  }
}


function aw_modal_close(registered_modal_id){
  $('#modal_box_window_id').empty();
  $("#modal_box_id").hide();
  $(".modal_close").hide();
  $('#modal_box_window_id').hide();
  $('#modal_box_mask_id').hide();
  $("html,body").css("overflow","auto");

}
/*
 * Register modal handler on init
 */
$(document).ready(function() {  
 
    /*
     * Click is made live with an intention to support image and video modals
     */
    $('.js_modal_dialog_link').live("click", function(e) {
        //Cancel the link behavior
        e.preventDefault();
        //Get the A tag
        /* show the modal dialogs parent window*/
        //alert("clicked");

        var modal_window =   $('#modal_box_window_id');
        var modal_bkg_mask = $('#modal_box_mask_id');
        var modal_close = $('#modal_c');
        //alert(modal_window);

        $("#modal_box_id").show();
        $(".modal_close").show();

        //Get the screen height and width
        var mask_height = $(document).height();
        var mask_width = $(window).width();
        //Set height and width to mask to fill up the whole screen
        modal_bkg_mask.css({'width':mask_width,'height':mask_height});
        
        //transition effect     
        modal_bkg_mask.fadeIn(1000);    
        modal_bkg_mask.fadeTo("slow",0.8);  
    
        /* find the modal height and widhth*/
        var registered_modal_id = ""; 
        $($(this).attr('class').split(' ')).each(function() { 
          if (this !== '' 
              && this.substring(0,modal_registration_prefix.length) == modal_registration_prefix){
              registered_modal_id = this;
            }    
        });
        
         if( registered_modal_id.length ){
           var config_json = the_big_modal_manager_json[registered_modal_id];
           if(config_json){
             modal_window.css({'width':config_json.width,'height':config_json.height});
             modal_window.css({'top':config_json.top,'left':config_json.left});
             //alert("if"); 
             //modal_close.css({'width':config_json.width,'height':config_json.height});
             modal_close.css({'margin-top':config_json.top-15,'margin-left':config_json.width+config_json.left+40});

           }
         }else{
              //Set the popup window to center
              //alert("else"); 
              modal_window.css('top',  winH/2 - modal_window.height()/2);
              modal_window.css('left', winW/2 - modal_window.width()/2);

              modal_close.css('top',  winH/2 - modal_window.height()/2);
              modal_close.css('left', winW/2 - modal_window.width()/2);

         }


        //Get the window height and width
        var winH = $(window).height();
        var winW = $(window).width();
               
     
     
        //transition effect
        modal_window.fadeIn(2000); 

        if( registered_modal_id.length ){
          var ret_code = aw_modal_dialog_maker(registered_modal_id, "modal_box_window_id", $(this).attr("id"));
          if(!ret_code){
            /*hide the parent of modal window box*/
            $("#modal_box_id").hide();
            $(".modal_close").hide();
            $('#modal_box_window_id').hide();
            $('#modal_box_mask_id').hide();
            $("html,body").css("overflow","auto");
          }
        }else{
            $("#modal_box_id").hide();
            $(".modal_close").hide();
            $('#modal_box_window_id').hide();
            $('#modal_box_mask_id').hide();
            $("html,body").css("overflow","auto");
        }
     
    });
     
    /*
     * Click is made live with an intention to support image and video modals
     */
    $('.js_modal_close').live("click", function (e) {
        //Cancel the link behavior
        e.preventDefault();
        $('#modal_box_window_id').html('');
        $('#modal_box_window_id').hide();
        $('#modal_box_mask_id').hide();
        $("#modal_box_id").hide();
        $(".modal_close").hide();
        $("html,body").css("overflow","auto");
    });     
     
    /*
     * Click is made live with an intention to support image and video modals
     */
    $('.modal_mask').live("click",function () {
        $('#modal_box_window_id').html('');
        $("#modal_box_id").hide();
        $(".modal_close").hide();
        $('#modal_box_window_id').hide();
        $('#modal_box_mask_id').hide();
        $("html,body").css("overflow","auto");
    });         
     
});



/*
 * Home page things related jqueries
 *
 */
var the_big_modal_entities_json = {};




/* Global data */
var ignore_entity_auto_complete = false;
function get_all_entities(userid, render_div_id){
    /*
     * Get data on ready
     */
    $.ajax({
        url: '/home/get_entities.json',
        type: 'GET',
        data: {user_id:userid, sort_order:1},
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
          /* set context for the modal dialog */
          aw_entities_set_all_entities_modal_data(data);
          var tabs_data = aw_modal_get_data("JS_AW_MODAL_all_entities");
          aw_boxer_render_tabs(render_div_id, tabs_data);
        },
        error: function (error) {

        }
    });
   ignore_entity_auto_complete = false; 
    
}



/********************************************************************************************/


$(document).ready(function(){
  
  $(".js_search_entities").live('keyup.autocomplete', function() {
    var json_data = get_entities_json_data($(this).attr("id"));
    //alert(JSON.stringify(json_data));
   //TODO: check why JSON is not working here
    $(this).autocomplete(json_data, {
     	minChars: 0,
		  width: 310,
		  matchContains: true,
		  highlightItem: false,
      formatItem: function(entity) {
        return '<img alt="" class="p-st-fltr-search-img" src="'+ entity.image + '?maxwidth=40&maxheight=40">   ' + entity.name + '</img>';
      }

    }).result(function(e, entity) {
      if (ignore_entity_auto_complete == false){
          var new_filter = {
                            thing_id:entity.id,
                            thing_name:entity.name
                           };
          modify_filter(new_filter);
          aw_modal_close(get_entities_modal_id($(this).attr("id")));
          ignore_entity_auto_complete=true;
        }
    });
  });



  $('.js_modal_entities').live('click', function(){

    //the_big_comment_count_json
    var entity = the_big_modal_entities_json[$(this).attr("id")];
    if(entity){
      //alert("Entity id:" + entity.id);
      var new_filter = {
                         thing_id:entity.id,
                         thing_name:entity.name
                       }; 
      modify_filter(new_filter);
    }

    var modal_win_id = $(this).parents('.modal_window:first').attr("id");
    aw_modal_close(modal_win_id);
    return false;
  });

});


function get_entities_json_data(id){
  if(id == "js_entities_modal_related"){
    var aw_modal_data = aw_modal_get_data("JS_AW_MODAL_related_entities");
    return aw_modal_data.data;
  }else{
    return aw_modal_get_data("JS_AW_MODAL_all_entities").data;
  }
}

function get_entities_modal_id(id){
  if(id == "js_entities_modal_related"){
    return "JS_AW_MODAL_related_entities";
  }else{
    return "JS_AW_MODAL_all_entities";
  }
}

function aw_entities_set_related_modal_data(json_data){
  var modal_data = {
                      type:"entities",
                      class:"entities_box",
                      data:json_data
                   };
  aw_modal_set_data("JS_AW_MODAL_related_entities", modal_data);
}

function aw_entities_set_all_entities_modal_data(json_data){
  
  var modal_data = {
                      type:"entities",
                      class:"entities_box",
                      data:json_data
                   };
  aw_modal_set_data("JS_AW_MODAL_all_entities", modal_data);

}

function aw_render_entities_internal(entity, div_id, new_tab_id){
     var link_id = "stream_related_modal_" + entity.id;
     //var main_div = $('.entities_box_internal').parent().attr("id");
     //var main_id = $('#main_div');
     //alert(main_id + entity.image);
     //alert("cool");
     //alert($('.entities_box_internal').parent().attr("id"));
     //main_div.css({'background-image': url( entity.image )});

     var html='<div class="entities_box_internal" id="' + div_id + '">' +
                '<a href="#" class="js_modal_entities" id="' + link_id + '">' +
                  '<img class="entities_box_images" src="' + entity.image +  '?maxwidth=120&maxheight=90"/>' +
                  '<span> '+  entity.name + '</span>'+
                '</a>'+
               
              '</div>';
     the_big_modal_entities_json[link_id] = {id:entity.id, name:entity.name};
     return html;
}

function aw_entities_render_related_modal(win_id, trigger_id){
  the_big_modal_entities_json={};
  var id = win_id + '_modal_div';
  var div = $("#" + win_id);
  var search_html = '<div class="search_box">' +
                      '<ul class="modal_ul">' +
                        '<li><label class="lab_search_box">Search by Related Entities</label></li>' +
                        '<li><input type="text" id="js_entities_modal_related" class="js_search_entities " placeholder="Entities"/></li>' +
                      '</ul>' +
                    '</div>';

  div.append(search_html);
  ignore_entity_auto_complete=false;
  var html = '<div  id="' + id + '">' +
             '</div>';
  div.append(html);

  var tabs_data = aw_modal_get_data("JS_AW_MODAL_related_entities");
  aw_boxer_render_tabs(id, tabs_data);
  return true;
}


function aw_entities_render_all_modal(win_id, trigger_id){
  the_big_modal_entities_json={};
  var id = win_id + '_modal_div';
  var div = $("#" + win_id);
  var search_html = '<div class="search_box">' +
                       '<ul class="modal_ul">' +
                        '<li><label class="lab_search_box">Search by Entities</label></li>' +
                        '<li><input type="text" id="js_entities_modal_all" class="js_search_entities " placeholder="Entities"/></li>' +
                        '</ul>' +
                    '</div>';

  div.append(search_html);
  ignore_entity_auto_complete=false;
  var html = '<div  id="' + id + '">' +
             '</div>';
  div.append(html);
  
  var page_owner_id=$('#page_owner_id').attr("value");
  get_all_entities( page_owner_id, id); 
  return true;
}





/*
 * Home page things related jqueries
 *
 */
var the_big_modal_related_friends_json = {};
/* Global data */
var ignore_friend_related_auto_complete = false;



/********************************************************************************************/


$(document).ready(function(){
  
  $(".js_search_related_friends").live('keyup.autocomplete', function() {
    var json_data = get_friends_json_data();
    //alert(JSON.stringify(json_data));
   //TODO: check why JSON is not working here
    $(this).autocomplete(json_data, {
     	minChars: 0,
		  width: 310,
		  matchContains: true,
		  highlightItem: false,
      formatItem: function(friend) {
        return '<img alt="" class="p-st-fltr-search-img" src="'+ friend.image + '?maxwidth=40&maxheight=40">   ' + friend.name + '</img>';
      }

    }).result(function(e, friend) {
      if (ignore_friend_related_auto_complete == false){
          var new_filter = {
                            user:friend.id,
                           };
          modify_filter(new_filter);
          aw_modal_close("JS_AW_MODAL_related_friends");
          ignore_friend_related_auto_complete=true;
        }
    });
  });



  $('.js_modal_related_friends').live('click', function(){

    //the_big_comment_count_json
    var user_json = the_big_modal_related_friends_json[$(this).attr("id")];
    if(user_json){
      var new_filter = {
                         user:user_json.user_id
                       }; 
      modify_filter(new_filter);
    }

    var modal_win_id = $(this).parents('.modal_window:first').attr("id");
    aw_modal_close(modal_win_id);
    return false;
  });

});


function get_friends_json_data(){
    return aw_modal_get_data("JS_AW_MODAL_related_friends").data;
}


function aw_friends_set_related_modal_data(json_data){
  var modal_data = {
                      type:"related_friends",
                      class:"related_friends_box",
                      data:json_data
                   };
  aw_modal_set_data("JS_AW_MODAL_related_friends", modal_data);
}



function aw_render_friends_related_internal(friend, div_id){
     var link_id = "stream_related_modal_" + friend.id;
     var html='<div class="related_friends_box_internal" id="' + div_id + '">' +
                '<a href="#" class="js_modal_related_friends" id="' + link_id + '">' +
                  '<img class="friends_box_images" src="' + friend.image +  '?maxwidth=40&maxheight=40"/>' +
                    friend.name +
                '</a>'+
               
              '</div>';
     the_big_modal_related_friends_json[link_id] = {user_id: friend.id};
     return html;
}

function aw_friends_render_related_modal(win_id, trigger_id){
  the_big_modal_related_friends_json={};
  alert("i m in");
  var id = win_id + '_modal_div';
  var div = $("#" + win_id);
  var search_html = '<div class="search_box">' +
                      '<ul class="modal_ul">' +
                        '<li><label class="lab_search_box">Search by Friends</label></li>' +
                        '<li><input type="text" id="js_friends_modal_related" class="js_search_related_friends" placeholder="People"/></li>' +
                       '</ul>' +  
                    '</div>';

  div.append(search_html);
  ignore_friend_related_auto_complete=false;
  var html = '<div  id="' + id + '">' +
             '</div>';
  div.append(html);

  var tabs_data = aw_modal_get_data("JS_AW_MODAL_related_friends");
  aw_boxer_render_tabs(id, tabs_data);
  return true;
}








/*
 * Home page things related jqueries
 *
 */
var the_big_modal_locations_json = {};



var ignore_location_auto_complete = false;
function get_all_locations(userid, render_div_id){
    $.ajax({
        url: '/home/get_locations.json',
        type: 'GET',
        data: {user_id:userid, sort_order:1},
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
          aw_locations_set_all_locations_modal_data(data);
          var tabs_data = aw_modal_get_data("JS_AW_MODAL_all_locations");
          aw_boxer_render_tabs(render_div_id, tabs_data);
        },
        error: function (error) {

        }
    });
   ignore_location_auto_complete = false; 
    
}





$(document).ready(function(){
  
  $(".js_search_locations").live('keyup.autocomplete', function() {
    var json_data = get_locations_json_data($(this).attr("id"));
   //TODO: check why JSON is not working here
    $(this).autocomplete(json_data, {
     	minChars: 0,
		  width: 310,
		  matchContains: true,
		  highlightItem: false,
      formatItem: function(location) { //pramod
      var url;
     if (location.type == 2){
        url = "http://maps.googleapis.com/maps/api/staticmap?center="+location.lat+","+location.long+"&zoom=8&size=400x400&sensor=false";
     }
     else if(location.type == 3){
        url = get_location_image_for_type(location.type);
     }
     else{
        url = "/images/rails.png";
     }

        //return '<img alt="" class="p-st-fltr-search-img" src="'+ get_location_image_for_type(location.type) + '">   ' 
        return '<img alt="" class="p-st-fltr-search-img" src="'+ url + '">   ' 
                  + location.name + 
                '</img>';
      }

    }).result(function(e, location) {
      if (ignore_location_auto_complete == false){
          var new_filter = {
                            location_id:location.id,
                            location_name:location.name
                           };
          modify_filter(new_filter);
          aw_modal_close(get_locations_modal_id($(this).attr("id")));
          ignore_location_auto_complete=true;
        }
    });
  });



  $('.js_modal_locations').live('click', function(){

    //the_big_comment_count_json
    var location = the_big_modal_locations_json[$(this).attr("id")];
    if(location){
      var new_filter = {
                         location_id:location.id,
                         location_name:location.name
                       }; 
      modify_filter(new_filter);
    }

    var modal_win_id = $(this).parents('.modal_window:first').attr("id");
    aw_modal_close(modal_win_id);
    return false;
  });

});


function get_locations_json_data(id){
  if(id == "js_locations_modal_related"){
    var aw_modal_data = aw_modal_get_data("JS_AW_MODAL_related_locations");
    return aw_modal_data.data;
  }else{
    return aw_modal_get_data("JS_AW_MODAL_all_locations").data;
  }
}

function get_locations_modal_id(id){
  if(id == "js_locations_modal_related"){
    return "JS_AW_MODAL_related_locations";
  }else{
    return "JS_AW_MODAL_all_locations";
  }
}

function aw_locations_set_related_modal_data(json_data){
  var modal_data = {
                      type:"locations",
                      class:"locations_box",
                      data:json_data
                   };
  aw_modal_set_data("JS_AW_MODAL_related_locations", modal_data);
}

function aw_locations_set_all_locations_modal_data(json_data){
  
  var modal_data = {
                      type:"locations",
                      class:"locations_box",
                      data:json_data
                   };
  aw_modal_set_data("JS_AW_MODAL_all_locations", modal_data);

}


function get_location_image_for_type(type){
  var location_type_image = "/images/actwitty/unknown_location.png"; 
  if(type == 1) {
    location_type_image = "/images/actwitty/web_location.png";
  }else if (type == 2){
    location_type_image = "/images/actwitty/geo_location.png";
  }

  return location_type_image;
}

function getmapinfo1(lat,lang,loc_id){
  var latlng = new google.maps.LatLng(lat, lang);
    var myOptions = {
      zoom: 8,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    $(".locations_box_images").hide();
    var map = new google.maps.Map(document.getElementById(location_id),
        myOptions);
}

function aw_render_locations_internal(location, div_id){
     //alert(JSON.stringify(location));
     var link_id = "stream_related_modal_" + location.id;
     var loc_id = "stream_related_modal_" + location.id + "_loc";
     var url;
     if (location.type == 2){
        url = "http://maps.googleapis.com/maps/api/staticmap?center="+location.lat+","+location.long+"&zoom=8&size=400x400&sensor=false";
     }
     else if(location.type == 3){
        url = get_location_image_for_type(location.type);
     }
     else{
        url = "/images/rails.png";
     }

       
     var str;
     /**********************************************************/

     if( location.name.length > 15 )
     {  
       var limit = 15;                
       str = location.name;        
       var strtemp = str.substr(0,limit); 
       str = strtemp+ '....' + '<span class="hide">' + str.substr(limit,str.length) + '</span>'; 
     }
     else
     {
       str = location.name;
     }
     //alert(location.lat +"--"+location.long);
     var html='<div id="'+loc_id+'" class="hover_txt" style="position: absolute; right: 0px;display:none;left: 100px; top: -30px; "></div>' +
              '<div class="locations_box_internal" id="' + div_id + '">' +
                '<a href="#" class="js_modal_locations" id="' + link_id + '">' +
                  //'<img class="locations_box_images" src="' + get_location_image_for_type(location.type) +  '"/>' +
                  '<img class="locations_box_images" src="' +url+  '"/>' +
                  '<span id="span_hover" onmouseover="toolTip( &#39;'+location.name+'&#39;, &#39;' + loc_id + '&#39;)" onmouseout="toolTip()">'+ str +'</span>'+
                  '</a>'+
              '</div>';

              the_big_modal_locations_json[link_id] = {id:location.id, name:location.name};
     return html;
}

function aw_locations_render_related_modal(win_id, trigger_id){
  the_big_modal_locations_json={};
  var id = win_id + '_modal_div';
  var div = $("#" + win_id);
  var search_html = '<div class="search_box">' +
                      '<ul class="modal_ul">' +
                        '<li><label class="lab_search_box">Search by Related Location</label></li>' +
                        '<li><input type="text" id="js_locations_modal_related" class="js_search_locations " placeholder="Locations"/></li>' +
                     '</ul>' + 
                    '</div>';

  div.append(search_html);
  ignore_location_auto_complete=false;
  var html = '<div  id="' + id + '">' +
             '</div>';
  div.append(html);

  var tabs_data = aw_modal_get_data("JS_AW_MODAL_related_locations");
  
  aw_boxer_render_tabs(id, tabs_data);
  return true;
}


function aw_locations_render_all_modal(win_id, trigger_id){
  the_big_modal_locations_json={};
  var id = win_id + '_modal_div';
  var div = $("#" + win_id);
  var search_html = '<div class="search_box">' +
                      '<ul class="modal_ul">' +
                        '<li><label class="lab_search_box">Search by Location</label></li>' +
                        '<li><input type="text" id="js_locations_modal_all" class="js_search_locations " placeholder="Locations"/></li>' +
                      '</ul>' +   
                    '</div>';

  div.append(search_html);
  ignore_location_auto_complete=false;
  var html = '<div  id="' + id + '">' +
             '</div>';
  div.append(html);
  
  var page_owner_id=$('#page_owner_id').attr("value");
  get_all_locations( page_owner_id, id); 
  return true;
}







/*
 * Home page things related jqueries
 *
 */
var the_big_modal_channels_json = {};




/* Global data */
var ignore_channel_auto_complete = false;
function get_all_channels(userid, render_div_id){
    /*
     * Get data on ready
     */
    $.ajax({
        url: '/home/get_channels.json',
        type: 'GET',
        data: {user_id:userid, sort_order:1},
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
          /* set context for the modal dialog */
          aw_channels_set_all_channels_modal_data(data);
          var tabs_data = aw_modal_get_data("JS_AW_MODAL_all_channels");
          aw_boxer_render_tabs(render_div_id, tabs_data);
        },
        error: function (error) {

        }
    });
   ignore_channel_auto_complete = false; 
    
}



/********************************************************************************************/


$(document).ready(function(){
  
  $(".js_search_channels").live('keyup.autocomplete', function() {
    var json_data = get_channels_json_data($(this).attr("id"));
    //alert(JSON.stringify(json_data));
   //TODO: check why JSON is not working here
    $(this).autocomplete(json_data, {
     	minChars: 0,
		  width: 310,
		  matchContains: true,
		  highlightItem: false,
      formatItem: function(channel) {
        return channel.name;
      }

    }).result(function(e, channel) {
      if (ignore_channel_auto_complete == false){
          var new_filter = {
                            channel_id:channel.id,
                            channel_name:channel.name
                           };
          modify_filter(new_filter);
          aw_modal_close(get_channels_modal_id($(this).attr("id")));
          ignore_channel_auto_complete=true;
        }
    });
  });



  $('.js_modal_channels').live('click', function(){

    //the_big_comment_count_json
    var channel = the_big_modal_channels_json[$(this).attr("id")];
    if(channel){
      //alert("Channel id:" + channel.id);
      var new_filter = {
                         channel_id:channel.id,
                         channel_name:channel.name
                       }; 
      modify_filter(new_filter);
    }

    var modal_win_id = $(this).parents('.modal_window:first').attr("id");
    aw_modal_close(modal_win_id);
    return false;
  });

});


function get_channels_json_data(id){
  if(id == "js_channels_modal_related"){
    var aw_modal_data = aw_modal_get_data("JS_AW_MODAL_related_channels");
    return aw_modal_data.data;
  }else{
    return aw_modal_get_data("JS_AW_MODAL_all_channels").data;
  }
}

function get_channels_modal_id(id){
  if(id == "js_channels_modal_related"){
    return "JS_AW_MODAL_related_channels";
  }else{
    return "JS_AW_MODAL_all_channels";
  }
}

function aw_channels_set_related_modal_data(json_data){
  var modal_data = {
                      type:"channels",
                      class:"channels_box",
                      data:json_data
                   };
  aw_modal_set_data("JS_AW_MODAL_related_channels", modal_data);
}

function aw_channels_set_all_channels_modal_data(json_data){
  
  var modal_data = {
                      type:"channels",
                      class:"channels_box",
                      data:json_data
                   };
  aw_modal_set_data("JS_AW_MODAL_all_channels", modal_data);

}

function aw_render_channels_internal(channel, div_id){
     var link_id = "stream_related_modal_" + channel.id;
     var html='<div class="channels_box_internal" id="' + div_id + '">' +
                '<a href="#" class="js_modal_channels" id="' + link_id + '">' +
                   '<span>'+ channel.name +'</span>' +
                '</a>'+
               
              '</div>';
     the_big_modal_channels_json[link_id] = {id:channel.id, name:channel.name};
     return html;
}

function aw_channels_render_related_modal(win_id, trigger_id){
  the_big_modal_channels_json={};
  var id = win_id + '_modal_div';
  var div = $("#" + win_id);
  var search_html = '<div class="search_box">' +
                      '<input type="text" id="js_channels_modal_related" class="js_search_channels " placeholder="Channels"/>' +
                    '</div>';

  div.append(search_html);
  ignore_channel_auto_complete=false;
  var html = '<div  id="' + id + '">' +
             '</div>';
  div.append(html);

  var tabs_data = aw_modal_get_data("JS_AW_MODAL_related_channels");
  aw_boxer_render_tabs(id, tabs_data);
  return true;
}


function aw_channels_render_all_modal(win_id, trigger_id){
  the_big_modal_channels_json={};
  var id = win_id + '_modal_div';
  var div = $("#" + win_id);
  var search_html = '<div class="search_box">' +
                      '<ul class="modal_ul">' +

                      '<li><label class="lab_search_box">Search by Channel</label></li>' +
                      '<li><input type="text" id="js_channels_modal_all" class="js_search_channels " placeholder="Channels"/></li>' +
                      '</ul>' +
                    '</div>';

  div.append(search_html);
  ignore_channel_auto_complete=false;
  var html = '<div  id="' + id + '">' +
             '</div>';
  div.append(html);
  
  var page_owner_id=$('#page_owner_id').attr("value");
  get_all_channels( page_owner_id, id); 
  return true;
}





function get_socialize_html(stream){
  var title="";
  if( stream.post.sub_title == undefined) {
    title = stream.post.sub_title;
  }
  
  var twitter_count = 0;
  var fb_count = 0;
  var digg_count = 0;
  var stumbleupon_count = 0;
  var delicious_count = 0;
  var buzz_count = 0;

  var cummulative_count = 0;
  if( stream.post.social_counters && stream.post.social_counters.length) {

    $.each(stream.post.social_counters, function(i, counter) { 
    
      if( counter.source_name == "twitter"){
        twitter_count = counter.count;
      }

      if( counter.source_name == "facebook"){
        fb_count = counter.count;
      }

      if( counter.source_name == "digg"){
        digg_count = counter.count;
      }

      if( counter.source_name == "stumbleupon"){
        stumbleupon_count = counter.count;
      }

      if( counter.source_name == "delicious"){
        delicious_count = counter.count;
      }

      if( counter.source_name == "buzz"){
        buzz_count = counter.count;
      }

      cummulative_count += counter.count;
    });
  }
  var socialize_html = '<div class="js_socialize_post">' +
                          '<input type="hidden" value="' + stream.post.id + '" class="socialize_post_id" />' +
                          '<input type="hidden" value="' + stream.post.summary_id + '" class="socialize_summary_id" />' +
                          '<input type="hidden" value="' + stream.post.sub_title + '" class="socialize_post_title" />' +
                          '<input type="hidden" value="' + cummulative_count + '" class="socialize_count" />' +
                          '<span>' + 
                            '<a  class="js_socialize_minimize" >' + cummulative_count + ' Shares  ' +'<img src="/images/alpha/shares/plus.png" width="10" height="10"/>' +
                            '</a>' +
                          '</span>' +
                          '<div class="js_socialize_icons">' +
                            
                            '<div class="socialize_box" >' +
                              '<img src="/images/alpha/shares/twitter.png"  alt="Share on Twitter" width="25" height="25" class="js_share_post_externally JS_SHARE_TWITTER" id="twitter_share_' + stream.post.id + '" />' +
                              '<span class="twitter_text">' +
                                twitter_count +
                              '</span>' +
                            '</div>' +
                           
                            '<div class="socialize_box" >' +
                              '<img src="/images/alpha/shares/facebook.png"  alt="Share on facebook" width="25" height="25" class="js_share_post_externally JS_SHARE_FACEBOOK" id="facebook_share_' + stream.post.id + '"/>' +
                              '<span class="facebook_text">' +
                                fb_count +
                              '</span>' +
                            '</div>' +
                           
                            '<div class="socialize_box" >' +
                              '<img src="/images/alpha/shares/digg.png"  alt="Share on Digg" width="25" height="25" class="js_share_post_externally JS_SHARE_DIGG" id="digg_share_' + stream.post.id + '" />' +
                              '<span class="digg_text">' +
                                digg_count +
                              '</span>' +
                            '</div>' +
                           
                            '<div class="socialize_box" >' +
                              '<img src="/images/alpha/shares/stumbleupon.png"  alt="Share on Stumbleupon" width="25" height="25" class="js_share_post_externally JS_SHARE_STUMBLEUPON" id="stumbleupon_share_' + stream.post.id + '" />' +
                              '<span class="stumbleupon_text">' +
                                stumbleupon_count +
                              '</span>' +
                            '</div>' +
                           
                            '<div class="socialize_box" >' +
                              '<img src="/images/alpha/shares/delicious.png"  alt="Share on Delicious" width="25" height="25" class="js_share_post_externally JS_SHARE_DELICIOUS" id="delicious_share_' + stream.post.id + '" />' +
                              '<span class="delicious_text">' +
                                delicious_count +
                              '</span>' +
                            '</div>' +
                           
                            '<div class="socialize_box" >' +
                              '<img src="/images/alpha/shares/buzz.png"  alt="Share on Buzz" width="25" height="25" class="js_share_post_externally JS_SHARE_BUZZ" id="buzz_share_' + stream.post.id + '" />' +
                              '<span class="buzz_text">' +
                                buzz_count +
                              '</span>' +
                            '</div>' +
                        '</div>' +
                    '</div>';
  return socialize_html;
}


function get_socialize_icon_html(stream){
  var title="";
  var stream_socialize_id = stream.post.id + '_social';
  if( stream.post.sub_title == undefined) {
    title = stream.post.sub_title;
  }
  
   var socialize_html = '<div class="js_socialize_icons' + stream_socialize_id + '">' +
                            '<input type="hidden" value="' + stream.post.id + '" class="socialize_post_id" />' +
                            '<input type="hidden" value="' + stream.post.summary_id + '" class="socialize_summary_id" />' +
                            '<input type="hidden" value="' + stream.post.sub_title + '" class="socialize_post_title" />' +
                            '<div class="socialize_box" >' +
                              '<img src="/images/alpha/shares/twitter.png"  alt="Share on Twitter" width="25" height="25" class="js_share_post_externally JS_SHARE_TWITTER" id="twitter_share_' + stream.post.id + '" />' +
                              '<span class="twitter_text">' +
                                '0' +
                              '</span>' +
                            '</div>' +
                           
                            '<div class="socialize_box" >' +
                              '<img src="/images/alpha/shares/facebook.png"  alt="Share on facebook" width="25" height="25" class="js_share_post_externally JS_SHARE_FACEBOOK" id="facebook_share_' + stream.post.id + '"/>' +
                              '<span class="facebook_text">' +
                                '0' +
                              '</span>' +
                            '</div>' +
                           
                            '<div class="socialize_box" >' +
                              '<img src="/images/alpha/shares/digg.png"  alt="Share on Digg" width="25" height="25" class="js_share_post_externally JS_SHARE_DIGG" id="digg_share_' + stream.post.id + '" />' +
                              '<span class="digg_text">' +
                                '0' +
                              '</span>' +
                            '</div>' +
                           
                            '<div class="socialize_box" >' +
                              '<img src="/images/alpha/shares/stumbleupon.png"  alt="Share on Stumbleupon" width="25" height="25" class="js_share_post_externally JS_SHARE_STUMBLEUPON" id="stumbleupon_share_' + stream.post.id + '" />' +
                              '<span class="stumbleupon_text">' +
                                '0' +
                              '</span>' +
                            '</div>' +
                           
                            '<div class="socialize_box" >' +
                              '<img src="/images/alpha/shares/delicious.png"  alt="Share on Delicious" width="25" height="25" class="js_share_post_externally JS_SHARE_DELICIOUS" id="delicious_share_' + stream.post.id + '" />' +
                              '<span class="delicious_text">' +
                                '0' +
                              '</span>' +
                            '</div>' +
                           
                            '<div class="socialize_box" >' +
                              '<img src="/images/alpha/shares/buzz.png"  alt="Share on Buzz" width="25" height="25" class="js_share_post_externally JS_SHARE_BUZZ" id="buzz_share_' + stream.post.id + '" />' +
                              '<span class="buzz_text">' +
                                '0' +
                              '</span>' +
                            '</div>' +
                        '</div>';
                  
  return socialize_html;
}

/*
 * Get post url for sharing
 */
function get_post_url(post_id){
   var url = aw_lib_get_base_url() + '/view?id=' + post_id;
   return url;
}
/***********************/
function get_cummulative_count(clicked_ele){
 return clicked_ele.closest(".js_socialize_post").find(".socialize_count").val();
}
/***********************/
function set_cummulative_count(clicked_ele, value){
 var curr_value =  get_cummulative_count(clicked_ele);
 curr_value =  value +  parseInt(get_cummulative_count(clicked_ele));
 clicked_ele.closest(".js_socialize_post").find(".socialize_count").val(curr_value);
 var html = ' ' + 
            curr_value + 
            ' Shares  ' + 
            '<img src="/images/alpha/shares/plus.png" width="10" height="10"/>';
 clicked_ele.closest(".js_socialize_post").find(".js_socialize_minimize").html(html);
}
/***********************/
/*
 * Get post title for sharing
 */
function get_summary_id_on_click(clicked_ele){
   return clicked_ele.closest(".js_socialize_post").find(".socialize_summary_id").val();
}
/***********************/
/*
 * Get post id from hidden on click of share
 */
function get_post_id_on_click(clicked_ele){
  return clicked_ele.closest(".js_socialize_post").find(".socialize_post_id").val();
}

/*
 * Get summary id from hidden on click of share
 */
function get_post_id_on_click(clicked_ele){
  return clicked_ele.closest(".js_socialize_post").find(".socialize_summary_id").val();
}
/***********************/
function get_social_counter(post_id, element){
    var social_data = {
                        activity_id:post_id,
                      };
    var base = element.closest(".js_socialize_post");

    $.ajax({
        url: '/home/get_social_counter.json',
        type: 'POST',
        data: social_data,
        dataType: 'json',
        success: function (data) {
          $.each(data, function(i,social_share){
             if (social_share.action == "share"){
               base.find('.' + social_share.source_name + '_text').html(social_share.count);
             }
          }); 
        },
        error:function(XMLHttpRequest,textStatus, errorThrown) {
            aw_lib_alert('There has been a problem in adding new comment. \n ActWitty is trying to solve.');
        }
    });
}
/***********************/
function update_social_counter(post, summary, source, action_type){
    var social_data = {
                    activity_id:post,
                    summary_id:summary,
                    source_name:source,
                    action_type:action_type
                };

    $.ajax({
        url: '/home/update_social_media_share.json',
        type: 'POST',
        data: social_data,
        dataType: 'json',
        success: function (data) {
        },
        error:function(XMLHttpRequest,textStatus, errorThrown) {
            aw_lib_alert('There has been a problem in adding new comment. \n ActWitty is trying to solve.');
        }
    });
}
/***********************/

/*
 * Share externally modal dialog
 */
function aw_render_share_externally( trigger_id){
  var share_prefix = "JS_SHARE";
  $($("#" + trigger_id).attr('class').split(' ')).each(function() { 
    if (this !== '' && this.substring(0,share_prefix.length) == share_prefix){
      share_class = this;
    }    
  });
  var host = window.location.hostname;
  var post_id = get_post_id_on_click($("#" + trigger_id));
  var summary_id = get_summary_id_on_click($("#" + trigger_id));
  var post_title = "";//get_post_title_on_click($("#" + trigger_id));
  var url = get_post_url(post_id);
  var modal_href = "";
  var source_name="";
  var action_name="share";



  if(share_class == "JS_SHARE_TWITTER"){
    modal_href = 'http://twitter.com/home?status='+ post_title + '%20' + url;
    source_name="twitter";

  }else if(share_class == "JS_SHARE_FACEBOOK"){
    modal_href = 'http://www.facebook.com/sharer.php?u='+url
    source_name="facebook";

  }else if(share_class == "JS_SHARE_DELICIOUS"){
    modal_href  = 'http://del.icio.us/post?url='+url+'&amp;title='+ post_title;
    source_name="delicious";

  }else if(share_class == "JS_SHARE_DIGG"){
    modal_href = 'http://digg.com/submit?phase=2&url='+url+'&amp;title='+ post_title;
    source_name="digg";

  }else if(share_class == "JS_SHARE_STUMBLEUPON"){
    modal_href = 'http://stumbleupon.com/submit?url='+url+'&amp;title='+post_title;
    source_name="stumbleupon";

  }else if(share_class == "JS_SHARE_BUZZ"){
     modal_href = 'http://www.google.com/reader/link?url='+url+'&amp;title='+ post_title +'&amp;srcURL='+host;
    source_name="buzz";
  }
  var base = $("#" + trigger_id).closest(".js_socialize_post");
  var existing_count = base.find('.' + source_name + '_text').html();
  existing_count = parseInt(existing_count) + 1;
  base.find('.' + source_name + '_text').html(existing_count);

  set_cummulative_count($("#" + trigger_id), 1);
  //var div = $("#" + win_id);
  var winl = ($(window).width() - 600)/2; 
  var wint = ($(window).height() - 400)/2; 
  update_social_counter(post_id, summary_id, source_name, action_name );
  var win_popup = window.open(modal_href, "Share ActWitty post", 'top=' + wint + ', left=' + winl + ' width=600, height=400, resizable, toolbar=no');
  return win_popup.focus();
  return false;
}
/***********************/


/*
 * Add the live bindings
 */
$(document).ready(function(){
  /*
   * show socialize
   */
  $(".js_socialize_minimize").live('click', function(){
    var socialize_block = $(this).closest(".js_socialize_post").find(".js_socialize_icons");
    
    var post_id = get_post_id_on_click($(this));
    if(socialize_block.css('display') == 'none'){ 
      //get_social_counter(post_id, $(this));
      socialize_block.show('slow'); 
      $(this).find('img').attr("src", "/images/alpha/shares/minus.png");
    } else { 
      socialize_block.hide('slow'); 
      $(this).find('img').attr("src", "/images/alpha/shares/plus.png");
    }
  });

  /*
   * open a modal
   */
  $(".js_share_post_externally").live('click', function(){
    return aw_render_share_externally($(this).attr('id'));
  });
  

});

/*
 * 
 *
 */
var the_big_modal_subscriber_json = {};
/* Global data */
var ignore_subscriber_auto_complete = false;



/********************************************************************************************/


$(document).ready(function(){
  function subscriber_format(user) {
    return '<img alt="" class="p-st-fltr-search-img" src="'+ user.photo + '">   ' + user.name + "</img>";
  }

  function subscriber_get_id(user){
    return user.id;
  }

  $(".js_search_subscriber").live('keyup.autocomplete', function() {
    var json_data = get_subscriber_json_data();
   //TODO: check why JSON is not working here
    $(this).autocomplete(json_data, {
     	minChars: 0,
		  width: 310,
		  matchContains: true,
		  highlightItem: false,
      formatItem: function(subscriber) {
        return subscriber_format(subscriber);
      }

    }).result(function(e, subscriber) {
      if (ignore_subscriber_auto_complete == false){
          window.location="/home/show?id=" + subscriber.id;
          aw_modal_close("JS_AW_MODAL_subscriber");
          ignore_subscriber_auto_complete=true;
        }
    });
  });



  $('.js_modal_subscriber').live('click', function(){

    //the_big_comment_count_json
    var user_json = the_big_modal_subscriber_json[$(this).attr("id")];
    if(user_json){
      window.location="/home/show?id=" + user_json.user_id;
    }

    var modal_win_id = $(this).parents('.modal_window:first').attr("id");
    aw_modal_close(modal_win_id);
    return false;
  });

});


function get_subscriber_json_data(){
    return aw_modal_get_data("JS_AW_MODAL_subscriber").data;
}


function aw_subscriber_modal_data(json_data){
  var modal_data = {
                      type:"subscriber",
                      class:"subscriber_box",
                      data:json_data
                   };
  aw_modal_set_data("JS_AW_MODAL_subscriber", modal_data);
}



function aw_render_subscriber_internal(subscriber, div_id){
     var link_id = "subscriber_modal_" + subscriber.id;
     var html='<div class="subscriber_box_internal" id="' + div_id + '">' +
                '<a href="#" class="js_modal_subscriber" id="' + link_id + '">' +
                  '<img class="subscriber_box_images" src="' + subscriber.photo +  '?maxwidth=40&maxheight=40"/>' +
                    subscriber.name +
                '</a>'+
              '</div>';
     the_big_modal_subscriber_json[link_id] = {user_id: subscriber.id};
     return html;
}

function aw_subscriber_modal(win_id, trigger_id){
  the_big_modal_subscriber_json={};
  var id = win_id + '_modal_div';
  var div = $("#" + win_id);
  var search_html = '<div class="search_box">' +
                      '<ul class="modal_ul">' +
                        '<li><label class="lab_search_box">Search by subscriber</label></li>' +
                        '<li><input type="text" id="js_input_subscriber" class="js_search_subscriber" placeholder="Subscribers"/></li>' +
                       '</ul>' +  
                    '</div>';

  div.append(search_html);
  ignore_subscriber_auto_complete=false;
  var html = '<div  id="' + id + '">' +
             '</div>';
  div.append(html);

  var tabs_data = aw_modal_get_data("JS_AW_MODAL_subscriber");
  aw_boxer_render_tabs(id, tabs_data);
  return true;
}










/*
 * Home page friends related jqueries
 *
 */

/*
 * Render friends 
 */


function renderFacebookers(json){
 
  var invite_html = '<div id="invite"  class="modal_fb_ul sc_menu1">' +  '</div><br/>';
  
  var follow_html = '<div id="follow" class="modal_fb_ul">' + '</div><br/>';

  var unfollow_html = '<div id="unfollow" class="modal_fb_ul">'+ '</div><br/>';

  $("#invite_friends").append(invite_html);  
  var inv_html = '<ul class="sc_menu1" id="test">' + '</ul>';
  $('#invite').append(inv_html);
  
  
  $("#follow_friends").append(follow_html);  
  $("#unfollow_friends").append(unfollow_html); 

  $.each(json, function(i,data){
      if( data ){
        var li_id = "fb_li_" + data.uid;
	      var html="";
        var str;
     
         //alert(data.name.length); 
         if( data.name.length > 12 )
         {  
           var limit = 12;                
           str = data.name;        
           var strtemp = str.substr(0,limit); 
           str = strtemp+ '..' + '<span class="hide">' + str.substr(limit,str.length) + '</span>'; 
         }
         else
         {
           str = data.name;
         }

        if (!data.user_id){
        var html= '<li class="lk"><div id="' + li_id  +  '" class="user_stamp">' +
	'<div id="ex1">' +
	'<img class="img" src="' + data.image + '" height="55" width="50" align="left">'+
       	'<div id="txt1">' +  str  + '</div>'+
	'<div id="inner">'+
		'<input type="button"  height="25" width="25" value="Invite" class="fb_invite" id="' + data.uid + '"/>' +
	'</div>'+
	'</div>'+
	'</div></li>';


        $('#test').append(html);
        }else{
         html='<div id="' + li_id  +  '" class="user_stamp">' +
		'<div id="ex1">' +
			'<a href="#" id="user_nav_' +  data.user_id + '" class="link_user_stamp user_nav">' +
			       	'<img class="img" src="' + data.image + '" height="55" width="50" align="left">'+
				'<div id="txt1">' +  str + '</div>'+
			'</a>'+ 
			'<input type="hidden" id="user_nav_' +  data.user_id + '_hidden" value="' +  data.user_id + '"/>'+
     		'</div>'+
		'</div>';


          if (data.status == "Follow"){
            $('#follow').append(html);
      	    var html = '<div id="inner">'+
		 	'<input type="button" height="25" width="25" value="Unfollow" class="follow_button"   id="follow_btn_' + data.user_id + '" />' +
			'</div>';
	      $('#' + li_id + " " +  "#ex1").append(html);


          }else{
            $('#unfollow').append(html);
	    var html = '<div id="inner">'+
		 	'<input type="button" height="25" width="25" value="Follow" class="follow_button"  id="follow_btn_' + data.user_id + '" />' +
			'</div>';

            $('#' + li_id + " " + "#ex1").append(html);
	   
          }
        }


      
        var html = '<input type="hidden" value="' + data.user_id + '" id="follow_btn_' + data.user_id + '_user_id" />';
        $("#" + li_id).append(html);
	
    }
  });

}


function append_invite_friends(){
 //alert("invite");
  if ($('#invite').is(':empty'))
  {
      $('#invite').append('<h3>No friends To invite.</h3>');
  }
}
function append_follow_friends(){
 //alert("follow");
  if ($('#follow').is(':empty'))
  {
      $('#follow').append('<h3>No friends To follow.</h3>');
  }
}
function append_unfollow_friends(){
 //alert("unfollow");
  if ($('#unfollow').is(':empty'))
  {
     $('#unfollow').append('<h3>No friends To unfollow.</h3>');
  }
}


/* Global data */
/*
 * Invoke on page load
 */
var temp = 0;
function get_all_facebookers(){
    /*
     * Get data on ready
     */
    //alert("get_all_facebooker"); 
    
    $.ajax({
        url: '/facebook/facebook_friends_list',
        type: 'GET',
        data: {},
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
          /* if rails demands a redirect because of log in missing */
          if (data && data.location) {
            window.location.href = data.location;
          }else{
            renderFacebookers(data);
          }
          //TODO: try to use this in search, why should search hit server, again and again
          
        },
        error: function (error) {

        }
    });
   
}

  
/********************************************************************************************/
$(document).ready(function(){
  //alert("Inside profile_facebook.js ready"); 
  $(".user_nav").live('click', function(){
    var click_id = $(this).attr("id");
    var user_id = $("#" + click_id + "_hidden").attr("value");
    modify_filter({});

    $("#facebook-dialog-modal").dialog('close');
    /*$("#test").dialog('close');*/
    window.location.href = "/home/show?id=" + user_id;
  });


  $('.fb_invite').live('click', function () {
    var dataString = 'provider=facebook&uid=' + $(this).attr('id');
    $.ajax({
      url:  '/facebook/invite',
      type: 'POST',
      data: dataString
    });
    $(this).closest('li').remove();
  });

 


  $('.js_add_facebook_friends').live('click',function(){

   //alert("js_add_facebook_friends"); 
   
   $.ajax({
        url: '/facebook/facebook_friends_list',
        type: 'GET',
        data: {},
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
     
          if (data && data.location) {
           //alert("if");
           window.location.href = data.location;
          }else{
            //renderFacebookers(data);
            //get_all_facebookers();
            window.location.href = "/home/facebook_friends";
            //alert("else");
          }
          
        },
        error: function (error) {

        }
    });
   
    $('#empty_check').hide();

  });
  
  $('#fb_friends').click(function(){
     //alert("fb_friends");
     get_all_facebookers();
     $('#empty_check').hide();
  });
  //get_all_facebookers();
  //if ($('#invite_friends').is(':empty'))
  //alert($('#invite_friends').children().size());
  if ($('#invite_friends').children().size() > 1)
  {
      //$('#invite_friends').append('<h3 id="empty_check">No Facebook friends In your Profile.Invite them.</h3>');
      $('#empty_check').hide();
  }
  else
  {
      $('#empty_check').show();
      //$('#empty_check').remove();
  }
 

});


/********************************* READY ENDS HERE ******************************************/





/*
 * 
 *
 */
var the_big_modal_subscription_json = {};
/* Global data */
var ignore_subscription_auto_complete = false;



/********************************************************************************************/


$(document).ready(function(){
  function subscription_format(user) {
    return '<img alt="" class="p-st-fltr-search-img" src="'+ user.photo + '">   ' + user.name + "</img>";
  }

  function subscription_get_id(user){
    return user.id;
  }

  $(".js_search_subscription").live('keyup.autocomplete', function() {
    var json_data = get_subscription_json_data();
    //alert(JSON.stringify(json_data));
   //TODO: check why JSON is not working here
    $(this).autocomplete(json_data, {
     	minChars: 0,
		  width: 310,
		  matchContains: true,
		  highlightItem: false,
      formatItem: function(subscription) {
        return subscription_format(subscription);
      }

    }).result(function(e, subscription) {
      if (ignore_subscription_auto_complete == false){
          window.location="/home/show?id=" + subscription.id;
          aw_modal_close("JS_AW_MODAL_subscription");
          ignore_subscription_auto_complete=true;
        }
    });
  });



  $('.js_modal_subscription').live('click', function(){

    //the_big_comment_count_json
    var user_json = the_big_modal_subscription_json[$(this).attr("id")];
    if(user_json){
      window.location="/home/show?id=" + user_json.user_id;
    }

    var modal_win_id = $(this).parents('.modal_window:first').attr("id");
    aw_modal_close(modal_win_id);
    return false;
  });

});


function get_subscription_json_data(){
    return aw_modal_get_data("JS_AW_MODAL_subscription").data;
}


function aw_subscription_modal_data(json_data){
  var modal_data = {
                      type:"subscription",
                      class:"subscription_box",
                      data:json_data
                   };
  aw_modal_set_data("JS_AW_MODAL_subscription", modal_data);
}



function aw_render_subscription_internal(subscription, div_id){
     var link_id = "subscription_modal_" + subscription.id;
     var html='<div class="subscription_box_internal" id="' + div_id + '">' +
                '<a href="#" class="js_modal_subscription" id="' + link_id + '">' +
                  '<img class="subscription_box_images" src="' + subscription.photo +  '?maxwidth=40&maxheight=40"/>' +
                    subscription.name +
                '</a>'+
               
              '</div>';
     the_big_modal_subscription_json[link_id] = {user_id: subscription.id};
     return html;
}

function aw_subscription_modal(win_id, trigger_id){
  the_big_modal_subscription_json={};
  var id = win_id + '_modal_div';
  var div = $("#" + win_id);
  var search_html = '<div class="search_box">' +
                      '<ul class="modal_ul">' +
                        '<li><label class="lab_search_box">Search by subscription</label></li>' +
                        '<li><input type="text" id="js_input_subscription" class="js_search_subscription" placeholder="Subscribers"/></li>' +
                       '</ul>' +  
                    '</div>';

  div.append(search_html);
  ignore_subscription_auto_complete=false;
  var html = '<div  id="' + id + '">' +
             '</div>';
  div.append(html);

  var tabs_data = aw_modal_get_data("JS_AW_MODAL_subscription");
  aw_boxer_render_tabs(id, tabs_data);
  return true;
}












$(document).ready(function(){

    $(document).ajaxSend(function(event, request, settings) {
      if (typeof(AUTH_TOKEN) == "undefined") return;
        // settings.data is a serialized string like "foo=bar&baz=boink" (or null)
        settings.data = settings.data || "";
        settings.data += (settings.data ? "&" : "") + "authenticity_token=" + encodeURIComponent(AUTH_TOKEN); 
    });


   //alert("Inside profile_follow.js ready");
   $('.follow_button').live("click",function(){
      btn = $(this);
      friend_id = $("#" + btn.attr("id") + "_user_id").attr("value");
      if( $(this).val() == 'Follow' ) {
       post_url="/contacts/follow";
      }else{
       post_url="/contacts/unfollow";
      }
      $.ajax({
        url: post_url,
        type: 'POST',
        data: { "friend_id" :  friend_id },
        dataType: "json",
        success: function (data) {

            if(data && data.change_action){
             btn.val(data.change_action);
            }
            
        },
        error: function (error) {

        }
      });
    });
    return false;

  }); /* ready ends here */


  


/*
 * NOTE :: There are certain sections where html code has been commented.
 * plz keep it for a while to have a ref.
 */


var the_big_filter_JSON={dummy:"dummy"};
function get_base_theme_image_url(){
  return "https://s3.amazonaws.com/TestCloudActwitty/channel_themes/";
}
function get_summary_theme_images(){
  /*var images = [
                 'bubbles.jpg',
                 'gray.jpg',
                 'orange.jpg',
                 'skycurtain.jpg',
                 'coffee.jpg',
                 'green.jpg',
                 'pebbles.jpg',
                 'wood.jpg',
                 'kaliedoscope.jpg',
                 'pink.jpg',
                 'yellow.jpg',
                 'forest.jpg',
                 'marine.jpg',
                 'red.jpg'
               ];
  */
  var images = [
                 'box1.png',
                 'box2.png', 
                 'box3.png',
                 'box4.png',
                 'box5.png',
                 'box6.png',
                 'box7.png',
                 'box8.png',

               ];
  return images;
}

function get_img_list_html(){
  var html="";
  jQuery.each(get_summary_theme_images(), function() {
    html = html + '<img src="' + get_base_theme_image_url() + this + '" class="js_theme_image p-channelp-summary-theme-img"/>';
  });

  return html;
}

function get_summary_theme_html(summary){
  var html="";
  if ( aw_lib_get_page_owner_id() == aw_lib_get_session_owner_id() &&
      summary.user.id == aw_lib_get_session_owner_id() ){
     html = '<div class="js_summary_theme_base p-channelp-summary-theme">' +
             '<span>' + 
                  '<a  class="js_set_theme_minimize p-channelp-summary-theme-show" > Theme  <img src="/images/alpha/shares/plus.png" width="10" height="10"/>' +
                  '</a>' +
             '</span>' +
             '<div class="js_summary_theme_list_box p-channelp-theme-img-list-box">' +
                 get_img_list_html() +
             '</div>' + 
            '</div>';
  }
  return html;
}


/* handle text box */
function create_and_add_text_box(box_id, summary,channel_class){
  var text_box= $("#" + box_id);

  if(channel_class == "mainpage"){
    var lup_class = "p-channelp-post-lup-mainpage";
  }else{
    var lup_class = "p-channelp-post-lup";
  }

  if ( summary.recent_text && summary.recent_text.length  ){

    $.each(summary.recent_text, function(i, text_json){
     if(i>1){
       return;
     }
     shortText = text_json.text.trim().substring(0, 160).split(" ").slice(0, -1).join(" ") + "..."; 
     var html = '<div class="' +lup_class +'">' +
                    '<div class="p-channelp-post-lup-time">' +
                       '<abbr class="timeago" title="' + text_json.time + '"></abbr>' +
                    '</div>' +
                    '<div class="p-channelp-post-lup-text">' +
                      '<p>' + shortText + '</p>' +
                    '</div>'+
                  '</div>';

     text_box.append(html);
   
    var more_cookie =  $("#more_channels_cookie").val();
    
    if( i == 0 
          && aw_get_channel_scope() == 1 
            && (more_cookie == undefined || more_cookie == "")  ){
      var html = '<div class="p-channelp-auth-last-upd-post-time">'+
                  '<abbr class="timeago" title="' + text_json.time + '"></abbr>' +
                 '</div>' +
                  '<div class="p-channelp-auth-last-upd-post-text">' +
                    '<p>' + shortText + '</p>' +
                  '</div>';
      $("#p-latest-post").html(html);

    }
     

    });
      
  }else{
    /* hide if there is nothing to show */
    var html = '<div class="' +lup_class +'">' +
                    '<div class="p-channelp-post-lup-time">' +
                       '<abbr class="timeago" title=""></abbr>' +
                    '</div>' +
                    '<div class="p-channelp-post-lup-text">' +
                      '<p>  Could not found any text update !!!!</p>' +
                    '</div>'+
                  '</div>';
    text_box.append(html);
    /*text_box.hide();*/
  }
}



/* handle docs box 
 * fancy box activated
 * */
function create_and_docs_box(box_id, summary){
  docs_box= $("#" + box_id);
  if ( summary.documents &&  summary.documents.length ){
    var ul_box = $("#" + box_id);
   
    $.each(summary.documents, function(i, attachment){
      
      if(attachment.category == "image"){
        var thumb_url = attachment.url;
       
       if( attachment.thumb_url ) {
          thumb_url = attachment.thumb_url;
        }
       
       var html='<a rel="fnc_group_'+box_id+'" href="'+ attachment.url + '" title="">' +
                  '<img alt="" src="'+ thumb_url + '"  width="50"  alt="" />' +
                '</a>';
        ul_box.append(html);
        activate_fancybox_group(box_id);
      }
    });
    
  }else{
    /* hide if there is nothing to show */
    var html = '<span> No attachments found </span>';
    docs_box.append(html);
    //docs_box.hide();
  }
  
}


function get_subscription_box_element(type)
{
  if(type == 'UNSUBSCRIBE') {
    return '<a class="js_subscribe_summary" id="unsubscribed_channel"><img src="/images/alpha/subscribed.png" ></a>';
  }else if(type == 'SUBSCRIBE'){
      return '<a class="js_subscribe_summary" id="subscribed_channel"><img src="/images/alpha/unsubscribed.png" ></a>';
  }else{
    return '';
  }

}


/* handle subscribe box */
function create_add_add_subscribe_box(box_id, summary){
  var subsc_box = $("#" + box_id);
  if(aw_lib_get_session_owner_id() != -1 &&
     summary.user.id != aw_lib_get_session_owner_id() ){
    var html="";
    if(aw_get_channel_scope() == 2 &&
        aw_lib_get_session_owner_id() == aw_lib_get_page_owner_id()){
        //html='<a class="p-channel-subscribe-btn js_subscribe_summary" >UNSUBSCRIBE</a>';
        html=get_subscription_box_element('UNSUBSCRIBE');
    }else{
      if(summary.subscribed && summary.subscribed == true){
        //html='<a class="p-channel-subscribe-btn js_subscribe_summary" >UNSUBSCRIBE</a>';
        html=get_subscription_box_element('UNSUBSCRIBE');
      }else{
        //html='<a class="p-channel-subscribe-btn js_subscribe_summary" >SUBSCRIBE</a>';
        html=get_subscription_box_element('SUBSCRIBE');
      }
    }
    subsc_box.append(html);
  }else{
    subsc_box.append(" ");
    //subsc_box.hide();
  }

}


/******************************************************************/


/* handle friends box */
function create_and_add_friends_box(box_id, summary){
  var friends_box = $("#" + box_id);
  if( summary.friends && summary.friends.length ){
    $.each(summary.friends, function(i, friend){

      var filter_id =  'FS_' + summary.word.id + '_' + summary.user.id + '_' + friend.id;
      /* create a JSON of filter */
      var filter_value = {
                          user:friend.id ,
                          channel_id:summary.word.id, 
                          channel_name:summary.word.name  
                    };
      the_big_filter_JSON[filter_id] = filter_value;
      //var html='<li>' +
      var html =  '<a href="#" class="js_summary_filter_setter summary_links_styling" id="' + filter_id +'" >' +
                  '<img src="'+ friend.photo + '"  width="25" height="25" alt="" />' +
                  '<span>' +
                      friend.full_name +
                  '</span>' +
                '</a>';
              //'</li>';

      friends_box.append(html);
    });

  }else{
    var html='<span> could not found any related friends !! </span>';
    friends_box.append(html);              
    //friends_box.hide();
  }
  
}

/*******************************************************************/


/* handle entities box */
function create_and_add_entities_box(box_id, summary){
  var entities_box = $("#" + box_id);
  if( summary.entities && summary.entities.length ){
    $.each(summary.entities, function(i, entity){
       // cap on max number of elements shown in related entity fields
      if(i>6)
        return;
      /* This filter id uniquely identifies filter */
      var filter_id =  'FS_' + summary.word.id + '_' + summary.user.id + '_' + entity.id;
      /* create a JSON of filter */
      var filter_value = {
                            user:summary.user.id ,
                            thing_id:entity.id,
                            thing_name:entity.name,
                            channel_id:summary.word.id, 
                            channel_name:summary.word.name  
                          };
      the_big_filter_JSON[filter_id] = filter_value;

      var thing_text = entity.name;
      // 20 is max char limit set to be display on one like
      if(thing_text.length > 20){
        thing_text =   entity.name.substring(0,20) + ' >' ;
      } 

      var html='<li>' +
                '<a href="#" class="js_summary_filter_setter summary_links_styling" id="' + filter_id +'" >' +
                  /*'<img src="'+ entity.image  + '?maxwidth=40&maxheight=40"  width="40" height="40" alt="" />' +*/
                  '<span>' +
                      thing_text +
                  '</span>' +
                '</a>' +
              '</li>';

      entities_box.append(html);
    });

  }else{
    var html='<li>' +
                  '<span> No elements found!!</span>' +
              '</li>';
    entities_box.append(html);
    //entities_box.hide();
  }
}


/*******************************************************************/

/* handle locations box */
function create_and_add_locations_box(box_id, summary){
  var locations_box = $("#" + box_id);
  
  if( summary.locations && summary.locations.length ){
  
    $.each(summary.locations, function(i, place){
      // cap on max number of elements shown in related location fields
      if(i>6)
        return;
      var filter_id =  'FS_' + summary.word.id + '_' + summary.user.id + '_' + place.id;
      /* create a JSON of filter */
      var filter_value = {
                            user:summary.user.id ,
                            location_id:place.id,
                            location_name:place.name,
                            channel_id:summary.word.id,
                            channel_name:summary.word.name  
                          };
      the_big_filter_JSON[filter_id] = filter_value;

      var location_text = place.name;
      // 20 is max char limit set to be display on one like
      if(location_text.length > 20){
        location_text =   place.name.substring(0,20) + ' >' ;
      } 
      
      var html='<li>' +
                  '<a href="#" class="js_summary_filter_setter summary_links_styling" id="' + filter_id + '"  >' +
                    '<span>' +
                         location_text +
                    '</span>' +
                  '</a>' +
                '</li>';

      locations_box.append(html);
    });

  }else{
    var html='<li>' +
                  '<span> No locations found!!</span>' +
              '</li>';
    locations_box.append(html);
    //locations_box.hide();
  }
}

/*******************************************************************/
function populate_people_list_on_summary(box_id, data){
  var div = $("#" + box_id);


  $.each(data.user, function(i, user){
     var html='<div class="p-channel-people-box">' +
                '<a href="/home/show?id=' + user.id + '">' +
                  '<img src="'+ user.photo + '"  width="30" height="30" alt="" />' +
                '</a>' +
              '</div>';
      
     div.append(html);
     if(i>5){
       return false;
     }

    });
  
  div.show();
}

/*******************************************************************/
function create_and_add_subscriptions_in_auth_sect()
{
   $("#" + "owners_subscription_list").empty();

   $.ajax({
        url: '/home/get_subscriptions.json',
        type: 'GET',
        data: { 
                user_id:aw_lib_get_page_owner_id(),
                cache_cookie:aw_lib_get_cache_cookie_id()
              },
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
           if(data && data.user && data.user.length != 0) {
             var html = '<span class="p-channel-people-head  JS_AW_MODAL_subscription js_modal_dialog_link">' +
                          data.user.length +' Subscriptions from  >' +
                        '</span>' +
                        '<div class="p-channel-people-list" id="subscriptions_list_box">' +
                        '</div>';
             $("#" + "owners_subscription_list").append(html);
             populate_people_list_on_summary("subscriptions_list_box", data);
             /* set context for the modal dialog */
             aw_subscription_modal_data(data.user);
           }else{
             $("#" + "owners_subscription_list").html('<span>No subscriptions so far.</span>');
           }

        },
        error:function(XMLHttpRequest,textStatus, errorThrown) {
            aw_lib_alert('There has been a problem getting subscribers list. \n ActWitty is trying to solve.');
        }
    });

  

}

/*******************************************************************/
function create_and_add_subscribers_in_auth_sect()
{
  $("#" + "owners_subscribers_list").empty();
  
   $.ajax({
        url: '/home/get_subscribers.json',
        type: 'GET',
        data: { 
                user_id:aw_lib_get_page_owner_id(),
                cache_cookie:aw_lib_get_cache_cookie_id()
              },
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
           if(data && data.user && data.user.length != 0) {
             var html = '<span class="p-channel-people-head  JS_AW_MODAL_subscriber js_modal_dialog_link">' +
                          data.user.length + ' Subscribers of channels >' +
                        '</span>' +
                        '<div class="p-channel-people-list" id="subscribers_list_box">' +
                        '</div>';
             $("#" + "owners_subscribers_list").append(html);
             populate_people_list_on_summary("subscribers_list_box", data);
             /* set context for the modal dialog */
             aw_subscriber_modal_data(data.user);
           }else{
             $("#" + "owners_subscribers_list").html('<span>No subscribers to the channels.</span>');
           }

        },
        error:function(XMLHttpRequest,textStatus, errorThrown) {
            aw_lib_alert('There has been a problem getting subscribers list. \n ActWitty is trying to solve.');
        }
    });

}


function create_and_add_last_updates_in_auth_sect(box_id)
{
  var latest_update_box = $("#" + box_id);
  var html = '<div class="p-channelp-auth-last-upd-post" id="p-latest-post">'+
               
             '</div>' +

             '<div class="p-channelp-auth-subscriptions" id="owners_subscription_list">' +
             '</div>' +
             '<div class="p-channelp-auth-subscribers" id="owners_subscribers_list" >' +
             '</div>';

  html = html + get_add_channel_html(); 
             
  latest_update_box.append(html);

}

/*******************************************************************/
function get_add_channel_html(){
  var html="";
  if ( aw_lib_get_page_owner_id() == aw_lib_get_session_owner_id() ){
     html = '<div class="js_summary_add_channel_base p-channelp-auth-add-channel">' +
             '<span>' +
                  '<div><a  class="js_add_facebook_friends" id="add_facebook_friends" href="#"> Manage Facebook Friends' +'</a></div></br>' +
                  '<a  class="js_add_channel_minimize" > Add Channel  <img src="/images/alpha/shares/plus.png" width="10" height="10"/>' +
                  '</a>' +
                  
             '</span>' +
             '<div class="js_summary_add_channel_box p-channelp-auth-add-channel-box">' +
                '<span>' +
                  '<input id="js_new_channel_field" class="activity_input input_text_box" type="text" />' +
                  '<input id="js_new_channel_button" type="button" value="Create" />' +
                '</span>' +
             '</div>' + 
            '</div>';
  }
  return html;

}


/*******************************************************************/


function create_and_add_summary_author(author_box, owner_id)
{
  /*
   */
   var unique_id =  'SUMMARY_AUTHOR_' + owner_id;
   if ($("#" + unique_id ).length > 0){
     return;
   }
   var latest_update_id = unique_id + '_latest_update'; 
   
   var html =   '<div class="p-channelp-author-img-sect">' +
                  '<img src="' + aw_lib_get_page_owner_photo() + '">' +
                '</div>' +
                '<div class="p-channelp-author-name">' +
                   '<span>' + aw_lib_get_page_owner_name() + '</span>' +
                '</div>' +
                '<div class="p-channelp-auth-last-upd-sect" id="' + latest_update_id + '">' +
                   '<div class="p-channelp-auth-last-upd-hd">' +
                      '<span>Last Updates :</span>' +
                   '</div>' +
                '</div>';
    $("#p-channelp-author-section").html(html);
    create_and_add_last_updates_in_auth_sect(latest_update_id);
    
}




/*
 * Create and add summary icon box.. as we have decided to have 2 icons per line
 * clicking on any of the icon will open full summary view of that channel
 */
function create_and_add_summary_icon_box(summary_box,id)
{
    var html = '<div class="p-channelp-otr-box" id="'+ id +'">' +
               '</div>';
    summary_box.append(html);
}





/* 
 * create and add summary for main page. Latest updates seen on main page is a bit different
 *
 */
function create_and_add_mainpage_summary(summary_box, summary){
 /* Fail safe, due to any reason this happens, reject the summary from being displayed again */
 var unique_id =  'SUMMARY_MAINPAGE_' + summary.word.id + '_' + summary.user.id;
 if ($("#" + unique_id ).length > 0){
   return;
 }
 var docs_box_id = unique_id + '_attachments';
 var friends_box_id = unique_id + '_friends';
 var subscribe_box_id = unique_id + '_subscribe';
 var entities_box_id = unique_id + '_entities';
 var locations_box_id = unique_id + '_locations';
 var latest_text_box_id = unique_id + '_text';
 
 var filter_id =  'FS_' + summary.word.id + '_' + summary.user.id;
 
 
 /* create a JSON of filter */
 var filter_value = {
                      user:summary.user.id ,
                      channel_id:summary.word.id, 
                      channel_name:summary.word.name  
                    };
 the_big_filter_JSON[filter_id] = filter_value;
var show_counter = 0;
 if( summary.social_counters && summary.social_counters.length){
  $.each(summary.social_counters, function(i, counter) { 
    show_counter += counter.count; 
  });
 }
 aw_lib_console_log("debug","profile_summary.js:create_and_add_mainpage_summary"); 
 
 
 var html = '<div class="p-channlep-post-mainpage" id="' +  unique_id + '">'+
                '<div class="p-channelp-post-info-mainpage">'+
                  '<div class="p-channelp-post-lu-mainpage" id="' + latest_text_box_id  + '">' + 
                      '<div class="p-channelp-post-lu-header-mainpage">'+
                        '<span>Last Updates</span>'+
                      '</div>'+
                  '</div>'+
                  '<div class="p-channelp-post-cu-mainpage js_word_name_box">'+
                    '<div class="p-channelp-post-subs-info" id="' + subscribe_box_id + '">' +
                    '</div>'+
                  
                    '<hr class="p-channelp-post-cu-bar-mainpage"/>'+
                    '<div class="p-channelp-post-title-mainpage">'+
                       '<center><span id="'+ filter_id +'" class="js_summary_filter_setter">' + summary.word.name + '</span></center>'+
                    '</div>'+
                  '</div>'+
                  '<div class="p-channelp-post-analytic-mainpage">'+
                    '<div class="p-channelp-post-like-mainpage">'+
                      '<p><center>' + show_counter + '</center></p> <p> <center>Shares</center></p>'+
                    '</div>'+
                    '<div class="p-channelp-post-post-mainpage">'+
                      '<p><center>' + summary.activity_count + '</center></p> <p> <center>Posts</center></p>'+
                    '</div>'+
                  '</div>'+
                '</div>'+
             '</div>';


        /* overall summary div is added */        
        summary_box.append(html);

        var background_theme =  get_base_theme_image_url() + "box1.png";
        if( summary.theme_data.url && summary.theme_data.url.length){
          background_theme = summary.theme_data.url;
        }

        var word_name_box = $('#' + unique_id).find('.js_word_name_box');
        word_name_box.css({
                            'backgroundImage' :'url('+ background_theme + ')',
                            //'backgroundRepeat': 'no-repeat',
                            'backgroundPosition': 'center center'
                          });  

        create_and_add_text_box(latest_text_box_id, summary,"mainpage");
}










/* handle complete summary box */
function create_and_add_summary_icon(summary_box, summary, icon_id, main_id){
 /* Fail safe, due to any reason this happens, reject the summary from being displayed again */
 var unique_id =  icon_id;
 var unique_id_main_box = main_id;
 if ($("#" + unique_id ).length > 0){
   return;
 }
 var docs_box_id = unique_id + '_attachments';
 var friends_box_id = unique_id + '_friends';
 var subscribe_box_id = unique_id + '_subscribe';
 var entities_box_id = unique_id + '_entities';
 var locations_box_id = unique_id + '_locations';
 var latest_text_box_id = unique_id + '_text';
 
 var filter_id =  'FS_' + summary.word.id + '_' + summary.user.id;
 
 
 /* create a JSON of filter */
 var filter_value = {
                      user:summary.user.id ,
                      channel_id:summary.word.id, 
                      channel_name:summary.word.name  
                    };
 the_big_filter_JSON[filter_id] = filter_value;
var show_counter = 0;
 if( summary.social_counters && summary.social_counters.length){
  $.each(summary.social_counters, function(i, counter) { 
    show_counter += counter.count; 
  });
 }
 aw_lib_console_log("debug","profile_summary.js:create_and_add_summary_icon"); 
 var html =  '<div class="p-channelp-otr-channel-icon" id="' + unique_id + '">'+
               '<div class="p-channelp-post-cu js_word_name_box" >' +
                  '<div class="p-channelp-post-subs-info" id="' + subscribe_box_id + '">' +
                  '</div>'+
                  
                  '<hr class="p-channelp-post-cu-bar"/>'+
                  '<div class="p-channelp-post-title">'+
                     '<center><span id="'+ filter_id +'" class="js_summary_filter_setter">' + summary.word.name + '</span></center>'+
                  '</div>'+
                  '<div class="p_channelp_view_summary" value="' + unique_id_main_box + '"> <span>view more ></span>'+
                  '</div>'+
                '</div>' +
                '<div class="p-channelp-post-analytic">' +
                  '<div class="p-channelp-post-like">' +
                    '<p><center>' + show_counter + '</center></p> <p> <center>Shares</center></p>' +
                  '</div>' +
                  '<div class="p-channelp-post-post">' +
                    '<p><center>' + summary.activity_count + '</center></p> <p> <center>Posts</center></p>' +
                  '</div>' +
                '</div>' +
             '</div>';
 

 
  
        /* overall summary div is added */        
        summary_box.append(html);
        var background_theme =  get_base_theme_image_url() + "box1.png";
        if( summary.theme_data.url && summary.theme_data.url.length){
          background_theme = summary.theme_data.url;
        }
        var word_name_box = $('#' + unique_id).find('.js_word_name_box');
        word_name_box.css({
                            'backgroundImage' : 'url('+ background_theme + ')',
//                            'backgroundRepeat': 'no-repeat',
                            'backgroundPosition': 'center center'
                          }); 
        return unique_id_main_box;
}

/* handle complete summary box */
function create_and_add_summary(summary_box, summary , box_id, hide_class){
 /* Fail safe, due to any reason this happens, reject the summary from being displayed again */


 var unique_id = box_id;
 if ($("#" + unique_id ).length > 0){
   return;
 }
 aw_lib_console_log("debug", "profile_summary.js:create_and_add_summary called ");
 var docs_box_id = unique_id + '_attachments';
 var friends_box_id = unique_id + '_friends';
 var subscribe_box_id = unique_id + '_subscribe';
 var entities_box_id = unique_id + '_entities';
 var locations_box_id = unique_id + '_locations';
 var latest_text_box_id = unique_id + '_text';
 
 var filter_id =  'FS_' + summary.word.id + '_' + summary.user.id;
  /* create a JSON of filter */
 var filter_value = {
                      user:summary.user.id ,
                      channel_id:summary.word.id, 
                      channel_name:summary.word.name  
                    };
 the_big_filter_JSON[filter_id] = filter_value;

 var show_counter = 0;
 if( summary.social_counters && summary.social_counters.length){
  $.each(summary.social_counters, function(i, counter) { 
    show_counter += counter.count; 
  });
 }

 var html = '<div class="p-channelp-post  js_summary_base_div '+ hide_class +' " id="' + unique_id + '">' +
              '<input type="hidden" class="js_summary_id_hidden" value="' + summary.id + '"/>' +

              '<div class="p-channelp-post-header">' +

                '<div class="p-channelp-post-tab">More >' +
                '</div>' +

                '<div class="p-channelp-post-author">' +

                  '<div class="p-channelp-post-author-img">' +
                    '<a href="/home/show?id=' +  summary.user.id + '" >' +  
                      '<img src="' + summary.user.photo + '" alt="">' +
                    '</a>'+ 
                   '</div>' +

                  '<div class="p-channelp-post-author-name">' +
                    '<span>' + summary.user.full_name+ '</span>' +
                  '</div>' +

                '</div>' +
              '</div> ' +
             

              '<div class="p-channelp-post-info">' +
                '<div class="p-channelp-post-lu" id="' + latest_text_box_id  + '">' +
                  '<div class="p-channelp-post-lu-header">' +
                    '<span>Last Updates</span>' +
                  '</div>' +
                '</div>' +
            
                '<div class="p-channelp-post-cu js_word_name_box">' +
                  '<div class="p-channelp-post-subs-info" id="' + subscribe_box_id + '">' +
                  '</div>'+
                  
                  '<hr class="p-channelp-post-cu-bar"/>'+
                  '<div class="p-channelp-post-title">'+
                     '<center><span id="'+ filter_id +'" class="js_summary_filter_setter">' + summary.word.name + '</span></center>'+
                  '</div>'+
                '</div>' +
                '<div class="p-channelp-post-analytic">' +
                  '<div class="p-channelp-post-like">' +
                    '<p><center>' + show_counter + '</center></p> <p> <center>Shares</center></p>' +
                  '</div>' +
                  '<div class="p-channelp-post-post">' +
                    '<p><center>' + summary.activity_count + '</center></p> <p> <center>Posts</center></p>' +
                  '</div>' +
                '</div>' +

              '</div>' +

              get_summary_theme_html(summary) +
              '<div class="p-channelp-related-info">' +
                '<div class="p-channelp-rel-frnd" >' +
                  '<div class="p-channelp-post-rel-friend-header">' +
                    '<span>Related Friends :</span>'+
                  '</div>' +
                  '<div id="' + friends_box_id + '">' +
                  '</div>' +
                '</div>' +
                '<div class="p-channelp-post-rel-elem" >' +
                  '<div class="p-channelp-post-rel-elem-header">' +
                    '<span>Related Elements :</span>'+
                  '</div>' +
                  '<div class="p-channelp-post-relelem-sect">' +
                    '<ul class="p-channelp-post-relelem" id="' + entities_box_id  + '">' +
                    '</ul>' +
                  '</div>' +
                '</div>' +
                '<div class="p-channelp-post-rel-loc" >' +
                  '<div class="p-channelp-post-rel-loc-header">' +
                    '<span>Related Locations :</span>'+
                  '</div>' +
                  '<div class="p-channelp-post-relloc-sect">' +
                    '<ul class="p-channelp-post-relelem" id="' + locations_box_id  + '">' +
                    '</ul>' +
                  '</div>' +
                '</div>' +
              '</div>' +

              '<div class="p-channelp-post-rel-img" >' +
                '<div class="p-channelp-post-rel-img-header">' +
                    '<span>Related Images :</span>'+
                '</div>' +
                '<div class="p-channelp-rel-img">' +
                  '<div id="' + docs_box_id + '">' +
                  '</div>' +
                '</div>' +
              '</div>' +

            '</div>';


        /* overall summary div is added */        
        summary_box.append(html);
        var background_theme =  get_base_theme_image_url() + "box1.png";
        if( summary.theme_data.url && summary.theme_data.url.length){
          background_theme = summary.theme_data.url;
        }
        var word_name_box = $('#' + unique_id).find('.js_word_name_box');
        word_name_box.css({
                            'backgroundImage' : 'url('+ background_theme + ')',
//                            'backgroundRepeat': 'no-repeat',
                            'backgroundPosition': 'center center'
                          });  
          
         aw_lib_console_log("debug","profile_summary.js:create_and_add_summary html appended");
        /* handle individual divs */
        //create_and_add_post_author_box(post_author_box_id, summary);
        create_and_docs_box(docs_box_id, summary); 
        create_add_add_subscribe_box(subscribe_box_id, summary);
        create_and_add_text_box(latest_text_box_id, summary,"channelpage");
        create_and_add_friends_box(friends_box_id, summary);
        create_and_add_entities_box(entities_box_id, summary);
        create_and_add_locations_box(locations_box_id, summary);

}
/*
 *
 */
function append_personal_summary(owner_id){
  var scroll = $(window).scrollTop();
  var more_cookie =  $("#more_channels_cookie").val();
   aw_lib_console_log("debug","profile_summary.js:append_personal_summary");
  $.ajax({
        url: '/home/get_summary.json',
        type: 'GET',
        data: {
                user_id : owner_id, 
                updated_at:more_cookie, 
                page_type:aw_get_channel_scope(),
                cache_cookie:aw_lib_get_cache_cookie_id()
              },
        dataType: 'json',
        contentType: 'application/json',  
        success: function (data) {

           // if rails demands a redirect because of log in missing
           if( aw_get_channel_scope() == 3  ||
               (aw_get_channel_scope() == 1 && 
                  aw_lib_get_page_owner_id() != aw_lib_get_session_owner_id()) ){
             for (i=0;i < data.length;i=i+2) {
                if(!data[i+1]) {
                   var summary_r_id = 0;
                }
                var id = 'SUMMARY_ICON_BOX_' + data[i].id + '_' + summary_r_id;
                create_and_add_summary_icon_box($('#p-channelp-posts'),id); 
                for(j=0;j<2;j++) {
                   if(data[i+j]){
                     summary = data[i+j];
                     var icon_id = 'SUMMARY_ICON_' + summary.word.id + '_' + summary.user.id;
                     var main_id = 'SUMMARY_ICON_MAIN_' + summary.word.id + '_' + summary.user.id;
                     create_and_add_summary_icon($("#"+id),summary,icon_id, main_id);
                   }
                }
                for(j=0;j<2;j++) {
                   if(data[i+j]){
                      summary = data[i+j];
                      var main_id = 'SUMMARY_ICON_MAIN_' + summary.word.id + '_' + summary.user.id;
                      create_and_add_summary($('#p-channelp-posts'),summary, main_id, "hide_it"); 
                   };
                }
             }
             $("#more_channels_cookie").val(summary.time);
           } else {
            $.each(data, function(i,summary){
                if( summary ){
                    var box_id = 'SUMMARY_BOX_' + summary.word.id + '_' + summary.user.id;
                    create_and_add_summary($('#p-channelp-posts'),summary, box_id, "no_hide");
                    $("#more_channels_cookie").val(summary.time);
                } 
            });
          }
          $(window).scrollTop(scroll);

          /* convert time stamp to time ago */
          $("abbr.timeago").timeago();


        },
        error:function(XMLHttpRequest,textStatus, errorThrown) {  
          aw_lib_alert('There has been a problem generating summary. \n ActWitty is trying to solve.');
        }
    });

}


/*
 * To fetch and create the author section (on right side) of channel page
 */
function attach_channel_author_section(owner_id){
  /* 
   * I am not sure of api to call hence leaving it blank...
   */
   create_and_add_summary_author($('#p-channelp-author-section'),owner_id);
   create_and_add_subscribers_in_auth_sect();
   create_and_add_subscriptions_in_auth_sect();
}


/**********************/
function aw_summary_reload_tab(owner_id){
  $('#p-channelp-posts').html('');
  $("#more_channels_cookie").val("");
  append_personal_summary(owner_id);

}

/**********************/
function subscribe_summary(trigger_ele, sub_summary_id, action ){
    var post_url="";
     aw_lib_console_log("debug","profile_summary.js:called subscribe/unsubscribe summary");
    if( action == true ){
      post_url = '/home/subscribe_summary.json';
    }else{
      post_url = '/home/unsubscribe_summary.json';
    }
    $.ajax({
        url: post_url,
        type: 'POST',
        data: {summary_id:sub_summary_id},
        dataType: 'json',
        success: function (data) {
          if(action == true){
            //trigger_ele.html('UNSUBSCRIBE');
            trigger_ele.html(get_subscription_box_element('UNSUBSCRIBE'));
          }else{
            //trigger_ele.html('SUBSCRIBE');
            trigger_ele.html(get_subscription_box_element('SUBSCRIBE'));
            if(aw_lib_get_session_owner_id() == aw_lib_get_page_owner_id() &&
              aw_get_channel_scope() == 2 ){
              trigger_ele.closest('.js_summary_base_div').hide();
            }
          }
         
        return false;
         
         
        },
        error:function(XMLHttpRequest,textStatus, errorThrown) {
            aw_lib_alert('There has been a problem in adding new comment. \n ActWitty is trying to solve.');
        }
    });
}
/**********************/
function update_summary_theme(trigger_ele){
  var summary_id_val = trigger_ele.closest('.js_summary_base_div').find('.js_summary_id_hidden').val();
  var url_val = trigger_ele.attr("src");
  var default_val = false;
  
  var json_data = { 
                    summary_id:summary_id_val,
                    url:url_val,
                  };

  $.ajax({
        url: '/home/create_theme.json',
        type: 'POST',
        data: json_data,
        dataType: 'json',
        success: function (data) {
          var word_name_box = trigger_ele.closest('.js_summary_base_div').find('.js_word_name_box');
          word_name_box.css({
                            'backgroundImage': 'url('+  url_val + ')',
//                            'backgroundRepeat': 'no-repeat',
                            'backgroundPosition': 'center center'
                          }); 
          return false;
         
         
        },
        error:function(XMLHttpRequest,textStatus, errorThrown) {
            aw_lib_alert('There has been a problem in adding new comment. \n ActWitty is trying to solve.');
        }
    });

}

/**********************/
$(document).ready(function(){
  /* Manage summary filters */
    $('.js_summary_filter_setter').live('click', function(){
      var filters_base_id = $(this).attr("id");
      if (filters_base_id.length > 0){
          var filter = the_big_filter_JSON[filters_base_id];
          if(filter){
            /* do not cause reload */
            reset_filter(false);
            modify_filter(filter);
          }

          return false;
        }
      aw_lib_alert("ActWitty will fix the problem with the filter");
    });
    /**********************/
    $(".js_subscribe_summary").live('click', function(){
       aw_lib_console_log("debug","profile_summary.js:clicked subscribe/unsubscribe summary");
      var summary_id =$(this).closest('.js_summary_base_div').find('.js_summary_id_hidden').val();
      /* old code is commented for a while to have quick ref */
      //var action = $(this).html();
      var action = $(this).attr('id');
      //if (action == 'SUBSCRIBE'){
      if (action == 'subscribed_channel'){
        subscribe_summary($(this), summary_id, true);
      }else{
        subscribe_summary($(this), summary_id, false);
      }
      
    });
    /*
     * Bind click to more on personal summary
     */
    $('#more_personal').click(function() {
      aw_lib_console_log("debug", "profile.js:more personal summary clicked");
      append_personal_summary(page_owner_id);
      return false;
    });
    /***********************/
    $(".js_add_channel_minimize").live('click',function(){
      var add_new_block = $(this).closest(".js_summary_add_channel_base").find(".js_summary_add_channel_box");
    
      if(add_new_block.css('display') == 'none'){ 
        add_new_block.show('slow'); 
        $(this).find('img').attr("src", "/images/alpha/shares/minus.png");
      } else { 
        add_new_block.hide('slow'); 
        $(this).find('img').attr("src", "/images/alpha/shares/plus.png");
      }
      return false;
    });
    /*************************/
    $("#js_new_channel_button").live('click', function(){
     var new_channel = $("#js_new_channel_field").val();
     if(new_channel.length == 0){
       aw_lib_alert("Channel name cannot be left blank");
       return false;
      }

      var post_json = { 
                      word : new_channel,
                      enrich : true,
                      source_name:"actwitty",
                      text : "created a new channel",
                      status:2

                    };
       post_activity_to_server(post_json, false, true);
       $("#js_new_channel_field").val('');
       return false;
    });
    /*************************/
    $(".js_set_theme_minimize").live('click',function(){
      var add_new_block = $(this).closest(".js_summary_theme_base").find(".js_summary_theme_list_box");
    
      if(add_new_block.css('display') == 'none'){ 
        add_new_block.show('slow'); 
        $(this).find('img').attr("src", "/images/alpha/shares/minus.png");
      } else { 
        add_new_block.hide('slow'); 
        $(this).find('img').attr("src", "/images/alpha/shares/plus.png");
      }
      return false;
    });
    /*************************/
    $(".js_theme_image").live('click', function(){
      update_summary_theme($(this));
    });
    /*************************/

    /*
     *    Collaspsible effect on more/less on channel summary
     */
    $(".p-channelp-post-tab").live('click',function(){
      $(this).closest(".p-channelp-post").find(".p-channelp-related-info").slideToggle();
      $(this).closest(".p-channelp-post").find(".p-channelp-post-rel-img").slideToggle();
      if($(this).text() == "More >") {
        $(this).text("Less <");
        $(this).closest(".p-channelp-post").addClass("p-channelp-post-border");
      } else {
        $(this).text("More >");
        $(this).closest(".p-channelp-post").removeClass("p-channelp-post-border");
      }
    });

    $(".p_channelp_view_summary").live('click',function(){
      var summary_id = $("#"+$(this).attr("value"));
      if($(this).find('span').text() == "view more >"){
        $(this).find('span').text("view less <");
        $(this).parent().addClass("p-channelp-otr-icon-active");
        summary_id.addClass("p-channelp-icon-summary-active");
      } else {
        $(this).find('span').text("view more >");
        $(this).parent().removeClass("p-channelp-otr-icon-active");
        summary_id.removeClass("p-channelp-icon-summary-active");
      }
      
      summary_id.slideToggle();
    });

});



/************************************/
var the_big_related_friend_json = {};
var the_big_related_entities_json = {};
var the_big_related_locations_json = {};
var the_big_related_channels_json = {};
/************************************/

/*
 * Populate filtered related friends
 */
function populate_filtered_friends(ele, friends){
  if( !friends && friends.length <= 0 ){
    return;
  }
  var div = ele;

  //alert(JSON.stringify(friends));

  $.each(friends, function(i, friend){
     var link_id = "stream_friend_id_" + friend.id;
     var html='<div class="p-fltr-tag-list">' +
                '<a href="#" class="js_related_friends" id="' + link_id + '">' +
                  '<img src="'+ friend.image + '"  width="30" height="30" alt="" />' +
                '</a>' +
              '</div>';
      
     div.append(html);
     the_big_related_friend_json[link_id] = friend.id;
     if(i>3){
       return false;
     }

    });
  
  var related_friends_div=$("#stream_related_friends");
  related_friends_div.show();
}
/************************************/
/*
 * Populate filtered related entities
 */
function populate_filtered_entities(ele, entities){
  if( !entities && entities.length <= 0 ){
    return;
  }
  var div = ele;
  $.each(entities, function(i, entity){
     var link_id = "stream_related_entity_fltr_" + entity.id;
     var entity_name = get_trim_text(entity.name,18,"..."); // a helper to trim the text
     var html='<div class="p-fltr-tag-list-entity">' +
                '<span id="'+ link_id + '" class="js_related_entities">' +
                      entity.name +
                '</span>' +
              '</div>';
     div.append(html);
     the_big_related_entities_json[link_id] = {id:entity.id, name:entity.name};

     if(i>2){
       return false;
     }

    });
  
}
/************************************/
/*
 * Populate filtered related locations
 */
function populate_filtered_locations(ele, locations){
  if( !locations && locations.length <= 0 ){
    return;
  }
  var div = ele;
  
  
 
  $.each(locations, function(i, location){
     var link_id = "stream_location_id_" + location.id;
     var location_name = get_trim_text(location.name,18,"..."); // a helper to trim the text
     var html='<div class="p-fltr-tag-list-location">' +
                  '<span class="js_related_locations" id="' + link_id + '">' +
                    location_name +
                  '</span>' +
              '</div>';
      
     div.append(html);
     the_big_related_locations_json[link_id] = {id:location.id, name:location.name};
     if(i>2){
       return false;
     }
    });
  
}
/************************************/

/*
 * Populate related channels
 */


function populate_filtered_channels(box_id, channels){
  if( !channels && locatchannelsions.length <= 0 ){
    return;
  }

  var div = $("#" + box_id);
  var ul_id = "FILTERED_STREAM_CHANNELSS_UL";
  var title_html = '<div class="stream_related_channels_title_box">' +
                    '<span>' +
                      'Related Channels' +
                    '</span>' +
                   '</div>';
  var html = '<ul class="streams_side_ul_channels" id="' + ul_id +'">' +
             '</ul>';
  div.append(title_html);
  div.append(html);


  var ul = $("#" + ul_id);
  $.each(channels, function(i, channel){
     var link_id = "stream_location_id_" + channel.id;
     var html='<li class="streams_side_li_locations">' +
                '<a href="#" class="js_related_locations stream_channels_a" id="' + link_id + '">' +
                  '<span class="stream_locations_span">' +
                    channel.name +
                  '</span>' +
                '</a>' +
              '</li>';
      
     ul.append(html);
     the_big_related_channels_json[link_id] = {id:channel.id, name:channel.name};

    });
  
  var related_channels_div=$("#stream_channels_box");
  related_channels_div.show();
}


/************************************/
function list_related_friends(){
    var ele = $("#stream_related_friends");
    $.ajax({
        url: '/home/get_related_friends.json',
        type: 'GET',
        data: { 
                filter : get_filter(),
                page_type:aw_get_stream_scope(),
                cache_cookie:aw_lib_get_cache_cookie_id()
              },
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
           populate_filtered_friends(ele, data);

           /* set context for the modal dialog */
           aw_friends_set_related_modal_data(data);
        },
        error:function(XMLHttpRequest,textStatus, errorThrown) {
            alert('There has been a problem getting related friends list. \n ActWitty is trying to solve.');
        }
    });

}

/************************************/
function list_related_entities(owner_id){
    var ele = $("#stream_related_entities");
    $.ajax({
        url: '/home/get_related_entities.json',
        type: 'GET',
        data: { 
                user_id : owner_id, 
                filter : get_filter(),
                page_type:aw_get_stream_scope(),
                cache_cookie:aw_lib_get_cache_cookie_id()
              },
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
           populate_filtered_entities(ele, data);

           /* set context for the modal dialog */
           aw_entities_set_related_modal_data(data);
        },
        error:function(XMLHttpRequest,textStatus, errorThrown) {
            alert('There has been a problem getting related entities list. \n ActWitty is trying to solve.');
        }
    });

}

/************************************/

function list_related_locations(owner_id){
    var ele = $("#stream_related_locations");
    $.ajax({
        url: '/home/get_related_locations.json',
        type: 'GET',
        data: { 
                user_id : owner_id, 
                filter : get_filter(),
                page_type:aw_get_stream_scope(),
                cache_cookie:aw_lib_get_cache_cookie_id()
              },
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
           populate_filtered_locations( ele, data);
           
           /* set context for location */
           aw_locations_set_related_modal_data(data);
        },
        error:function(XMLHttpRequest,textStatus, errorThrown) {
            alert('There has been a problem getting related locations list. \n ActWitty is trying to solve.');
        }
    });

}

/************************************/
function list_related_channels(owner_id){
    $.ajax({
        url: '/home/get_activities.json',
        type: 'GET',
        data: { 
                user_id : owner_id, filter : get_filter(),
                cache_cookie:aw_lib_get_cache_cookie_id()
              },
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
           populate_filtered_channels("stream_channels_box", data);
        },
        error:function(XMLHttpRequest,textStatus, errorThrown) {
            alert('There has been a problem getting related channels list. \n ActWitty is trying to solve.');
        }
    });

}


/************************************/
function clear_related_friends() {
  $("#stream_related_friends_parent").html('');
  $("#stream_related_friends_parent").html('<div class="p-rel-fltr-tags" id="stream_related_friends">' +
                                           '</div>');
  the_big_related_friend_json={};

}


/************************************/
function clear_related_entities() {
 $("#stream_related_entities_parent").html('');
 $("#stream_related_entities_parent").html('<div class="p-rel-fltr-tags" id="stream_related_entities">' +
                                           '</div>');
  the_big_related_friend_json={};
}

/************************************/
function clear_related_locations() {
  $("#stream_related_locations_parent").html('');
  $("#stream_related_locations_parent").html('<div class="p-rel-fltr-tags" id="stream_related_locations">' +
                                           '</div>');
  the_big_related_locations_json={};

}


/************************************/
function clear_related_channels() {
  var related_locations_div=$("#stream_channels_box");
  related_locations_div.html('');
  the_big_related_channels_json={};

}

/*
 * Add the live bindings
 */
$(document).ready(function(){
  /*
   * A related friend clicked
   */
  $('.js_related_friends').live('click', function(){
    //the_big_comment_count_json
    var friend = the_big_related_friend_json[$(this).attr("id")];
    if(friend){
      var new_filter = {
                         user:friend,
                       }; 
      modify_filter(new_filter);
    }
    return false;
  });


  /*
   * A related entity clicked
   */
  $('.js_related_entities').live('click', function(){

    //the_big_comment_count_json
    var entity = the_big_related_entities_json[$(this).attr("id")];
    if(entity){
      //alert("Entity id:" + entity.id);
      var new_filter = {
                         thing_id:entity.id,
                         thing_name:entity.name
                       }; 
      modify_filter(new_filter);
    }
    return false;
  });

  /*
   * A related channel clicked
   */
  $('.js_related_channels').live('click', function(){
    //the_big_comment_count_json
    var channel = the_big_related_channels_json[$(this).attr("id")];
    if(channel){
      alert("Channel id:" + channel.id);
    }
    return false;
  });

  /*
   * A related location clicked
   */
  $('.js_related_locations').live('click', function(){
    //alert("RELATED LOCATION: STAY ON PAGE CHANGE FILTER");
    //the_big_comment_count_json
    var location = the_big_related_locations_json[$(this).attr("id")];
    if(location){
      //alert("Location id:" + location.id);
      var new_filter = {
                         location_id:location.id,
                         location_name:location.name                      
                      };
      modify_filter(new_filter);
    }
    return false;
  });
});



function show_all_drafts(){
   var more_cookie = $("#more_streams_drafts_cookie").val();
   $.ajax({
        url: '/home/get_draft_activities.json',
        type: 'GET',
        dataType:"json",
        cache: false,
        data: {
                 filter : get_filter(),
                 updated_at : more_cookie,
                 cache_cookie:aw_lib_get_cache_cookie_id()
              },
        success: function (data) {
          // if rails demands a redirect because of log in missing
          if (data.length){
             $.each(data, function(i,stream){
              if( stream ){
                  
                  create_and_add_stream($("#streams_drafts_list"), stream, aw_lib_get_session_owner_id());
                  $("#more_streams_drafts_cookie").val(stream.post.time);
              } 
            });
             $(window).scrollTop(scroll);
          }else{
            if( more_cookie.length == 0){
              $("#streams_drafts_list").html("<br/> <br/> No drafts to show");
            }
            aw_lib_alert('No drafts to show');
          }
            

        },
        error:function(XMLHttpRequest,textStatus, errorThrown) {
            aw_lib_alert('There has been a problem getting post. \n ActWitty is trying to solve.');
        }
    });

}
var g_aw_reedit_mode = 0;
function aw_get_reedit_mode(){
  return g_aw_reedit_mode;
}

function aw_edit_drafted_stream(post_id){
  /* Go into edit mode */
  var stream_render_id = get_stream_ele_id(post_id);
  $("#hidden_draft_post_id").val(post_id); 
  $("#" + stream_render_id).empty().remove();
  g_aw_reedit_mode = 1;
  init_edit_box(post_id);
}

function aw_publish_drafted_stream(post_id){
  var stream_render_id = get_stream_ele_id(post_id);
  $.ajax({
    url: '/home/publish_activity.json',
    type: 'POST',
    data: {activity_id:post_id},
    dataType: 'json',
    success: function (data) {
      if(data && data.post && data.post.status == 2){
        $("#" + stream_render_id).empty().remove();
      }
    },
    error:function(XMLHttpRequest,textStatus, errorThrown) {
      aw_lib_alert('There has been a problem in publishing the stream. \n ActWitty is trying to solve.');
    }
  });
}



/*
 * Add the live bindings
 */
$(document).ready(function(){
    /*
     * Bind click to more on streams tab
     */
     $('#more_streams_drafts').click(function() {
        aw_lib_console_log("debug", "more drafts clicked on streams page");
        show_all_drafts();
        return false;
    });
});

/**********************************/
/* Big global jsons which need to maintain context for dynamism*/
var the_big_comment_add_json={ };
var the_big_comment_show_all_json={ };
var the_big_comment_delete_json={ };


var the_big_stream_actions_json={ };

var the_big_stream_campaign_manager_json={ };
var the_big_stream_campaign_show_all={};
var the_big_stream_enriched_state={};
var the_big_stream_post_text={};

var the_big_stream_entity_deletes={};
/**********************************/

function getEmbeddedPlayer( url, height, width){
	var output = '';
  
	var youtubeUrl = url.match(/watch\?v=([a-zA-Z0-9\-_]+)/);
	var vimeoUrl = url.match(/^http:\/\/(www\.)?vimeo\.com\/(clip\:)?(\d+).*$/);
	if( youtubeUrl ){
	  output = '<iframe class="video" width="'+width+'" height="'+height+'" src="http://www.youtube.com/embed/'+youtubeUrl[1]+'?wmode=transparent"></iframe>';
    
	}else if(vimeoUrl){
		output =  '<iframe class="video" src="http://player.vimeo.com/video/'+vimeoUrl[3]+'" width="'+width+'" height="'+height+'" frameborder="0" ></iframe>';
	}else{
		output = '<p>no video url found - only vimeo and youtube supported</p>';
	}
	return output;
}

/*
 * Render stream docs
 * Attaching the docs with rel attribute
 * This rel attribute will start iwth fnc_group (for fancy box group)
 * There are different version of fancy box which can also be used.
 * The current one in place is for image gallery
 */
function handle_stream_docs(type, box_id, stream,view_all_id){
  aw_lib_console_log("debug", "stream html handle docs called");
  docs_box= $("#" + box_id);
  docs_view_all = $("#" + box_id + " div.p-awp-view-all-images-div");
  if ( stream.documents &&  stream.documents.count ){
    var ul_box = $("#" + box_id);
    

    if(stream.documents.array.length < 7){
      docs_view_all.hide();
    }else{
      if(view_all_id != ""){
        $("#"+view_all_id).html('View All ' + stream.documents.array.length + ' Images');
      }
    }

    $.each(stream.documents.array, function(i, attachment){
      var caption = "";
      if(attachment.caption && attachment.caption.length){
        caption = attachment.caption;
      }
      var thumb_nail = attachment.url; 
      if (attachment.thumb_url){
        thumb_nail = attachment.thumb_url; 
      }
      if( attachment.category == type && type == "image" ){
        aw_lib_console_log ("debug", "stream attaching thumb url:" + thumb_nail);

        var inner_box_id = box_id + "_" + attachment.id;
        /* currently 6 is the max number of images shown as icon-attachment */
        if(i>6){
          var box_html = '<div class="p-awp-view-attachment-inner-box hide_it" id="' + inner_box_id + '">' +
                   '</div>';
        }else{
          var box_html = '<div class="p-awp-view-attachment-inner-box" id="' + inner_box_id + '">' +
                   '</div>';
        }
        ul_box.append(box_html);
        var attachment_box = $("#" + inner_box_id);
      
        var image_theme_selector = "";
        if( stream.post.user.id == aw_lib_get_session_owner_id()){
          image_theme_selector = '<input type="hidden" class="js_theme_doc_id" value="' + attachment.id + '" />' +
                                 '<input type="hidden" class="js_theme_user_id" value="' + stream.post.user.id + '" />';
        }

        var html='<a rel="fnc_group_'+ box_id +'" href="' + attachment.url + '" title="' + caption  + '" >' + 
                  '<img alt="" src="'+ thumb_nail + '"   width="60" alt="" />' +
                  image_theme_selector +
                '</a>'; 
        if(aw_lib_get_session_owner_id() == stream.post.user.id){
          var close_html = '<div class="delete-image-box">' +
                            '<div class="delete-image-cntrl js_remove_attached_doc" id="' + attachment.id + '" />' +
                           '</div>';
          attachment_box.append(close_html);
        }
        attachment_box.append(html);
      }
     
    });
    /* activate fancy box  */
    activate_fancybox_group(box_id);   

    $.each(stream.documents.array, function(i, attachment){
      var thumb_nail = attachment.url; 
      if (attachment.thumb_url){
        thumb_nail = attachment.thumb_url; 
      }
      if( attachment.category == type && type == "video" ){
        aw_lib_console_log ("debug", "stream attaching video url:" + thumb_nail);
        var html=getEmbeddedPlayer( attachment.url, 180, 240);
        
        var inner_box_id = box_id + "_" + attachment.id;
        var box_html = '<div class="p-awp-video-view-attachment-inner-box" id="' + inner_box_id + '">' +
                   '</div>';
        ul_box.append(box_html);
        var attachment_box = $("#" + inner_box_id);
        if(aw_lib_get_session_owner_id() == stream.post.user.id){
          var close_html = '<div class="delete-video-box">' +
                            '<div class="delete-image-cntrl js_remove_attached_doc" id="' + attachment.id + '" />' +
                           '</div>';
          attachment_box.append(close_html);
        }
        attachment_box.append(html);
       
      }
     
    });
  }else{
    /* hide if there is nothing to show */
    docs_box.hide();
  }
}



/*
 * Render stream campaign
 */
function get_campaign_likes_label(count){
  if(count>1){
    return '<center>' + count + '</center><center>Likes</center>';
  }else{
    return '<center>' + count + '</center><center>Like</center>';
  }
}

function get_pluralize_form(count){
  if(count>1){
    return 's';
  }else{
    return '';
  }
}


function handle_like_campaign(div_id, stream){
  var div = $("#" + div_id);
  var link = div_id + "_link";
  var text_id = div_id + "_span";
  var user_status = false;
  var total_count = 0;
  var img_src = '/images/alpha/like.png';
  var like_text = "Like";
  var like_count_div = $("#" + text_id);
  $.each(stream.campaigns, function(i,campaign){
    if( campaign.name == "like" ){
       if(campaign.user ){
         user_status = campaign.user;
       }
       total_count = campaign.count;
    } 
  }); 
  var campaign_manager_json = {
                                  campaign_div_id:div_id,
                                  name:"like",
                                  user:user_status,
                                  post_id:stream.post.id,
                                  count: total_count
                              };

 the_big_stream_campaign_manager_json[div_id] = campaign_manager_json;
 if (user_status == true){
   img_src = '/images/alpha/unlike.png';
   like_text = "Unlike";
 }

  var html = '<div class="p-awp-view-campaign_all ">' +
              
             '<a id="' + link + '" value="' + div_id + '" class="js_like_user_action">' +
                  like_text +
             '</a>' +
             '</div>' +
            '<div class="p-awp-campaigns-section">' +
            '</div>';

  var like_count_html = get_campaign_likes_label(total_count);
  /* Pramod
  var like_count_html = '<center>'+total_count+'</center><center>Like'+get_pluralize_form(total_count)+'</center>';
  var html2 = '<div class="p-awp-view-campaign_all ">' +
                
                '<span class="js_campaign_show_all" id="' + text_id + '" value="' + div_id + '" >' +
                    get_campaign_likes_label(total_count) + 
                '</span>' +

                '<a id="' + link + '" value="' + div_id + '" class="js_like_user_action">' +
                  '<img src="' + img_src + '" />' +
                '</a>' + 
            '</div>' +
            '<div class="p-awp-campaigns-section">' +
            '</div>';
    
  */
               
  
  div.append(html);
  like_count_div.append(get_campaign_likes_label(total_count));
}
/*
 * Show all users in a campaign
 */
function show_all_stream_campaigns(likes, div){
  var likes_html="";
  alert(JSON.stringify(likes));
  //alert("show_all_stream_campaigns" + div);
  $.each(likes, function(i,like){
    var like_html = '<div class="author">' +
                        '<div class="p-st-comment-actor-image">' +
                          '<a href="/home/show?id=' +  like.id + '">' +
                            '<img class="avatar" src="' + like.photo + '" width="32" height="32" alt="" />' +
                          '</a>' +
                        '</div>' +
                        '<div class="p-st-comment-actor-desc">' +
                          '<span class="p-st-comment-actor">' +
                            '<a href="/home/show?id=' +  like.id + '">' +
                              like.full_name +
                            '</a>' +
                          '</span>' +
                        '</div>' +
                      '</div>';
    likes_html = likes_html + like_html;
  }); 
  div.html(likes_html);
  //div.append(likes_html);
}

/*
 * Render stream campaign
 */
function handle_stream_campaign(box_id, like_count_box_id,stream){
  var div=$("#" + box_id);
  var like_count_div=$("#" + like_count_box_id);
  if(stream.post.campaign_types == 1){
    handle_like_campaign(box_id, stream);
    //div.hide();
  }else{
    div.hide();
    like_count_div.hide();
  }
}

function append_entity_delete(post_id){
    /*handle entity delete*/
   var entity_del_json = the_big_stream_post_text[post_id];
    if ( entity_del_json ){
      var box_id = entity_del_json.text_box;
      var user_id = entity_del_json.user;
      var current_user_id=aw_lib_get_page_owner_id();  

      if(current_user_id == user_id){
        $("#" + box_id).find(".js_activity_entity").each(function(){
          $(this).addClass("js_handle_stream_entity_mention");
          var entity_id = $(this).attr("value");
          $(this).attr("href","/entity_page?entity_id=" +  entity_id);
          var remove_val = {post_id:post_id , entity:entity_id };
          
          var remove_id = post_id + '_' + entity_id + "_rem";
          the_big_stream_entity_deletes[remove_id] = remove_val;
          var hover_html = '<span>' +
                              '<a id="' + remove_id + '" value="' + remove_val + '" class="js_entity_delete"> unmark </a>' +
                           '</span>';
          $(this).append(hover_html);
        });
      }
    }
    return;
}




/*
 * Render stream text
 */
function handle_stream_text( box_id, post_text){
  var div=$("#" + box_id);
  if(post_text && post_text.length){
        var html='<p>' +
                post_text +
             '</p>';

        div.html(html);
    
  }else{
    /* text not defined correctly */
    div.hide();
  }
}

/*
 * Render stream location
 */
function handle_stream_location(box_id, location){
     var div = $("#" + box_id);
     if ( location && location.name && location.name.length){
           var html = '<a href="/location_page?location_id=' + location.id + '">' +
                     '<span class="p-awp-location-name" > @ ' + 
                        location.name +
                     '</span>' +
                 '</a>' ;
      div.append(html);
      
     }else{
       div.hide();
     }
               
}


/*
 * Render stream close button
 */
function handle_stream_actions(box_id, stream, current_user_id,post_operations_id,like_text_id){
  var div=$("#" + box_id);
  var like_count_div = $("#" + like_text_id);
  var post_op = $("#" + post_operations_id);
  /* set context on parent div  */
  var action_btn_json = {
                          stream_id : stream.post.id 
                       };
 
  the_big_stream_actions_json[box_id] = action_btn_json;
  if( stream.post.status == 1){
    /* basically now handling all operational buttons (mentions/comments/like etc) for drafts vs posts here itself . */
    if(current_user_id == stream.post.user.id){
      post_op.next().find(".p-awp-post-edit").show();
      post_op.next().find(".p-awp-post-publish").show();
      post_op.next().find(".p-awp-post-mentions").hide();
      post_op.next().find(".p-awp-post-like").hide();
      post_op.next().find(".p-awp-post-comments").hide();
      like_count_div.hide();
      /*var html = '<input type="button" value="Edit" class="js_stream_edit_btn p-awp-edit"/>' +
                '<input type="button" value="Publish" class="js_stream_publish_btn p-awp-publish"/>' ;
      div.append(html);
      */
    }
  }else{
    post_op.next().find(".p-awp-post-edit").hide();
    post_op.next().find(".p-awp-post-publish").hide();
    post_op.next().find(".p-awp-post-mentions").show();
    post_op.next().find(".p-awp-post-like").show();
    post_op.next().find(".p-awp-post-comments").show();
    like_count_div.show();
    /*var html = 'input type="button" value="Mentions" class="js_stream_enrich_btn p-awp-mention"/>' ;
    div.append(html);
    */
  }
  /* 
  if(current_user_id == stream.post.user.id) {
    alert("adding close");
    var html = '<input type="button" value="x" class="js_stream_delete_btn p-awp-close"/>';
    div.append(html);
  }*/
}

/*
 * Render comments close button
 */
function handle_comment_close_box(box_id, comment, comment_post_id, current_user_id, comment_id, show_all_id){
  var div=$("#" + box_id);
  if(current_user_id != comment.user.id){
    div.hide();
    return;
  }


  /* Set context to handle close button 
   * Don't mess with this structure
   */
  var comment_close_json = {
                            comment_id : comment.id,
                            comment_del_id : comment_id,
                            post_id : comment_post_id,
                            all_id: show_all_id
                           };
  var comment_close_id = 'COMMENT_CLOSE_BTN_' + comment.id;
  the_big_comment_delete_json[comment_close_id] = comment_close_json;
  /******************************/


  var html2 = '<input type="button" value="Remove" id="' + comment_close_id + '"' + 
                    'class="js_comment_delete_btn p-st-comment-close-btn"/>';
  var html = '<div class="p-st-comment-close js_comment_delete_btn" id="' + comment_close_id + '">' +
             '</div>' ;
  div.append(html);
}


function handle_stream_single_comment(comment, div_id, comment_post_id, current_user_id, show_all_id){

  var div = $("#" + div_id);
  var comment_box_id =  div_id + "_" + comment.id;
  var close_box_id =  comment_box_id + '_close'; 
  var comment_id = 'comment_list_' + comment.id;


  var html = '<div class="p-awp-comment" id="' + comment_id + '">' +
                    /* close box */
                  '<div class="p-st-comment-close-section" id="'+ close_box_id +'">' +
                  '</div>' +

                  /*'<div class="p-awp-close-section" id="'+ close_box_id +'">' +
                      '<div class="p-awp-close js_stream_delete_btn">' +
                      '</div>' +
                   '</div>'+
                  */
                  '<div class="author">'+
                    '<div class="p-st-comment-actor-desc">'+
                        '<div class="p-st-comment-submitdate">'+
                        //'<center>' +  comment.time + '</center>'+
                            '<center>' +  '<abbr class="timeago" title="' + comment.time + '"></abbr>' + '</center>'+
                        '</div>'+
                        '<div class="p-st-comment-actor">'+
                            '<center><a href="/home/show?id=' +  comment.user.id + '">' +
                              comment.user.full_name +
                            '</a></center>'+
                        '</div>'+
                    '</div>'+
                    '<div class="p-st-comment-actor-image">'+
                      //'<a href="/home/show?id=' +  comment.user.id + '">' +
                        '<img class="avatar" src="' + comment.user.photo + '" alt="" />' +
                      //'</a>' +
                    '</div>'+
                  '</div>'+
                  '<div class="p-st-comment-content">'+
                      '<p>' + comment.text +'</p>'+
                  '</div>'+
                  '<div class="clearing"></div>'+
                '</div>';
                
      div.append(html);
      handle_comment_close_box(close_box_id, 
                               comment, 
                               comment_post_id, 
                               current_user_id, 
                               comment_id, 
                               show_all_id);
      /* convert time stamp to time ago */
      $("abbr.timeago").timeago();

}

/*
 * Render stream comments
 */
function setup_comment_handling(all_box_id, box_id, postid, comment_count){
  var comment_show_all_id = box_id + '_show_all';
  var html = '<span class="view-comments js_show_all_comment_btn" id=' + comment_show_all_id + '>' +
                get_comment_head_label(comment_count) +
             '</span>';
  $("#" + all_box_id).html(html);  

  var show_all_json = {post_id:postid,
                      div_id:box_id,
                      all_id:comment_show_all_id,
                      count:comment_count};


  the_big_comment_show_all_json[comment_show_all_id] = show_all_json;
}

function show_all_stream_comments(comments, post_id, current_user_id, comment_show_all_id){
 
  //alert("show_all_stream_comments");
  var comments_count=0;
  var comments_div_id = the_big_comment_show_all_json[comment_show_all_id].div_id;
  var div = $("#" + comments_div_id);
  div.html("");
  var add_new_btn_id = 'COMMENT_ADD_NEW_BTN_' + post_id;
  var add_new_textarea_id = 'COMMENT_ADD_NEW_TEXT_' + post_id;
  var count_display_span_id = 'COUNT_DISPLAY_SPAN_' + post_id;


  var add_new_comment_json = {
                                post_id:post_id,
                                text_id:add_new_textarea_id,
                                div_id:comments_div_id,
                                all_id:comment_show_all_id
                             };
  the_big_comment_add_json[add_new_btn_id] = add_new_comment_json;


  if( comments && comments.length){
    comments_count = comments.length;
  }


  
    var html = '<div class="post-comment">'+
                  '<input type="text" name="comment" class="add-comment" placeholder="Add Comment...">'+
                    '<div class="submit-comment" >'+
                      '<input type="text" name="comment" class="add-comment-text p-st-comment-text-box" id="' + add_new_textarea_id + '" >'+
                      '<input type="submit" value="Post Comment" class="js_add_new_comment post-comment-btn btn-comments" id="' + add_new_btn_id + '"/>' +
                      '<input type="submit" value="Cancel" class="cancel-comment-btn btn-comments">'+
                      '<span class="comment-limit">12</span>'+
                    '</div>'+
                '</div> ';

   /* add new comments */
    var html2 = 
               '<div class="p-st-comment-new">' +
                  '<div class="stream_comment_text_area_box">' +
                    '<textarea class="p-st-comment-text-box" rows="2" cols="20" maxlength="200" placeholder="New Comment" id="' + add_new_textarea_id + '" >' +
                    '</textarea>' +
                  '</div>' +
                  '<div class="stream_comment_text_area_box_btn_box">' +
                    '<input type="button"  value="Post" class="js_add_new_comment p-st-comment-add-btn" id="' + add_new_btn_id + '"/>' +
                  '</div>' +
               '</div>'; 
    //div.append(html);
    div.html(html);


  /* context is set, go ahead */
  
  $.each(comments, function(i,data){
    if( data && data.comment ){
      handle_stream_single_comment(data.comment, comments_div_id, post_id, current_user_id, comment_show_all_id); 
    }

  });

    //div.show();
    div.slideToggle();
}


function get_comment_head_label(count){
  if (count > 1){
    return '' + count + ' Comments >';
  }else{
    return '' + count + ' Comment >';
  }
}


/************************************/
/*
 * Handling enrich updates through polling
 */
/************************************/
function setup_polling_for_enrich(){
  var check_data=0;
  for(var i in the_big_stream_enriched_state) { 
    check_data++;
    break;
  }
  if (check_data == 1) {
    setTimeout(update_enriched_streams, 60000);
  }
}

/************************************/

function get_enriched_streams(post_ids_arr){
   $.ajax({

            url: '/home/get_enriched_activities.json',
            type: 'GET',
            data: {
                    "post_ids" : post_ids_arr
                  },
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
              // if rails demands a redirect because of log in missing 
            $.each(data, function(i,stream){
              var box_id = the_big_stream_enriched_state[stream.post.id].text_box;
              if( stream.post.enriched == true ){
                handle_stream_text(box_id, 
                                stream.post.text);
                the_big_stream_post_text[stream.post.id] = {
                                                              text_box : box_id,
                                                              user : stream.post.user.id,
                                                              mentions_state:false
                                                           };
                append_entity_delete(stream.post.id);
                // remove the element from the list of un enriched streams 
                delete the_big_stream_enriched_state[stream.post.id];
              }
            });

           setup_polling_for_enrich();

        },
        error:function(XMLHttpRequest,textStatus, errorThrown){ 
            aw_lib_alert('There has been a problem getting summaries. \n ActWitty is trying to solve.');
        }
    });
   
}



/************************************/
function update_enriched_streams () {

  var post_ids_arr = [];
  var i=0;
  for(var key in the_big_stream_enriched_state) {
    post_ids_arr[i] = key;
    i++;
  }
  get_enriched_streams(post_ids_arr);
}
/*********************************************/






/*********************************************/

function get_stream_ele_id(post_id, prefix){
  if( prefix == undefined){
    prefix="aw";
  }
  return prefix + 'stream_render_id_' + post_id;
}

/*
 * Create div
 *
 * Post Status : 1 -> 
 *
 */
function create_and_add_stream(streams_box, stream, current_user_id, prepend){
  var post = stream.post;
  var comments = stream.comment;
  if(prepend===undefined){
    prepend=false;
  }
  
  
  var stream_render_id= get_stream_ele_id(post.id);

  /* Fail safe, due to any reason this happens, reject the stream from being displayed again*/
  if ($("#" + stream_render_id ).length > 0){
   return;
  }

  var doc_box_id      =  stream_render_id + '_docs';
  var video_doc_box_id = stream_render_id + '_videos';
  var campaign_box_id =  stream_render_id + '_campaigns';
  var text_box_id     =  stream_render_id + '_text';
  var location_box_id =  stream_render_id + '_location';
  var action_box_id   = stream_render_id + '_action';
  var view_all_image_id = doc_box_id + '_all';
  var post_operations_id = stream_render_id + '_operations';


  var comment_box_id  = stream_render_id + '_comments';
  var comment_box_show_all_div_id  = stream_render_id + '_show_all';
  var comment_show_all_id = comment_box_id + '_show_all';
 
  var like_text_id = campaign_box_id + "_span";

  var date_js = Date.parse('t');
  var time_js = new Date().toString('HH:mm tt');
  var external_shares="";
  var external_icon_shares="";
  var subtitle = "";
  var location_id = "";
  var location_name = " ";

  if ( post.status == 2){
    var external_shares = get_socialize_html(stream); 
    var external_icon_shares = get_socialize_icon_html(stream); 
  }
  if(post.sub_title)
  {
    subtitle=post.sub_title;
  }
  if( stream.location && stream.location.id )
  {
    location_id = stream.location.id;
  }
  if( stream.location && stream.location.name )
  {
    location_name = "@" + stream.location.name;
  }


  /* Main stream div definition 
   * */
  var stream_ele_id = get_stream_ele_id(post.id);
  aw_lib_console_log("debug", "rendering the stream");
  var html = '<div id="' + stream_ele_id + '" class="p-aw-post" value="' + post.id + '">' +
                   '<div class="p-awp-close-section">'+
                      '<div class="p-awp-close js_stream_delete_btn">' +
                      '</div>' +
                   '</div>'+
                   '<div class="p-awp-stream-post-info">' +
                      '<div class="p-awp-channel">'+
                        '<div class="p-awp-channel-desc">'+
                          '<label class="p-awp-channel-label">CHANNEL : </label>'+
                          '<a href="/channel_page?channel_id=' +  post.word.id + '">' +
                          '<span class="p-awp-channel-name">' + post.word.name + '</span>'+
                          '</a>' +
                        '</div>'+
                        '<div id="'+ location_box_id +'">' +
                        '</div>'+
                      '</div>'+
                      '<div class="p-awp-stream-post-author-section">'+
                        '<a href="/home/show?id=' +  post.user.id + '" >' +
                        '<div class="p-awp-post-author">'+
                          '<div class="p-awp-post-author-img">'+
                            '<img src="' + post.user.photo + '" alt="" />' +
                          '</div>'+
                          '<div class="p-awp-post-author-name">'+
                            '<span>' + post.user.full_name + '</span>'+
                          '</div>'+
                        '</div>'+
                        '</a>'+
                      '</div>'+
                   '</div>'+
                    
                   '<div class="p-awp-post-info">' +
                      '<div class="p-awp-post-contents">'+
                      '<div class="p-awp-subtitle">'+
                        /*
                        '<a href="/location_page?location_id=' + stream.location.id + '">' +
                          '<span class="p-awp-location-name" >' + 
                            '@' + stream.location.name +
                          '</span>' +
                        '</a>' +
                        */
                        '<a href="/view?id=' + post.id + '">' +
                          '<span class="p-awp-subtitle-name">' + subtitle +'</span>' +
                        '</a>' +
                      '</div>'+
                      '<div class="p-awp-date">'+
                        '<span class="p-awp-date-content">' + time_js + ' '+date_js.toString("dddd, dd MMMM yyyy") + '</span>' +
                      '</div>'+
                      '<div class="p-awp-content">'+
                        '<div class="quote">'+
                          '<span>&#8220;</span>'+
                        '</div>'+
                        '<div class="p-awp-text" id="' + text_box_id + '" >' +
                          '<p align="justify">' + +
                          '</p>' +
                        '</div>'+
                      '</div>'+
                      '</div>'+
                      '<div class="p-awp-post-like-info js_campaign_show_all" id="'+ like_text_id + '">'+
                      '</div>'+
                   '</div>'+
 
                   
                   
                    
                    /* Post attachment */
                    '<div style="z-index:1;" class="p-awp-view-attachment" id="' + doc_box_id + '" >' +
                      '<div class="p-awp-view-all-images-div">' +
                        '<span id="'+ view_all_image_id +'">View All Images</span>'+
                      '</div>' +
                    '</div>' +

                    /* Post video attachment */
                    '<div style="z-index:1;" class="p-awp-view-video-attachment" id="' + video_doc_box_id + '" >' +
                    '</div>' +
                    
                    external_shares +
                    
                    /* general operation on a post - mention/likes/comments */
                    '<div class="p-awp-post-opt" >' +
                     '<input id="'+post_operations_id+'" type="hidden" value="'+ action_box_id + '">'+
                     '<div class="p-awp-post-const-opt">' +
                        '<div class="js_stream_enrich_btn p-awp-post-mentions hover_point"> Mentions </div> '+
                        '<div class="js_stream_edit_btn p-awp-post-edit hover_point"> Edit </div> '+
                        '<div class="js_stream_publish_btn p-awp-post-publish hover_point"> Publish </div> '+
                        '<div class="p-awp-post-like hover_point" id="' + campaign_box_id + '">'+'</div>' +
                        //'<div class="js_socialize_minimize p-awp-post-mentions hover_point"> Share </div> '+ 

                        '<div class="p-awp-post-comments hover_point js_show_all_comment_btn" id="' + comment_show_all_id + '">' 
                        + get_comment_head_label(stream.comments.count)+ '</div> ' +
                     '</div>'+
                     /*
                     '<div class="p-awp-post-vol-opt">' +
                        '<input type="button" value="Edit" class="js_stream_edit_btn p-awp-edit"/>' +
                        '<input type="button" value="Publish" class="js_stream_publish_btn p-awp-publish"/>' +
                     '</div>' +
                     */
                    '</div>' +
                   
                    

                    //external_icon_shares +

                    /* Post campaigns */
                    '<div class="p-awp-view-campaign" id="' + campaign_box_id + '" >' +
                    '</div>' +
                    '<div class="p-awp-view-campaign-comments" id="' + campaign_box_id + '_comment" >' +
                    '</div>' +
                    
                    /* Post comments */
                    '<div class="p-awp-comments-section" id="' + comment_box_id + '" >' +
                    '</div>' +

              '</div>'; /* div class: p-aw-post*/
  if(prepend == true){
    streams_box.prepend(html);
  }else{
    streams_box.append(html);
  }
  aw_lib_console_log("debug", "stream html added");
  handle_stream_actions(action_box_id, stream, current_user_id,post_operations_id,like_text_id);
  handle_stream_text(text_box_id, stream.post.text);

  handle_stream_location(location_box_id, stream.location);
  handle_stream_docs("image", doc_box_id, stream,view_all_image_id);
  handle_stream_docs("video", video_doc_box_id, stream,"");
  
  if( post.status == 2){
    setup_comment_handling(comment_box_show_all_div_id,
                           comment_box_id,  
                           post.id,
                           stream.comments.count);
    handle_stream_campaign(campaign_box_id, like_text_id,stream);
  }
  setup_readmore("div#"+ text_box_id + " p",250); /* read more for content with character slice at 100 */

  


  if( stream.post.enriched == false ){
    the_big_stream_enriched_state[stream.post.id] = {text_box : text_box_id};
  }

  the_big_stream_post_text[post.id] = {
                                          text_box : text_box_id,
                                          user : post.user.id,
                                          mentions_state:false
                                        };
  append_entity_delete(post.id);

}





/*
 * Re Render the attachment box after some attachment is deleted.
 */


function rerender_attachements_after_delete(view_attach_box) {
  var count = view_attach_box.children().size() - 1;
  var image_count_div = view_attach_box.find(".p-awp-view-all-images-div span");
  if(count > 7 ){
    image_count_div.text("View all " + count + " images");
  } else {
    image_count_div.hide();
  }
}





/*
 * Add streams to the page
 */
function append_stream(owner_id, current_user_id){
  var scroll = $(window).scrollTop();
  var more_cookie = $("#more_streams_cookie").val();

  $.ajax({
        url: '/home/get_streams.json',
        type: 'GET',
        data: {
                user_id : owner_id,
                updated_at : more_cookie,
                filter : get_filter(),
                page_type:aw_get_stream_scope(),
                cache_cookie:aw_lib_get_cache_cookie_id()
              },
        dataType: 'json',
        contentType: 'application/json',
       success: function (data) {
          // if rails demands a redirect because of log in missing
          if(data.length){
            $.each(data, function(i,stream){
              if( stream ){
                create_and_add_stream($("#streams_list"),stream , current_user_id);
                $("#more_streams_cookie").val(stream.post.time);
              } 

           
            });
            /* set up polling for checking enriching */
            setup_polling_for_enrich();
          }else{
            if( more_cookie.length == 0){
              $("#streams_list").html("<br/> <br/> No streams to show");
            }
            aw_lib_alert('No streams to show');
          }

        },
        error:function(XMLHttpRequest,textStatus, errorThrown) {
            aw_lib_alert('There has been a problem getting streams. \n ActWitty is trying to solve.');
        }
    });
    $(window).scrollTop(scroll);

  
}

/*comment related apis*/
//INPUT => activity_id = 123, :author_id => 234, :text => "helllo"
function add_comment(add_json){
    var comment_data={
                        activity_id:add_json.post_id,
                        text:$("#" + add_json.text_id).val()
                      };
    var current_user_id=$('#session_owner_id').attr("value");
    $.ajax({
        url: '/home/create_comment.json',
        type: 'POST',
        data: comment_data,
        dataType: 'json',
        success: function (data) {
          handle_stream_single_comment( data.comment, 
                                        add_json.div_id, 
                                        add_json.post_id, 
                                        current_user_id,
                                        add_json.all_id);
          $("#" + add_json.text_id).val("");
          var comment_count = the_big_comment_show_all_json[add_json.all_id].count + 1;
          the_big_comment_show_all_json[add_json.all_id].count = comment_count;
          var all_id = add_json.all_id;
          //alert(all_id);
          //alert(get_comment_head_label(comment_count));
          $("#" + all_id).html(get_comment_head_label(comment_count));
         
         
        },
        error:function(XMLHttpRequest,textStatus, errorThrown) {
            aw_lib_alert('There has been a problem in adding new comment. \n ActWitty is trying to solve.');
        }
    });
}

//#INPUT => comment_id = 1234
function delete_comment(post_id, comment_id, del_id, all_id){
    $.ajax({
        url: '/home/delete_comment.json',
        type: 'POST',
        data: {"comment_id":comment_id},
        dataType: 'json',
        success: function (data) {
          $("#" + del_id).html('');
          $("#" + del_id).remove();
          var comment_count = the_big_comment_show_all_json[all_id].count - 1;
          the_big_comment_show_all_json[all_id].count = comment_count;
          $("#" + all_id).html(get_comment_head_label(comment_count));

        },
        error:function(XMLHttpRequest,textStatus, errorThrown) {
            aw_lib_alert('There has been a problem in deleting comment. \n ActWitty is trying to solve.');
        }
    });
}


function delete_entity_from_post(post_id, entity_id){
    $.ajax({
        url: '/home/delete_entities_from_post.json',
        type: 'POST',
        data: {post_id:post_id, entity_id:entity_id},
        dataType: 'json',
        success: function (data) {
           var box_id = the_big_stream_post_text[data.post.id].text_box;
           handle_stream_text( box_id, data.post.text);
           append_entity_delete(data.post.id); 
        },
        error:function(XMLHttpRequest,textStatus, errorThrown) {
            aw_lib_alert('There has been a problem in deleting entity from post. \n ActWitty is trying to solve.');
        }
    });
}

//#INPUT => activity_id => 123
function show_all_comments(post_id, all_id){
    var current_user_id=$('#session_owner_id').attr("value");
    $.ajax({
        url: '/home/get_all_comments.json',
        type: 'POST',
        data: {activity_id:post_id},
        dataType: 'json',
        success: function (data) {
          show_all_stream_comments(data, post_id, current_user_id, all_id);
          /*****************************************Error On Slidetoggle****************************/
          $(this).parent().next().slideToggle();
        },
        error:function(XMLHttpRequest,textStatus, errorThrown) {
            aw_lib_alert('There has been a problem in adding new comment. \n ActWitty is trying to solve.');
        }
    });
}

/*
* Delete stream
*/
function delete_stream(post_id){
 
  var stream_render_id = get_stream_ele_id(post_id);
  //alert("in delete... post_id  " +post_id);
  //alert("after success we will close " + stream_render_id);
  $.ajax({
    url: '/home/delete_stream.json',
    type: 'POST',
    data: "post_id=" + post_id,
    dataType: 'json',
    success: function (data) {
      $("#" + stream_render_id).html('');
      $("#" + stream_render_id).remove();
    },
    error:function(XMLHttpRequest,textStatus, errorThrown) {
      aw_lib_alert('There has been a problem in deleting the stream. \n ActWitty is trying to solve.');
    }
  });
}


/*
 * process user campaign action
 */
function process_user_campaign_action(campaign_manager_json){
    if( campaign_manager_json.user == false){
      $.ajax({
          url: '/home/create_campaign.json',
          type: 'POST',
          data: { 
                  name:campaign_manager_json.name, 
                  value:1, 
                  activity_id:campaign_manager_json.post_id
                },
          dataType: 'json',
          success: function (data) {
            if( data.name == "like" && data.user==true ){
              //alert("i have already liked it");
              //alert(data.count);
              campaign_manager_json.user= true;
              var link_id = campaign_manager_json.campaign_div_id + '_link'; 
              var span_id = campaign_manager_json.campaign_div_id + '_span';
              campaign_manager_json.count = data.count;
              $("#" + span_id).html(get_campaign_likes_label(campaign_manager_json.count));
              /*$("#" + link_id).html('<img src="/images/alpha/unlike.png" />');*/
              $("#" + link_id).html('Unlike');
            }
          },
          error:function(XMLHttpRequest,textStatus, errorThrown) {
            alert("like error");
            aw_lib_alert('There has been a problem in deleting comment. \n ActWitty is trying to solve.');
          }
      });
    }else{
       $.ajax({
          url: '/home/delete_campaign.json',
          type: 'POST',
          data: { 
                  name:campaign_manager_json.name, 
                  activity_id:campaign_manager_json.post_id
                },
          dataType: 'json',
          success: function (data) {
            if( data.name == "like" && data.user==false ){
              campaign_manager_json.user= false;
              var link_id = campaign_manager_json.campaign_div_id + '_link'; 
              var span_id = campaign_manager_json.campaign_div_id + '_span';
              campaign_manager_json.count = data.count;
              $("#" + span_id).html(get_campaign_likes_label(campaign_manager_json.count));
              /*$("#" + link_id).html('<img src="/images/alpha/like.png" />');*/
              $("#" + link_id).html('Like');
            } 
          },
          error:function(XMLHttpRequest,textStatus, errorThrown) {
            aw_lib_alert('There has been a problem in deleting comment. \n ActWitty is trying to solve.');
          }
      });
    }
}
  /**********Like*********Pramod***/
  
function aw_channels_render_like(win_id, trigger_id){
  //alert("aw_channels_render_like");
  var id = win_id + '_modal_div';
  var div = $("#" + win_id);
  //var div_id = $("#" + trigger_id).attr("id");
  var div_id = $("#" + trigger_id).parent().next().next().next().next().children("div.p-awp-post-const-opt").children("div.p-awp-post-like").attr("id");
  //alert(div_id);
  campaign_manager = the_big_stream_campaign_manager_json[div_id];
  alert(JSON.stringify(campaign_manager));
  $.ajax({
          url: '/home/get_users_of_campaign.json',
          type: 'GET',
         data: { 
                  name:campaign_manager.name, 
                  activity_id:campaign_manager.post_id
                },
          dataType: 'json',
          success: function (data) {
            show_all_stream_campaigns(data, div);
          },
          error:function(XMLHttpRequest,textStatus, errorThrown) {
            alert('There has been a problem in deleting comment. \n ActWitty is trying to solve.');
          }
      });
  return true;
}
/**************************/
/*
 *  Show all campaigns Like
 */
function show_all_campaigns(campaign_manager_json){
  //alert(JSON.stringify(campaign_manager_json));
  $.ajax({
          url: '/home/get_users_of_campaign.json',
          type: 'GET',
         data: { 
                  name:campaign_manager_json.name, 
                  activity_id:campaign_manager_json.post_id
                },
          dataType: 'json',
          success: function (data) {
            show_all_stream_campaigns(data, $("#" + campaign_manager_json.campaign_div_id).next());
            /*****************************************Error On Slidetoggle****************************/
            $("#" + campaign_manager_json.campaign_div_id).next().slideToggle();
            //alert("show_all_campaigns");
          },
          error:function(XMLHttpRequest,textStatus, errorThrown) {
            aw_lib_alert('There has been a problem in deleting comment. \n ActWitty is trying to solve.');
          }
      });
}
/**************************/
/*
 *  Remove document from post
 */
function remove_document_from_post(document_id, close_box){
   $.ajax({
          url: '/home/remove_document.json',
          type: 'POST',
          data: { 
                  doc_id:document_id, 
                },
          dataType: 'json',
          success: function (data) {
            /*remove that document*/
           var main_parent = close_box.closest(".p-awp-view-attachment");
           var parent_box = close_box.closest(".p-awp-view-attachment-inner-box");
           parent_box.html('');
           parent_box.remove();
           rerender_attachements_after_delete(main_parent);

          },
          error:function(XMLHttpRequest,textStatus, errorThrown) {
            aw_lib_alert('There has been a problem in deleting comment. \n ActWitty is trying to solve.');
          }
      });
}
/**************************/


/*
 * Bring stream on focus whenever there is a change in filter
 */
function set_stream_to_focus_on_filter_change(){
    $("ul.p-cstab li").removeClass("active");
    $("ul.p-cstab li:last").addClass("active").show();

    //$("#channels_left_side_bar").hide();
    //$("#channels_main_bar").hide();
    //$("#channels_right_side_bar").hide();
    $("#p-channelp-sect").hide();

    $("#streams_left_side_bar").fadeIn();
    $("#streams_main_bar").fadeIn();
    $("#streams_right_side_bar").fadeIn();


}


/*
 * Clear stream div completely
 */
function aw_stream_clear_stream_jsons(){
  
  /* reset all big jsons */
  the_big_comment_add_json={ };
  the_big_comment_show_all_json={ };
  the_big_comment_delete_json={ };
  the_big_stream_actions_json={ };
  the_big_stream_campaign_manager_json={};
  the_big_stream_campaign_show_all={};
  the_big_stream_enriched_state={};
  the_big_stream_post_text={};
  the_big_stream_entity_deletes={};
  /***********************/
}





/*
 * Add the live bindings
 */
$(document).ready(function(){

  /*
   * Comment add button clicked
   */
  $('.js_add_new_comment').live('click', function(){
    //the_big_comment_count_json
    var add_json = the_big_comment_add_json[$(this).attr("id")];
    if(add_json){
      if( !$("#" + add_json.text_id).val() || jQuery.trim($("#" + add_json.text_id).val()) == "" ){
        aw_lib_alert("Nothing written on comment");
        return;
      }
      add_comment( add_json);
    }
    return false;
  });

  /*
   * Comment delete button clicked
   */
  $('.js_comment_delete_btn').live('click', function(){
    //the_big_comment_count_json
    var del_json = the_big_comment_delete_json[$(this).attr("id")];
    if(del_json){
      delete_comment(del_json.post_id, 
                    del_json.comment_id, 
                    del_json.comment_del_id,
                    del_json.all_id);

    }
    return false;
  });
  /********************************/

  /*
   * Stream delete button clicked
   */
  $('.js_stream_delete_btn').live('click', function(){
    alert("closing " + $(this).parent().parent().attr("value"));
    var del_json = the_big_stream_actions_json[$(this).parent().parent().attr("value")];
    //if(del_json){
      //delete_stream(del_json.stream_id);
      delete_stream($(this).parent().parent().attr("value"));
    //}
    return false;
  });
  /********************************/
  /*
   * Stream edit button clicked
   */
  $('.js_stream_edit_btn').live('click', function(){
    //var edit_json = the_big_stream_actions_json[$(this).parent().attr("id")];
    var edit_json = the_big_stream_actions_json[$(this).parent().prev().val()];
    if(edit_json){
      //aw_lib_alert("edit:" + edit_json.stream_id);
      var stream_render_id = get_stream_ele_id(edit_json.stream_id);
      $("#" + stream_render_id).html('');
      $("#" + stream_render_id).remove();
      aw_edit_drafted_stream(edit_json.stream_id);
    }
    return false;
  });
  /********************************/
  /*
   * Stream publish button clicked
   */
  $('.js_stream_publish_btn').live('click', function(){
    //var publish_json = the_big_stream_actions_json[$(this).parent().attr("id")];
    var publish_json = the_big_stream_actions_json[$(this).parent().prev().val()];
    if(publish_json){
      var stream_render_id = get_stream_ele_id(publish_json.stream_id);
      $("#" + stream_render_id).html('');
      $("#" + stream_render_id).remove();
      aw_publish_drafted_stream( publish_json.stream_id);
    }
    return false;
  });
 /********************************/
  /*
   * Stream enrich button clicked
   */
  $('.js_stream_enrich_btn').live('click', function(){
    var enrich_json = the_big_stream_actions_json[$(this).parent().prev().val()];
    var post_id = enrich_json.stream_id;

     
    var text_box_id = the_big_stream_post_text[post_id].text_box;
    var text_box = $("#" + text_box_id);
    var mentions_state = the_big_stream_post_text[post_id].mentions_state;
    if(!mentions_state){
      text_box.find(".js_activity_entity").addClass("js_mention_highlight");
      the_big_stream_post_text[post_id].mentions_state=true;
    }else{
      text_box.find(".js_activity_entity").removeClass("js_mention_highlight");
      the_big_stream_post_text[post_id].mentions_state=false;
    }

  });
  /********************************/

  /*
   * Stream show all button clicked
   */
  $('.js_show_all_comment_btn').live('click', function(){
    var all_json = the_big_comment_show_all_json[$(this).attr("id")];
    if(all_json){
       show_all_comments(all_json.post_id, $(this).attr("id"));
    }
    return false;
  });

  /*
   * User action on campaign
   */
  $('.js_like_user_action').live('click', function(){
    //alert("js_like_user_action");
    var div_id = $(this).attr("value");
    campaign_manager = the_big_stream_campaign_manager_json[div_id];
    process_user_campaign_action(campaign_manager);
    return false;
  });
  /********************************/

  /*
   * User action show all  Pramod
   */
  $('.js_campaign_show_all').live('click', function(){
    //var cls = $(this).attr("class");
    //alert("on click like");
    //var div_id = $(this).attr("id");
    //alert(div_id);
    //campaign_manager = the_big_stream_campaign_manager_json[div_id];
    $(this).addClass("js_modal_dialog_link");  
    $(this).addClass("JS_AW_MODAL_like"); 
    return false;
  });
  /********************************/
  /*
    //alert("likes");
    //var cls = $(this).attr("class");
    //var nxt = $(this).next().children().attr("src");
    //alert(nxt);
    /****************************Changed For the Like SlideToggle***div_id*********************************/
    //var div_id = $(this).parent().parent().attr("id");
    //if(nxt == "/images/alpha/unlike.png")
    //{
    //alert("1"); 
    //}
    //campaign_manager = the_big_stream_campaign_manager_json[div_id];
    //show_all_campaigns(campaign_manager); 

  /*
   * Delete entity mentioned in text
   */
  $('.js_entity_delete').live('click' , function(){

    delete_entity_from_post(the_big_stream_entity_deletes[$(this).attr("id")]["post_id"], 
                            the_big_stream_entity_deletes[$(this).attr("id")]["entity"]);
  });

  /*
   * Remove an attached document
   */
  $('.js_remove_attached_doc').live('click', function(){
    alert($(this).attr("id"));
    remove_document_from_post($(this).attr("id"), $(this));
  });

  /*
   * Bind click to more on streams tab
   */
  $('#more_streams').click(function() {
     aw_lib_console_log("debug", "profile.js:more personal streams clicked");
     append_stream(aw_lib_get_page_owner_id(), 
               aw_lib_get_session_owner_id());
     return false;
  });
    
  /*
   *
   */
  $(".p-awp-view-all-images-div span").live('click',function() {
    $(this).parent().next().children("a").trigger("click");
  });
  
  /*
   *
   */

  $("div.p-awp-content p").expander({
      slicePoint:       300,  // default is 100
      expandText:         'read more', // default is 'read more...'
      userCollapseText: '...less'  // default is '[collapse expanded text]'
    });


});
/************************************/

/*
 * home/show or profile page activities related jqueries
 *
 */


/*
 * Globals
 *
 */


function main_profile_initializer(){
    var page_owner_id=aw_lib_get_page_owner_id();
    var session_owner_id=aw_lib_get_session_owner_id();
    
    var default_tab = $('#default_page_mode').attr("value");
    /* initialize filters for carry forward to another page*/
    profile_filter_init();

    /* initialize stream page mode for carry forward to another page*/
    aw_stream_select_mode_on_load();
    aw_toggle_scope_on_stream_page(aw_get_current_stream_mode());

    /* At very start Hide all contents on page load */
    //Decide to bring one tab on focus
    if(default_tab =='filtered'){
  	  $("ul.p-cstab li:last").addClass("active").show();
      $("#streams_left_side_bar").show();
      $("#streams_main_bar").show();
      $("#streams_right_side_bar").show();
      /* Bring in stream filtered view on focus*/
      aw_reload_streams_on_viewed_user();
    }else{
      /* Bring in personal summary on focus*/
      //$("#channels_main_bar").show();
      $("#p-channelp-sect").show();
  	  $("ul.p-cstab li:first").addClass("active").show(); 
      //$('#channels_display_list').html("");
      $('#p-channelp-posts').html("");
      $("#more_channels_cookie").val("");
      append_personal_summary(page_owner_id);
      attach_channel_author_section(page_owner_id);
    }
}

/*
 * Execute on load
 */
$(document).ready(function(){

     aw_lib_console_log("debug", "profile.js:ready called"); 
     var page_owner_id=aw_lib_get_page_owner_id();
     var session_owner_id=aw_lib_get_session_owner_id();  
	 
    
    /*
     * Bind Click on the tab
     */
	  $("ul.p-cstab li").click(function() {
     
      aw_lib_console_log("debug", "profile.js: tab clicked"); 
      /* Remove active from all tabs */
		  $("ul.p-cstab li").removeClass("active");


		  $(this).addClass("active"); //Add "active" class to selected tab
      
      var tab_id = $(this).attr("id");
      
      if(tab_id == "channels_tab_head"){
        aw_lib_console_log("debug", "profile.js: channels tab selected"); 
        $("#streams_left_side_bar").hide();
        $("#streams_main_bar").hide();
        $("#streams_right_side_bar").hide();
        //$("#channels_main_bar").fadeIn();
        //$('#channels_display_list').html("");
        $("#p-channelp-sect").fadeIn();
        $('#p-channelp-posts').html("");
        $("#more_channels_cookie").val("");
        append_personal_summary(page_owner_id);
        attach_channel_author_section(page_owner_id);

      }else if(tab_id == "streams_tab_head"){
        aw_lib_console_log("debug", "profile.js: streams tab selected"); 
        /*$("#channels_main_bar").hide();*/
        $("#p-channelp-sect").hide(); 
        $("#streams_left_side_bar").fadeIn();
        $("#streams_main_bar").fadeIn();
        $("#streams_right_side_bar").fadeIn();
        aw_lib_console_log("debug", "profile.js: reload streams"); 
        aw_reload_streams_on_viewed_user();
          
      }


		  var activeTab = $(this).find("a").attr("href"); //Find the href attribute value to identify the active tab + content
		  $(activeTab).fadeIn(); //Fade in the active ID content
		  return false;
	  });
    /********************** click on tab ends here ****************************/
   
   


    
    

  }); /* ready ends here */


  



function single_post_initializer(){
  var post_id=$('#post_id').attr("value");
  var current_user_id=$('#session_owner_id').attr("value");
  
  $.ajax({
        url: '/home/get_single_activity.json',
        type: 'GET',
        dataType:"json",
        cache: true,
        data: {
                activity_id:post_id
              },
        success: function (data) {
          // if rails demands a redirect because of log in missing 
           $.each(data, function(i,stream){
            if( stream ){
                create_and_add_stream($("#streams_list"),stream , current_user_id);
            } 
          });

            /* set up polling for checking enriching */
            setup_polling_for_enrich();

        },
        error:function(XMLHttpRequest,textStatus, errorThrown) {
            alert('There has been a problem getting post. \n ActWitty is trying to solve.');
        }
    });
}


/**************************/
var document_pre_uploaded_handling_json={};
function add_preuploaded_doc(id, url_val, thumb_url_val, caption_val){

  document_pre_uploaded_handling_json[id] = {
                                              url:url_val,
                                              thumb_url:thumb_url_val,
                                              caption:caption_val
                                            };

                                                
}


function remove_preuploaded_doc(id){ 
  delete document_pre_uploaded_handling_json[id];
                                                
}

function get_preuploaded_doc(){
  return document_pre_uploaded_handling_json;
}
/***************************/
function append_pre_uploaded_docs(docs){
  $.each(docs.array, function(i, attachment){
    var caption="";

    if(attachment.uploaded == false){
      return;
    }
    if(attachment.caption){
      caption = attachment.caption;
    }
    add_preuploaded_doc(attachment.id, attachment.url, attachment.thumb_url, caption);
    var id = 'preuploaded_' + attachment.id;
    var caption_id = id + '_caption';
    var remove_id = id + '_remove';
    var html = '<div class="p-preuploaded-images-on-input" >' +
                  '<div class="p-preuploaded-delete-cntrl js_preupload_remove" id="' + attachment.id + '" >' +
                  '</div>' +
                  '<div class="p-preload-image-data" >' + 
                    '<div class="preupload-image"> ' +
                      '<img src="' + attachment.thumb_url + '" width=60 />' +
                    '</div>' +
                  
                    '<div class="p-preupload-caption">' +
                      '<input type="text" value="' + attachment.caption + '" id="' + caption_id + '" class="js_perupload_caption " />' +
               
                    '</div>' +
                  '</div>' +
               '</div>';

    $("#pre_uploaded_docs").append(html);

  });
}

function populate_to_input(post_json){

  /* location */
  if(post_json.location){
    //$("#user_latlng").val();
    //$("#input_latlang").val();
    //
    if(post_json.location.name != undefined){
      $('#location_field').val(post_json.location.name);
      $("#geo_location").val(post_json.location.name);
    }

    if(post_json.location.type != undefined){
      $("#location_type").val(post_json.location.type);
    }
    if(post_json.location.lat != undefined){
      $("#lat_value").val(  '' + post_json.location.lat);
    }

    if(post_json.location.long != undefined){
      $("#lng_value").val( '' + post_json.location.long);
    }
  }
  
  /* text */
  if(post_json.post.text){
    $('#entity_field').val(post_json.post.text);
  }
  /* title */ 
  if(post_json.post.sub_title){
    $('#title_field').val(post_json.post.sub_title);
  }
  /* channel */
  if(post_json.post.word.name){
    $('#activity_field').val(post_json.post.word.name);
  }
  change_max_file_that_can_be_uploaded(post_json.documents.count * -1);
  append_pre_uploaded_docs(post_json.documents);

  
}

function init_edit_box(post_id){

  if ($('.home_page_inputs').is(':visible')) {
    aw_input_box_reset_to_default();
  }
  clear_all_input_jsons();
  $("#pre_uploaded_docs").empty();
  $('.add-page-input').trigger('click');


  $.ajax({
        url: '/home/get_single_activity.json',
        type: 'GET',
        dataType:"json",
        cache: true,
        data: {
                activity_id:post_id
              },
        success: function (data) {
          // if rails demands a redirect because of log in missing 
           document_pre_uploaded_handling_json={};
           //alert(JSON.stringify(data)); 
           $.each(data, function(i,post_json){
            if( post_json ){
                populate_to_input(post_json);
            } 
          });

        },
        error:function(XMLHttpRequest,textStatus, errorThrown) {
            alert('There has been a problem getting post. \n ActWitty is trying to solve.');
        }
    });

 
}

$(document).ready(function() {
 $(".js_preupload_remove").live("click",function(){
      delete document_pre_uploaded_handling_json[$(this).parent().attr("id")];
      $(this).parent().empty().remove();

  });
  
  $(".js_perupload_caption").live("change", function(){
      remove_preuploaded_doc(id);
  });
});


function append_entity_streams(){
   var current_user_id=$('#session_owner_id').attr("value");
   var entity_id=$('#entity_id').attr("value");
   var more_entity_streams_cookie = $("#more_entity_streams_cookie").val();
   $.ajax({
        url: '/home/get_entity_stream.json',
        type: 'GET',
        dataType:"json",
        cache: true,
        data: { entity_id:entity_id, updated_at:more_entity_streams_cookie},
        success: function (data) {
          // if rails demands a redirect because of log in missing
           var header_html = '<img class="locations_box_images" src="' + data.image +  '?maxwidth=150&maxheight=150" height="150" width="150" />';
           $('#entity_stream_header').html(header_html);
           $.each(data.stream, function(i,stream){
            if( stream ){
                create_and_add_stream($("#streams_list"),stream , current_user_id);
                $("#more_entity_streams_cookie").val(stream.post.time);
            } 
          });
          
          $(".js_entity_div_show").hide();

        },
        error:function(XMLHttpRequest,textStatus, errorThrown) {
            alert('There has been a problem getting post. \n ActWitty is trying to solve.');
        }
    });
}


function show_all_on_entity(){
  $("#entitys_left_side_bar").fadeIn();
  append_entity_streams();
  
}


$(document).ready(function(){

  $("#more_entity_streams").click(function(){
    append_entity_streams();
  });

});



function append_channel_streams(){
   var current_user_id=$('#session_owner_id').attr("value");
   var channel_id=$('#channel_id').attr("value");
   var more_channel_streams_cookie = $("#more_channel_streams_cookie").val();
   $.ajax({
        url: '/home/get_activity_stream.json',
        type: 'GET',
        dataType:"json",
        cache: true,
        data: { word_id:channel_id, updated_at:more_channel_streams_cookie},
        success: function (data) {
          // if rails demands a redirect because of log in missing
           var header_html = '<div class="p-awp-channel">' +
                              '<div class="p-awp-channel-desc">' +
                                /*'<label class="p-awp-channel-label">'  +
                                  'Channel:' +
                                '</label>' +
                                '<span class="p-awp-channel-name">' +
                                  data.name +
                                '</span>' +
                                */
                              '</div>' +
                            '</div>';
           $('#channel_stream_header').html(header_html);
           $.each(data.stream, function(i,stream){
            if( stream ){
                create_and_add_stream($("#streams_list"),stream , current_user_id);
                $("#more_channel_streams_cookie").val(stream.post.time);
            } 
          });
          
          $(".js_channel_div_show").hide();

        },
        error:function(XMLHttpRequest,textStatus, errorThrown) {
            alert('There has been a problem getting post. \n ActWitty is trying to solve.');
        }
    });
}


function show_all_on_channel(){
  $("#channels_left_side_bar").fadeIn();
  append_channel_streams();
  
}


$(document).ready(function(){

  $("#more_channel_streams").click(function(){
    append_channel_streams();
  });

});


function append_location_streams(){
   var current_user_id=$('#session_owner_id').attr("value");
   var location_id=$('#location_id').attr("value");
   var more_location_streams_cookie = $("#more_location_streams_cookie").val();
   $.ajax({
        url: '/home/get_location_stream.json',
        type: 'GET',
        dataType:"json",
        cache: true,
        data: { location_id:location_id, updated_at:more_location_streams_cookie},
        success: function (data) {
        //alert(JSON.stringify(data));
        // if rails demands a redirect because of log in missing
        /******************************************************/
          
        var url;
        if (data.type == 2){
            url = "http://maps.googleapis.com/maps/api/staticmap?center="+data.lat+","+data.long+"&zoom=13&size=800x400&sensor=false";
        }
        else if(data.type == 3){
            url = get_location_image_for_type(data.type);
        }
        else{
            url = "/images/rails.png";
        }
        
        /******************************************************/
          var header_html=  '<div class="locationp_map">'+
                              '<img class="locations_box_images" id="loc_page_img" src="' +url+  '" style="width:570px;height:200px;"/>' + 
                            '</div>' +
                            '<div class="locationp_name">' +
                                  '<span > ' +
                                    data.name +
                                  '</span>' +
                            '</div>' ;
                            //'<img class="locations_box_images" src="' + get_location_image_for_type(data.type) +  '" height="40" width="40" />'
                            
                            ;
           $('#location_stream_header').html(header_html);
           $.each(data.stream, function(i,stream){
            if( stream ){
                create_and_add_stream($("#streams_list"),stream , current_user_id);
                $("#more_location_streams_cookie").val(stream.post.time);
            } 
          });
          
          $(".js_location_hide").hide();

        },
        error:function(XMLHttpRequest,textStatus, errorThrown) {
            alert('There has been a problem getting post. \n ActWitty is trying to solve.');
        }
    });
}


function show_all_on_location(){
  $("#channels_left_side_bar").fadeIn();
  append_location_streams();
  
}


$(document).ready(function(){

  $("#more_location_streams").click(function(){
    append_location_streams();
  });

});


/*************************************/
var g_page_context = "profile_main";
function get_current_page_context(){
  return g_page_context;
}

function set_current_page_context(context){
  g_page_context = context;
}
/*************************************/

$(document).ready(function(){
  /* main pump to decide page flow */
  var page_context=$('#page_mode').attr("value");
  set_current_page_context(page_context);
  if( page_context == "profile_main"){
    main_profile_initializer();  /* in profile.js */
  }else if( page_context == "sign-in-page"){
    main_page_sign_in_initializer();  /* in main_page.js */
  }else if( page_context == "single_post") {
    single_post_initializer();  /* in single_post.js */
  }else if( page_context == "entity"){
    show_all_on_entity();   /* in entity_page.js */
  }else if( page_context == "location"){
    show_all_on_location(); /* in location_page.js */
  }else if( page_context == "channel"){
    show_all_on_channel(); /* in channel_page.js */
  }

  /** General functions to support auto complete based search **/
  function format(user) {
    return '<img alt="" class="p-st-fltr-search-img" src="'+ user.photo_small_url + '">   ' + user.full_name + "</img>";
  }

  function getID(user){
    return user.id;
  }

   $("#username_search").autocomplete("/home/search_people" , {
     	minChars: 3,
      delay:400,
		  width: 215,
		  matchContains: true,
		  highlightItem: false,
      parse: function(data) {
        return $.map(data, function(row) {
          return {
            data: row.user,
            value: row.user.full_name,
            result: row.user.full_name
          }
        });
      },
      formatItem: function(item) {
        return format(item);
      },

    }).result(function(e, item) {
      window.location.href = "/home/show?id=" + getID(item);
      
    });

});



$(document).ready(function(){
      //alert("Inside profile_people.js ready");
      $('#all_followers').click(function() { 
          $( "#follower-dialog-modal" ).attr("title", "Manage followers");
          $( "#follower-dialog-modal" ).empty();                                       
          $( "#follower-dialog-modal" ).dialog({
			                                  height: 500,
                                        width: 800,
			                                  modal: true
		                                  });      
          get_all_followers();
      });

         
     $('#all_followings').click(function() {
          $( "#follower-dialog-modal" ).attr("title", "Manage followings");
          $( "#following-dialog-modal" ).empty();                                       
          $( "#following-dialog-modal" ).dialog({
			                                  height: 500,
                                        width: 800,
			                                  modal: true
		                                  });  
          get_all_followings();
     });

     $('#all_facebookers').click(function() {
          $( "#facebook-dialog-modal" ).attr("title", "Manage facebook");
          $( "#facebook-dialog-modal" ).empty();                                       
          $( "#facebook-dialog-modal" ).dialog({
			                                  height: 500,
                                        width: 800,
			                                  modal: true
		                                  });              
          //get_all_facebookers();
     });


  }); /* ready ends here */


  


/* {"word":{"id":9,"name":"image"},"time":"2011-08-17T09:50:08Z","user":{"id":1,"full_name":"sudhanshu saxena","photo":"/images/profile/default.png"},"document":{"id":9,"url":"http://farm7.static.flickr.com/6137/5951657062_690a1ff8d8.jpg","thumb_url":null,"caption":null,"source_name":"actwitty","status":2,"uploaded":false,"category":"image","activity_id":13,"summary_id":4}} */

function activate_fancybox_doc_page_group(post_group,stream){
   $('a[rel=fnc_group_docs_page_'+post_group+']').fancybox({
				'transitionIn'		: 'none',
				'transitionOut'		: 'none',
				'titlePosition' 	: 'over',
				'titleFormat'		: function(title, currentArray, currentIndex, currentOpts) {
					var html = '<span id="fancybox-title-over">' +
                        'Image ' + (currentIndex + 1) + ' / ' + currentArray.length + (title.length ? ' &nbsp; ' + title : '') +
                      '</span>';

          return html;
				}
	});
}

function get_or_create_a_box(box_id, stream){
  var small_box_id = 'docs_box_' + stream.document.activity_id;
  var div =  $("#" + box_id);
  var small_div = $("#" + small_box_id);
  if( small_div.length == 0 ){

  var html = '<div class="p-st-docs-per-activity" id="' + small_box_id + '">' +
                   '<div class="p-awp-stream-post-info">' +
                      '<div class="p-awp-channel">'+
                        '<div class="p-awp-channel-desc">'+
                          '<label class="p-awp-channel-label">CHANNEL : </label>'+
                          '<a href="/channel_page?channel_id=' +  stream.word.id + '">' +
                          '<span class="p-awp-channel-name">' + stream.word.name + '</span>'+
                          '</a>' +
                        '</div>'+
                      '</div>'+
                      '<div class="p-awp-stream-post-author-section">'+
                        '<a href="/home/show?id=' +  stream.user.id + '" >' +
                        '<div class="p-awp-post-author">'+
                          '<div class="p-awp-post-author-img">'+
                            '<img src="' + stream.user.photo + '" alt="" />' +
                          '</div>'+
                          '<div class="p-awp-post-author-name">'+
                            '<span>' + stream.user.full_name + '</span>'+
                          '</div>'+
                        '</div>'+
                        '</a>'+
                      '</div>'+
                     
                   '</div>'+ 
                    '<div class="p-st-docs-list-view-post">' +
                        '<a href="/view?id=' + stream.document.activity_id + '">Goto Post</a>' +
                      '</div>' +
                   '<div style="z-index:1;" class="p-awp-view-attachment p-awp-view-images">' +
                   '</div>' +
            '</div>';
    
    
    div.append(html);
    small_div = $("#" + small_box_id);
  }

  return small_div;

}


function append_stream_docs(box_id, stream){
  var small_box_id = 'docs_box_' + stream.document.activity_id;
  var div_internal = get_or_create_a_box(box_id, stream);
 
  var img_box_div = $("#" + small_box_id + " div.p-awp-view-images");

  var caption = "";
  if(stream.document.caption && stream.document.caption.length){
    caption = stream.document.caption;
  }
  var thumb_nail = stream.document.url; 
  if (stream.document.thumb_url){
    thumb_nail = stream.document.thumb_url; 
  }
   
  aw_lib_console_log ("debug", "image stream attaching thumb url:" + thumb_nail);
  
  var html= '<div class="p-awp-view-attachment-inner-box">' +
              '<a rel="fnc_group_docs_page_'+ box_id +'" href="' + stream.document.url + '" title="' + caption  + '" class="p-st-docs-image">' + 
                '<img alt="" src="'+ thumb_nail + '"  width="60"  alt="" />' +
              '</a>' +
            '</div>';

  //div_internal.append(html);
  img_box_div.append(html);

  activate_fancybox_doc_page_group(box_id, stream);
}



function create_and_append_documents( data ){
}

function show_all_images(){
   var more_cookie = $("#more_streams_images_cookie").val();
   var scroll = $(window).scrollTop();
   $.ajax({
        url: '/home/get_document_stream.json',
        type: 'GET',
        dataType:"json",
        contentType: 'application/json',
        cache: true,
        data: {
                 user_id:aw_lib_get_page_owner_id(),
                 filter:get_filter(),
                 updated_at:more_cookie,
                 page_type:aw_get_stream_scope(),
                 cache_cookie:aw_lib_get_cache_cookie_id(),
                 category:"image"
              },
        success: function (data) {
          // if rails demands a redirect because of log in missing
          if (data.length){
             $.each(data, function(i,stream){
              if( stream ){
                  append_stream_docs("streams_images_list", stream);
                  $("#more_streams_images_cookie").val(stream.time);
              } 
            });
             $(window).scrollTop(scroll);
          }else{
            if( more_cookie.length == 0){
              $("#streams_images_list").html("<br/> <br/> No images to show for this filter");
            }
            aw_lib_alert('No images to display');
          }
            

        },
        error:function(XMLHttpRequest,textStatus, errorThrown) {
            aw_lib_alert('There has been a problem getting images. \n ActWitty is trying to solve.');
        }
    });
}

/*
 * Add the live bindings
 */
$(document).ready(function(){
    /*
     * Bind click to more on streams tab
     */
     $('#more_streams_images').click(function() {
        aw_lib_console_log("debug", "more images clicked on streams page");
        show_all_images();
        return false;
    });
});






function get_or_create_a_video_box(box_id, stream){
  var small_box_id = 'video_box_' + stream.document.activity_id;
  var div =  $("#" + box_id);
  var small_div = $("#" + small_box_id);
  if( small_div.length == 0 ){
    var html = '<div class="p-st-docs-per-activity" id="' + small_box_id + '">' +
                   '<div class="p-awp-stream-post-info">' +
                      '<div class="p-awp-channel">'+
                        '<div class="p-awp-channel-desc">'+
                          '<label class="p-awp-channel-label">CHANNEL : </label>'+
                          '<a href="/channel_page?channel_id=' +  stream.word.id + '">' +
                          '<span class="p-awp-channel-name">' + stream.word.name + '</span>'+
                          '</a>' +
                        '</div>'+
                      '</div>'+
                      '<div class="p-awp-stream-post-author-section">'+
                        '<a href="/home/show?id=' +  stream.user.id + '" >' +
                        '<div class="p-awp-post-author">'+
                          '<div class="p-awp-post-author-img">'+
                            '<img src="' + stream.user.photo + '" alt="" />' +
                          '</div>'+
                          '<div class="p-awp-post-author-name">'+
                            '<span>' + stream.user.full_name + '</span>'+
                          '</div>'+
                        '</div>'+
                        '</a>'+
                      '</div>'+
                   '</div>'+  
                   
                   '<div class="p-st-docs-list-view-post">' +
                    '<a href="/view?id=' + stream.document.activity_id + '">Goto Post</a>' +
                   '</div>' +

                   '<div style="z-index:1;" class="p-awp-view-video-attachment">' +
                   '</div>' +
            '</div>';
    
    
              
    div.append(html);
    small_div = $("#" + small_box_id);
  }

  return small_div;

}

function append_video_docs(box_id, stream){
  var div_internal = get_or_create_a_video_box(box_id, stream);
    var caption = "";
    if(stream.document.caption && stream.document.caption.length){
      caption = stream.document.caption;
    }
  
    var div_video = div_internal.find(".p-awp-view-video-attachment"); 
    var html=getEmbeddedPlayer( stream.document.url, 180, 240);
    div_video.append(html);

}

function show_all_videos(){
   var more_cookie = $("#more_streams_videos_cookie").val();
   var scroll = $(window).scrollTop();
   $.ajax({
        url: '/home/get_document_stream.json',
        type: 'GET',
        dataType:"json",
        cache: true,
        data: {
                 user_id:aw_lib_get_page_owner_id(),
                 filter : get_filter(),
                 updated_at : more_cookie,
                 page_type:aw_get_stream_scope(),
                 category : "video",
                 cache_cookie:aw_lib_get_cache_cookie_id()
              },
        success: function (data) {
          // if rails demands a redirect because of log in missing
          if (data.length){
             $.each(data, function(i,stream){
              if( stream ){
                  
                  append_video_docs("streams_videos_list", stream);
                  $("#more_streams_videos_cookie").val(stream.time);
              } 
            });
             $(window).scrollTop(scroll);
          }else{
            if( more_cookie.length == 0){
              $("#streams_videos_list").html("<br/> <br/> No videos to show");
            }
            aw_lib_alert('No videos to display');
          }
            

        },
        error:function(XMLHttpRequest,textStatus, errorThrown) {
            aw_lib_alert('There has been a problem getting videos. \n ActWitty is trying to solve.');
        }
    });
}


/*
 * Add the live bindings
 */
$(document).ready(function(){
    /*
     * Bind click to more on streams tab
     */
     $('#more_streams_videos').click(function() {
        aw_lib_console_log("debug", "more videos clicked on streams page");
        show_all_videos();
        return false;
    });
});



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




 function create_and_add_box(id){
   //alert("Entry to create_add_box");

   var html = "<h3>Into the Create And Add Box</h3>";

   id.append(html);

   //alert("Into the Create and add box");
 }


 function custom_box_effects(fb_box){
    //alert("In Custom Box Effects");
    create_and_add_box($('#fb_box')); 
 }


$(document).ready(function(){
  //$("#y").append("Hello");
  //get_all_facebookers(); 
 /* 
  $("ul.p-cstab1 li").click(function() {

  $(".tab_content").hide(); //Hide all tab content
  $("ul.p-cstab1 li").removeClass("active");
  $(this).addClass("active"); //Add "active" class to selected tab
      
  var tab_id = $(this).attr("id");
  if(tab_id == "invite_tab_head"){
       //alert("invite");
       //get_all_facebookers(); 
	append_invite_friends();
  }
  else if(tab_id == "follow_tab_head"){
	//alert("follow");
	append_follow_friends();
  }
  else{
	//alert("unfollow");
	append_unfollow_friends();
  }

 
      var activeTab = $(this).find("a").attr("href"); //Find the href attribute value to identify the active tab + content
      $(activeTab).fadeIn(); //Fade in the active ID content
      return false;
  });
  */
 
});

/*
 * Home page friends related jqueries
 *
 */

/*
 *
 * Render friends 
 */
/*
function renderFacebookers(json){
 
  var invite_html = '<div id="invite"  class="modal_fb_ul sc_menu1">' +  '</div><br/>';
  
  var follow_html = '<div id="follow" class="modal_fb_ul">' + '</div><br/>';

  var unfollow_html = '<div id="unfollow" class="modal_fb_ul">'+ '</div><br/>';

  $("#invite_friends").append(invite_html);  
  var inv_html = '<ul class="sc_menu1" id="test">' + '</ul>';
  $('#invite').append(inv_html);
  
  
  $("#follow_friends").append(follow_html);  
  $("#unfollow_friends").append(unfollow_html); 

  $.each(json, function(i,data){
      if( data ){
        var li_id = "fb_li_" + data.uid;
	      var html="";
        var str;
     
         //alert(data.name.length); 
         if( data.name.length > 12 )
         {  
           var limit = 12;                
           str = data.name;        
           var strtemp = str.substr(0,limit); 
           str = strtemp+ '..' + '<span class="hide">' + str.substr(limit,str.length) + '</span>'; 
         }
         else
         {
           str = data.name;
         }

        if (!data.user_id){
        var html= '<li class="lk"><div id="' + li_id  +  '" class="user_stamp">' +
	'<div id="ex1">' +
	'<img class="img" src="' + data.image + '" height="55" width="50" align="left">'+
       	'<div id="txt1">' +  str  + '</div>'+
	'<div id="inner">'+
		'<input type="button"  height="25" width="25" value="Invite" class="fb_invite" id="' + data.uid + '"/>' +
	'</div>'+
	'</div>'+
	'</div></li>';


        $('#test').append(html);
        }else{
         html='<div id="' + li_id  +  '" class="user_stamp">' +
		'<div id="ex1">' +
			'<a href="#" id="user_nav_' +  data.user_id + '" class="link_user_stamp user_nav">' +
			       	'<img class="img" src="' + data.image + '" height="55" width="50" align="left">'+
				'<div id="txt1">' +  str + '</div>'+
			'</a>'+ 
			'<input type="hidden" id="user_nav_' +  data.user_id + '_hidden" value="' +  data.user_id + '"/>'+
     		'</div>'+
		'</div>';


          if (data.status == "Follow"){
            $('#follow').append(html);
      	    var html = '<div id="inner">'+
		 	'<input type="button" height="25" width="25" value="Unfollow" class="follow_button"   id="follow_btn_' + data.user_id + '" />' +
			'</div>';
	      $('#' + li_id + " " +  "#ex1").append(html);


          }else{
            $('#unfollow').append(html);
	    var html = '<div id="inner">'+
		 	'<input type="button" height="25" width="25" value="Follow" class="follow_button"  id="follow_btn_' + data.user_id + '" />' +
			'</div>';

            $('#' + li_id + " " + "#ex1").append(html);
	   
          }
        }


      
        var html = '<input type="hidden" value="' + data.user_id + '" id="follow_btn_' + data.user_id + '_user_id" />';
        $("#" + li_id).append(html);
	
    }
  });

}
*/
function renderFollowers(json){
  //var search_html = '<input type="text" id="search_followers" placeholder="Followers"/>';
  //$("#follower-dialog-modal").append(search_html);
   //alert("renderFollowers");
   var html = '<div id="followers_list" class="modal_friends_ul sc_menu1">' +
             '</div>';

  
  $("#follower_friends").append(html);
  var inv_html = '<ul class="sc_menu1" id="test">' + '</ul>';
  $('#followers_list').append(inv_html);

  //var html = '<div id="profile_followers_list">' + '</div>';

  
  //$("#followers_list").append(html);
  

  $.each(json, function(i,user_data){
      if( user_data && user_data.user){
        var li_id = "followers_li_" + user_data.user.id;
        var str;
     
         //alert(data.name.length); 
         if( user_data.user.full_name.length > 12 )
         {  
           var limit = 12;                
           str = user_data.user.full_name;        
           var strtemp = str.substr(0,limit); 
           str = strtemp+ '..' + '<span class="hide">' + str.substr(limit,str.length) + '</span>'; 
         }
         else
         {
           str = user_data.user.full_name;
         }



    	var html= '<li class="lk"><div id="' + li_id  +  '">' +
	'<div id="ex1" >' +
            '<a href="#" id="user_nav_' +  user_data.user.id + '" class="link_user_stamp user_stamp user_nav">' +
		'<img class="img" src="'+  user_data.user.photo_small_url  +'" height="55" width="50" align="left">'+
		'<div id="txt1">' + str + '</div>'+
            '</a>'+ 
            '<input type="hidden" id="user_nav_' +  user_data.user.id + '_hidden" value="' +  user_data.user.id + '"/>'+
	'</div>'+
	'</div></li>';



	//$('#profile_followers_list').append(html);
  $('#test').append(html);

      if (user_data.user.following){
   	    var html = '<div id="inner">'+
		'<input type="button" class="follow_button" height="25" width="20" value="Unfollow" id="follow_btn_' + user_data.user.id + '" />' +
		'</div>';
	
           $("#" + li_id + " " + "#ex1").append(html);

        }else{
           var html =  '<div id="inner">'+
		'<input type="button" class="follow_button" height="25" width="20" value="Follow" id="follow_btn_' + user_data.user.id + '" />' + 
		'</div>';
           $( "#" + li_id + " " + "#ex1" ).append(html);
        }

        var html = '<input type="hidden" value="' +user_data.user.id + '" id="follow_btn_' + user_data.user.id + '_user_id" />';
        $("#" + li_id).append(html);
      }
  });
}



/* Global data */
var json_followers_data;
var ignore_follower_auto_complete = false;

/*
 * Invoke on page load
 */
function get_all_followers(){
    /*
     * Get data on ready
     */
    //alert("followers");

    $.ajax({
        url: '/contacts/followers',
        type: 'GET',
        data: {},
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
          /* if rails demands a redirect because of log in missing */
          if (data && data.location) {
            //alert("followers-if");
            window.location.href = data.location;
          }else{
            //alert("followers-else");
            $('#empty_check_flwr').hide();
            renderFollowers(data);
            json_followers_data=data;
          }
          //TODO: try to use this in search, why should search hit server, again and again
          
        },
        error: function (error) {

        }
    });
}

  
/********************************************************************************************/
/** General functions to support auto complete based search **/
function format(user) {
  return '<img alt="" class="img_stamp user_stamp" src="'+ user.photo_small_url + '">   ' + user.full_name + "</img>";
}

function getID(user){
  return user.id;
}

/********************************************************************************************/
$(document).ready(function(){
//alert("Inside profile_followers.js ready");

  $(".user_nav").live('click', function(){
    var click_id = $(this).attr("id");
    var user_id = $("#" + click_id + "_hidden").attr("value");
    reset_filter({});

    $("#follower-dialog-modal").dialog('close');
    window.location.href = "/home/show?id=" + user_id;
  });


  $('#flwr_friends').click(function(){
     //alert("flwr_friends");
     get_all_followers();
     $('#empty_check_flwr').hide();
  });

  if ($('#follower_friends').children().size() > 1)
  {
      //alert("flwr_friends -check -if");
      $('#empty_check_flwr').hide();
  }
  else
  {
      //alert("flwr_friends -check -else");
      $('#empty_check_flwr').show();
  }
 

});


/********************************* READY ENDS HERE ******************************************/





/*
 * Home page friends related jqueries
 *
 */

/*
 * Render friends 
 */
function renderFollowings(json){
  //var search_html = '<input type="text" id="search_followings" placeholder="Followings"/>';
  //$("#following-dialog-modal").append(search_html);
  //alert("renderFollowings");
 
  var html = '<div id="followings_list" class="modal_friends_ul sc_menu1">' +
             '</div>';
  
  $("#following_friends").append(html);
  var inv_html = '<ul class="sc_menu1" id="test">' + '</ul>';
  $('#followings_list').append(inv_html);

  $("#all_subscribed").append(html);  

  $.each(json, function(i,user_data){
      if( user_data && user_data.user){
        var li_id = "followings_li_" + user_data.user.id;
         var str;
     
         //alert(data.name.length); 
         if( user_data.user.full_name.length > 12 )
         {  
           var limit = 12;                
           str = user_data.user.full_name;        
           var strtemp = str.substr(0,limit); 
           str = strtemp+ '..' + '<span class="hide">' + str.substr(limit,str.length) + '</span>'; 
         }
         else
         {
           str = user_data.user.full_name;
         }


	var html= '<li class="lk"><div id="ex1" >' +
	'<a href="#" id="user_nav_' +  user_data.user.id + '" class="link_user_stamp user_stamp user_nav">' +
		'<img class="img" src="' + user_data.user.photo_small_url + '" height="55" width="50" align="left">'+
		'<div id="txt1">' + str + '</div>'+
	'</a>' +
 
        '<input type="hidden" id="user_nav_' +  user_data.user.id + '_hidden" value="' +  user_data.user.id + '"/>' + 

	'<div id="inner">'+
			'<input type="button" class="follow_button" height="25" width="25" value="Unfollow" id="follow_btn_' + user_data.user.id + '" />' +
	'</div>'+

	'</div></li>';   


        //$('#followings_list').append(html);
        $('#test').append(html);

        var html = '<input type="hidden" value="' +user_data.user.id + '" id="follow_btn_' + user_data.user.id + '_user_id" />';
        $("#" + li_id).append(html);
      }
  });

}


/* Global data */
var json_followings_data;
var ignore_following_auto_complete = false;

/*
 * Invoke on page load
 */
function get_all_followings(){
    /*
     * Get data on ready
     */
    //alert("get_all_followings");
    $.ajax({
        url: '/contacts/followings',
        type: 'GET',
        data: {},
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
          /* if rails demands a redirect because of log in missing */
          if (data && data.location) {
            window.location.href = data.location;
            //alert("if renderFollowings");
          }else{
            //alert("else renderFollowings");
            $('#empty_check_flwg').hide();
            renderFollowings(data);
            json_followings_data=data;
          }
          //TODO: try to use this in search, why should search hit server, again and again
          
        },
        error: function (error) {

        }
    });

    $('#empty_check_flwg').hide();
}

  
/********************************************************************************************/
/** General functions to support auto complete based search **/
function format(user) {
  return '<img alt="" class="img_stamp user_stamp" src="'+ user.photo_small_url + '">   ' + user.full_name + "</img>";
}

function getID(user){
  return user.id;
}

/********************************************************************************************/
$(document).ready(function(){
//alert("Inside profile_followings.js ready");



  $('#flwg_friends').click(function(){
    //alert($('#following_friends').children().size());
       
     $('#empty_check_flwg').hide();
     get_all_followings();
     
  });
    if ($('#following_friends').children().size() > 1)
    {
        $('#empty_check_flwg').hide();
    }
    else
    {
        $('#empty_check_flwg').show();
    }
 
 

});


/********************************* READY ENDS HERE ******************************************/




