/***********************************************/
/*
 *
 *
 */
var aw_local_more_cookie_manager={};

/***********************************************/
/*
 *
 *
 */
function aw_api_ppm_cmn_more_cookie_set(key, value){
  aw_local_more_cookie_manager[key] = value;
}


/***********************************************/
/*
 *
 *
 */
function aw_api_ppm_cmn_more_cookie_get(key){
  if( aw_local_more_cookie_manager[key]){
    return  aw_local_more_cookie_manager[key];
  }else{
    return '';
  }

}

