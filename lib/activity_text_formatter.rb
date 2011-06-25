module ActivityTextFormatter

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
    "<a href=/#{controller}/#{id} class=\"#{klass}\">#{name}</a>".html_safe
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
     arr = text.scan(/#{key}/i)
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
  def unlink_an_entity(text, entity_name, entity_id)
    regex = /<a href=\/#{AppConstants.entity_controller}\/(#{entity_id}) class=\"#{AppConstants.activity_entity_class}\">([\w\s]+)<\/a>/i
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
    txt = text.gsub( /<mention><name>[\w\s]+<name><id>#{user_id}<id><mention>/ ,
                     "<mention><name>#{m[0][0]}<name><id>#{AppConstants.invalid_resource_id}<id><mention>")
    txt
  end

  #convert a mention link into normal name without a link
  #this is used when user id mentioned in mention gets deleted
  #TODO - NOT UTF8 Compliance
  def unlink_a_mention(text, user_name, user_id)
    text.gsub!(  /#{link_to_type(AppConstants.user_controller,AppConstants.activity_mention_class, user_name, user_id)}/ ,user_name)
    text
  end

  #Removes the mentions from text
  #This will be used when sending the activity text for entity search
  #TODO - NOT UTF8 Compliance
  def remove_all_mentions(text)
    txt = text.gsub(/<a href=\/#{AppConstants.user_controller}\/\d+
                     class=\"#{AppConstants.activity_mention_class}\">[\w\s]+<\/a>/, "")
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

  #Masks the mentions with seeds
  #This will be done before processing the entity replacement as otherwise entity can replace mentions in some corner cases
  #TODO - NOT UTF8 Compliance
  def mask_mentions(text, seed_index, seed_hash)
    regex = /<a href=\/#{AppConstants.user_controller}\/\d+ class=\"#{AppConstants.activity_mention_class}\">[\w\s]+<\/a>/
    m = text.scan(regex)
    i =seed_index
    m.each do |attr|
      seed_hash[attr] = generate_seed(i, attr)
      text = text.gsub(attr , "#{seed_hash[attr]}" )
      i = i+ 1
    end
    text
  end
  #this is used in after flatten_entities to restore mentions
  def unmask_mentions(text, seed_hash)
    seed_hash.each do |key, value|
       text.gsub!(value ,key)
    end
    text
  end

  def mark_entities(text, entities)
    seed_hash ={}
    text = mask_mentions(text, 0, seed_hash)
    text = flatten_entities(text, entities, seed_hash.length)
    text = unmask_mentions(text, seed_hash)
    text
  end

  def test_format_text(text,entities)
    seed_hash ={}

    text = flatten_mentions(text)

    text = mask_mentions(text, 0, seed_hash)
    text = flatten_entities(text, entities, seed_hash.length)
    text = unmask_mentions(text, seed_hash)
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
    text = unlink_an_entity(text,"pizza", 345)
    puts text
  end

end