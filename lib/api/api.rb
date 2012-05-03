require 'streams/streams'
require 'summaries/summaries'
require 'analytics/analytics'
require 'services/services'
require "search/search"
require "entities/entities"
require "admin/admin"
require "user_crawl/user_crawl"
require "social_shares/fb_timeline"

require 'helpers/plan_table_query/plan_table_query'
require 'helpers/format_object/format_object'
require 'helpers/format_object/format_analytics/analytics'

require 'helpers/parser/parser'
require "social_shares/fb_timeline"


if Rails.env != "production"
  require 'test/test_data'
  require 'test/test_services'
  require 'test/test_streams'
  require 'test/test_summaries'
end

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
      #:till  => 1992-11-05T13:15:30Z ( ISO 8601)        #QUERY PART ENDS
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
      #                          OR
      #              :source_action => {
      #                                   :all => true
      #                                                   OR
      #                                   :name => "likes" or "comments" or"shares" or "retweets"
      #                               }
      #           }
      #
      #:current_user_id => 123 #user_id for self (calling user)  #Handled internally
      #
      #
      #OUTPUT
      # [
      #
      #   {
      #
      #     :post=>
      #     {
      #       :id=>10, :user=>{:id=>5, :full_name=>"lemony1 lime1", :photo=>"images/id_1"},
      #       :time=>Sat, 30 Jul 2011 21:41:56 UTC +00:00,
      #       :text=> text:Had a great pizza at pizza hut #food #italian http://pizzahut.com/123/234\n user_id:123
      #       :if_yaml => true,
      #       :summary_id=>9,
      #       :source_name=>"twitter",
      #       :source_object_id => "12233",
      #       :source_object_type => "post", #AppConstants.source_object_type_post/like
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
      #
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



      def get_stream(params)
         params[:current_user_id] = self.id
         stream = ::Api::Streams.get_stream(params)
         stream
      end





