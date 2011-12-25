
/*
 * List of default code values for existing categories
 * */
var aw_local_default_channel_theme_json = {
                                            'animals' :       '0x00000019',
                                            'arts':           '0x00000045',    
                                            'automobiles':    '0x00000037',
                                            'books':          '0x00000005',
                                            'business':       '0x00000039',
                                            'education':      '0x00000055',
                                            'entertainment':  '0x00000042',
                                            'food':           '0x00000023',
                                            'games':          '0x00000034',
                                            'health':         '0x00000021',
                                            'hobbies' :       '0x00000027',
                                            'home':           '0x00000028',    
                                            'leisure':        '0x00000018', 
                                            'products':       '0x00000067', 
                                            'nonprofits':     '0x00000044',
                                            'places':         '0x00000047',
                                            'world':          '0x00000066', 
                                            'sports' :        '0x00000052',
                                            'stories':        '0x00000060',
                                            'technology':     '0x00000043',
                                            'default':        '0xffffff00' 
                                      };


var aw_local_theme_base_path = "/images/actwitty/refactor/aw_common/themes/";
/*
 *  List of themes for channels. This is kind of a Theme Registry
 *  values like "0x000001" are actually the code values for particular theme.
 *  The value is not exactly a hex value -  just a convention.
 *  The default theme
 */
