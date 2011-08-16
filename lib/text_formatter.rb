module TextFormatter
  include TranslateText

  #generates the masking string to mark an entity or mention for easy replacement
  def generate_seed(idx, str)
    s = ""
    len = str.length
    len.times do
      s = s + "#{idx.to_s}"
    end
    s
  end

  #convert to html urls
  def link_to_type(controller, klass, name, id)
    "<a href=\# value=#{id} class=#{klass}>#{name}</a>".html_safe
  end

  #add entity references in text
  def flatten_entities(text, entity_hash, seed_index)

   seed_array = {}
   all_case = {}

   #sort the entity array based on key length as replacement should start from longest strng first
   entity_hash = entity_hash.sort {|x, y| y[0].length <=> x[0].length}

   #collect all possible combination ( in various cases ) of anentity from text
   #assign ids also - ids will be same as of actual entity.
   #exmaple =>> Entity_hash => {"Pizza Hut"=> 2345}, In text should be "piZZa hUt" => 2345, "pizza hut" => 2345
   entity_hash.each do |key, value|
     arr = text.scan(/#{key}\b/i)
     arr.each do |attr|
      all_case[attr] = value
     end
   end

   #Generate Seed corresponding to all forms of entity => this is to avoid the nested overwrites
   #Example => If substitution is done here, pizza in  <a hres=/entities/2345>Pizza hut</a> can be
   #overwritten while substituting Pizza entity ...
   i = seed_index
   all_case.each do |key, value|
    seed_array[key] = generate_seed(i, link_to_type(AppConstants.entity_controller, AppConstants.activity_entity_class, key, value))
    text = text.gsub(key , "#{seed_array[key]}" )
    i = i+ 1
   end

   #Finally substitute the
   seed_array.each do |key, value|
     text = text.gsub(value , link_to_type(AppConstants.entity_controller, AppConstants.activity_entity_class, key, all_case[key]))
    end
   text
  end

  #convert an entity link into normal name without a link
  #this is used when entity id mentioned in entity url does not exist
  def unlink_an_entity(text,  entity_id)
    regex = /<a href=\# value=(#{entity_id}) class=#{AppConstants.activity_entity_class}>([\w\s]+)<\/a>/i
    m = text.scan(regex)
    m.each do |m_array|
      text.gsub!( /#{link_to_type(AppConstants.entity_controller,AppConstants.activity_entity_class, m_array[1], m_array[0])}/ ,m_array[1])
    end
    text
  end

  #convert a mention in received text ( not converted into links, only tags are there) into normal name without tags
  #this is used when user id mentioned in mention is does not exist
  #TODO - NOT UTF8 Compliance
  def untag_a_mention(text, user_id)
    regex = /<mention><name>([\w\s]+)<name><id>#{user_id}<id><mention>/
    m = text.scan(regex)
    #txt = text.gsub( /<mention><name>[\w\s]+<name><id>#{user_id}<id><mention>/ ,
    #                 "<mention><name>#{m[0][0]}<name><id>#{AppConstants.invalid_resource_id}<id><mention>")
    txt = text.gsub( /<mention><name>[\w\s]+<name><id>#{user_id}<id><mention>/ , m[0][0])
    txt
  end

  #convert a mention link into normal name without a link
  #this is used when user id mentioned in mention gets deleted
  #TODO - NOT UTF8 Compliance
  def unlink_a_mention(text, user_name, user_id)
    text.gsub!(  /#{link_to_type(AppConstants.user_controller,AppConstants.activity_mention_class, user_name, user_id)}/ ,user_name)
    text
  end

  #Removes the mentions and tags from text. Regex is OR for mentions and tags
  #This will be used when sending the activity text for entity search
  #TODO - NOT UTF8 Compliance
  def remove_mentions_and_tags(text)
    txt = text.gsub(/(<a href=\# value=\d+ class=#{AppConstants.activity_mention_class}>[\w\s]+<\/a>)|(#[\w\d]+[^\s])/, "")
    txt = txt.strip
  end


  #returns a double dimension array of user ids from mentions
  #TODO - NOT UTF8 Compliance
  def get_mentions(text)
    regex = /<mention><name>[\w\s]+<name><id>(\d+)<id><mention>/
    m = text.scan(regex)
    m
  end

  #Replace all mentions with their corresponding html
  #TODO - NOT UTF8 Compliance
  def flatten_mentions(text)
    regex = /(<mention><name>[\w\s]+<name><id>\d+<id><mention>)/
    arr = text.scan(regex)
    arr.each do |key|
       m = key[0].scan( /<mention><name>([\w\s]+)<name><id>(\d+)<id><mention>/)
       text.gsub!(key[0] ,link_to_type(AppConstants.user_controller, AppConstants.activity_mention_class, m[0][0], m[0][1]))
    end
    text
  end

  #Masks the mentions and tags with seeds. Regex is OR for mentions and tags
  #This will be done before processing the entity replacement as otherwise entity can replace mentions in some corner cases
  #TODO - NOT UTF8 Compliance
  def mask_activity_text(text, seed_index, seed_hash)

    str = "#{AppConstants.video_sources}|#{AppConstants.image_sources}|#{AppConstants.document_sources}
                |#{AppConstants.audio_sources}"

    #Regex for mention or hashtag or url
    regex = /(<a href=\# value=\d+ class=#{AppConstants.activity_mention_class}>[\w\s]+<\/a>)|(#[\w\d]+[^\s])|((http:\/\/|https:\/\/)?(www.)?(#{str}){1}(\/[^\s]*)?)/

    m = text.scan(regex)

    i =seed_index
    m.each do |attr|

      #strip array into only 3  fields as url can have many fields matched like http://, www. etc
      attr = attr[0..2]

      #attr will be in format of [mention, nil, nil] or [nil, tag, nil] or [nil, nil, http://google.com] because of OR in regex
      attr = attr.compact

      seed_hash[attr[0]] = generate_seed(i, attr[0])
      text = text.gsub(attr[0] , "#{seed_hash[attr[0]]}" )

      i = i+ 1
    end
    text
  end


  #this is used in after flatten_entities to restore mentions
  def unmask_activity_text(text, seed_hash)
    seed_hash.each do |key, value|
       text.gsub!(value ,key)
    end
    text
  end

  def mark_entities(text, entities)
    seed_hash ={}
    text = mask_activity_text(text, 0, seed_hash)
    text = flatten_entities(text, entities, seed_hash.length)
    text = unmask_activity_text(text, seed_hash)
    text
  end

  #need to write strong parser for remote docs
  #this is temporary for time being.. need to make all the parse in one call
  # like mentions, documents and hashes
  #TODO
  def get_documents(text)
    array = []

    str = "#{AppConstants.video_sources}|#{AppConstants.image_sources}|#{AppConstants.document_sources}
                |#{AppConstants.audio_sources}"
    arr = text.scan(/((http:\/\/|https:\/\/)(www.)?(#{str}){1}(\/[^\s]*)?)/)

    arr.each do |attr|

      if attr[3] =~ /#{AppConstants.document_sources}/
        array << {:mime => AppConstants.mime_remote_document, :url => attr[0], :provider => attr[3], :uploaded => false}

      elsif attr[3] =~ /#{AppConstants.image_sources}/
        array << {:mime => AppConstants.mime_remote_image, :url => attr[0], :provider => attr[3],:uploaded => false}

      elsif attr[3] =~ /#{AppConstants.video_sources}/
        array << {:mime => AppConstants.mime_remote_video, :url => attr[0], :provider => attr[3],:uploaded => false}

      elsif attr[3] =~ /#{AppConstants.audio_sources}/
        array << {:mime => AppConstants.mime_remote_music, :url => attr[0], :provider => attr[3],:uploaded => false}
      end

    end

    array
  end
  #need to write strong parser for remote docs
  #this is temporary for time being.. need to make all the parse in one call
  # like mentions, documents and hashes
  #TODO
  def get_tags(text)
    arr = text.scan(/(#[\w\d]+[^\s])/)
    array = []

    arr.each do |attr|
      array << {:name => attr[0], :tag_type => AppConstants.tag_type_hash}
    end
    array
  end
  def format_activity_word(word)
    h = {}
    h = {:id => word.id,
         :name => word.word_name
        }
    h
  end

  def format_entity(entity)
    h = {}
    h = {:id => entity.id,
         :name => entity.entity_name,
         :image => AppConstants.entity_image_thumb_base + entity.entity_image,
         :description => (!entity.entity_doc['key'].blank? && !entity.entity_doc['key']['value'].blank?) ?
                          AppConstants.entity_description_url + entity.entity_doc['key']['value'] : nil
        }
    h
  end
  #format social counter
  def format_social_counter(attr)

    if attr.nil?
      return {}
    end
    hash = {}
    hash = {:source_name => attr.source_name, :action => attr.action}
  end

  #format a location object to generic form
  def format_location(loc)
    h = {}
    case loc.location_type
      when AppConstants.location_type_web
        h = {:type => AppConstants.location_type_web, :url => loc.location_url, :name => loc.location_name}
      when AppConstants.location_type_geo
        h = {:type => AppConstants.location_type_geo, :lat => loc.location_lat, :long => loc.location_long,
            :name => loc.location_name}
      when AppConstants.location_type_unresolved
        h = {:type => AppConstants.location_type_unresolved, :name => loc.location_name}
      else
        h = {}
    end
    h[:id] = loc.id if !h.blank?
    h
  end


  #formats an activity object to compatible format for sending outside
  def format_activity(activity)

    hash = {}
    if activity.blank?
      return {}
    end

    author = activity.author
    hash[:post]={
        :id => activity.id,
        :user => {:id => author.id, :full_name => author.full_name, :photo => author.photo_small_url},
        :word => {:id => activity.activity_word_id, :name => activity.activity_name},
        :time => activity.updated_at,
        :text => translate_activity_text(activity),
        :enriched => activity.enriched,
        :summary_id => activity.summary_id,
        :sub_title => activity.sub_title,
        :source_name => activity.source_name,
        :status => activity.status,
        :campaign_types => activity.campaign_types
      }

    if !activity.base_location_id.blank?
      hash[:location] = format_location(activity.base_location)
      #hash[:location][:id] = activity.base_location_id
    end
    hash
  end

  #formats an comment to compatible format for sending outside
  def format_comment(comment)
    hash = {}
    if comment.blank?
      return {}
    end
    author = comment.author
    hash[:comment] = {
              :id => comment.id,
              :user => {:id => comment.author_id, :full_name => author.full_name,:photo => author.photo_small_url},
              :text => comment.text,
              :time => comment.updated_at,
#              :source_name => comment.source_name,
#              :status => comment.status
           }
    hash
  end

  #formats an document hash  to compatible format for sending outside
  def format_document(document)
    hash = {}
    if document.blank?
      return {}
    end

    hash[:document] = {
              :id => document.id,
              :url => document.url,
              :thumb_url => document.thumb_url,
              :caption => document.caption,
              #:time =>  document.updated_at
              :source_name => document.source_name,
              :status => document.status,
              :uploaded => document.uploaded,
              :category => document.category,
              :activity_id => document.activity_id,
              :summary_id => document.summary_id           }
    hash
  end
  #formats an campaign  ( extra => user_id which tells if current user is there & count )
  #to compatible format for sending outside
  def format_campaign(campaign, user_id = nil)
    hash = {}
    if campaign.blank?
      return {}
    end
    if user_id.nil?
      hash[:campaign] = { :name => campaign.name, :count=> campaign.count,:user => false }
    else
      hash[:campaign] = { :name => campaign.name, :count=> campaign.count,:user => true, :user_id =>campaign.user_id }
    end
  end

  #format tag
  def format_tag(tag)
    hash = {}
    if tag.blank?
      return {}
    end

    hash[:tag] = {
              :id => tag.id,
              :name =>  tag.name,
              :type => tag.tag_type,
              :source_name => tag.source_name,
              :status => tag.status,
           }
    hash
  end
  def test_format_text(text,entities)
    seed_hash ={}

    text = flatten_mentions(text)

    text = mask_activity_text(text, 0, seed_hash)
    text = flatten_entities(text, entities, seed_hash.length)
    text = unmask_activity_text(text, seed_hash)
    text
  end
  def formatter_test
    text = "pizZa at PizZa frieds hUt at dominos Pizza at pizza Frieds hello   <mention><name>Alok Srivastava<name><id>234<id><mention> pizza eating <mention><name>PIZZA<name><id>235<id><mention> "
    puts text
    puts "+++++++++++++++++++++++++++++++++++++++++++++"
    m = get_mentions(text)
    puts m
    puts m[0].class
    puts m[0]
    puts "+++++++++++++++++++++++++++++++++++++++++++++"
#    text = untag_a_mention(text, 234)
#    puts text
#    puts "+++++++++++++++++++++++++++++++++++++++++++++"
    text = test_format_text(text, {  "pizza"=> 345, "Pizza Frieds hut" => 234, "frieds" => 456})
    puts text
    puts "+++++++++++++++++++++++++++++++++++++++++++++"
    text = unlink_a_mention(text,"PIZZA", 235)
    puts text
    puts "+++++++++++++++++++++++++++++++++++++++++++++"
    text = unlink_an_entity(text, 345)
    puts text
    text = remove_mentions_and_tags(text)
    puts text
  end

end