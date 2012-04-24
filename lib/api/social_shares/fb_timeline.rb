module Api
  module FBTimeline
    class << self
      #INPUT => {
      #            :user_id => "",
      #            :activities => [ {:category => "", :url => ""} ,{:category => "", :url => ""} ]
      #         }
      #   

      def fb_write_to_timeline(params)
        Rails.logger.info("[API] [FBTimeline] [FB_WRITE_TO_TIMELINE] entering #{params.inspect}")

        if params[:category].blank? ||  params[:user_id].blank?
          Rails.logger.info("[API] [FBTimeline] [FB_WRITE_TO_TIMELINE] entering #{params.inspect}")
          return
        end

        provider="facebook"
        facebook_auth=Authentication.find_by_user_id_and_provider(params[:user_id], provider)
        if facebook_auth.nil?
          return
        end

        begin
          Rails.logger.debug("[API] [FBTimeline] [FB_WRITE_TO_TIMELINE] Posting to FB")
          graph = Koala::Facebook::GraphAPI.new(facebook_auth.token)
          graph.put_connections( "me",
                                 
                                 :object => params[:url] )
          graph.batch do |batch_api|
            params[:activities].each do |activity|
              batch_api.put_connections(
                                          "og_lemonbaglocal:#{AW_CATEGORIES[activity[:category]]['fb_timeline']}",
                                          :object => activity[:url]
                                       )
            end
          end

          rescue Koala::Facebook::APIError
            Rails.logger.error("[API] [FBTimeline] [FB_WRITE_TO_TIMELINE] Exception in fb koala")
        end


        Rails.logger.debug("[API] [FBTimeline] [FB_WRITE_TO_TIMELINE] Posting to FB timeline done")
        return
      end 
    end
  end
end
