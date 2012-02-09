module Api
  module Search
    class << self
      #INPUT => {
      #            :name => "sach"
      #         }
      #
      #OUTPUT => [
      #           {:id => 123, :image => "http://xyz.com", :name => "sudhanshu saxena" },
      #           {..}
      #         ]OUTPUT ARRAY

      def search_user(params)
        Rails.logger.info("[API] [SEARCH] [SEARCH_USER] entering #{params.inspect}")

        if params[:name].blank?
          Rails.logger.info("[API] [SEARCH] [SEARCH_USER] blank name #{params.inspect}")
          return []
        end

        array = []

        User.select("id,full_name,photo_small_url, user_type").order("full_name").
             where( ['users.email = ? or full_name ILIKE ?', params[:name], "#{params[:name]}%"]).all.each do |attr|

          h = {:id => attr.id, :image => attr.photo_small_url, :name => attr.full_name}

          #ADMIN USER SHOULD NOT BE SEARCHED
          array << h if attr.user_type.nil? ||  (attr.user_type == AppConstants.user_type_regular)
        end

        Rails.logger.info("[API] [SEARCH] [SEARCH_USER] leaving #{params.inspect}")
        return array
      rescue => e
        Rails.logger.error("[API] [SEARCH] [SEARCH_USER] **** RESCUE **** #{e.message} for #{params.inspect}")
        []
      end
    end
  end
end