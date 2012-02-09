module SocialFetch
  module Services
    class Twitter
      class << self
        include TextFormatter
        DATA_ARRAY =
        [
          "@ActwittyTweets All the best for the demo.",
          "@ActwittyTweets All the best",
          "@act_witty All the best",
          "Welcome to India: http://t.co/36N8dLSl So my Nation is poor, heavily over crowded, mismanaged and now imposing harsh laws.",
          "testing twitter",
          "test image http://t.co/VW83UvRD",
          "how to add geo location",
          "testing geo locaiton",
          "The new recruiting ecosystem http://t.co/F8sh58Q6",
          "Facebook asks: What's on your mind? Twitter asks: What's happening? Foursquare asks: Where are you? The Web is a worried girlfriend.",
          "Paul Grahams startup mistakes a worth read http://t.co/5BKuYB6b",
          "@alok78 I am game for it. Did another 4.5 km today :-)",
          "Meme Machine: Top 5 Viral Hits of the Week http://t.co/6BGUPlMf via @mashentertain @mashable",
          "#running did a 10K run good start to a sunday.",
          "RT @alok78: RT @nytimes: Hudson River Park, After Early Success, Faces New Challenges http://t.co/32xQzEPI",
          "#running did close to 6km this morning, a lot of fun. Bangalore is reasonably early riser :-)",
          "#running few rounds  of kaikondanahalli lake (2.2 km periphery) before day break. Dusty track, morning dew, chirpy birds. Life's good.",
          "Europe Weighs a Tough Law on Online Privacy and User Data: http://t.co/DQ22T0vT",
          "never seen India this hopeless in cricket. Another innings defeat on cards",
          "Ready or Not, Your Facebook Profile Is About to Get the Timeline Design http://t.co/4fqpRplr via @Techland",
          "I unlocked the The Simpsons sticker on @GetGlue! http://t.co/FX83BTab",
          "Early Facebook App Causes Is Being Reborn As A Polished Web Site For&nbsp;Good http://t.co/CbAgPkaO via @techcrunch",
          "Why Kodaks bankruptcy should scare Nokia http://t.co/2tgh0r5G",
          "RT @adamcoomes: Turntable For Video Chill Turns Into Pinterest For Video, Sees 10 Sign Ups A Minute http://t.co/5RFusSYc",
          "Good numbers to checkout, 250 million tweets a day (Oct 2011) ... http://t.co/FK6GMcrh",
          "China Has 500 Million Web Users, Half of Them Are Microbloggers http://t.co/gfwDdwtO via @mashable",
          "Orkut loses last ground, With over 36 million visitors, Facebook finally overtakes Orkut in Brazil http://t.co/tUos31TL via @TNWfacebook",
          "youtube, squrl, fanhattan and now chill as well. Social video and recommendation is getting more and more http://t.co/V5tPZUkI",
          "You Are What You Like (And Not What Your Friends Like) On Facebook [STUDY] by @CopeWrites http://t.co/wOzYVc9t via @RWW",
          "@mayanks lets see",
          "interesting chain http://t.co/WZuoeqWp (though a little old",
          "Awesome moder day pickup line:",
          "Hey I've seen ya somewhere before...on some social network or something.",
          "@alistairdsouza this time you can :D",
          "Who loses in the war between Google and Twitter? Users http://t.co/IWoWNGIX",
          "@alok78 Social Entertainment Network GetGlue Raises $12 Million In New Financing  http://t.co/tyI5vdNA http://t.co/PL7RuojS",
          "@alok78 http://t.co/L7bqBorm",
          "@alok78 GetGlue Hits 2 Million Users and Rolls Out New Guide Page -",
          "@alistairdsouza http://t.co/XdaxEWQ2",
          "@ankita_86 http://t.co/hGoCROE6 The 12 best online graduate degree programs",
          "@ankita_86 The 12 best online graduate degree programs",
          "@deliaball2 thanks but no thanks. Please do not spam.",
          "@alistairdsouza welcome again and again, u can always make us feel lucky by paying :D hahaha",
          "The great Frank Sinatra.",
          "Only lucky few in life will sing this at the end.",
          "http://t.co/geZ2P0BC",
          "Google+ users in India to get free Wi-Fi access to the social network http://t.co/eVavoGFX via @TNWgoogle",
          "MySpace + TV = the next step in television and entertainment, claims Justin Timberlake http://t.co/4htCLOSx via @Techland",
          "@ksrikrishna thats some travel plan",
          "Reddit Founder, DNS Hacker And Other SOPA Critics Will Address Congress In Hearing - Forbes http://t.co/W3Ra1Rna",
          "Apple Products vs. Apple the Fruit (Infographic) : Discovery Channel http://t.co/iguVYjLi",
          "Twitter is huge in Japan  bigger than Facebook, actually  VentureBeat: http://t.co/PCDXZ6H4 via @AddThis",
          "Personal branding, profiling and how important it is: http://t.co/sSjFBZDo via @fastcompany",
          "Bad water taking down people at IIM and Billekahalli. Me a victim :-(",
          "Catalyst90 makes 2012 social media marketing predictions - http://t.co/V3xeGvR8 http://t.co/V3xeGvR8",
          "RT @aparanjape: Massive milk adulteration detected in samples across most major states: http://t.co/0i1tpUez",
          "The Art Of Film Title Design Throughout Cinema History http://t.co/AuA6LsKk via @smashingmag",
          "Iran Mounts New Web Crackdown http://t.co/ZeKYUKSU via @WSJ",
          "@alok78 see ur Samsung expects record profits: Patent wars barely dented sales http://t.co/478ODj8p",
          "Facebook Business Cards Are Here: 200,000 Users Get Free Bundles http://t.co/tVj8eLDF via @mashable",
          "Google Punishes Itself For Breaking Its Own Rules http://t.co/FEdkKkU6 via @huffingtonpost",
          "@AtulChitnis so damn right. I cycle to work and thats the reason I chose it as my commute. (In bangalore)",
          "What 2012 holds for Facebook http://t.co/BtLWbczs via @TNWfacebook",
          "Details Matter http://t.co/nj1WmbmN via @techcrunch",
          "Copying Y Combinator &#8211; WHY and HOW:  http://t.co/eIeupJXe (@jedc)",
          "@BenegalSachi  hello this is sudhanshu",
          "A must read for incubators and people looking for incubators. incubators are a ghetto http://t.co/e4tQqIZB via @wordpressdotcom",
          "Why Twitters verified account failure matters http://t.co/Ewe0SWkl",
          "Inbound Marketing vs. Outbound Marketing http://t.co/B8IbBX3X via @HubSpot",
          "BBC News - Could hypersonic flight become a reality? http://t.co/gLJ0S5fY",
          "I wonder suddenly cyclone is named Thane, I reckon reading cyclones are named after feminine names. Is Thane one such name.",
          "More on cloud, 10 cloud startups to watch in 2012 http://t.co/g0RqUB5n",
          "Klout, Kred, Peer Index: The Year of Online Influence | Business 2 Community http://t.co/Q9Wblu95 via @B2Community",
          "Delete anti-religious posts: Court to networking sites - Hindustan Times http://t.co/Jylws2fA",
          "Found this interesting, The Ultimate Glossary: 120 Social Media Marketing Terms Explained http://t.co/mdfjJ737",
          "Why India is Riskier than China - Stephen S. Roach - Project Syndicate http://t.co/NZuXQWYW",
          "True Colors Infographic - Breakdown of Color Preferences by Gender http://t.co/ZSEXWNhn",
          "@alistairdsouza sure",
          "Microsoft so.cl being marketted as social network for students http://t.co/W4f3xqkX  Is it better late then never ?",
          "Interesting way to see 2011 curiositycounts: The team at http://t.co/7TLzur5i do... http://t.co/OlL2PMZ5",
          "Entrepreneurs: Is Your Idea Ready for Prime Time? Its so important not to hurry http://t.co/S5gm4bu6",
          "Facebook No Longer Supports IE7 http://t.co/0WHJ7oUd People using this to avoid Timeline.",
          "An Introduction To Object Oriented CSS (OOCSS) - Smashing Coding http://t.co/fELk0nbh",
          "Great numbers to refer Nielsens Tops of 2011: Digital | Nielsen Wire http://t.co/1XNgRKNx",
          "RT @DNA: Google beats Facebook as 2011 s most visited site in US http://t.co/aD5aguUh",
          "Duh !!! Get you 2000 TWITTER followers in less then 24 hours with no need for password for $20 : TwitterFast - Gigbucks http://t.co/bcw9Rppr",
          "The Very Best of YouTube in 2011 [VIDEOS] http://t.co/hd8cXyq5",
          "Incredible Things That Happen Every 60 Seconds On The Internet http://t.co/8KZA0a2S",
          "Traffic for Google+ on the Rise Along with User Count (Gabe Donnini / Chitika Insights) http://t.co/duRiqEtm",
          "Indian Parliament proved Anna right - http://t.co/mtn4D70R News http://t.co/BsRpAFgj",
          "4 Nearly Guaranteed 2012 Social Media Predictions | Social Media Marketing | Social Media Consulting - Convince & Conv http://t.co/KQtVZiQD",
          "4 Nearly Guaranteed 2012 Social Media Predictions | Social Media Marketing | Social Media Consulting - Co http://t.co/KQtVZiQD via @jaybaer",
          "Bangalore is so good after an early morning rain.Today's cycling will be a pleasure with lots of fresh air and less traffic coz of holidays.",
          "New Comment On 10 Biggest Social Business Stories Of 2011:  http://t.co/6t7QRoQH",
          "Some air of freshness ActWitty moving to NSRCEL (IIM Bangalore) from 2nd of January.",
          "The App Internet in 2012: Defining the death of the web http://t.co/yYmXUNYc",
          "Social Profiles: It's Quality, Not Quantity http://t.co/gYeKSmu6 via @sengineland",
          "Here's How People Look at Your Facebook Profile -- Literally http://t.co/bvuhUuDN via @mashable",
          "How Many Social Profiles Do You Need? http://t.co/3FdYeJ4X via @DeniseWakeman",
          "Facebook: A Year in Review http://t.co/0ob7wBTX via @InsideNetwork",
          "A Few Tips For Developers On How To Get Hired By A Startup http://t.co/XQIhQICu via @techcrunch",
          "Ben Chestnut Mailchimp counder talking at CreativeMornings. Good talk for creative people http://t.co/i3RJ4JzB",
          "Facebook rejiggers platform to increase game usage | VentureBeat: http://t.co/XN60Gw9N via @AddThis",
          "Good one, best data visualization project of 2011 http://t.co/2GjIdIV4",
          "Butt recognizing cars, REALLY http://t.co/zii8FKiq",
          "Bad news point n shoot http://t.co/ICvGM6H6",
          "Good move against SOPA http://t.co/J9no24v0",
          "Google pays Moziall 300 Mil $ for search deal. http://t.co/QQKoH1uD",
          "Ads Are Coming To Your Facebook News Feed Next Month http://t.co/YjCU29ws via @sai",
          "Chart on minutes spent on social networking sites. Facebook is the winner",
          "http://t.co/A5F0Rtjs #socialmedia",
          "#running a week of running 6.5 kms a day (sadly only on tread mill). But still happy to catch speed.",
          "Colors and how they play",
          "http://t.co/Vr2cTYkW",
          "Interesting color themes",
          "http://t.co/Mg6ttwbN",
          "http://t.co/wOF6mR1S",
          "Kickass blog on infographic designing http://t.co/HINNYRfR",
          "Earth to Kapil Sibal: Sonia Gandhi is not God http://t.co/KEJdxJ2K via @firstpostin",
          "@SrBachchan Sir is this good or is it devastatingly bad ?",
          "RT @moneycontrolcom Can Amazon conquer India? http://t.co/ZE1ppK2v",
          "#cotpi #post Infosys, TCS, or Wipro?: http://t.co/YnedIQ4U",
          "No disrespect intended.",
          "Nokia Kinetic device prototypes show bendable phones aren't far away http://t.co/1gpTtZdC",
          "Spotted a beautiful gray owl on a wall at our apartment. We surely can save these birds by making sure there is green cover.",
          "Ra.One ads stopped (good) and movie disappoints (doesn't matter) http://t.co/fZnQEtDE #movie",
          "'Steve Jobs': 10 Biography Excerpts That Portray a Passionate, Intense Visionary http://t.co/0tB5cyFC via @TIMENewsFeed",
          "Check this video out -- Spherical Flying Machine Developed by Japan Ministry Of Defense #DigInfo http://t.co/wQcDOxzq via @youtube",
          "http://t.co/tAKQOhQL Very nice presentation of what they learnt from 5 million books.",
          "The $35 Tablet: Will India's 'iPad' Sell Stateside? http://t.co/fecZwyCA via @TIME",
          "Colleges That Do The Web Well - Forbes http://t.co/ItSrD6fV #socialmedia",
          "Check this video out -- 'Trick Printing' With CMYK And RGB Ink  #DigInfo http://t.co/vz5lTxCU via @youtube",
          "Android app downloads surpass iOS http://t.co/dp5puYFF via @smh",
          "Kindle Fire Predicted to Sell 5M at Launch, May Outsell iPad 2? http://t.co/sDkVF1Gg via @Techland",
          "jQuery's New Project Will Fight for Every Developer Lost in the Web Standards Pit of Despair by @marshallk http://t.co/KNv1CpFn via @RWW",
          "Why money is driving the virtual buying boom (and not for the obvious reason) | http://t.co/YVAGSWIz http://t.co/BD0mcc9b",
          "Apple analyst says the 50-inch  iTV is coming soon | VentureBeat http://t.co/ZCxdifRx via @venturebeat",
          "Google Is Mulling a Bid for Yahoo - Technology - The Atlantic Wire http://t.co/xCTlhkzC",
          "World power swings back to America - Telegraph http://t.co/KQ1UHzSO via @Telegraph",
          "Google Circles/Facebook Lists an insight to How To http://t.co/xGWDULPa",
          "Microsoft collects license fees on 50% of Android devices, tells Google to wake up http://t.co/iZoHJDg0 via @arstechnica",
          "Omni touch, impressive technology. Looks reasonably stable as well.",
          "http://t.co/bEAMohUd",
          "Google Bookcase http://t.co/dvx2wHsa",
          "ARM A7-A15 MPC (big.LITTLE) interesting read on battery life saving http://t.co/By0NpUV3",
          "New gmail preview http://t.co/lpUbfEky",
          "WOW Camera: http://t.co/WufB5B3R",
          "Brand Table concept revolutionizes fast food, NFC still won't make it good for you (video) http://t.co/v3HUi1hW via @engadget",
          "Toshiba high resolution LCD http://t.co/WMNWrGtS",
          "People Are Awesome 2011 http://t.co/h3jiANal via @koreus",
          "New Studies Show Social Media Can Change Your Brain! http://t.co/K2SXcCA3 via @bangstyletweets",
          "Bit.ly announces beta launch of search platform, reputation monitoring http://t.co/YYOnqtgs",
          "RT @jhunjhunwala That Kejriwal chappal thrower will never even wear a chappal again let alone throw one after watching Arnab's Rage tonight.",
          "Space travel: Returning from the moon | The Economist http://t.co/3X8F0blF via @theeconomist",
          "The ultimate startup lesson: knowing what matters http://t.co/rxSnqPtN",
          "Awesome but Creepy Japanese Product of the Day: Realistic 3-D Face Replicas | Popular Science http://t.co/yDLIhVbB",
          "RT @ZDNet Apple wins Samsung Galaxy tablet ban in Australia http://t.co/0BslwMzl",
          "Check out this SlideShare presentation : What Android Can Learn from Steve Jobs http://t.co/IRSP9Abq",
          "BBC News - Samsung Nexus Prime smartphone delay is 'Jobs tribute' http://t.co/Hnz8L4HW",
        ]

       #INPUT => {:user_id => 123, :uid => "234", :access_token => "gdjjsagjgds.."}
       #OUTPUT => array of messages from twitter in descending order of creation time
        def pull_data(params)

          Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [TWITTER] [pull_data] entering  #{params.inspect}")

          h = {:word => "stories",:category_id => "stories", :enrich => true,
                    :source_name => "twitter", :status_at_source => 2, :source_uid => "2367263",}

          id = 100000
          time =  DateTime.new(2012,1,31)

          latest_msg_timestamp = params[:latest_msg_timestamp]

          if latest_msg_timestamp >= time
            return []
          end

          index = 0
          array = []

          DATA_ARRAY.each do |attr|
            hash = {}
            hash = hash.merge(h)
            index = index + 1
            hash[:source_object_id] = (id + index).to_s
            hash[:created_at] = time - (index*60)
            hash[:text] = attr
            array << hash
            break if index == AppConstants.maximum_import_first_time
          end
          Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [TWITTER] [pull_data] leaving  #{params.inspect}")
          array
        rescue => e
          Rails.logger.error("[LIB] [SOCIAL_FETCH] [FETCHER] [TWITTER] [pull_data] **** RESCUE **** #{e.message} for #{params.inspect}")
        end

        def data_adaptor(params)
          Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [TWITTER] [data_adaptor] entering  #{params.inspect}")

          hash = {}
          links = []

          links = get_documents(params[:blob][:text]) if !params[:blob][:text].blank?

          hash[:post] = params[:blob]
          hash[:post][:links] = links if !links.blank?

          Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [TWITTER] [data_adaptor] leaving  #{params.inspect} for #{links}")
          hash
        rescue => e
          Rails.logger.error("[LIB] [SOCIAL_FETCH] [FETCHER] [TWITTER] [data_adaptor] **** RESCUE **** #{e.message} for #{params.inspect}")
          {}
        end
      end
    end
  end
end