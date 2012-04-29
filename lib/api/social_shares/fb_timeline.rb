module Api
  module FBTimeline
    class << self
      #INPUT => {
      #            :user_id => "",
      #            :activities => [ {:category => "", :url => ""} ,{:category => "", :url => ""} ]
      #         }
      #   

      def fb_write_to_timeline_internal(params)
        puts "#{params.inspect}"
        Rails.logger.info("[API] [FBTimeline] [FB_WRITE_TO_TIMELINE] entering #{params.inspect}")
        
        if params[:activities].nil?
          Rails.logger.info("[API] [FBTimeline] [FB_WRITE_TO_TIMELINE] entering Nothing to write")
          return
        end

        provider="facebook"
        facebook_auth=Authentication.find_by_user_id_and_provider(params[:user_id], provider)
        if facebook_auth.nil?
          return
        end

        begin
          Rails.logger.debug("[API] [FBTimeline] [FB_WRITE_TO_TIMELINE] Posting to FB #{facebook_auth.token}")
          graph = Koala::Facebook::GraphAPI.new(facebook_auth.token)
          graph.batch do |batch_api|
            params[:activities].each do |activity|
               Rails.logger.debug "PUTTING #{activity[:url]}"
              batch_api.put_connections(
                                          "og_lemonbaglocal:#{AW_CATEGORIES[activity[:category]]['fb_timeline']}",
                                          :website => activity[:url]
                                       )
            end
          end

          rescue Koala::Facebook::APIError => err
            Rails.logger.error("[API] [FBTimeline] [FB_WRITE_TO_TIMELINE] Exception in fb koala #{err.message}")
        end


        Rails.logger.debug("[API] [FBTimeline] [FB_WRITE_TO_TIMELINE] Posting to FB timeline done")
        return
      end 
    end
  end
end
