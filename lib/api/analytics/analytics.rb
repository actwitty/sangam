module Api
  module Analytics
    class << self
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
      #      }


      def get_analytics(params)

        Rails.logger.info("[LIB] [API] [ANALYTICS] [GET_ANALYTICS] entering #{params}")
        hash = {:trends => {}, :popularity => {}}

        objects = SummaryRank.where(:user_id => params[:user_id] ).all

        if objects.blank?
          Rails.logger.info("[LIB] [API] [ANALYTICS] [GET_ANALYTICS] nothing valid object found for params #{params}")
          return {}
        end

        date_today = DateTime.now
        today = Integer(date_today.year.to_s + date_today.cweek.to_s)

        params[:num_of_week].blank? ? num_of_week = AppConstants.analytics_default_number_of_week : num_of_week = params[:num_of_week]

        num_of_week = AppConstants.analytics_default_number_of_week if num_of_week > AppConstants.analytics_default_number_of_week

        objects.each do |object|

          #first get weeks data
          #week data if summary id == blank
          if object.summary_id.blank?

            weeks = []
            #get the weeks keys [201252 first 4 is yr and last 1 or 2 is week]in analytics information
            if !object.analytics.blank?
              weeks = object.analytics.keys[-num_of_week..-1]
              weeks = object.analytics.keys if weeks.blank?
            end

            weeks.each do |week|
              hash[:trends][week] = {:start_date => nil, :end_date => nil, :weekly_trends => {}, :summary_snapshots => {}} if hash[:trends][week].blank?
              yr = Integer(week.to_s[0..3])
              wk = Integer(week.to_s[4..-1])

              hash[:trends][week] = ::Api::Helpers::FormatObject.format_analytics({:hash => object.analytics[week],
                                                                          :enabled_services => params[:enabled_services]})
              hash[:trends][week][:start_date] = DateTime.commercial(yr,wk, 1).utc
              hash[:trends][week][:end_date] = DateTime.commercial(yr,wk, 7).utc
            end
          end
        end

        #add popularity of respective week only when asked
        objects.each do |object|
          #Now process summary data
          if !object.summary_id.blank?
            k = nil

            a = Hash[object.analytics.sort.reverse]
            k = a.first[0] if !a.blank? #k is most recent week 20129 => year 2012, week 9

            if !k.blank?
              summary = ::Api::Helpers::FormatObject.format_analytics({:hash => object.analytics[k]})
              if !summary.blank?
                Rails.logger.info("[LIB] [API] [ANALYTICS] [GET_ANALYTICS] Summary Check #{summary.inspect}")
                hash[:popularity][object.activity_name] = {:source_actions => {}}
                hash[:popularity][object.activity_name][:source_actions] = summary[:source_actions]
                hash[:popularity][object.activity_name][:summary_id] = object.summary_id
              end
            end
          end
        end

        Rails.logger.info("[LIB] [API] [ANALYTICS] [GET_ANALYTICS] leaving  #{params}")
        hash
      rescue => e
        Rails.logger.info("[LIB] [API] [ANALYTICS] [GET_ANALYTICS]  **** RESCUE **** #{e.message} For #{params.inspect}")
        {}
      end
    end
  end
end
