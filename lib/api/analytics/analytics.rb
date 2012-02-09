module Api
  module Analytics
    class << self
      #COMMENT - Return the 5 weeks analytics by default. Including current week
      #
      #INPUT => {
      #           :user_id => 123,
      #           :num_of_week => 6 [OPTIONAL], Default 5, AppConstants.analytics_default_number_of_week
      #           :summary_snapshot => true [OPTIONAL return overall summary snapshot till that week]
      #         }
      #
      #OUTPUT => {
      #             First 4 numbers are year.. next one or two numbers are week in that year - year, 2012,week 5
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
      #         }


      def get_analytics(params)

        Rails.logger.info("[LIB] [API] [ANALYTICS] [GET_ANALYTICS] entering #{params}")

        hash = {}

        objects = SummaryRank.where(:user_id => params[:user_id] ).all

        if object.blank?
          Rails.logger.info("[LIB] [API] [ANALYTICS] [GET_ANALYTICS] nothing valid object found for params #{params}")
          return {}
        end

        date_today = DateTime.now
        today = Integer(date_today.year.to_s + date_today.cweek.to_s)

        params[:num_of_week].blank? ? num_of_week = AppConstants.analytics_default_number_of_week : num_of_week = params[:num_of_week]

        num_of_week = AppConstants.analytics_default_number_of_week if num_of_week > AppConstants.analytics_default_number_of_week

        objects.each do |object|

          #first get weeks data
          if object.summary_id.blank?

            weeks = []
            #get the weeks keys [201252 first 4 is yr and last 1 or 2 is week]in analytics information
            if !object.analytics.blank?
              weeks = object.analytics.keys[-num_of_week..-1]
              weeks = object.analytics.keys if weeks.blank?
            end

            weeks.each do |week|
              hash[week] = {:start_date => nil, :end_date => nil, :weekly_trends => {}, :summary_snapshots => {}} if hash[week].blank?
              yr = Integer(week.to_s[0..3])
              wk = Integer(week.to_s[4..-1])

              hash[week][:start_date] = DateTime.commercial(yr,wk, 1).utc
              hash[week][:end_date] = DateTime.commercial(yr,wk, 7).utc

              hash[week] = ::Api::Helpers::FormatObject.format_analytics({:hash => object.analytics[week]})
            end
          end

        end

        #now valid weeks are ..
        weeks = hash.keys

        if weeks.blank?
          Rails.logger.info("[LIB] [API] [ANALYTICS] [GET_ANALYTICS] no weekly trends available for  #{params}")
          return {}
        end

        #add summary snapshots of respective week only when asked
        if params[:summary_snapshots] == true
          objects.each do |object|

            #Now process summary data
            if !object.summary_id.blank?
              weeks.each do |week|
                summary = ::Api::Helpers::FormatObject.format_analytics({:hash => object.analytics[week]})

                if !summary.blank?
                  hash[week][:summary_snapshots][object.activity_name] = summary
                  hash[week][:summary_snapshots][object.activity_name][:summary_id] = object.summary_id
                end

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