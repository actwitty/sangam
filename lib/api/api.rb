require 'streams/streams'
require 'summaries/summaries'
require 'analytics/analytics'
require 'services/services'
require "search/search"
require "entities/entities"

require 'helpers/plan_table_query/plan_table_query'
require 'helpers/format_object/format_object'

require 'test/test_data'
require 'test/test_services'
require 'test/test_streams'
require 'test/test_summaries'

module Api

################################################ STREAMS ################################################
      #COMMENT - Only returns public post which has summary
      #INPUT
      #
      #:user_id => 123                                  #QUERY PART STARTS
      #
      #:summary_id => 123,
      #
      #:source_name => "actwitty" OR "twitter" OR "facebook"
      #
      #:since => 1994-11-05T13:15:30Z ( ISO 8601)
      #
      #:from => 1992-11-05T13:15:30Z ( ISO 8601)        #QUERY PART ENDS
      #
      #
      #:limit => 200                                    #LIMIT RESULT OF QUERY
      #
      #:filter => {                                     #FILTERS ON QUERY
      #              :document => {
      #                             :all => true
      #                                                     OR
      #                             :type => "image" OR  "audio" OR "video" OR "link" OR "document"
      #                                                     OR
      #                             :id => 123
      #                           }
      #                           OR
      #              :location => {
      #                              :all => true
      #                                                     OR
      #                              :id => 124
      #                           }
      #                           OR
      #              :entity => {
      #                              :all => true
      #                                                     OR
      #                              :id => 125
      #                         }
      #
      #           }
      #
      #OUTPUT
      #{
      # :stream =>
      # [
      #
      #   {
      #
      #     :post=>
      #     {
      #       :id=>10, :user=>{:id=>5, :full_name=>"lemony1 lime1", :photo=>"images/id_1"},
      #       :time=>Sat, 30 Jul 2011 21:41:56 UTC +00:00,
      #       :text=> Had a great pizza at pizza hut #food #italian http://pizzahut.com/123/234,
      #       :summary_id=>9,
      #       :source_name=>"twitter",
      #       :source_object_id => "12233",
      #       :source_object_type => "post",
      #       :category_data => {:id => "food",:name => "food and drink",:type => "/food", :hierarchy => "/", :default_channel => "food"   }
      #     },
      #
      #     :location=>
      #     {
      #         :id => 223
      #
      #         :lat=>#<BigDecimal:9de78e0,'0.2345E2',18(18)>, :long=>#<BigDecimal:9de77c8,'0.4545E2',18(18)>, :name=>"marathalli", :id=>8
      #   ,     :city => "bangalore", :country => "india", :region => "karnataka",
      #         :source_object_id => "123344",
      #
      #         :source_name=>"twitter",
      #         :source_msg_id =>  "12233", [OBJECT ID OF POST]
      #     },
      #
      #     #COMMENT => Tag type check in constants,yml #TAG TYPE
      #     :tags =>
      #     {
      #       :count => 2,
      #       :array => [
      #                     {:id => 1, :name => "food",    :source_name => "twitter", :source_msg_id =>  "12233"},
      #                     {:id => 3, :name => "italian", :source_name => "twitter", :source_msg_id =>  "12233"}
      #                 ]
      #     }
      #
      #    :documents=>
      #    {
      #       :count=>1,
      #       :array=>[
      #                   {
      #                       :id=>729,
      #                       :source_name=>"twitter",
      #                       :type=>"link",
      #                       :source_msg_id => "12233", [OBJECT ID OF POST]
      #                       :source_object_id => nil,        #id of doc object on twitter
      #
      #                       :url=>"http://pizzahut.com/123/234",
      #                       :url_description=>"Cheese crest pizzas at pizza hut",
      #                       :url_category=>"food", :url_title=>"pizza hut", :url_image=>nil, :url_provider=>"pizzahut.com"}
      #                 },
      #
      #           ]
      #    },
      #
      #    :entities=>
      #    {
      #       :count=>1,
      #       :array=>[
      #
      #                   {
      #                       :id => 123
      #
      #                       :name => Pizza
      #                       :image => ""http://freebase.com/pizza.jpg",
      #                       :description => ""http://freebase.com/text.html",

      #                       :source_name => "twitter"
      #                       :source_msg_id =>  "12233", [OBJECT ID OF POST]
      #                   }
      #           ]
      #    },
      #  },# single post hash
      #  :post=>
      #     {
      #       #EXAMPLE TEXT =  Google putting new privacy policy  http://facebook.photo.com/123/234 #google #privacy,
      #       #NOT INCLUDED IN RESPONSE OF PRIVATE SERVICES LIKE FACEBOOK
      #
      #       :id=>11, :user=>{:id=>5, :full_name=>"lemony1 lime1", :photo=>"images/id_1"},
      #       :time=>Sat, 30 Jul 2011 21:41:56 UTC +00:00,
      #       :summary_id=>10,
      #       :source_name=>"facebook",
      #       :source_object_id => "12233",
      #       :source_object_type => "like",
      #       :category_data => {:id => "technology",:name => "technology",:type => "/technology", :hierarchy => "/", :default_channel => "technology"   }
      #     },
      #
      #     :location=>
      #     {
      #       :id => 234,
      #       :source_name => "facebook"
      #       :source_msg_id =>  "12234", [OBJECT ID OF POST]
      #     },
      #
      #     #COMMENT => Tag type check in constants,yml #TAG TYPE
      #     :tags =>
      #     {
      #       :count => 2,
      #       :array => [
      #                     { :id => 345, :source_name => "facebook", :source_msg_id =>  "12234"},
      #                     { :id => 456, :source_name => "facebook", :source_msg_id =>  "12234"}
      #                 ]
      #     }
      #
      #    :documents=>
      #    {
      #       :count=>1,
      #       :array=>[
      #                   {
      #                       :id=>730,
      #                       :type=>"photo",
      #                       :source_name=>"facebook",
      #                       :source_msg_id => "12234", [OBJECT ID OF POST]
      #                       :source_object_id => 234,  #id of doc object on facebook.. It will be only present for
      #                                                  #uploaded objects at source. Exemplary here
      #
      #                 },
      #
      #           ]
      #    },
      #
      #    :entities=>
      #    {
      #       :count=>1,
      #       :array=>[
      #
      #                   {
      #                       :id => 124
      #                       :source_name =>"facebook",
      #                       :source_msg_id =>  "12234", [OBJECT ID OF POST]
      #                   }
      #           ]
      #    },
      #  }# single post hash
      # ......
      # ]#stream array
      #}#OUTPUT HASH


      def get_stream(params)
         params[:current_user_id] = self.id
         stream = ::Api::Streams.get_stream(params)
         stream
      end





