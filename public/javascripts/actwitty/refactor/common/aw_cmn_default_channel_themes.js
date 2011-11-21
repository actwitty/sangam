var aw_local_default_channel_theme_json = {
                                          'pets and animals' : {
                                                                  'thumb': '/images/actwitty/refactor/aw_common/themes/channel_thumbs/pets.jpg',
                                                                  'bkg' : '/images/actwitty/refactor/aw_common/themes/channel_backgrounds/pets.jpg' 
                                                               },
                                          'arts and design': {
                                                                  'thumb': '/images/actwitty/refactor/aw_common/themes/channel_thumbs/art.jpg',
                                                                  'bkg' : '/images/actwitty/refactor/aw_common/themes/channel_backgrounds/art.jpg' 
                                                               },
                                          'books and articles': {
                                                                  'thumb': '/images/actwitty/refactor/aw_common/themes/channel_thumbs/books.jpg',
                                                                  'bkg' : '/images/actwitty/refactor/aw_common/themes/channel_backgrounds/books.jpg' 
                                                               },
                                          'business': {
                                                        'thumb': '/images/actwitty/refactor/aw_common/themes/channel_thumbs/business.jpg',
                                                        'bkg' : '/images/actwitty/refactor/aw_common/themes/channel_backgrounds/business.jpg' 
                                                      },
                                          'cars': {
                                                    'thumb': '/images/actwitty/refactor/aw_common/themes/channel_thumbs/cars.jpg',
                                                    'bkg' : '/images/actwitty/refactor/aw_common/themes/channel_backgrounds/cars.jpg' 
                                                  },
                                          'holidays and events':{
                                                    'thumb': '/images/actwitty/refactor/aw_common/themes/channel_thumbs/celebration.jpg',
                                                    'bkg' : '/images/actwitty/refactor/aw_common/themes/channel_backgrounds/celebration.jpg' 
                                                  },
                                          'culture and society': {
                                                    'thumb': '/images/actwitty/refactor/aw_common/themes/channel_thumbs/culture.jpg',
                                                    'bkg' : '/images/actwitty/refactor/aw_common/themes/channel_backgrounds/culture.jpg' 
                                                  },

                                          'entertainment':{
                                                    'thumb': '/images/actwitty/refactor/aw_common/themes/channel_thumbs/entertainment.jpg',
                                                    'bkg' : '/images/actwitty/refactor/aw_common/themes/channel_backgrounds/entertainment.jpg' 
                                                  },
                                          'education':{
                                                    'thumb': '/images/actwitty/refactor/aw_common/themes/channel_thumbs/education.jpg',
                                                    'bkg' : '/images/actwitty/refactor/aw_common/themes/channel_backgrounds/education.jpg' 
                                                  },
                                        'fashion and style':{
                                                    'thumb': '/images/actwitty/refactor/aw_common/themes/channel_thumbs/fashion.jpg',
                                                    'bkg' : '/images/actwitty/refactor/aw_common/themes/channel_backgrounds/fashion.jpg' 
                                                  },
                                        'food and drink' :{
                                                    'thumb': '/images/actwitty/refactor/aw_common/themes/channel_thumbs/food.jpg',
                                                    'bkg' : '/images/actwitty/refactor/aw_common/themes/channel_backgrounds/food.jpg' 
                                                  },
                                        'toys and games': {
                                                    'thumb': '/images/actwitty/refactor/aw_common/themes/channel_thumbs/games.jpeg',
                                                    'bkg' : '/images/actwitty/refactor/aw_common/themes/channel_backgrounds/games.jpg' 
                                                  },
                                        'health': {
                                                    'thumb': '/images/actwitty/refactor/aw_common/themes/channel_thumbs/health.jpg',
                                                    'bkg' : '/images/actwitty/refactor/aw_common/themes/channel_backgrounds/health.jpg' 
                                                  },
                                        'home':{
                                                    'thumb': '/images/actwitty/refactor/aw_common/themes/channel_thumbs/home.jpg',
                                                    'bkg' : '/images/actwitty/refactor/aw_common/themes/channel_backgrounds/home.jpg' 
                                                  },
                                        'hobbies and interest' : {
                                                    'thumb': '/images/actwitty/refactor/aw_common/themes/channel_thumbs/hobbies.jpg',
                                                    'bkg' : '/images/actwitty/refactor/aw_common/themes/channel_backgrounds/hobbies.png' 
                                                  },
                                        'nonprofits': {
                                                    'thumb': '/images/actwitty/refactor/aw_common/themes/channel_thumbs/nonprofits.jpg',
                                                    'bkg' : '/images/actwitty/refactor/aw_common/themes/channel_backgrounds/nonprofits.jpg' 
                                                  },
                                        'sports' : {
                                                    'thumb': '/images/actwitty/refactor/aw_common/themes/channel_thumbs/sports.jpg',
                                                    'bkg' : '/images/actwitty/refactor/aw_common/themes/channel_backgrounds/sports.jpg' 
                                                  },
                                        'stories': {
                                                    'thumb': '/images/actwitty/refactor/aw_common/themes/channel_thumbs/stories.jpg',
                                                    'bkg' : '/images/actwitty/refactor/aw_common/themes/channel_backgrounds/stories.jpg' 
                                                  },
                                        'technology':{
                                                    'thumb': '/images/actwitty/refactor/aw_common/themes/channel_thumbs/technology.jpg',
                                                    'bkg' : '/images/actwitty/refactor/aw_common/themes/channel_backgrounds/technology.png' 
                                                  },
                                        'travel and places':{
                                                    'thumb': '/images/actwitty/refactor/aw_common/themes/channel_thumbs/travel.jpg',
                                                    'bkg' : '/images/actwitty/refactor/aw_common/themes/channel_backgrounds/travel.jpg' 
                                                  },
                                        'default':  {
                                                      'thumb': '/images/actwitty/refactor/aw_common/themes/channel_thumbs/default.jpg',
                                                      'bkg' : '/images/actwitty/refactor/aw_common/themes/channel_backgrounds/default.png' 
                                                    }
                                      };

/*
 *
 *
 */
function aw_lib_get_default_channel_theme_for_category(category){
  if ( category && category.length && aw_local_default_channel_theme_json[category]){
    return aw_local_default_channel_theme_json[category];
  }else{
    return aw_local_default_channel_theme_json['default'];
  }
}

/*
 *
 *
 */
function aw_lib_get_default_stream_theme_for_category(category){
  if ( category && category.length && aw_local_default_channel_theme_json[category]){
    return aw_local_default_channel_theme_json[category].bkg;
  }else{
    return aw_local_default_channel_theme_json['default'].bkg;
  }
}