################################################ SUMMARIES ################################################
      #INPUT =>  {
      #           :user_id => 123
      #           :enabled_services => ["facebook', "twitter"...] #[OPTIONAL] Needed only when analytics of some services needs to blocked.. for privacy
      #          }
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
      #                              :posts => {
      #                                          :counts => {
      #                                                      :total => 95,
      #                                                      :services =>  {
      #                                                                     :facebook => 20, :twitter => 30, :actwitty => 45
      #                                                                    }
      #                                                    }
      #                                      }
      #
      #                              :documents => {
      #                                             :counts => {
      #                                                         :total => 6,
      #                                                         :categories => {
      #                                                                          :image => {
      #                                                                                      :total => 2,
      #                                                                                      :services => {:facebook => 1, :twitter => 1}
      #                                                                                    },
      #                                                                          :video => {
      #                                                                                      :total => 2,
      #                                                                                      :services => {:facebook => 1, :twitter => 1}
      #                                                                                    },
      #                                                                          :audio => {
      #                                                                                      :total => 0,
      #                                                                                      :services => {}
      #                                                                                    },
      #                                                                          :document => {
      #                                                                                        :total => 0,
      #                                                                                        :services => {}
      #                                                                                       },
      #                                                                          :link =>    {
      #                                                                                        :total => 2,
      #                                                                                        :services => {:facebook => 2}
      #                                                                                      }
      #                                                                      }
      #                                                      }
      #                                          },
      #                              :locations => {
      #                                             :counts => {
      #                                                          :total => 95,
      #                                                          :services => {
      #                                                                        :facebook => 20, :twitter => 30, :actwitty => 45
      #                                                                       }
      #                                                        }
      #                                           },
      #                              :entities => {
      #                                             :counts => {
      #                                                          :total => 95,
      #                                                          :services => {
      #                                                                         :facebook => 20, :twitter => 30, :actwitty => 45
      #                                                                       }
      #                                                        }
      #                                          },
      #                              :source_actions  => {
      #                                                   :counts => {
      #                                                               :total => 100,
      #                                                               :actions => {
      #                                                                            :likes => {
      #                                                                                       :total => 50,
      #                                                                                       :services => {:facebook => 20, :twitter => 30}
      #                                                                                      },
      #                                                                           :comments => {
      #                                                                                         :total => 50,
      #                                                                                         :services => {:facebook => 20, :twitter => 30}
      #                                                                                        }
      #                                                                          }
      #                                                              }
      #                                                 },
      #                              :local_actions =>  {
      #                                                  :counts => {
      #                                                              :total => 95,
      #                                                              :actions => {
      #                                                                           :upvote => 20, :recommendations => 30
      #                                                                          }
      #                                                             }
      #                                                }
      #                            }
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
      #           :summary_ids => [1,2, 3, 4..] [MANDATORY]
      #           :enabled_services => ["facebook', "twitter"...] #[OPTIONAL] Needed only when analytics of some services needs to blocked.. for privacy
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



      #INPUT => {
      #           :user_id => 123,
      #           :summary_id => 123,
      #         }
      #OUTPUT => true / false

      def up_vote_summary(params)
        params[:current_user_id] = self.id
        status = ::Api::Summaries.up_vote_summary(params)
        status
      end




      #INPUT => {
      #           :user_id => 123,
      #           :summary_id => 123,
      #         }
      #OUTPUT => true / false

      def down_vote_summary(params)
        params[:current_user_id] = self.id
        status = ::Api::Summaries.down_vote_summary(params)
        status
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



      #COMMENT =>  Only delete service data and does not delete authentication records as without authentication
      #            there is no meaning of user being there
      #INPUT {
      #         :user_id => 123,
      #         :provider => "facebook"/"twitter" [MANDATORY]
      #         :uid => 123 [MANDATORY]
      #         :auth_key => "hdkjshfkjsdhkhfksdfsdf"[OPTIONAL == It is only used for Admin call(invite controller) as a mode for authorization..]
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


      # INPUT {
      #         :user_id => 123
      #       },
      # OUTPUT
      #  data_sync_new:                            1   #can be deleted in this state
      #                       OR
      #  data_sync_active:                         2
      #                       OR
      #  data_sync_done:                           3   #can be deleted in this state

      def get_status(params)
        status = ::Api::Services.get_status(params)
        status
      end


      #ASSUMPTION => Service is already enabled
      #
      #INPUT {
      #         :current_user_id => 123
      #         :user_id => 123,
      #         :provider => "facebook"/"twitter" [MANDATORY]
      #         :uid => 123 [MANDATORY]
      #
      #      }
      #OUTPUT => true [ON SUCCESS], false [ON FAILURE]
      def inject_job(params)
        params[:current_user_id] = self.id
        result = ::Api::Services.inject_job(params)
        result
      end


      #INPUT => {:user_id => 123, :provider => "facebook/twitter"}
      def mock_enable_service(params)

        Rails.logger.info("[LIB] [API] [MOCK_ENABLE_SERVICES] Entering #{params.inspect}")

        h = {}

        services = ["facebook","twitter"]

        services.each do |service|

           #supports single id per user
           auth = Authentication.where(:user_id => params[:user_id], :provider => service).first
           if auth.blank?
             Rails.logger.info("[LIB] [API] [MOCK_ENABLE_SERVICES] Not Authorised #{params.inspect} #{auth.inspect}")
             next
           end

          h = {:user_id => params[:user_id], :uid => auth.uid, :provider => service }

          result = enable_service(h)

          if result == false
            SocialAggregator.schedule_job({:user_id => h[:user_id], :uid => h[:uid], :provider => h[:provider] })
          end

        end

        Rails.logger.info("[LIB] [API] [MOCK_ENABLE_SERVICES] Leaving #{params.inspect}")


      rescue => e
        Rails.logger.error("[LIB] [API] [MOCK_ENABLE_SERVICES] **** RESCUE **** #{e.message} for #{params.inspect}")
        false
      end