var aw_local_channel_theme_list_json = {

                                '0x00000001' : {
                                          'thumb': aw_local_theme_base_path + 'america/thumb.jpg',
                                          'bkg': aw_local_theme_base_path + 'america/bkg.jpg',
                                          'text': 'American Dream theme.',
                                          'name': 'American Dream'
                                            },
                                '0x00000002': {
                                          'thumb': aw_local_theme_base_path + 'beach/thumb.jpg',
                                          'bkg': aw_local_theme_base_path + 'beach/bkg.jpg',
                                          'text': 'Sun, sand and beach.',
                                          'name': 'Beach' 
                                         },
                                '0x00000003': {
                                          'thumb': aw_local_theme_base_path + 'beer/thumb.jpg',
                                          'bkg': aw_local_theme_base_path + 'beer/bkg.jpg' ,
                                          'text': 'Beer and friends theme.',
                                          'name': 'Beer'
                                         },
                                '0x00000004': {
                                          'thumb': aw_local_theme_base_path + 'beetle/thumb.jpg',
                                          'bkg': aw_local_theme_base_path + 'beetle/bkg.jpg',
                                          'text': 'Beetle car theme.',
                                          'name': 'Beetle'
                                          },
                                '0x00000005': {
                                          'thumb': aw_local_theme_base_path + 'books/thumb.jpg',
                                          'bkg': aw_local_theme_base_path + 'books/bkg.jpg',
                                          'text': 'Book readers theme.',
                                          'name': 'Books'
                                          },
                                '0x00000006':{
                                          'thumb': aw_local_theme_base_path + 'bricks/thumb.jpg',
                                          'bkg': aw_local_theme_base_path + 'bricks/bkg.jpg',
                                          'text': 'Bricks on the wall.',
                                          'name': 'Bricks'
                                          },
                                '0x00000007': {
                                          'thumb': aw_local_theme_base_path + 'celebration/thumb.jpg',
                                          'bkg': aw_local_theme_base_path + 'celebration/bkg.jpg',
                                          'text': 'Festivals and celebrations.',
                                          'name': 'Celebrations'                                         
                                          },
                                '0x00000008':{
                                          'thumb': aw_local_theme_base_path + 'christmas/thumb.jpg',
                                          'bkg': aw_local_theme_base_path + 'christmas/bkg.jpg',
                                          'text': 'Christmas Celebrations.',
                                          'name': 'Christmas'                                         
                                          },
                                '0x00000009':{
                                          'thumb': aw_local_theme_base_path + 'coins/thumb.jpg',
                                          'bkg': aw_local_theme_base_path + 'coins/bkg.jpg',
                                          'text': 'Coins and money.',
                                          'name': 'Coins'                                         
                                          },
                                '0x00000010':{
                                          'thumb': aw_local_theme_base_path + 'cycling/thumb.jpg',
                                          'bkg': aw_local_theme_base_path + 'cycling/bkg.jpg',
                                          'text': 'Cycle to good health.',
                                          'name': 'Cycling'
                                          },
                                '0x00000011' :{
                                          'thumb': aw_local_theme_base_path + 'dance/thumb.jpg',
                                          'bkg': aw_local_theme_base_path + 'dance/bkg.jpg',
                                          'text': 'Dancing queen.',
                                          'name': 'Dance'                                          
                                          },
                                '0x00000013': {
                                          'thumb': aw_local_theme_base_path + 'darwin/thumb.png',
                                          'bkg': aw_local_theme_base_path + 'darwin/bkg.jpg' ,
                                          'text': 'Evolution and Charles Darwin',
                                          'name': 'Darwin'
                                          },
                                '0x00000014':{
                                          'thumb': aw_local_theme_base_path + 'dawn/thumb.jpg',
                                          'bkg': aw_local_theme_base_path + 'dawn/bkg.jpg' ,
                                          'text': 'Dawn in nature',
                                          'name': 'Dawn'
                                          },
                                '0x00000015' : {
                                          'thumb': aw_local_theme_base_path + 'default/thumb.jpg',
                                          'bkg': aw_local_theme_base_path + 'default/bkg.jpg' ,
                                          'text': 'Colors of life',
                                          'name': 'Colors'
                                          },
                                '0x00000016': {
                                          'thumb': aw_local_theme_base_path + 'disney/thumb.jpg',
                                          'bkg': aw_local_theme_base_path + 'disney/bkg.jpg' ,
                                          'text': 'Pluto and Mickey',
                                          'name': 'Disney'
                                          },
                                '0x00000017' : {
                                          'thumb': aw_local_theme_base_path + 'eye_liners/thumb.jpg',
                                          'bkg': aw_local_theme_base_path + 'eye_liners/bkg.jpg',
                                          'text': 'Styles on eyes',
                                          'name': 'EyeLiners'
                                          },
                                '0x00000018': {
                                          'thumb': aw_local_theme_base_path + 'fashion/thumb.jpg',
                                          'bkg': aw_local_theme_base_path + 'fashion/bkg.jpg',
                                          'text': 'Clothing and Fashion',
                                          'name': 'Fashion'
                                          },
                                '0x00000019':{
                                          'thumb': aw_local_theme_base_path + 'feline/thumb.jpg',
                                          'bkg': aw_local_theme_base_path + 'feline/bkg.jpg',
                                          'text': 'Cats as pets',
                                          'name': 'Feline'
                                          },
                                '0x00000020':{
                                          'thumb': aw_local_theme_base_path + 'ferrari/thumb.jpg',
                                          'bkg': aw_local_theme_base_path + 'ferrari/bkg.jpg',
                                          'text': 'Ferrari the car',
                                          'name': 'Ferrari'
                                          },
                                '0x00000021':{
                                          'thumb': aw_local_theme_base_path + 'fitness/thumb.jpg',
                                          'bkg': aw_local_theme_base_path + 'fitness/bkg.jpg',
                                          'text': 'Health and fitness',
                                          'name': 'Fitness'
                                          },
                                '0x00000022':{
                                          'thumb': aw_local_theme_base_path + 'fly/thumb.jpg',
                                          'bkg': aw_local_theme_base_path + 'fly/bkg.jpg',
                                          'text': 'Travellers flying across.',
                                          'name': 'Flying'
                                          },
                                '0x00000023':{
                                          'thumb': aw_local_theme_base_path + 'food/thumb.jpg',
                                          'bkg': aw_local_theme_base_path + 'food/bkg.jpg',
                                          'text': 'Lovely food.',
                                          'name': 'Food'
                                          },
                                '0x00000024':{
                                          'thumb': aw_local_theme_base_path + 'guitar/thumb.jpg',
                                          'bkg': aw_local_theme_base_path + 'guitar/bkg.jpg',
                                          'text': 'Six strings.',
                                          'name': 'Guitar'
                                          },                                          
                                '0x00000025':{
                                          'thumb': aw_local_theme_base_path + 'halloween/thumb.jpg',
                                          'bkg': aw_local_theme_base_path + 'halloween/bkg.jpg',
                                          'text': 'Trick or Treat.',
                                          'name': 'Halloween'
                                          },
                                '0x00000026':{
                                          'thumb': aw_local_theme_base_path + 'harley/thumb.jpg',
                                          'bkg': aw_local_theme_base_path + 'harley/bkg.jpg',
                                          'text': 'Harley Davidson.',
                                          'name': 'Harley Davidson'
                                          },                                          
                                '0x00000027':{
                                          'thumb': aw_local_theme_base_path + 'hobbist/thumb.jpg',
                                          'bkg': aw_local_theme_base_path + 'hobbist/bkg.jpg',
                                          'text': 'Leisurely things to do.',
                                          'name': 'Hobbists'
                                          },  
                                '0x00000028':{
                                          'thumb': aw_local_theme_base_path + 'home/thumb.jpg',
                                          'bkg': aw_local_theme_base_path + 'home/bkg.jpg',
                                          'text': 'Home decors and furnishings.',
                                          'name': 'Home'
                                          },          
                                '0x00000029':{
                                          'thumb': aw_local_theme_base_path + 'john_lennon/thumb.jpg',
                                          'bkg': aw_local_theme_base_path + 'john_lennon/bkg.jpg',
                                          'text': 'Give peace a chance.',
                                          'name': 'John Lennon'
                                          }, 
                                '0x00000030':{
                                          'thumb': aw_local_theme_base_path + 'lady_gaga/thumb.jpg',
                                          'bkg': aw_local_theme_base_path + 'lady_gaga/bkg.jpg',
                                          'text': 'Lady Gaga.',
                                          'name': 'Lady Gaga'
                                          },                                          
                                '0x00000031':{
                                          'thumb': aw_local_theme_base_path + 'lion/thumb.jpg',
                                          'bkg': aw_local_theme_base_path + 'lion/bkg.jpg',
                                          'text': 'African Lion.',
                                          'name': 'Lion'
                                          },                                                                                    
                                '0x00000032':{
                                          'thumb': aw_local_theme_base_path + 'love/thumb.jpg',
                                          'bkg': aw_local_theme_base_path + 'love/bkg.jpg',
                                          'text': 'Love and affection',
                                          'name': 'Love'
                                          },                                                                                                                    '0x00000033':{
                                          'thumb': aw_local_theme_base_path + 'maple/thumb.jpg',
                                          'bkg': aw_local_theme_base_path + 'maple/bkg.jpg',
                                          'text': 'Fall colors in maple',
                                          'name': 'Maples'
                                          },
                                '0x00000034':{
                                          'thumb': aw_local_theme_base_path + 'mario/thumb.jpg',
                                          'bkg': aw_local_theme_base_path + 'mario/bkg.jpg',
                                          'text': 'Mario Brothers',
                                          'name': 'Mario'
                                          },                                          
                                '0x00000035':{
                                          'thumb': aw_local_theme_base_path + 'matrix/thumb.jpg',
                                          'bkg': aw_local_theme_base_path + 'matrix/bkg.jpg',
                                          'text': 'Matrix',
                                          'name': 'Matrix'
                                          },  
                                '0x00000036':{
                                          'thumb': aw_local_theme_base_path + 'meerkat/thumb.jpg',
                                          'bkg': aw_local_theme_base_path + 'meerkat/bkg.jpg',
                                          'text': 'Meerkat in the wild',
                                          'name': 'Meerkats'
                                          },
                                '0x00000037':{
                                          'thumb': aw_local_theme_base_path + 'mercedes/thumb.jpg',
                                          'bkg': aw_local_theme_base_path + 'mercedes/bkg.jpg',
                                          'text': 'Famous automobile brands',
                                          'name': 'Mercedes'
                                          },                                        
                                '0x00000038':{
                                          'thumb': aw_local_theme_base_path + 'messi/thumb.jpg',
                                          'bkg': aw_local_theme_base_path + 'messi/bkg.jpg',
                                          'text': 'Messi',
                                          'name': 'Messi'
                                          }, 
                                '0x00000039':{
                                          'thumb': aw_local_theme_base_path + 'money/thumb.jpg',
                                          'bkg': aw_local_theme_base_path + 'money/bkg.jpg',
                                          'text': 'Business and money',
                                          'name': 'Money'
                                          },
                                '0x00000040':{
                                          'thumb': aw_local_theme_base_path + 'motorcycle/thumb.jpg',
                                          'bkg': aw_local_theme_base_path + 'motorcycle/bkg.jpg',
                                          'text': 'Motorcycles',
                                          'name': 'Motorcycles'
                                          },                                          
                                '0x00000041':{
                                          'thumb': aw_local_theme_base_path + 'movies/thumb.jpg',
                                          'bkg': aw_local_theme_base_path + 'movies/bkg.jpg',
                                          'text': 'Movies magic',
                                          'name': 'Movies magic'
                                          }, 
                                '0x00000042':{
                                          'thumb': aw_local_theme_base_path + 'music/thumb.jpg',
                                          'bkg': aw_local_theme_base_path + 'music/bkg.jpg',
                                          'text': 'Music',
                                          'name': 'Music'
                                          },                                          
                                '0x00000043':{
                                          'thumb': aw_local_theme_base_path + 'nasa/thumb.jpg',
                                          'bkg': aw_local_theme_base_path + 'nasa/bkg.jpg',
                                          'text': 'NASA',
                                          'name': 'NASA'
                                          },
                                '0x00000044':{
                                          'thumb': aw_local_theme_base_path + 'nonprofits/thumb.jpg',
                                          'bkg': aw_local_theme_base_path + 'nonprofits/bkg.jpg',
                                          'text': 'Nonprofits',
                                          'name': 'Nonprofits'
                                          },
                                '0x00000044':{
                                          'thumb': aw_local_theme_base_path + 'nonprofits/thumb.jpg',
                                          'bkg': aw_local_theme_base_path + 'nonprofits/bkg.jpg',
                                          'text': 'Nonprofits',
                                          'name': 'Nonprofits'
                                          },
                                '0x00000045':{
                                          'thumb': aw_local_theme_base_path + 'painting/thumb.jpg',
                                          'bkg': aw_local_theme_base_path + 'painting/bkg.jpg',
                                          'text': 'Paintings',
                                          'name': 'Paintings'
                                          },
                                '0x00000046':{
                                          'thumb': aw_local_theme_base_path + 'parenting/thumb.jpg',
                                          'bkg': aw_local_theme_base_path + 'parenting/bkg.jpg',
                                          'text': 'Parenting',
                                          'name': 'Parenting'
                                          },        
                                '0x00000047':{
                                          'thumb': aw_local_theme_base_path + 'paris/thumb.jpg',
                                          'bkg': aw_local_theme_base_path + 'paris/bkg.jpg',
                                          'text': 'Paris',
                                          'name': 'Paris'
                                          },
                                '0x00000049':{
                                          'thumb': aw_local_theme_base_path + 'peace/thumb.jpg',
                                          'bkg': aw_local_theme_base_path + 'peace/bkg.jpg',
                                          'text': 'Peace',
                                          'name': 'Peace'
                                          }, 
                                  '0x00000050':{
                                          'thumb': aw_local_theme_base_path + 'pencils/thumb.jpg',
                                          'bkg': aw_local_theme_base_path + 'pencils/bkg.jpg',
                                          'text': 'Pencil and sketching',
                                          'name': 'Pencils'
                                          },
                                  '0x00000051':{
                                          'thumb': aw_local_theme_base_path + 'penguin/thumb.jpg',
                                          'bkg': aw_local_theme_base_path + 'penguin/bkg.jpg',
                                          'text': 'Penguins',
                                          'name': 'Penguins'
                                          },                                                   
                                  '0x00000052':{
                                          'thumb': aw_local_theme_base_path + 'play/thumb.jpg',
                                          'bkg': aw_local_theme_base_path + 'play/bkg.jpg',
                                          'text': 'Outdoor sports',
                                          'name': 'Outdoor sports'
                                          },                                         
                                  '0x00000053':{
                                          'thumb': aw_local_theme_base_path + 'rose/thumb.jpg',
                                          'bkg': aw_local_theme_base_path + 'rose/bkg.jpg',
                                          'text': 'Rose Bloom',
                                          'name': 'Roses'
                                          },
                                  '0x00000054':{
                                          'thumb': aw_local_theme_base_path + 'running/thumb.jpg',
                                          'bkg': aw_local_theme_base_path + 'running/bkg.jpg',
                                          'text': 'Running',
                                          'name': 'Running'
                                          },
                                  '0x00000055':{
                                          'thumb': aw_local_theme_base_path + 'school/thumb.jpg',
                                          'bkg': aw_local_theme_base_path + 'school/bkg.jpg',
                                          'text': 'School and Education',
                                          'name': 'Schools'
                                          },
                                  '0x00000056':{
                                          'thumb': aw_local_theme_base_path + 'silks/thumb.jpg',
                                          'bkg': aw_local_theme_base_path + 'silks/bkg.jpg',
                                          'text': 'Silk thread',
                                          'name': 'Silks'
                                          },                                          
                                  '0x00000057':{
                                          'thumb': aw_local_theme_base_path + 'soccer/thumb.jpg',
                                          'bkg': aw_local_theme_base_path + 'soccer/bkg.jpg',
                                          'text': 'Soccer',
                                          'name': 'Soccer'
                                          },
                                  '0x00000058':{
                                          'thumb': aw_local_theme_base_path + 'starvation/thumb.jpg',
                                          'bkg': aw_local_theme_base_path + 'starvation/bkg.jpg',
                                          'text': 'Starvation and hunger',
                                          'name': 'Starvation'
                                          },
                                  '0x00000059':{
                                          'thumb': aw_local_theme_base_path + 'stevejobs/thumb.jpg',
                                          'bkg': aw_local_theme_base_path + 'stevejobs/bkg.jpg',
                                          'text': 'RiP Steve Jobs',
                                          'name': 'Steve Jobs'
                                          },
                                  '0x00000060':{
                                          'thumb': aw_local_theme_base_path + 'stories/thumb.jpg',
                                          'bkg': aw_local_theme_base_path + 'stories/bkg.jpg',
                                          'text': 'Stories',
                                          'name': 'Stories'
                                          },
                                  '0x00000061':{
                                          'thumb': aw_local_theme_base_path + 'transformers/thumb.jpg',
                                          'bkg': aw_local_theme_base_path + 'transformers/bkg.jpg',
                                          'text': 'Transformers',
                                          'name': 'Transformers'
                                          },                                         
                                  '0x00000062':{
                                          'thumb': aw_local_theme_base_path + 'violin/thumb.jpg',
                                          'bkg': aw_local_theme_base_path + 'violin/bkg.jpg',
                                          'text': 'Violin',
                                          'name': 'Violin'
                                          },             
                                  '0x00000063':{
                                          'thumb': aw_local_theme_base_path + 'war/thumb.jpg',
                                          'bkg': aw_local_theme_base_path + 'war/bkg.jpg',
                                          'text': 'Wars',
                                          'name': 'Wars'
                                          },             
                                  '0x00000064':{
                                          'thumb': aw_local_theme_base_path + 'wedding/thumb.jpg',
                                          'bkg': aw_local_theme_base_path + 'wedding/bkg.jpg',
                                          'text': 'Wedlock',
                                          'name': 'Wedding'
                                          },
                                  '0x00000065':{
                                          'thumb': aw_local_theme_base_path + 'winter/thumb.jpg',
                                          'bkg': aw_local_theme_base_path + 'winter/bkg.jpg',
                                          'text': 'Snowy winter',
                                          'name': 'Winter'
                                          },                                          
                                  '0x00000066':{
                                          'thumb': aw_local_theme_base_path + 'world/thumb.jpg',
                                          'bkg': aw_local_theme_base_path + 'world/bkg.jpg',
                                          'text': 'World Politics',
                                          'name': 'World'
                                         },                                                                                                                   '0x00000067':{
                                          'thumb': aw_local_theme_base_path + 'brands/thumb.jpg',
                                          'bkg': aw_local_theme_base_path + 'brands/bkg.jpg',
                                          'text': 'Brands to buy',
                                          'name': 'Brands'
                                          },                 
                                '0xffffff00':  {
                                          'thumb': aw_local_theme_base_path + 'default/thumb.jpg',
                                          'bkg': aw_local_theme_base_path + 'default/bkg.jpg',
                                          'text': 'Default theme',
                                          'name': 'Default'
                                            }
                              };

