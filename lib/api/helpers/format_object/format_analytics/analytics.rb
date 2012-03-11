module Api
  module Helpers
    module FormatObject
      module FormatAnalytics
        class Analytics
          class << self
            #COMMON COMMENT
            #These functions takes care of privacy .. in terms of masking the services user is not subscribed to
            #This need can arise when months of analytics is generated for a service and then service is disabled
            #The analytics data will still contain deleted service numbers.. so masking is needed

            # ##handles a common format {:total => 5, :services => {:facebook => 3, :twitter => 2}}
            #INPUT => {
            #           :hash =>  {
            #                       :total => 5,
            #                       :services => {
            #                                      :facebook => 3,
            #                                      :twitter => 2
            #                                    }
            #                    },
            #            :enabled_services => ["facebook"] [OPTIONAL]
            #         }
            def format_analytics_common(params)
              #Rails.logger.info("[LIB] [API] [HELPERS] [FORMAT_OBJECT] [FORMAT_ANALYTICS] [format_analytics_common] entering ")

              return params[:hash] if params[:enabled_services].blank?

              svc = params[:hash]

              svc[:services].each do |service, count|
                if params[:enabled_services][service].nil?
                  svc[:total] -= count
                  svc[:services].delete(service)
                end
              end

              params[:hash] = {} if params[:hash][:total] == 0

              #Rails.logger.info("[LIB] [API] [HELPERS] [FORMAT_OBJECT] [FORMAT_ANALYTICS] [format_analytics_common] entering ")
              params[:hash]

            rescue => e
              Rails.logger.error("[LIB] [API] [HELPERS] [FORMAT_OBJECT] [FORMAT_ANALYTICS] [format_analytics_common]  **** RESCUE **** #{e.message} For #{params.inspect}")
              {}
            end
            # ##format a posts analytics to generic form.
            #INPUT => {
            #           :hash => {
            #                      :counts => {
            #                                   :total => 5,
            #                                   :services => {
            #                                                   :facebook => 3,
            #                                                   :twitter => 2
            #                                                }
            #                                 }
            #                   },
            #           :enabled_services => ["facebook"] [OPTIONAL]
            #         }
            def format_analytics_posts(params)
              #Rails.logger.info("[LIB] [API] [HELPERS] [FORMAT_OBJECT] [FORMAT_ANALYTICS] [format_analytics_posts] entering ")

              return params[:hash] if params[:enabled_services].blank?

              params[:hash]=format_analytics_common(:hash => params[:hash][:counts], :enabled_services => params[:enabled_services])

              #Rails.logger.info("[LIB] [API] [HELPERS] [FORMAT_OBJECT] [FORMAT_ANALYTICS] [format_analytics_posts] leaving ")
              params[:hash]
            rescue => e
              Rails.logger.error("[LIB] [API] [HELPERS] [FORMAT_OBJECT] [FORMAT_ANALYTICS] [format_analytics_posts]  **** RESCUE **** #{e.message} For #{params.inspect}")
              {}
            end

            # ##format a documents analytics to generic form.
            #INPUT => {
            #           :hash => {
            #                      :counts => {
            #                                   :total => 6,
            #                                   :categories => {
            #                                                    :image => {
            #                                                                :total => 2,
            #                                                                :services => {:facebook => 1, :twitter => 1}
            #                                                              },
            #                                                    :video => {
            #                                                                :total => 2,
            #                                                                :services => {:facebook => 1, :twitter => 1}
            #                                                              },
            #                                                    :audio => {
            #                                                                 :total => 0,
            #                                                                 :services => {}
            #                                                              },
            #                                                    :document => {
            #                                                                   :total => 0,
            #                                                                   :services => {}
            #                                                                 },
            #                                                    :link => {
            #                                                               :total => 2,
            #                                                               :services => {:facebook => 2}
            #                                                             }
            #                                                 }
            #                               }
            #                 },
            #           :enabled_services => ["facebook", "twitter"] [OPTIONAL]
            #         }
            def format_analytics_documents(params)
              #Rails.logger.info("[LIB] [API] [HELPERS] [FORMAT_OBJECT] [FORMAT_ANALYTICS] [format_analytics_documents] entering ")

              return params[:hash] if params[:enabled_services].blank?

              total = 0

              params[:hash][:counts][:categories].each do |k,v|
                v = format_analytics_common(:hash => v, :enabled_services => params[:enabled_services])
                total += v[:total] if v.size != 0
              end

              total > 0 ? params[:hash][:counts][:total] = total : params[:hash] = {}

              #Rails.logger.info("[LIB] [API] [HELPERS] [FORMAT_OBJECT] [FORMAT_ANALYTICS] [format_analytics_documents] leaving ")
              params[:hash]
            rescue => e
              Rails.logger.error("[LIB] [API] [HELPERS] [FORMAT_OBJECT] [FORMAT_ANALYTICS] [format_analytics_documents]  **** RESCUE **** #{e.message} For #{params.inspect}")
              {}
            end



            # ##format a locations analytics to generic form.
            #INPUT => {
            #           :hash => {
            #                      :counts => {
            #                                   :total => 5,
            #                                   :services => {
            #                                                   :facebook => 3,
            #                                                   :twitter => 2
            #                                                }
            #                                 }
            #                   },
            #           :enabled_services => ["facebook"] [OPTIONAL]
            #         }
            def format_analytics_locations(params)
              #Rails.logger.info("[LIB] [API] [HELPERS] [FORMAT_OBJECT] [FORMAT_ANALYTICS] [format_analytics_locations] entering ")

              return params[:hash] if params[:enabled_services].blank?

              params[:hash]=format_analytics_common(:hash => params[:hash][:counts], :enabled_services => params[:enabled_services])

              #Rails.logger.info("[LIB] [API] [HELPERS] [FORMAT_OBJECT] [FORMAT_ANALYTICS] [format_analytics_locations] leaving ")
              params[:hash]
            rescue => e
              Rails.logger.error("[LIB] [API] [HELPERS] [FORMAT_OBJECT] [FORMAT_ANALYTICS] [format_analytics_locations]  **** RESCUE **** #{e.message} For #{params.inspect}")
              {}
            end

            # ##format a entities analytics to generic form.
            #INPUT => {
            #           :hash => {
            #                      :counts => {
            #                                   :total => 5,
            #                                   :services => {
            #                                                   :facebook => 3,
            #                                                   :twitter => 2
            #                                                }
            #                                 }
            #                   },
            #           :enabled_services => ["facebook"] [OPTIONAL]
            #         }
            def format_analytics_entities(params)
              #Rails.logger.info("[LIB] [API] [HELPERS] [FORMAT_OBJECT] [FORMAT_ANALYTICS] [format_analytics_entities] entering ")

              return params[:hash] if params[:enabled_services].blank?

              params[:hash]=format_analytics_common(:hash => params[:hash][:counts], :enabled_services => params[:enabled_services])

              #Rails.logger.info("[LIB] [API] [HELPERS] [FORMAT_OBJECT] [FORMAT_ANALYTICS] [format_analytics_entities] leaving ")
              params[:hash]
            rescue => e
              Rails.logger.error("[LIB] [API] [HELPERS] [FORMAT_OBJECT] [FORMAT_ANALYTICS] [format_analytics_entities]  **** RESCUE **** #{e.message} For #{params.inspect}")
              {}
            end

            #  ##format a local_actions analytics to generic form
            #INPUT => {
            #           :hash => {
            #                       :counts => {
            #                                   :total => 100,
            #                                   :actions => {
            #                                                :likes => {
            #                                                           :total => 50,
            #                                                           :services => {:facebook => 20, :twitter => 30}
            #                                                          },
            #                                                :comments => {
            #                                                              :total => 50,
            #                                                              :services => {:facebook => 20, :twitter => 30}
            #                                                             }
            #                                              }
            #                                 }
            #                  },
            #           :enabled_services => ["facebook"] [OPTIONAL]
            #         }
            def format_analytics_source_actions(params)
              #Rails.logger.info("[LIB] [API] [HELPERS] [FORMAT_OBJECT] [FORMAT_ANALYTICS] [format_analytics_source_actions] entering ")
              return params[:hash] if params[:enabled_services].nil?

              total =0
              params[:hash][:counts][:actions].each do |k,v|
                v = format_analytics_common(:hash => v, :enabled_services => params[:enabled_services])
                total += v[:total] if v.size != 0
              end

              total > 0 ? params[:hash][:counts][:total] = total : params[:hash] = {}
              puts params[:hash]
              #Rails.logger.info("[LIB] [API] [HELPERS] [FORMAT_OBJECT] [FORMAT_ANALYTICS] [format_analytics_source_actions] leaving ")
              params[:hash]
            rescue => e
              Rails.logger.error("[LIB] [API] [HELPERS] [FORMAT_OBJECT] [FORMAT_ANALYTICS] [format_analytics_source_actions]  **** RESCUE **** #{e.message} For #{params.inspect}")
              {}
            end

            #  ##format a local_actions analytics to generic form
            #INPUT=>  {
            #           :hash => {
            #                     :counts => {
            #                                 :total => 95,
            #                                 :actions => {
            #                                              :upvote => 20, :recommendations => 30
            #                                             }
            #                               }
            #                    },
            #           :enabled_services => ["facebook"] [OPTIONAL]
            #         }

            def format_analytics_local_actions(params)
              #Rails.logger.info("[LIB] [API] [HELPERS] [FORMAT_OBJECT] [FORMAT_ANALYTICS] [format_analytics_local_actions] entering ")

              puts params[:hash]
              #Rails.logger.info("[LIB] [API] [HELPERS] [FORMAT_OBJECT] [FORMAT_ANALYTICS] [format_analytics_local_actions] leaving ")

              params[:hash]
            rescue => e
              Rails.logger.error("[LIB] [API] [HELPERS] [FORMAT_OBJECT] [FORMAT_ANALYTICS] [format_analytics_local_actions]]  **** RESCUE **** #{e.message} For #{params.inspect}")
              {}
            end

            #  ##format a weeks analytics to generic form.
            #INPUT=>{
            #        :hash =>{
            #                :services => {:facebook => 5, :twitter => 2}, #overall posts in services this week
            #                :topics =>   {
            #                               "sports" => {
            #                                             :summary_id => 123,
            #                                             :posts => {
            #                                                        :counts => {
            #                                                                     :total => 95,
            #                                                        :services =>  {
            #                                                                        :facebook => 20, :twitter => 30, :actwitty => 45
            #                                                                      }
            #                                                                   }
            #                                                       }
            #
            #                                            :documents => {
            #                                                            :counts => {
            #                                                                        :total => 6,
            #                                                                        :categories => {
            #                                                                                        :image => {
            #                                                                                                   :total => 2,
            #                                                                                                   :services => {:facebook => 1, :twitter => 1}
            #                                                                                                  },
            #                                                                                        :video => {
            #                                                                                                   :total => 2,
            #                                                                                                   :services =>  {:facebook => 1, :twitter => 1}
            #                                                                                                  },
            #                                                                                        :audio => {
            #                                                                                                   :total => 0,
            #                                                                                                   :services => {}
            #                                                                                                  },
            #                                                                                       :document => {
            #                                                                                                     :total => 0,
            #                                                                                                     :services => {}
            #                                                                                                    },
            #                                                                                       :link => {
            #                                                                                                   :total => 2,
            #                                                                                                   :services =>  {:facebook => 2}
            #                                                                                                }
            #                                                                                      }
            #                                                                       }
            #                                                        },
            #                                          :locations => {
            #                                                         :counts => {
            #                                                                     :total => 95,
            #                                                                     :services => {
            #                                                                                    :facebook => 20, :twitter => 30, :actwitty => 45
            #                                                                                  }
            #                                                                    }
            #                                                       },
            #                                         :entities => {
            #                                                       :counts => {
            #                                                                     :total => 95,
            #                                                                     :services => {
            #                                                                                    :facebook => 20, :twitter => 30, :actwitty => 45
            #                                                                                  }
            #                                                                  }
            #                                                     },
            #                                        :source_actions  => {
            #                                                             :counts => {
            #                                                                          :total => 100,
            #                                                                          :actions => {
            #                                                                                        :likes => {
            #                                                                                                    :total => 50,
            #                                                                                                    :services => {:facebook => 20, :twitter => 30}
            #                                                                                                  },
            #                                                                                        :comments => {
            #                                                                                                       :total => 50,
            #                                                                                                       :services => {:facebook => 20, :twitter => 30}
            #                                                                                                     }
            #                                                                                     }
            #                                                                       }
            #                                                           },
            #                                       :local_actions =>  {
            #                                                            :counts => {
            #                                                                         :total => 95,
            #                                                                         :actions => {
            #                                                                                       :upvote => 20, :recommendations => 30
            #                                                                                     }
            #                                                                       }
            #                                                          }
            #                                 },
            #
            #                           "technology" => {:summary_id => 124, :posts => {...},}
            #                       }
            #               },
            #         :enabled_services => ["facebook"] [OPTIONAL]
            #       }
            def format_analytics_weeks(params)
              #Rails.logger.info("[LIB] [API] [HELPERS] [FORMAT_OBJECT] [FORMAT_ANALYTICS] [format_analytics_weeks] entering ")

              return params[:hash] if params[:enabled_services].nil?

              params[:hash][:topics].each do |topic,analytics| #for example topic => sports, analytics => {:summary_id => 123, :posts => {}, :documents => {}, ...}
                analytics.each do |k,v|
                  v = send("format_analytics_#{k}", {:hash => v, :enabled_services => params[:enabled_services]}) if k != :summary_id
                  analytics.delete(k) if v.blank? #delete individual hash => posts, documents, locations, entities, local_actions, source_actions
                end
                params[:hash][:topics].delete(topic) if analytics.size <= 1 #delete a topic if only summary_id is remaining
              end

              params[:hash].delete(:topics) if params[:hash][:topics].blank? #delete topics hash

              params[:hash][:services].each do |service, count|
                params[:hash][:services].delete(service) if params[:enabled_services][service].nil? #delete services from top level services hash
              end

              params[:hash].delete(:services) if params[:hash][:services].blank? #delete service hash

              #Rails.logger.info("[LIB] [API] [HELPERS] [FORMAT_OBJECT] [FORMAT_ANALYTICS] [format_analytics_weeks] leaving ")
              params[:hash]
            rescue => e
              Rails.logger.error("[LIB] [API] [HELPERS] [FORMAT_OBJECT] [FORMAT_ANALYTICS] [format_analytics_weeks]  **** RESCUE **** #{e.message} For #{params.inspect}")
              {}
            end
          end
        end
      end
    end
  end
end