module ActivityApi
  
  #INPUT = Array of activity ids
  #OUTPUT =   See get_stream output
  def get_all_activity(activity_ids)

    Rails.logger.debug("[MODEL] [User] [get_all_activity] entering ")
    array = []
    index = 0
    hash = {}

    Activity.includes(:author, :base_location).where(:id => activity_ids).order("updated_at DESC").all.each do |attr|

      array << format_activity(attr)
      array[index][:comments] = {:count => attr.comments.size, :array => [] }
      array[index][:documents]= {:count => attr.documents.size, :array => []}
      array[index][:tags]=      {:count => attr.tags.size, :array => []}
      array[index][:campaigns]= []
      hash[attr.id] = index
      index = index + 1
    end

    #Commenting this whole blob. As per New UX only count is needed
#    Comment.includes(:author).where(:activity_id => activity_ids).all.each do |attr|
#       h = format_comment(attr)
#       array[hash[attr.activity_id]][:comments][:array] << h[:comment]
#    end

    Document.where(:activity_id => activity_ids).all.each do |attr|
       h = format_document(attr)
       array[hash[attr.activity_id]][:documents][:array] << h[:document]
    end

    Tag.where(:activity_id => activity_ids).all.each do |attr|
       h = format_tag(attr)
       array[hash[attr.activity_id]][:tags][:array] << h[:tag]
    end

    campaign_hash = {}
    temp_hash = {}
    index = 0
    #Get all the campaigns grouped for those activity
    Campaign.where(:activity_id => activity_ids).group(:activity_id, :name).count.each do |k,v|

       h = {:name => k[1], :count => v , :user => false}
       campaign_hash[k[0]].nil? ? campaign_hash[k[0]] = [h] : campaign_hash[k[0]] << h
       temp_hash[{:id => k[0], :name => k[1]}] = campaign_hash[k[0]].count -1

    end

    #Get all the campaigns grouped for those activity by current user
    #Set user_id if user has acted on  campaign
    Campaign.where(:activity_id => activity_ids, :author_id => self.id).group(:activity_id, :name).count.
        each do |k,v|
        if !campaign_hash[k[0]].nil?
          campaign_hash[k[0]][temp_hash[{:id => k[0], :name => k[1]}]][:user] =  true
          campaign_hash[k[0]][temp_hash[{:id => k[0], :name => k[1]}]][:user_id] =  self.id
       end
    end


    campaign_hash.each do |k,v|
      v.each do |entry|
       array[hash[k]][:campaigns] << entry
      end
    end

    Rails.logger.debug("[MODEL] [User] [get_all_activity] leaving")
    array
  end
end
