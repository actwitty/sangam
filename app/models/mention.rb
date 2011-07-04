# == Schema Information
# Schema version: 20110609094335
#
# Table name: mentions
#
#  id          :integer         not null, primary key
#  activity_id :integer         not null
#  user_id     :integer         not null
#  created_at  :datetime
#  updated_at  :datetime
#

class Mention < ActiveRecord::Base

  belongs_to :user
  belongs_to :activity

  validates_existence_of :user_id
  validates_existence_of :activity_id

  validates_uniqueness_of :activity_id, :scope => :user_id

  class << self
    include ActivityTextFormatter

    def create_mentions(text, activity)
       m = get_mentions(text)

       m.each do |attr|
         obj = Mention.create(:user_id => attr[0].to_i, :activity_id => activity.id)
         if obj.id.nil?
           text= untag_a_mention(text,attr[0].to_i )
         end
       end

       if m.length > 0
         text = flatten_mentions(text)

         #Save the updated mention if enrich is not done
         update = activity.update_attributes(:activity_text => text )

         if !update
           Rails.logger.error("Activity =. CreateMentions => Mentions Saving failed")
         end
       end
       text
    end
  end

end
