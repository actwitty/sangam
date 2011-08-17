
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

function activate_fancybox_group(post_group){
   $('a[rel=fnc_group_'+post_group+']').fancybox({
				'transitionIn'		: 'none',
				'transitionOut'		: 'none',
				'titlePosition' 	: 'over',
				'titleFormat'		: function(title, currentArray, currentIndex, currentOpts) {
					return '<span id="fancybox-title-over">' +
                    'Image ' + (currentIndex + 1) + ' / ' + currentArray.length + (title.length ? ' &nbsp; ' + title : '') +
                 '</span>';
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