############################################### ADMIN ###########################################

      #{
      #  :user_id => 123,
      #  :auth_key => "hdkjshfkjsdhkhfksdfsdf"[OPTIONAL == It is only used for Admin call(invite controller)  as a mode for authorization..]
      #}
      def delete_user(params)
        params[:current_user_id] = self.id
        ::Api::Admin.delete_user(params)
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
     #INPUT => {
      #           :user_id => 123
      #           :enabled_services => ["facebook', "twitter"...] #[OPTIONAL] Needed only when analytics of some services needs to blocked.. for privacy
      #         }
      #OUTPUT  : {
      #
      #              "technology"  =>  [
      #                                  {
      #                                     :count => 3
      #                                     :id => 123
      #
      #                                     :name => Pizza
      #                                     :image => ""http://freebase.com/pizza.jpg",
      #                                     :description => ""http://freebase.com/text.html",
      #
      #                                     :source_name => "twitter"
      #                                     :source_msg_id =>  "12233", [OBJECT ID OF POST]
      #
      #                                     :summary_id => 234
      #                                 },
      #                                 {
      #                                     :count => 3
      #                                     :id => 124
      #                                     :source_name =>"facebook",
      #                                     :source_msg_id =>  "12234", [OBJECT ID OF POST]
      #
      #                                     :summary_id => 235
      #                                 }
      #                             ]
      #              "sports" => [..]
      #           }OUTPUT HASH
      def get_entities(params)
        entities = ::Api::Entities.get_entities(params)
        entities
      end


      #INPUT => {
      #           :user_id => 123    [MANDATORY]
      #           :entity_ids => [1,2, 3, 4..] [MANDATORY] 50 MAXIMUM
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
      #          ]OUTPUT_ARRAY

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
      #           :enabled_services => ["facebook', "twitter"...] #[OPTIONAL] Needed only when analytics of some services needs to blocked.. for privacy
      #         }
      #
      #OUTPUT=>{
      #          :trends => {
      #                       First 4 numbers are year.. next one or two numbers are week in that year - year, 2012,week 5
      #                       20125 => {
      #
      #                                 :start_date => Sun, 04 Feb 2012 00:00:00 UTC +00:00,
      #                                 :end_date => Sat, 11 Feb 2012 00:00:00 UTC +00:00
      #                                 :weeks => {
      #                                             :services => {:facebook => 5, :twitter => 2}, #overall posts in services this week
      #                                             :topics =>   {
      #                                                            "sports" => {
      #                                                                         :summary_d => 123,
      #                                                                         :posts => {
      #                                                                                     :counts => {
      #                                                                                                  :total => 95,
      #                                                                                                  :services =>  {
      #                                                                                                                :facebook => 20,
      #                                                                                                                :twitter => 30,
      #                                                                                                                :actwitty => 45
      #                                                                                                               }
      #                                                                                               }
      #                                                                                  }
      #
      #                                                                        :documents => {
      #                                                                                       :counts => {
      #                                                                                                   :total => 6,
      #                                                                                                   :categories => {
      #                                                                                                                   :image => {
      #                                                                                                                               :total => 2,
      #                                                                                                                               :services => {:facebook => 1, :twitter => 1}
      #                                                                                                                             },
      #                                                                                                                   :video => {
      #                                                                                                                               :total => 2,
      #                                                                                                                               :services => {:facebook => 1, :twitter => 1}
      #                                                                                                                             },
      #                                                                                                                   :audio => {
      #                                                                                                                               :total => 0,
      #                                                                                                                               :services => {}
      #                                                                                                                             },
      #                                                                                                                   :document => {
      #                                                                                                                                 :total => 0,
      #                                                                                                                                 :services => {}
      #                                                                                                                                },
      #                                                                                                                   :link =>{
      #                                                                                                                             :total => 2,
      #                                                                                                                             :services => {:facebook => 2}
      #                                                                                                                           }
      #                                                                                                                  }
      #                                                                                                 }
      #                                                                                       },
      #                                                                       :locations => {
      #                                                                                       :counts => {
      #                                                                                                   :total => 95,
      #                                                                                                   :services => {
      #                                                                                                                 :facebook => 20, :twitter => 30, :actwitty => 45
      #                                                                                                                }
      #                                                                                                   }
      #                                                                                     },
      #                                                                       :entities => {
      #                                                                                       :counts => {
      #                                                                                                   :total => 95,
      #                                                                                                   :services => {
      #                                                                                                                 :facebook => 20, :twitter => 30, :actwitty => 45
      #                                                                                                                }
      #                                                                                                  }
      #                                                                                   },
      #                                                                      :source_actions  => {
      #                                                                                            :counts => {
      #                                                                                                         :total => 100,
      #                                                                                                         :actions => {
      #                                                                                                                       :likes => {
      #                                                                                                                                   :total => 50,
      #                                                                                                                                   :services => {:facebook => 20}
      #                                                                                                                                 },
      #                                                                                                                       :comments => {
      #                                                                                                                                       :total => 50,
      #                                                                                                                                       :services => {:facebook => 20}
      #                                                                                                                                    }
      #                                                                                                                       :shares => {
      #                                                                                                                                     :total => 50,
      #                                                                                                                                     :services => {:facebook => 20}
      #                                                                                                                                   }
      #                                                                                                                       :retweets => {
      #                                                                                                                                       :total => 50,
      #                                                                                                                                       :services => { :twitter => 30}
      #                                                                                                                                     }
      #                                                                                                                     }
      #                                                                                                     }
      #                                                                                         },
      #
      #                                                            "technology" => {:summary_id => 124, :posts => {...},}
      #                                                          }
      #
      #                                           },
      #
      #
      #                                }
      #                     }
      #          :popularity => {
      #                             "sports" => {
      #                                            :summary_d => 123,
      #                                            :source_actions  => {
      #                                                                 :counts => {
      #                                                                              :total => 100,
      #                                                                              :actions => {
      #                                                                                           :likes => {
      #                                                                                                      :total => 50,
      #                                                                                                      :services => {:facebook => 20}
      #                                                                                                     },
      #                                                                                           :comments => {
      #                                                                                                         :total => 50,
      #                                                                                                         :services => {:facebook => 20}
      #                                                                                                        }
      #                                                                                           :shares => {
      #                                                                                                       :total => 50,
      #                                                                                                       :services => {:facebook => 20}
      #                                                                                                      }
      #                                                                                           :retweets => {
      #                                                                                                         :total => 50,
      #                                                                                                         :services => { :twitter => 30}
      #                                                                                                        }
      #                                                                                           }
      #                                                                              }
      #                                                                 },
      #                             "technology" => {:summary_id => 124, :source_actions => {...},}
      #                         }
      #      }OUTPUT_HASH


      def get_analytics(params)
        analytics = ::Api::Analytics.get_analytics(params)
        analytics
      end