################################################ SUMMARIES ################################################
      #INPUT
      #user_id => 123
      #
      #OUTPUT
      #[
      # {
      #     :id=>24,
      #
      #     :word=>{:word_id=>44, :name=>"eating"},
      #
      #     :user=>{:id=>39, :full_name=>"lemony3 lime3", :photo=>"images/id_3"}
      #
      #     :analytics_snapshot => {
      #                               :posts =>     {
      #                                                :total => 2,
      #                                                :facebook => 1,
      #                                                :twitter => 1
      #                                             },
      #                            :documents =>    {
      #                                                :total => 6,
      #                                                :image => {:total => 2, :facebook => 1, :twitter => 1},
      #                                                :video => {:total => 2, :facebook => 1, :twitter => 1},
      #                                                :audio => {:total => 0},
      #                                                :document => {:total => 0},
      #                                                :link => {:total => 2, :facebook => 2}
      #
      #                                             },
      #                            :locations =>    {
      #                                                 :total => 3,
      #                                                 :facebook => 2,
      #                                                 :twitter => 1
      #                                             },
      #                            :entities =>     {
      #                                                 :total => 2,
      #                                                 :facebook => 1,
      #                                                 :twitter => 1
      #                                             }
      #                           }
      #     :category_id => "food"
      #     :category_type => "/food""
      #  },
      #
      #  {...},
      #  {...}
      #]OUTPUT ARRAY

      def get_summary(params)
        summaries = ::Api::Summaries.get_summary(params)
        summaries
      end


      #INPUT => {
      #           :user_id => 123 [MANDATORY]
      #           :summary_ids => [1,2, 3, 4..] [MANDATORY] 50 MAXIMUM - AppConstants.max_number_of_entities
      #         }
      #OUTPUT
      #[
      # {
      #     :id=>24,
      #
      #     :word=>{:word_id=>44, :name=>"eating"},
      #
      #     :user=>{:id=>39, :full_name=>"lemony3 lime3", :photo=>"images/id_3"}
      #
      #     :analytics_snapshot => {
      #                               :posts =>     {
      #                                                :total => 2,
      #                                                :facebook => 1,
      #                                                :twitter => 1
      #                                             },
      #                            :documents =>    {
      #                                                :total => 6,
      #                                                :image => {:total => 2, :facebook => 1, :twitter => 1},
      #                                                :video => {:total => 2, :facebook => 1, :twitter => 1},
      #                                                :audio => {:total => 0},
      #                                                :document => {:total => 0},
      #                                                :link => {:total => 2, :facebook => 2}
      #
      #                                             },
      #                            :locations =>    {
      #                                                 :total => 3,
      #                                                 :facebook => 2,
      #                                                 :twitter => 1
      #                                             },
      #                            :entities =>     {
      #                                                 :total => 2,
      #                                                 :facebook => 1,
      #                                                 :twitter => 1
      #                                             }
      #                           }
      #     :category_id => "food"
      #     :category_type => "/food""
      #  },
      #
      #  {...},
      #  {...}
      #]OUTPUT ARRAY

      def get_summary_by_id(params)
        summaries = ::Api::Summaries.get_summary_by_id(params)
        summaries
      end



