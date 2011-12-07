/*
 * This file take care of 
 * (1).Structure for defining the default theme code values for all the categories.
 * (2).Getting default theme value for categories.
 * (3).Getting the actual theme values for a category.
 * (4).Default has been set to 0xffffff00 as this value gets set while creating the summary itself TODO
 * 
 * Note : List of Theme codes and default categories are in aw_cspm_theme_setting.js file
 */


var aw_local_default_channel_theme_json = {
                                            'animals' :       '0x00000001',
                                            'arts':           '0x00000002',    
                                            'books':          '0x00000003',
                                            'business':       '0x00000004',
                                            'cars':           '0x00000005',
                                            'events':         '0x00000006',
                                            'politics':       '0x00000007', 
                                            'entertainment':  '0x00000008',
                                            'education':      '0x00000009',
                                            'fashion':        '0x00000010', 
                                            'food and drink': '0x00000011',
                                            'games':          '0x00000012',
                                            'health':         '0x00000013',
                                            'home':           '0x00000014',    
                                            'hobbies' :       '0x00000015',
                                            'nonprofits':     '0x00000016',
                                            'sports' :        '0x00000017',
                                            'stories':        '0x00000018',
                                            'technology':     '0x00000019',
                                            'places':         '0x00000020',
                                            'default':        '0xffffff00' 
                                      };


/*
 *
 *
 */
/*
function aw_lib_get_default_channel_theme_for_category(category_data){
  if ( category_data && category_data.category_id && aw_local_default_channel_theme_json[category_data.category_id]){
    return aw_local_default_channel_theme_json[category_data.category_id];
  }else{
    return aw_local_default_channel_theme_json['default'];
  }
}
*/
function aw_lib_get_default_channel_theme_for_category(category_data){
  if ( category_data && category_data.category_id && aw_local_default_channel_theme_json[category_data.category_id]){
    var theme_code = aw_local_default_channel_theme_json[category_data.category_id];
    return aw_local_channel_theme_list_json[theme_code];
  }else{
    return aw_local_channel_theme_list_json['0xffffff00'];

  }
}

/*
 *
 *
 */
/*
function aw_lib_get_default_stream_theme_for_category(category_data){
  if ( category_data && category_data.category_id && aw_local_default_channel_theme_json[category_data.category_id]){
    return aw_local_default_channel_theme_json[category_data.category_id].bkg;
  }else{
    return aw_local_default_channel_theme_json['default'].bkg;
  }
}*/


function aw_lib_get_default_stream_theme_for_category(category_data){
  if ( category_data && category_data.category_id && aw_local_default_channel_theme_json[category_data.category_id]){
    var theme_code = aw_local_default_channel_theme_json[category_data.category_id] 
    return aw_local_channel_theme_list_json[theme_code].bkg;
  }else{
    return aw_local_channel_theme_list_json['0xffffff00'].bkg;

  }
}


/*
 *  Return the thumbnail for a channel, based on set theme. Else return the default value  
 *
 */

function aw_lib_get_channel_theme_thumb(channel_info)
{
  if (channel_info.category_data && channel_info.category_data.category_id && aw_local_default_channel_theme_json[channel_info.category_data.category_id]){
    if(typeof channel_info.theme_data.id != 'undefined' && channel_info.theme_data.fg_color != '0xffffff00' && aw_local_channel_theme_list_json[channel_info.theme_data.fg_color]){
      return aw_local_channel_theme_list_json[channel_info.theme_data.fg_color].thumb;  
    }else{
      var theme_code = aw_local_default_channel_theme_json[channel_info.category_data.category_id];
      return aw_local_channel_theme_list_json[theme_code].thumb;
    }
  }else{
    return aw_local_channel_theme_list_json['0xffffff00'].thumb;
  }
}



/*
 * Return the background for a channel, based on set theme. Else return the default value 
 *
 */
function aw_lib_get_channel_theme_background(channel_info)
{
  if ( channel_info.category_data && channel_info.category_data.category_id && aw_local_default_channel_theme_json[channel_info.category_data.category_id]){
    if(typeof channel_info.theme_data.id != 'undefined' && channel_info.theme_data.fg_color != '0xffffff00' && aw_local_channel_theme_list_json[channel_info.theme_data.fg_color]){
      return aw_local_channel_theme_list_json[channel_info.theme_data.fg_color].bkg;  
    }else{
      var theme_code = aw_local_default_channel_theme_json[channel_info.category_data.category_id];
      return aw_local_channel_theme_list_json[theme_code].bkg;
    }
  }else{
    return aw_local_channel_theme_list_json['0xffffff00'].bkg;
  }
}



/*
 *  To fetch the thumbnail for a particular theme code
 */
function aw_lib_get_thumnail_for_theme_code(theme_code)
{
  if(aw_local_channel_theme_list_json[theme_code])
    return aw_local_channel_theme_list_json[theme_code].thumb;
}


/*
 *  To fetch the thumbnail for a particular theme code
 */
function aw_lib_get_background_for_theme_code(theme_code)
{
  if(aw_local_channel_theme_list_json[theme_code])
    return aw_local_channel_theme_list_json[theme_code].bkg;
}

