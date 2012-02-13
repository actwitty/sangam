/****************************************************/
/*
 *
 *
 */
var aw_js_mentions_test = [

                                    {
                                        name: "roger federer",
                                        id:1231,
                                        weight: 7,
                                        img_url: "",
                                    },
                                    {
                                        name: "aloo chaat",
                                        id:1231,
                                        weight: 3,
                                        img_url: "",
                                    },
                                    {
                                        name: "sachin tendulkar",
                                        id:1231,
                                        weight: 14,
                                        img_url: "",
                                    },
                                    {
                                        name: "pizza hut",
                                        id:1231,
                                        weight: 10,
                                        img_url: "",
                                    },
                                    {
                                        name: "ruby rails",
                                        id:1231,
                                        weight: 5,
                                        img_url: "",
                                    },
                                    {
                                        name: "india",
                                        id:1231,
                                        weight: 21,
                                        img_url: "",
                                    },
                                    {
                                        name: "kailash kher",
                                        id:1231,
                                        weight: 4,
                                        img_url: "",
                                    },
                                    {
                                        name: "actwitty",
                                        id:1231,
                                        weight: 14,
                                        img_url: "",
                                    }
                                               

                                 ];
/****************************************************/
/*
 *
 *
 */
function aw_api_model_mentions_initialize(){
  /* make a get call to server */
  aw_api_controller_render_mentions(aw_js_mentions_test);
}


