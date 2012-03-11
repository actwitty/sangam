module Api
  module Summaries
    class << self
      #INPUT
      #  {
      #    :user_id => 123
      #    :enabled_services => ["facebook', "twitter"...] #[OPTIONAL] Needed only when analytics of some services needs to blocked.. for privacy
      #  }
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
      #]

      def get_summary(params)

        Rails.logger.info("[LIB] [API] [SUMMARIES] [GET_SUMMARY] entering #{params.inspect}")

        if params[:user_id].blank?
          Rails.logger.info("[LIB] [API] [SUMMARIES] [GET_SUMMARY] Leaving => Blank User ID => #{params.inspect}")
          return {}
        end


        array = []
        summary = Summary.includes(:user).where(:user_id => params[:user_id]).order("source_created_at DESC").all.each do |attr|
          array << {
                   :id => attr.id,
                   :word => {:id => attr.activity_word_id, :name => attr.activity_name},
                   :user => {:id => attr.user_id, :full_name => attr.user.full_name, :photo => attr.user.photo_small_url},
                   :analytics_snapshot => ::Api::Helpers::FormatObject.format_analytics(
                                                                                           :hash => attr.analytics_snapshot,
                                                                                           :enabled_services => attr.enabled_services
                                                                                       ),
                   :category_id => attr.category_id,
                   :category_type => attr.category_type
                 }
        end

        Rails.logger.info("[LIB] [API] [SUMMARIES] [GET_SUMMARY] leaving #{params.inspect}")

       # array  = array.sort {|a,b| b[:analytics_snapshot][:posts][:total] <=> a[:analytics_snapshot][:posts][:total]}

        array
      rescue => e
        Rails.logger.info("[LIB] [API] [SUMMARIES] [GET_SUMMARY] **** RESCUE **** #{e.message} For #{params.inspect}")
        []
      end


      #INPUT => {
      #           :user_id => 123 [MANDATORY]
      #           :summary_ids => [1,2, 3, 4..] [MANDATORY] 50 MAXIMUM
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
      #]
      def get_summary_by_id(params)

        Rails.logger.info("[LIB] [API] [SUMMARIES] [GET_SUMMARY_BY_ID] entering #{params.inspect}")

        if params[:user_id].blank? or params[:summary_ids].blank?
          Rails.logger.info("[LIB] [API] [SUMMARIES] [GET_SUMMARY_BY_ID] entering #{params.inspect}")
          return []
        end

        params[:summary_ids] = params[:summary_ids][0..AppConstants.max_number_of_summaries]

        array = []
        summary = Summary.includes(:user).where(:id => params[:summary_ids],:user_id => params[:user_id]).
                                                                                 order("source_created_at DESC").all.each do |attr|
          array ={
                   :id => attr.id,
                   :word => {:id => attr.activity_word_id, :name => attr.activity_name},
                   :user => {:id => attr.user_id, :full_name => attr.user.full_name, :photo => attr.user.photo_small_url},
                   :analytics_snapshot => ::Api::Helpers::FormatObject.format_analytics(
                                                                                           :hash => attr.analytics_snapshot,
                                                                                           :enabled_services => attr.enabled_services
                                                                                       ),
                   :category_id => attr.category_id,
                   :category_type => attr.category_type
                 }
        end

        Rails.logger.info("[LIB] [API] [SUMMARIES] [GET_SUMMARY_BY_ID] leaving #{params.inspect}")

        array
      rescue => e
        Rails.logger.info("[LIB] [API] [SUMMARIES] [GET_SUMMARY_BY_ID] **** RESCUE **** #{e.message} For #{params.inspect}")
        []
      end

      #INPUT => {
      #           :current_user_id => 123, {FOr internal use => verifies acting and ad acted upon user is same]
      #           :user_id => 123,
      #           :summary_id => 123,
      #           :name => "vote"
      #         }
      #OUTPUT => true / false

      def up_vote_summary(params)
        Rails.logger.info("[LIB] [API] [SUMMARIES] [UP_VOTE_SUMMARY] Entering #{params.inspect}")

        if params[:user_id] != params[:current_user_id]
          raise 'User is different from Current User'
        end

        obj = LocalAction.create_local_action(:author_id => params[:user_id],:summary_id => params[:summary_id], :name => AppConstants.local_action_vote )

        if obj == nil
          raise 'up_vote create failed'
        end

        Rails.logger.info("[LIB] [API] [SUMMARIES] [UP_VOTE_SUMMARY] Leaving #{params.inspect}")
      rescue => e
        Rails.logger.info("[LIB] [API] [SUMMARIES] [UP_VOTE_SUMMARY] **** RESCUE **** #{e.message} For #{params.inspect}")
        false
      end


      #INPUT => {
      #           :current_user_id => 123, {FOr internal use => verifies acting and ad acted upon user is same]
      #           :user_id => 123,
      #           :summary_id => 123,
      #         }
      #OUTPUT => true / false
      def down_vote_summary(params)
        Rails.logger.info("[LIB] [API] [SUMMARIES] [DOWN_VOTE_SUMMARY] Entering #{params.inspect}")

        if params[:user_id] != params[:current_user_id]
          raise 'User is different from Current User'
        end

        LocalAction.destroy_all(:author_id => params[:user_id],:summary_id => params[:summary_id], :name => AppConstants.local_action_vote )

        Rails.logger.info("[LIB] [API] [SUMMARIES] [DOWN_VOTE_SUMMARY] Leaving #{params.inspect}")
      rescue => e
        Rails.logger.info("[LIB] [API] [SUMMARIES] [DOWN_VOTE_SUMMARY] **** RESCUE **** #{e.message} For #{params.inspect}")
        []
      end

    end
  end
end