################################################ ACTIVITY ################################################
      #INPUT => {
      #           :author_id => 123
      #
      #           :word =>   activity word or phrase in activity box
      #
      #           :status => 1 (public) OR 2 (private)  [OPTIONAL]  default => public
      #
      #           :source_name =>  "actwitty" or "twitter", or "facebook" or "gplus" or "dropbox" or "tumblr" or "posterous",
      #                             or custom email or mobile number #defualt is actwitty
      #
      #           :text =>   "hello world"  [OPTIONAL]
      #
      #           :json_text => "text:ljk;sdlsd"  [OPTIONAL]   #retains json format of source blob for easy display like for twitter, g+
      #                                                        #for which we are storing data
      #                                                        #.. if json_text present use replace :text with json_text while storing
      #                                                        # we are storing yamls to increase re-usability and simplicity in display functions
      #                                                        #in client side while doing mash-up with source data ( for example from twitter
      #                                                        #and twitter data from ou server )
      #
      #           :location => {                       [OPTIONAL]
      #                           :lat => 23.6567, :long => 120.3, :name => "sj",
      #                           :city => ""bangalore", :country => "india", :region => "Karnataka"}
      #                                     OR
      #                                     nil
      #                         }
      #
      #
      #           :source_object_id => 123        [OPTIONAL]
      #
      #           :status_at_source => AppConstants.status_private_at_source|public_at_source
      #
      #           :source_uid  => "123123213" #UID OF USER AT SOURCE
      #
      #           :links => [
      #                       {
      #                         :source_object_id => "23213123", [FOR UPLOADED IMAGES AT SOURCE]
      #                         :url => "http://timesofindia.com/123.cms",
      #                         :mime => AppConstants.mime_remote_link,
      #                         :provider => "timesofindia.com",
      #                         :description => "Manmohan singh sleeping" [OPTIONAL],
      #                         :title => "indian politics"[OPTIONAL],
      #                         :image_url => "http://timesofindia.com/123.jpg" [OPTIONAL],
      #                         :image_width => 90[OPTIONAL],
      #                         :image_height => 120[OPTIONAL],
      #                         :category_id => "sports" [OPTIONAL if present "should be" Same as summary_category..]
      #                         :canonical_url => "timesofindia.com/123"[long url when url = a short url, OPTIONAL],
      #                         :cache_age => params[:cache_age][OPTIONAL will mostly come from pulled data]
      #                       }
      #                    ]
      #          :mentions => [
      #                         {:source_uid => "232131232", :name => "John Doe}, ..
      #                       ] ,
      #
      #          :tags =>     [
      #                         { :name => "pizza}, ..
      #                       ] ,
      #
      #           :source_actions => {
      #                                 "likes" => {:count => 20,:meta => {:friends => [{:name => "alok",:id => "23232313"}...]}},
      #                                 "comments" => {:count => 20,:meta => {:friends => [{:name => "alok",:id => "23232313"}...]}},
      #                                 "shares" => {:count => 20,:meta => {}},
      #                                 "retweets" => {:count => 20,:meta => {:friends => [{:name => "alok",:id => "23232313"}...]}},
      #                              },
      #           :source_object_type => "post"/"like"  AppConstants.source_object_type_post/like
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

