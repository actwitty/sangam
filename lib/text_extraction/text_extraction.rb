module TextExtraction
  def self.extract_text(params)
    Rails.logger.info("[MODULE] [TEXT_EXTRACTION] [extract_text] entering =>
                      Text Hash Size = #{params[:text_cat].size}, Link Hash Size = #{params[:link_cat].size}")
    hash = {}
    if !params[:link_cat].blank?
      hash = ::TextExtraction::Services::AlchemyApi.extract_text(params[:link_cat].keys)

      hash.each do |k,v|
        if v[:description].length >= AppConstants.min_text_length_for_text_categorization
          params[:link_cat][k].each do |idx|
            params[:text_cat][idx] = {:text => v[:description][0..(AppConstants.max_text_length_for_text_categorization - 1)]}
          end
          params[:link_cat].delete(k)
        end
      end
    end
    Rails.logger.info("[MODULE] [TEXT_EXTRACTION] [extract_text] Leaving =>
                      Text Hash Size = #{params[:text_cat].size}, Link Hash Size = #{params[:link_cat].size}")
  end
end