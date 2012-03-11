module LinkResolution
  class << self
    #link array
    def resolve_links(params)
      Rails.logger.info("[LIB] [LINK_RESOLUTION] [resolve_links] => Entering #{params[:links_to_resolve]}")
      hash = {}
      #hash = ::LinkResolution::Services::Embedly.resolve_links(params[:links_to_resolve].keys) if !params[:links_to_resolve].blank?
      hash = ::LinkResolution::Services::Actwitty.resolve_links(params[:links_to_resolve].keys) if !params[:links_to_resolve].blank?

      Rails.logger.info("[LIB] [LINK_RESOLUTION] [resolve_links] => Leaving")
      hash
    rescue => e
      Rails.logger.error("[LIB] [LINK_RESOLUTION] [resolve_links] **** RESCUE **** => #{e.message}")
      {}
    end
  end
end