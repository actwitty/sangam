module Categorization
  module DocCategorizers
    class << self
      #time being using link categorization for document_categorization
      def categorize(params)
        params[:link_cat].merge!(params[:doc_cat])
        Rails.logger.info("[LIB] [CATEGORIZATION] [DOC_CATEGORIZERS] [categorize] => Added to link #{params[:doc_cat].size} #{params[:link_cat].size}")
      end
    end
  end
end