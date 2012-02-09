module LinkResolution
  class << self
    #link array
    def resolve_links(params)
      hash = {}
      hash = ::LinkResolution::Services::Embedly.resolve_links(params[:links_to_resolve].keys) if !params[:links_to_resolve].blank?
      hash
    end
  end
end