################################################ SERVICES ################################################

      #ASSUMPTION => Authorization with respective service is done
      #
      #INPUT {
      #         :user_id => 123,
      #         :provider => "facebook"/"twitter" [MANDATORY]
      #         :uid => 123 [MANDATORY]
      #
      #      }
      #OUTPUT => true [ON SUCCESS], false [ON FAILURE]

      def enable_service(params)
        params[:current_user_id] = self.id
        result = ::Api::Services.enable_service(params)
        result
      end



      #INPUT {
      #         :user_id => 123,
      #         :provider => "facebook"/"twitter" [MANDATORY]
      #         :uid => 123 [MANDATORY]
      #
      #      }
      #OUTPUT => true [ON SUCCESS], false [ON FAILURE]

      def disable_service(params)
        params[:current_user_id] = self.id
        result = ::Api::Services.disable_service(params)
        result
      end

      # INPUT {
      #         :user_id => 123
      #       },
      # OUTPUT
      #       [
      #          {:user_id => 123, :provider => "facebook" ,:uid => "2321321323" :status => 2 [ 1 -4 constants.yml data_sysnc_*]},
      #          {...},
      #          {...}
      #       ]OUTPUT ARRAY

      def get_services(params)
        services = ::Api::Services.get_services(params)
        services
      end


      #INPUT => {:user_id => 123, :provider => "facebook/twitter"}
      def mock_enable_service(params)

        Rails.logger.info("[LIB] [API] [MOCK_ENABLE_SERVICES] Entering #{params.inspect}")

        h = {}

        services = ["facebook", "twitter"]

        services.each do |service|
          auth = Authentication.where(:user_id => params[:user_id]).first

          if auth.blank?
            Rails.logger.info("[LIB] [API] [MOCK_ENABLE_SERVICES] Not Authorised #{params.inspect} #{auth.inspect}")
            next
          end
          h = {:user_id => params[:user_id], :uid => auth.uid, :provider => service }

          result = enable_service(h)

          if result == false
            SocialAggregator.pick_social_aggregation_request({:user_id => h[:user_id], :uid => h[:uid], :provider => h[:provider] })
          end

        end

        Rails.logger.info("[LIB] [API] [MOCK_ENABLE_SERVICES] Leaving #{params.inspect}")


      rescue => e
        Rails.logger.error("[LIB] [API] [MOCK_ENABLE_SERVICES] **** RESCUE **** #{e.message} for #{params.inspect}")
        false
      end
