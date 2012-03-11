class SummaryRank < ActiveRecord::Base

  belongs_to :summary
  belongs_to :user

  validates_uniqueness_of :summary_id    ,:unless => Proc.new {|a| a.summary_id.nil?}

  validates_presence_of :user_id

  serialize :analytics, Hash


  after_save  :update_analytics_in_models

  USER_ANALYTICS = ["weeks"]
  SUMMARY_ANALYTICS = ["posts","documents", "entities", "locations", "source_actions", "local_actions"]

  def  update_analytics_in_models
    Rails.logger.info("[MODEL] [SUMMARY_RANK] [update_analytics_in_models] entering ")

    analytics = nil

    if !self.summary_id.blank?

      date_today = DateTime.now
      today = Integer(date_today.year.to_s + date_today.cweek.to_s)

      analytics = self.analytics[today]   if !self.analytics.blank?

      if !analytics.blank?
        s = Summary.where(:id => self.summary_id).first
        s.analytics_snapshot = {}
        s.update_attributes(:analytics_snapshot => analytics)
        Rails.logger.info("[MODEL] [SUMMARY_RANK] [update_analytics_in_models] updating summary ID #{self.summary_id}")
      end

    end
    Rails.logger.info("[MODEL] [SUMMARY_RANK] [update_analytics_in_models] leaving ")
  rescue => e
    Rails.logger.error("[MODEL] [SUMMARY_RANK] [update_analytics_in_models]  **** RESCUE **** #{e.message} For #{self.inspect}")
    {}
  end

  class << self

    #INPUT => {
    #           :user_id => 123 [MANDATORY],
    #           :action => AppConstants.analytics_update_summaries or user [MANDATORY]
    #           :summary_id => 1234 or ARRAY [OPTIONAL][NEEDED FOR POSTS, DOCUMENTS, LOCATION, ENTITIES]
    #           :num_of_week => 5 [OPTIONAL] .. If not present only current week is taken n consideration
    #         }
    def build_analytics(params)

      Rails.logger.info("[MODEL] [SUMMARY_RANK] [BUILD_ANALYTICS] entering #{params.inspect}")

      if params[:user_id].blank?
        Rails.logger.info("[MODEL] [SUMMARY_RANK] [BUILD_ANALYTICS] USER ID Blank #{params.inspect}")
        return
      end

      if params[:action] == AppConstants.analytics_update_user

        params = params.except(:summary_id) #no need of summary_id when updating user level analytics
        params[:fields] = USER_ANALYTICS

      elsif params[:action] == AppConstants.analytics_update_summaries

        if params[:summary_id].blank?
          Rails.logger.info("[MODEL] [SUMMARY_RANK] [BUILD_ANALYTICS] Summary ID cant be blank for summary update #{params.inspect}")
          return
        end

        params[:fields] = SUMMARY_ANALYTICS
      else
        Rails.logger.info("[MODEL] [SUMMARY_RANK] [BUILD_ANALYTICS] Invalid Action Specified #{params.inspect}")
        return
      end

      params = params.except(:action)

      params[:num_of_week].blank? ? num_of_week = 1 : num_of_week = params[:num_of_week]

      num_of_week = AppConstants.analytics_default_number_of_week if num_of_week > AppConstants.analytics_default_number_of_week

      params = params.except(:num_of_week)

      #Normalize query in common array
      array = []
      if !params[:summary_id].blank?
        if params[:summary_id].class == Array
          params[:summary_id].each do |id|
            array << {:user_id => params[:user_id], :fields => params[:fields], :summary_id => id}
          end
        else
          array << {:user_id => params[:user_id], :fields => params[:fields], :summary_id => params[:summary_id]}
        end
      else
        array << {:user_id => params[:user_id], :summary_id => nil, :fields => params[:fields]}
      end

      array.each do |query|
        d = Date.today
        week = d.cweek
        year = d.year

        num_of_week.times do |idx|

          #year end check .. need to adjust weeks properly
          if week == 0
            year = year -1
            py = Date.new(year,12,31)
            if py.cweek < 53
              week = 52 #overlapping week  or complete 52 weeks
            else
              week = 53 #d.cweek
            end
          end

          query[:date] = {:year => year, :week => week}
          add_analytics(query)
          week = week -1
        end
      end

      Rails.logger.info("[MODEL] [SUMMARY_RANK] [BUILD_ANALYTICS] leaving #{params.inspect}")
    rescue => e
      Rails.logger.error("[MODEL] [SUMMARY_RANK] [BUILD_ANALYTICS] **** RESCUE **** #{e.message} For #{params.inspect}")
    end

    #INPUT => {
    #           :fields => ["posts","documents" ..],
    #           :summary_id => 1234 [OPTIONAL][FOR POSTS, DOCUMENTS, LOCATION, ENTITIES]
    #           :user_id => 123 [MANDATORY],
    #           :date => {:week => 2, :year => 2012}
    #         }
    def add_analytics(params)
      Rails.logger.info("[MODEL] [SUMMARY_RANK] [ADD_ANALYTICS] entering #{params.inspect}")

      updated = false
      hash = {}

      h = params.except(:fields, :date)

      object = SummaryRank.where(h).first  #h = {:user_id => 123 , :summary_id => 123} OR {user_id => 123, :summary_id => nil}

      if object.blank?
        Rails.logger.info("[MODEL] [SUMMARY_RANK] [ADD_ANALYTICS] new object #{h}")

        #TODO if this is correct -CHECK
        if !params[:summary_id].blank?
          #we can use summary id check but other case of user analytics also uses summary_id as squeel operator of eq
          s = Summary.where(:id => params[:summary_id]).first

          h[:activity_name] = s.activity_name
          h[:category_id] = s.category_id
        end

        Rails.logger.info("[MODEL] [SUMMARY_RANK] [ADD_ANALYTICS] creating object #{params}")
        object =create!(h)
      end

      date_today = DateTime.now
      today = Integer(date_today.year.to_s + date_today.cweek.to_s)

      #set the date in YEAR + WEEK[1-53] => 20125
      if !params[:date].blank?
        date = Integer(params[:date][:year].to_s + params[:date][:week].to_s)
      else
        date = today
      end

      params[:fields].each do |attr|

        data = send("add_#{attr}_analytics", params)

        if !data.blank?
          object.analytics = {} if object.analytics.blank?
          object.analytics[date] = {} if object.analytics[date].blank?

          object.analytics[date][attr.to_sym] = data
          object.analytics[date][:timestamp] = date_today.utc

          #this sorting is done so that if old date is inserted at later time it will spoil the shift operation
          #at spillover below.. Ensures always oldest goes at start and spills first..
          object.analytics = Hash[object.analytics]   if date < today

          #remove data points if needed
          object.analytics.shift if object.analytics.length > AppConstants.number_of_data_points

          hash[:analytics] =  object.analytics

          updated = true
        end
      end

      if updated == true
        object.update_attributes!(hash)
        Rails.logger.info("[MODEL] [SUMMARY_RANK] [ADD_ANALYTICS] Updating channel rank and analytics #{params}")
      end

      Rails.logger.info("[MODEL] [SUMMARY_RANK] [ADD_ANALYTICS] leaving #{params}")

      return object.attributes
    rescue => e
      Rails.logger.error("[MODEL] [SUMMARY_RANK] [ADD_ANALYTICS] **** RESCUE **** #{e.message} For #{params.inspect}")
      return nil
    end

    private

      #INPUT => { :summary_id => 123}
      #OUTPUT => {
      #            :counts => {
      #                         :total => 95,
      #                         :services => {
      #                                        :facebook => 20, :twitter => 30, :actwitty => 45
      #                                      }
      #                       }
      #          }
      def add_posts_analytics(params)

        Rails.logger.info("[MODEL] [SUMMARY_RANK] [ADD_POSTS_ANALYTICS] Entering #{params}")

        if params[:summary_id].blank?
          Rails.logger.info("[MODEL] [SUMMARY_RANK] [ADD_POSTS_ANALYTICS] blank summary #{params}")
          return nil
        end

        hash = {:counts => {:total => 0, :services => {}}}

        query = {:summary_id => params[:summary_id]}

        query[:till] = DateTime.commercial(params[:date][:year],params[:date][:week], 7).utc if !params[:date].blank?

        h = ::Api::Helpers::PlanTableQuery.plan_activity_query(query)

        posts = Activity.where(h).group(:source_name).count

        posts.each do |attr|
          hash[:counts][:services][attr[0].to_sym] = attr[1]
          hash[:counts][:total] += attr[1]
        end

        if hash[:counts][:total] == 0
          Rails.logger.info("[MODEL] [SUMMARY_RANK] [ADD_POSTS_ANALYTICS] No Posts found")
          hash = {}
        end

        puts "===== POSTS ======"
        puts hash.inspect

        Rails.logger.info("[MODEL] [SUMMARY_RANK] [ADD_POSTS_ANALYTICS] exiting #{params}")
        hash
      rescue => e
        Rails.logger.error("[MODEL] [SUMMARY_RANK] [ADD_POSTS_ANALYTICS]  **** RESCUE **** #{e.message} For #{params.inspect}")
        {}
      end


      #INPUT => { :summary_id => 123}
      #OUTPUT => {
      #             :counts => {
      #                         :total => 6,

      #                         :categories => {
      #                                           :image => {
      #                                                       :total => 2,
      #                                                       :services => {:facebook => 1, :twitter => 1}
      #                                                     },
      #                                           :video => {
      #                                                       :total => 2,
      #                                                       :services => {:facebook => 1, :twitter => 1}
      #                                                   },
      #                                           :audio => {
      #                                                       :total => 0,
      #                                                       :services => {}
      #                                                     },
      #                                           :document => {
      #                                                           :total => 0,
      #                                                           :services => {}
      #                                                         },
      #                                           :link => {
      #                                                      :total => 2,
      #                                                      :services => {:facebook => 2}
      #                                                    }
      #                                         }
      #                        }
      #            }
      def add_documents_analytics(params)

        Rails.logger.info("[MODEL] [SUMMARY_RANK] [ADD_DOCUMENTS_ANALYTICS] entering #{params}")

        if params[:summary_id].blank?
          Rails.logger.info("[MODEL] [SUMMARY_RANK] [ADD_DOCUMENTS_ANALYTICS] blank summary #{params}")
          return nil
        end

        hash = {
                 :counts => {
                              :total => 0,
                              :categories => {
                                               :image => {:total => 0, :services => {}},
                                               :video => {:total => 0, :services => {}},
                                               :audio => {:total => 0, :services => {}},
                                               :document => {:total => 0, :services => {}},
                                               :link => {:total => 0, :services => {}}
                                             }
                            }
               }

        query = {:summary_id => params[:summary_id]}

        query[:till] = DateTime.commercial(params[:date][:year],params[:date][:week], 7).utc if !params[:date].blank?

        h = ::Api::Helpers::PlanTableQuery.plan_document_query(query)

        docs = Document.where(h).group(:category, :source_name).count
        puts docs.inspect
        docs.each do |k,v|
          hash[:counts][:categories][k[0].to_sym][:total] += v
          hash[:counts][:categories][k[0].to_sym][:services][k[1].to_sym] = v
          hash[:counts][:total] += v
        end

        if hash[:counts][:total] == 0
          Rails.logger.info("[MODEL] [SUMMARY_RANK] [ADD_DOCUMENTS_ANALYTICS] No Posts found")
          hash = {}
        end

        puts "===== DOCUMENTS ======"
        puts hash.inspect

        Rails.logger.info("[MODEL] [SUMMARY_RANK] [ADD_DOCUMENTS_ANALYTICS] leaving #{params}")
        hash
      rescue => e
        Rails.logger.error("[MODEL] [SUMMARY_RANK] [ADD_DOCUMENTS_ANALYTICS]  **** RESCUE **** #{e.message} For #{params.inspect}")
        {}
      end

      #INPUT => { :summary_id => 123}
      #OUTPUT => {
      #            :counts => {
      #                         :total => 95,
      #                         :services => {
      #                                        :facebook => 20, :twitter => 30, :actwitty => 45
      #                                      }
      #                       }
      #          }
      def add_locations_analytics(params)

        Rails.logger.info("[MODEL] [SUMMARY_RANK] [ADD_LOCATIONS_ANALYTICS] entering #{params}")

        if params[:summary_id].blank?
          Rails.logger.info("[MODEL] [SUMMARY_RANK] [ADD_LOCATIONS_ANALYTICS] blank summary #{params}")
          return nil
        end

        hash = {:counts => {:total => 0, :services => {}}}

        query = {:summary_id => params[:summary_id], :all_location => true}

        query[:till] = DateTime.commercial(params[:date][:year],params[:date][:week], 7).utc if !params[:date].blank?

        h = ::Api::Helpers::PlanTableQuery.plan_activity_query(query)

        loc = Activity.where(h).group(:source_name).count

        loc.each do |attr|
          hash[:counts][attr[0].to_sym] = attr[1]
          hash[:counts][:total] += attr[1]
        end

        if hash[:counts][:total] == 0
          Rails.logger.info("[MODEL] [SUMMARY_RANK] [ADD_LOCATIONS_ANALYTICS] No Posts found")
          hash = {}
        end

        puts "===== LOCATIONS ======"
        puts hash.inspect

        Rails.logger.info("[MODEL] [SUMMARY_RANK] [ADD_LOCATIONS_ANALYTICS] leaving #{params}")
        hash
      rescue => e
        Rails.logger.error("[MODEL] [SUMMARY_RANK] [ADD_LOCATIONS_ANALYTICS]  **** RESCUE **** #{e.message} For #{params.inspect}")
        {}
      end

      #INPUT => { :summary_id => 123}
      #OUTPUT => {
      #            :counts => {
      #                         :total => 95,
      #                         :services => {
      #                                        :facebook => 20, :twitter => 30, :actwitty => 45
      #                                      }
      #                       }
      #          }
      def add_entities_analytics(params)

        Rails.logger.info("[MODEL] [SUMMARY_RANK] [ADD_ENTITIES_ANALYTICS] entering #{params}")

        if params[:summary_id].blank?
          Rails.logger.info("[MODEL] [SUMMARY_RANK] [ADD_ENTITIES_ANALYTICS] blank summary #{params}")
          return nil
        end

        hash = {:counts => {:total => 0, :services => {}}}

        query = {:summary_id => params[:summary_id]}

        query[:till] = DateTime.commercial(params[:date][:year],params[:date][:week], 7).utc if !params[:date].blank?

        h = ::Api::Helpers::PlanTableQuery.plan_hub_query(query)

        hub = Hub.where(h).group(:source_name).count

        hub.each do |attr|
          hash[:counts][attr[0].to_sym] = attr[1]
          hash[:counts][:total] += attr[1]
        end

        if hash[:counts][:total] == 0
          Rails.logger.info("[MODEL] [SUMMARY_RANK] [ADD_ENTITIES_ANALYTICS] No Posts found")
          hash = {}
        end

        puts "==== ENTITIES ====="
        puts hash.inspect

        Rails.logger.info("[MODEL] [SUMMARY_RANK] [ADD_ENTITIES_ANALYTICS] leaving #{params}")
        hash
      rescue => e
        Rails.logger.error("[MODEL] [SUMMARY_RANK] [ADD_ENTITIES_ANALYTICS]  **** RESCUE **** #{e.message} For #{params.inspect}")
        {}
      end

      #INPUT => { :summary_id => 123}
      #OUTPUT => {
      #            :counts => {
      #                         :total => 100,
      #                         :actions => {
      #                                        :likes => {
      #                                                    :total => 50,
      #                                                    :services => {:facebook => 20, :twitter => 30}
      #                                                  },
      #                                        :comments => {
      #                                                       :total => 50,
      #                                                       :services => {:facebook => 20, :twitter => 30}
      #                                                  }
      #                                     }
      #                       }
      #          }
      def add_source_actions_analytics(params)
        Rails.logger.info("[MODEL] [SUMMARY_RANK] [ADD_SOURCE_ACTIONS_ANALYTICS] entering #{params}")

        if params[:summary_id].blank?
          Rails.logger.info("[MODEL] [SUMMARY_RANK] [ADD_SOURCE_ACTIONS_ANALYTICS] blank summary #{params}")
          return nil
        end

        hash = {:counts => {:total => 0, :actions => {}}}

        query = {:summary_id => params[:summary_id]}

        query[:till] = DateTime.commercial(params[:date][:year],params[:date][:week], 7).utc if !params[:date].blank?

        h = ::Api::Helpers::PlanTableQuery.plan_source_action_query(query)

        s = SourceAction.where(h).group(:name, :source_name).sum(:count)
        s.each do |k,v|
          hash[:counts][:total] += v
          hash[:counts][:actions][k[0].to_sym] = {:total => 0, :services => {}} if hash[:counts][:actions][k[0].to_sym].blank?
          hash[:counts][:actions][k[0].to_sym][:total] += v
          hash[:counts][:actions][k[0].to_sym][:services][k[1].to_sym] = v
        end

        if hash[:counts][:total] == 0
          Rails.logger.info("[MODEL] [SUMMARY_RANK] [ADD_SOURCE_ACTIONS_ANALYTICS] No Posts found")
          hash = {}
        end

        puts "==== SOURCE_ACTIONS ====="
        puts hash.inspect

        Rails.logger.info("[MODEL] [SUMMARY_RANK] [ADD_SOURCE_ACTIONS_ANALYTICS] leaving #{params}")
        hash
      rescue => e
        Rails.logger.error("[MODEL] [SUMMARY_RANK] [ADD_SOURCE_ACTIONS_ANALYTICS]  **** RESCUE **** #{e.message} For #{params.inspect}")
        {}
      end

      #INPUT => { :summary_id => 123}
      #OUTPUT => {
      #            :counts => {
      #                         :total => 95,
      #                         :actions => {
      #                                        :upvote => 20, :recommendations => 30
      #                                      }
      #                       }
      #          }
      def add_local_actions_analytics(params)
        Rails.logger.info("[MODEL] [SUMMARY_RANK] [ADD_LOCAL_ACTIONS_ANALYTICS] entering #{params}")

        if params[:summary_id].blank?
          Rails.logger.info("[MODEL] [SUMMARY_RANK] [ADD_LOCAL_ACTIONS_ANALYTICS] blank summary #{params}")
          return nil
        end

        hash = {:counts => {:total => 0, :actions => {}}}

        query = {:summary_id => params[:summary_id]}

        query[:till] = DateTime.commercial(params[:date][:year],params[:date][:week], 7).utc if !params[:date].blank?

        h = ::Api::Helpers::PlanTableQuery.plan_local_action_query(query)

        s = LocalAction.where(h).group(:name).count
        s.each do |k,v|
          hash[:counts][:total] += v
          hash[:counts][:actions][k[0].to_sym] = v
        end

        #dont enable as otherwise down votes will not be reflected
