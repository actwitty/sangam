/*
 * This file take care of 
 * (1).Structure for defining the default theme code values for all the categories.
 * (2).Getting default theme value for categories.
 * (3).Getting the actual theme values for a category.
 * (4).Default has been set to 0xffffff00 as this value gets set while creating the summary itself TODO
 * 
 * Note : List of Theme codes and default categories are in aw_cspm_theme_setting.js file
 */



/*
 *
 *
 */
/*
function aw_lib_get_default_channel_theme_for_category(category_data){
  if ( category_data && category_data.id && aw_local_default_channel_theme_json[category_data.id]){
    return aw_local_default_channel_theme_json[category_data.id];
  }else{
    return aw_local_default_channel_theme_json['default'];
  }
}
*/
function aw_lib_get_default_channel_theme_for_category(category_data){
  if ( category_data && category_data.id && aw_local_default_channel_theme_json[category_data.id]){
    var theme_code = aw_local_default_channel_theme_json[category_data.id];
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
  if ( category_data && category_data.id && aw_local_default_channel_theme_json[category_data.id]){
    return aw_local_default_channel_theme_json[category_data.id].bkg;
  }else{
    return aw_local_default_channel_theme_json['default'].bkg;
  }
}*/


function aw_lib_get_default_stream_theme_for_category(category_data){
  if ( category_data && category_data.id && aw_local_default_channel_theme_json[category_data.id]){
    var theme_code = aw_local_default_channel_theme_json[category_data.id] 
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
  if (channel_info.category_data && channel_info.category_data.id && aw_local_default_channel_theme_json[channel_info.category_data.id]){
    if(typeof channel_info.theme_data.id != 'undefined' && channel_info.theme_data.fg_color != '0xffffff00' && aw_local_channel_theme_list_json[channel_info.theme_data.fg_color]){
      return aw_local_channel_theme_list_json[channel_info.theme_data.fg_color].thumb;  
    }else{
      var theme_code = aw_local_default_channel_theme_json[channel_info.category_data.id];
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
  if ( channel_info.category_data && channel_info.category_data.id && aw_local_default_channel_theme_json[channel_info.category_data.id]){
    if(typeof channel_info.theme_data.id != 'undefined' && channel_info.theme_data.fg_color != '0xffffff00' && aw_local_channel_theme_list_json[channel_info.theme_data.fg_color]){
      return aw_local_channel_theme_list_json[channel_info.theme_data.fg_color].bkg;  
    }else{
      var theme_code = aw_local_default_channel_theme_json[channel_info.category_data.id];
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