################################################ SEARCH ################################################

      #INPUT => {
      #            :name => "sach"
      #         }
      #
      #OUTPUT => [
      #           {:id => 123, :image => "http://xyz.com", :name => "sudhanshu saxena" },
      #           {..}
      #         ]OUTPUT ARRAY

      def search_user(params)
        users = ::Api::Search.search_user(params)
        users
      end


################################################ ENTITIES ################################################
      #INPUT
      #       {
      #         user_id => 123
      #       }
      #
      #OUTPUT  : [
      #
      #                   {
      #                       :count => 3
      #                       :id => 123
      #
      #                       :name => Pizza
      #                       :image => ""http://freebase.com/pizza.jpg",
      #                       :description => ""http://freebase.com/text.html",
      #
      #                       :source_name => "twitter"
      #                       :source_msg_id =>  "12233", [OBJECT ID OF POST]
      #                   },
      #                   {
      #                       :id => 124
      #                       :source_name =>"facebook",
      #                       :source_msg_id =>  "12234", [OBJECT ID OF POST]
      #                   }
      #           ]OUTPUT ARRAY
      def get_entities(params)
        entities = ::Api::Entities.get_entities(params)
        entities
      end


      #INPUT => {
      #           :user_id => 123    [MANDATORY]
      #           :entity_ids => [1,2, 3, 4..] [MANDATORY] 50 MAXIMUM - AppConstants.max_number_of_entities
      #         }
      #OUTPUT  : [
      #
      #                   {
      #                       :count => 3
      #                       :id => 123
      #
      #                       :name => Pizza
      #                       :image => ""http://freebase.com/pizza.jpg",
      #                       :description => ""http://freebase.com/text.html",
      #
      #                       :source_name => "facebook"  [PRIVATE SOURCE ENTITIES]
      #                       :source_msg_id =>  "12233", [OBJECT ID OF POST]
      #                   },
      #                   {..},
      #                   {..}
      #          ]OUTPUT ARRAY

      def get_entities_verified(params)
        entities = ::Api::Entities.get_entities_verified(params)
        entities
      end
################################################ ANALYTICS ################################################

      #COMMENT - Return the 5 weeks analytics by default. Including current week
      #
      #INPUT => {
      #           :user_id => 123,
      #           :num_of_week => 6 [OPTIONAL], Default 5, AppConstants.analytics_default_number_of_week
      #           :summary_snapshot => true [OPTIONAL return overall summary snapshot till that week]
      #         }
      #
      #OUTPUT => {
      #             #First 4 numbers are year.. next one or two numbers are week in that year - year, 2012,week 5
      #             20125 => {
      #
      #                         :start_date => Sun, 04 Feb 2012 00:00:00 UTC +00:00,
      #                         :end_date => Sat, 11 Feb 2012 00:00:00 UTC +00:00
      #                         :weeks => {
      #                                             :services => {:facebook => 5, :twitter => 2},
      #                                             "sports" => {
      #                                                           :summary_d => 123,
      #                                                           :posts =>     {
      #                                                                           :total => 2,
      #                                                                           :facebook => 1,
      #                                                                           :twitter => 1
      #                                                                         },
      #                                                           :documents => {
      #                                                                           :total => 6,
      #                                                                           :image => {:total => 2, :facebook => 1, :twitter => 1},
      #                                                                           :video => {:total => 2, :facebook => 1, :twitter => 1},
      #                                                                           :audio => {:total => 0},
      #                                                                           :document => {:total => 0},
      #                                                                           :link => {:total => 2, :facebook => 2}
      #                                                                         },
      #                                                           :locations => {
      #                                                                           :total => 3,
      #                                                                           :facebook => 2,
      #                                                                           :twitter => 1
      #                                                                         },
      #                                                           :entities => {
      #                                                                           :total => 2,
      #                                                                           :facebook => 1,
      #                                                                           :twitter => 1
      #                                                                        }
      #                                                        },
      #
      #                                           "technology" => {
      #                                                             :summary_id => 124,
      #                                                             :posts => {...},
      #                                                           }
      #                                       },
      #
      #                        [SUMMARY SNAPSHOT REPRESENTS OVERALL SOCIAL FOOTPRINT FOR A PARTICULAR TOPIC/SUMMARY/INTEREST "
      #                                                           "TILL THIS WEEK"]
      #                       :summary_snapshots => {
      #                                               "sports"  => {
      #                                                              :summary_d => 123,
      #                                                              :posts => {
      #                                                                           :total => 234,
      #                                                                           :facebook => 200,
      #                                                                            :twitter => 34
      #                                                                       },
      #                                                              :documents => {
      #                                                                               :total => 50,
      #                                                                               :image => {:total => 40, :facebook => 30, :twitter => 10},
      #                                                                               :video => {:total => 2, :facebook => 1, :twitter => 1},
      #                                                                               :audio => {:total => 3, :facebook => 3},
      #                                                                               :document => {:total => 3, :facebook => 1, :twitter => 2},
      #                                                                               :link => {:total => 2, :facebook => 2}
      #                                                                            },
      #                                                           :locations => {
      #                                                                           :total => 43,
      #                                                                           :facebook => 21,
      #                                                                           :twitter => 22
      #                                                                         },
      #                                                           :entities => {
      #                                                                           :total => 86,
      #                                                                           :facebook => 41,
      #                                                                           :twitter => 45
      #                                                                          }
      #                                                            }
      #                                              "technology" => {
      #                                                                 :summary_id => 124,
      #                                                                 :posts => {...},
      #                                                             }
      #                                             }
      #                    }
      #         }OUTPUT HASH

      def get_analytics(params)
        analytics = ::Api::Analytics.get_analytics(params)
        analytics
      end

