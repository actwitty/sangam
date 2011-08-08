/*!
 * jQuery YouTube Popup Player Plugin v1.0
 * http://lab.abhinayrathore.com/jquery_youtube/
 * Last Updated: June 17 2011
 */
(function ($) {
    var YouTubeDialog = null;
    var methods = {
        //initialize plugin
        init: function (options) {
            options = $.extend({}, $.fn.YouTubePopup.defaults, options);

            // initialize YouTube Player Dialog
            if (YouTubeDialog == null) {
                YouTubeDialog = $('<div></div>').css({ display: 'none', padding: 0 });
                $('body').append(YouTubeDialog);
                YouTubeDialog.dialog({ autoOpen: false, resizable: false, draggable: options.draggable, modal: options.modal,
                    close: function () { YouTubeDialog.html(''); }
                });
            }

            return this.each(function () {
                var obj = $(this);
                var data = obj.data('YouTube');
                if (!data) { //check if event is already assigned
                    obj.data('YouTube', { target: obj, 'active': true });
                    $(obj).bind('click.YouTubePopup', function () {
                        var youtubeId = options.youtubeId;
                        if ($.trim(youtubeId) == '') youtubeId = obj.attr(options.idAttribute);
                        var videoTitle = options.title;
                        if ($.trim(videoTitle) == '') videoTitle = obj.attr('title');
                        //var a = youtubeId.split("watch?v=");
                        //alert(a[1]);
                        var aa = getYoutubeURL(youtubeId);
                        //Format YouTube URL
                        var YouTubeURL = "http://www.youtube.com/embed/" + aa + "?rel=0&showsearch=0&autohide=" + options.autohide;
                        //alert(YouTubeURL);
                        YouTubeURL += "&autoplay=" + options.autoplay + "&color1=" + options.color1 + "&color2=" + options.color2;
                        YouTubeURL += "&controls=" + options.controls + "&fs=" + options.fullscreen + "&loop=" + options.loop;
                        YouTubeURL += "&hd=" + options.hd + "&showinfo=" + options.showinfo;

                        //Setup YouTube Dialog
                        YouTubeDialog.html(getYouTubePlayer(YouTubeURL, options.width, options.height));
                        YouTubeDialog.dialog({ 'width': 'auto', 'height': 'auto' }); //reset width and height
                        YouTubeDialog.dialog({ 'minWidth': options.width, 'minHeight': options.height, title: videoTitle });
                        YouTubeDialog.dialog('open');

                        return false;
                    });
                }
            });
        },
        destroy: function () {
            return this.each(function () {
                $(this).unbind(".YouTubePopup");
                $(this).removeData('YouTube');
            });
        }
    };

    function getYouTubePlayer(URL, width, height) {
        var YouTubePlayer = '<iframe title="YouTube video player" style="margin:0; padding:0;" width="' + width + '" ';
        YouTubePlayer += 'height="' + height + '" src="' + URL + '" frameborder="0" allowfullscreen></iframe>';
        return YouTubePlayer;
    }

    function getYoutubeURL(youtubeId) {
        //# set to zero
        var youtube_id = "";
        //$sYoutubeUrl = trim($sYoutubeUrl);
        var match_string = "";
        //# the User entered only the eleven chars long id, Case 1
        if((youtubeId.length) === 11) {
            youtube_id = youtubeId;
            alert("1");
            return youtubeId;
        }
        //# the User entered a Url
        else {
            match_string = youtubeId.split("watch?v=")
            if ( (match_string[1].length) == 11   ) {
                youtube_id = match_string[1];
                alert("2");
                return youtube_id;
            }
            else {
                var test = match_string[1];
                test = test.split("&feature=");
                alert(test[0]);
                alert("3");
                youtube_id = test[0];
                return youtube_id;
            }
        }


    }
    

    $.fn.YouTubePopup = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.YouTubePopup');
        }
    };

    //default configuration
    $.fn.YouTubePopup.defaults = {
        'youtubeId': '',
        'title': '',
        'idAttribute': 'rel',
        'draggable': false,
        'modal': true,
        'width': 640,
        'height': 480,
        'autohide': 2,
        'autoplay': 1,
        'color1': 'FFFFFF',
        'color2': 'FFFFFF',
        'controls': 1,
        'fullscreen': 1,
        'loop': 0,
        'hd': 1,
        'showinfo': 1 
    };
})(jQuery);