################################################ CRAWLED USER ################################################
      #INPUT
      #"  #COMES AS STRING
      #
      #  :users =>
      #           [
      #             {
      #               :provider => "twitter",
      #               :uid => "23232323",
      #               :full_name => "Alok Srivastava"
      #               :photo => "http://xyz.com/123"  [OPTIONAL]
      #               :location => "Bangalore" [OPTIONAL]
      #               :gender => "male" [OPTIONAL]
      #               :username => "mashable"[OPTIONAL]
      #             },
      #           ],
      #  :auth_key => "hdkjshfkjsdhkhfksdfsdf" [MANDATORY == It is only used for curl based call as a mode for authorization..]
      #
      #" #COMES AS STRING

      def create_crawled_user(params)
        result = ::Api::UserCrawl.create_crawled_user(params)
      end


############################################### SOCIAL SHARE ###########################################
      #  INPUT
      #  params[:activities] =[ {
      #                            :category => "technology", 
      #                            :url => "http://gigaom.com/2012/04/26/the-clouds-next-seismic-shift-structure-2012"
      #                          } ,
      #                          {
      #                            :category => "sports", 
      #                            :url => "www.cricinfo.com" 
      #                          } ]
      def fb_write_to_timeline(params={})
         params[:user_id] = self.id
         ::Api::FBTimeline.fb_write_to_timeline_internal(params)         
      end
end