################################################ ACTIVITY ################################################
      #    :author_id => 123
      #
      #    :word =>   activity word or phrase in activity box
      #    :text =>   "hello world"
      #    :location => {
      #                  :lat => 23.6567, :long => 120.3, :name => "sj",
      #                  :city => ""bangalore", :country => "india", :region => "Karnataka"}
      #                                     OR
      #                                     nil
      #                 }
      #
      #    :status => 0 or 1   #0 => saved, 1 => public share, #default => 1
      #
      #    :source_name =>  "actwitty" or "twitter", or "facebook" or "gplus" or "dropbox" or "tumblr" or "posterous",
      #                       or custom email or mobile number #defualt is actwitty
      #
      #    :enrich => true (if want to enrich with entities ELSE false => make this when parent is true -- in our case )
      #
      #    :source_object_id => 123
      #
      #    :status_at_source => AppConstants.status_private_at_source|public_at_source
      #
      #    :source_uid  => "123123213" #UID OF USER AT SOURCE
      #
      #    :links => [
      #                 {
      #                    :source_object_id => "23213123", [FOR UPLOADED IMAGES AT SOURCE]
      #                    :url => "http://timesofindia.com/123.cms",
      #                    :mime => AppConstants.mime_remote_link,
      #                    :provider => "timesofindia.com",
      #                    :description => "Manmohan singh sleeping" [OPTIONAL],
      #                    :title => "indian politics"[OPTIONAL],
      #                    :image_url => "http://timesofindia.com/123.jpg" [OPTIONAL],
      #                    :image_width => 90[OPTIONAL],
      #                    :image_height => 120[OPTIONAL],
      #                    :category_id => "sports" [OPTIONAL if present "should be" Same as summary_category..]
      #                    :canonical_url => "timesofindia.com/123"[long url when url = a short url, OPTIONAL],
      #                    :cache_age => params[:cache_age][OPTIONAL will mostly come from pulled data]
      #                 }
      #             ]
      #   :actions => {
      #                 :likes => 20,
      #                 :comments => 20,
      #                 :shares => 40,
      #                 :retweets => 40,
      #               }
      # }
      def create_activity(params={})

        Rails.logger.info("[LIB] [API] [create_activity] entering ")

        params[:author_id] = self.id

        obj = Activity.create_activity(params)

        if obj.blank?
          Rails.logger.error("[MODEL] [User] [create_activity] [ERROR] returning empty json ")
          return {}
        end

        a = ::Api::Helpers::FormatObject.format_activity({:object => obj})

        Rails.logger.info("[LIB] [API] [create_activity] leaving ")
        a
      end
end