#        if hash[:counts][:total] == 0
#          Rails.logger.info("[MODEL] [SUMMARY_RANK] [ADD_SOURCE_ACTIONS_ANALYTICS] No Posts found")
#          hash = {}
#        end

        Rails.logger.info("[MODEL] [SUMMARY_RANK] [ADD_LOCAL_ACTIONS_ANALYTICS] leaving #{params}")
        hash
      rescue => e
        Rails.logger.error("[MODEL] [SUMMARY_RANK] [ADD_LOCAL_ACTIONS_ANALYTICS]  **** RESCUE **** #{e.message} For #{params.inspect}")
        {}
      end


      #INPUT => { :user_id => 123}
      #OUTPUT => {
      #            :services => {:facebook => 5, :twitter => 2}, #overall posts in services this week
      #            :topics =>   {
      #                           "sports" => {
      #                                         :summary_id => 123,
      #                                         :posts => {
      #                                                     :counts => {
      #                                                                   :total => 95,
      #                                                     :services =>  {
      #                                                                     :facebook => 20, :twitter => 30, :actwitty => 45
      #                                                                   }
      #                                                                }
      #                                                  }
      #
      #                                        :documents => {
      #                                                       :counts => {
      #                                                                    :total => 6,
      #                                                                    :categories => {
      #                                                                                     :image => {
      #                                                                                                 :total => 2,
      #                                                                                                 :services => {:facebook => 1, :twitter => 1}
      #                                                                                               },
      #                                                                                     :video => {
      #                                                                                                 :total => 2,
      #                                                                                                 :services =>  {:facebook => 1, :twitter => 1}
      #                                                                                               },
      #                                                                                     :audio => {
      #                                                                                                 :total => 0,
      #                                                                                                 :services => {}
      #                                                                                               },
      #                                                                                     :document => {
      #                                                                                                    :total => 0,
      #                                                                                                    :services => {}
      #                                                                                                  },
      #                                                                                     :link =>    {
      #                                                                                                   :total => 2,
      #                                                                                                   :services =>  {:facebook => 2}
      #                                                                                                 }
      #                                                                                 }
      #                                                                 }
      #                                                     },
      #                                     :locations => {
      #                                                      :counts => {
      #                                                                   :total => 95,
      #                                                                   :services => {
      #                                                                                  :facebook => 20, :twitter => 30, :actwitty => 45
      #                                                                                }
      #                                                                 }
      #                                                   },
      #                                     :entities => {
      #                                                     :counts => {
      #                                                                   :total => 95,
      #                                                                   :services => {
      #                                                                                  :facebook => 20, :twitter => 30, :actwitty => 45
      #                                                                                }
      #                                                                 }
      #                                                  },
      #                                     :source_actions  => {
      #                                                           :counts => {
      #                                                                        :total => 100,
      #                                                                        :actions => {
      #                                                                                      :likes => {
      #                                                                                                  :total => 50,
      #                                                                                                  :services => {:facebook => 20, :twitter => 30}
      #                                                                                                },
      #                                                                                      :comments => {
      #                                                                                                     :total => 50,
      #                                                                                                     :services => {:facebook => 20, :twitter => 30}
      #                                                                                                   }
      #                                                                                   }
      #                                                                     }
      #                                                         },
      #                                 },
      #
      #                           "technology" => {:summary_id => 124, :posts => {...},}
      #                       }
      #          }
      def add_weeks_analytics(params)

        Rails.logger.info("[MODEL] [SUMMARY_RANK] [ADD_WEEKS_ANALYTICS] entering #{params}")

        if params[:user_id].blank?
          Rails.logger.info("[MODEL] [SUMMARY_RANK] [ADD_WEEKS_ANALYTICS] blank summary #{params}")
          return nil
        end

        query = {}
        query[:user_id] = params[:user_id]

        if params[:date].blank?
          d = DateTime.now
          params[:date]={:year => d.year, :week => d.cweek}
        end

        query[:since] = DateTime.commercial(params[:date][:year],params[:date][:week], 1).utc
        query[:till] = DateTime.commercial(params[:date][:year],params[:date][:week], 7).utc

        hash = {:services => {}, :topics => {}}

        summary_ids = {}

        h = ::Api::Helpers::PlanTableQuery.plan_activity_query(query)

        objects = Activity.where(h).group(:activity_name, :source_name, :summary_id).count

        objects.each do |k,v|
          hash[:topics][k[0]] = {:summary_id => k[2], :posts => {:counts => {:total => 0, :services => {}}}}  if hash[k[0]].blank?
          hash[:topics][k[0]][:summary_id] = k[2]

          posts = hash[:topics][k[0]][:posts]
          posts[:counts][:total] += v
          posts[:counts][:services][k[1].to_sym] = v #source_name

          summary_ids[k[2]] = k[0] #keep the mapping to use below id => name

          hash[:services][k[1].to_sym] = 0 if  hash[:services][k[1].to_sym].blank?
          hash[:services][k[1].to_sym] += v #overall posts in services this week
        end

        #now get others
        if !summary_ids.blank?

          #get docs mapping to those s
          #ummaries
          h = ::Api::Helpers::PlanTableQuery.plan_document_query(query)
          objects = Document.where(h).group(:category, :source_name, :summary_id).count

          puts objects.inspect
          objects.each do |k,v|
            name = summary_ids[k[2]]

            if !hash[:topics][name].blank?
              hash[:topics][name][:documents] = {:counts => {:total => 0, :categories => {:image => {:total => 0, :services => {}},
                                                                                          :video => {:total => 0, :services => {}},
                                                                                          :audio => {:total => 0, :services => {}},
                                                                                          :document => {:total => 0, :services => {}},
                                                                                          :link => {:total => 0, :services => {}}}}}
              docs = hash[:topics][name][:documents]
              docs[:counts][:categories][k[0].to_sym][:total] += v
              docs[:counts][:categories][k[0].to_sym][:services][k[1].to_sym] = v
              docs[:counts][:total] += v
            end
          end

          #get entities mapping to those summaries
          h = ::Api::Helpers::PlanTableQuery.plan_hub_query(query)
          objects = Hub.where(h).group(:source_name, :summary_id).count

          objects.each do |k,v|
            name = summary_ids[k[1]]

            if !hash[:topics][name].blank?
              hash[:topics][name][:entities] = {:counts => {:total => 0, :services => {}}}
              entities = hash[:topics][name][:entities]
              entities[:counts][:total] += v
              entities[:counts][:services][k[0].to_sym] = v
            end
          end

          #get locations mapping to those summaries
          query[:all_location] = true
          h = ::Api::Helpers::PlanTableQuery.plan_activity_query(query)
          objects = Activity.where(h).group(:source_name, :summary_id).count

          objects.each do |k,v|
            name = summary_ids[k[1]]

            if !hash[:topics][name].blank?
              hash[:topics][name][:locations] = {:counts => {:total => 0, :services => {}}}
              locations = hash[:topics][name][:locations]
              locations[:counts][:total] += v
              locations[:counts][:services][k[0].to_sym] = v
            end
          end

          #get source action mapping to those summaries
          query = query.except(:all_location)
          h = ::Api::Helpers::PlanTableQuery.plan_source_action_query(query)
          objects = SourceAction.where(h).group(:name, :source_name, :summary_id).sum(:count)

          objects.each do |k,v|
            name = summary_ids[k[2]]

            if !hash[:topics][name].blank?
              hash[:topics][name][:source_actions] = {:counts => {:total => 0, :actions => {}}}
              source_action = hash[:topics][name][:source_actions]
              source_action[:counts][:total] += v
              source_action[:counts][:actions][k[0].to_sym] = {:total => 0, :services => {}} if source_action[:counts][:actions][k[0].to_sym].blank?
              source_action[:counts][:actions][k[0].to_sym][:total] += v
              source_action[:counts][:actions][k[0].to_sym][:services][k[1].to_sym] = v
            end
          end
        end

        if !hash[:topics].blank?
          topics_hash = hash[:topics]
          topics_hash = topics_hash.sort_by {|k,v| v[:posts][:counts][:total]}.reverse #returns array tuple [ [k,v], [k,v], [k,v]  ]
          hash[:topics] = Hash[topics_hash]
        else
          hash = {}
          Rails.logger.info("[MODEL] [SUMMARY_RANK] [ADD_WEEKS_ANALYTICS] No Posts found")
        end

        puts "===== WEEKS ======="
        puts hash.inspect

        Rails.logger.info("[MODEL] [SUMMARY_RANK] [ADD_WEEKS_ANALYTICS] leaving #{params}")

        hash
      rescue => e
        Rails.logger.error("[MODEL] [SUMMARY_RANK] [ADD_WEEKS_ANALYTICS]  **** RESCUE **** #{e.message} For #{params.inspect}")
        {}
      end
  end
end






# == Schema Information
#
# Table name: summary_ranks
#
#  id            :integer         not null, primary key
#  summary_id    :integer
#  user_id       :integer         not null
#  activity_name :text
#  category_id   :text
#  analytics     :text
#  created_at    :datetime        not null
#  updated_at    :datetime        not null
#

