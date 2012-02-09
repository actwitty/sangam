module TermExtraction

  DOCUMENT_LENGTH = 7168 #around 50 Tweets => actual Zemanta limit is 8 KB

  #concate strings to create documents and then get the keywords in it.We are using zemanta for key word extraction
  #then hit freebase (batch api) to get details on keywords (as entities). Finally distribute those entities to
  #strings in text_hash
  def self.get_terms(params)
    Rails.logger.info("[LIB] [TERM_EXTRACTION] [GET_TERMS] Entering => Size of hash #{params[:term_extract].size}")

    get_entities(params[:term_extract])

    params[:term_extract].each do |k, v|
      params[:activities][k][:post][:entities] =  v[:entities]
    end

    Rails.logger.info("[LIB] [TERM_EXTRACTION] [GET_TERMS] Leaving")
  end

  #updates strings in text_hash with respective entities of format
  # {(id of text) 0 => {:text => "Dropbox is cool service", :entities =>  [ {:id => "/en/dropbox",         //unique id regarding entity   always present if content found in freebase
  #   :name=> "Dropbox",      //name of entity   always present
  #   :type=> {:id=>"/music/artist", :name=>"Musical Artist"}}]} }
  #
  def self.get_entities(text_hash)
    Rails.logger.info("[LIB] [TERM_EXTRACTION] [GET_ENTITIES] Entering => Size of hash #{text_hash}")
    doc_hash = {}
    str = ""
    index = 0

    text_hash.each do |k,v|
      v = v[0..DOCUMENT_LENGTH]
      if (str + v).length > DOCUMENT_LENGTH

        keywords = ::TermExtraction::Services::Zemanta.get_keywords_markup(str)

        entities=::TermExtraction::Services::Freebase.search_freebase(keywords)

        add_entities_to_text(text_hash, doc_hash, entities)

        #restart again
        str = v + ". "   #a string can not be bigger than document length itself
        doc_hash = {}
      else
        #keep adding to string
        str = str + v + ". "
      end
      doc_hash[k] = v
    end

    #the last one  .. will always be left over
    if !doc_hash.blank?
      keywords = ::TermExtraction::Services::Zemanta.get_keywords_markup(str)

      entities=::TermExtraction::Services::Freebase.search_freebase(keywords)

      add_entities_to_text(text_hash, doc_hash, entities)
    end

    Rails.logger.info("[LIB] [TERM_EXTRACTION] [GET_ENTITIES] Leaving")

  rescue => e
    Rails.logger.info("[LIB] [TERM_EXTRACTION] [GET_ENTITIES] **** RESCUE **** #{e.message} for #{text_hash.inspect}")
  end


  def self.add_entities_to_text(text_hash, doc_hash, entities)
     Rails.logger.info("[LIB] [TERM_EXTRACTION] [ADD_ENTITIES_TO_TEXT] Entering => Enities Size = #{entities.size}")
     array = []
     doc_hash.each do |idx, str|
       entities.each do |k,v|
         arr = str.scan(/#{k}\b/i)
         if arr.length  > 0
            array << {:name => v[:name], :id => v[:id], :type => v[:type], :svc => v[:svc]}
         end
       end
       h = {:text => text_hash[idx], :entities => array}
       text_hash[idx] = h
       array = []
     end
     Rails.logger.info("[LIB] [TERM_EXTRACTION] [ADD_ENTITIES_TO_TEXT] Leaving ")
  rescue => e
    Rails.logger.info("[LIB] [TERM_EXTRACTION] [GET_ENTITIES] **** RESCUE ****  #{e.message} for #{params.inspect}")
  end
end
