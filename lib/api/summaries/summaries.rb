module Api
  module Summaries
    class << self
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
      #]

      def get_summary(params)

        user = User.where(:id => params[:user_id]).first
        user.mock_enable_service({:user_id => params[:user_id]})

        Rails.logger.info("[LIB] [API] [SUMMARIES] [GET_SUMMARY] entering #{params.inspect}")

        if params[:user_id].blank?
          Rails.logger.info("[LIB] [API] [SUMMARIES] [GET_SUMMARY] Leaving => Blank User ID => #{params.inspect}")
          return {}
        end


        array = []
        summary = Summary.includes(:user).where(:user_id => params[:user_id]).order("updated_at DESC").all.each do |attr|
          array << {
                   :id => attr.id,
                   :word => {:id => attr.activity_word_id, :name => attr.activity_name},
                   :user => {:id => attr.user_id, :full_name => attr.user.full_name, :photo => attr.user.photo_small_url},
                   :analytics_snapshot => ::Api::Helpers::FormatObject.format_analytics(
                                                                                           :hash => attr.analytics_snapshot,
                                                                                           :services => {}
                                                                                       ),
                   :category_id => attr.category_id,
                   :category_type => attr.category_type
                 }
        end

        Rails.logger.info("[LIB] [API] [SUMMARIES] [GET_SUMMARY] leaving #{params.inspect}")
        array  = array.sort {|a,b| b[:analytics_snapshot][:posts][:total] <=> a[:analytics_snapshot][:posts][:total]}
        array
      rescue => e
        Rails.logger.info("[LIB] [API] [SUMMARIES] [GET_SUMMARY] **** RESCUE **** #{e.message} For #{params.inspect}")
        []
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
                                                                                 order("updated_at DESC").all.each do |attr|
          array ={
                   :id => attr.id,
                   :word => {:id => attr.activity_word_id, :name => attr.activity_name},
                   :user => {:id => attr.user_id, :full_name => attr.user.full_name, :photo => attr.user.photo_small_url},
                   :analytics_snapshot => ::Api::Helpers::FormatObject.format_analytics(
                                                                                           :hash => attr.analytics_snapshot,
                                                                                           :services => {}
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
    end
  end
end
