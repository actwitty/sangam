module Categorization
  module MusicCategorizers
    class << self
      def categorize(params)
        Rails.logger.info("[LIB] [CATEGORIZATION] [MUSIC_CATEGORIZATERS] [categorize] =>  #{params[:music_cat].keys.size}")
        params[:music_cat].each do |k,v|
          v.each do |idx|
            activity = params[:activities][idx][:post]
            activity[:category_id] =  "entertainment"
            activity[:word] = "entertainment"   #SUMMARY_CATEGORIES[category]['channel']
            activity[:links][0][:category_id] =  "entertainment" #SUMMARY_CATEGORIES[category]['channel'
          end
        end
      end
    end
  end
end