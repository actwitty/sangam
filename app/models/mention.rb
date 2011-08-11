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
    include TextFormatter

    def create_mentions(text, activity)
       m = get_mentions(text)

       m.each do |attr|
         begin
           obj = Mention.create!(:user_id => attr[0].to_i, :activity_id => activity.id)
           if obj.id.nil?
             Rails.logger.debug("[MODEL] [MENTION] [create_mentions] mention creation failed for user #{attr[0].to_i} and #{activity.id}")
             text= untag_a_mention(text,attr[0].to_i )
           end
         rescue => e
            #Validation Uniqueness fails
            if /has already been taken/ =~ e.message
               #means mention is correct
               Rails.logger.info("[MODEL] [MENTION] [create_mentions] [rescue] => Uniq index found " )
            else
              #otherwise just untag the mention
              Rails.logger.info("[MODEL] [MENTION] [create_mentions] [rescue] =>  " +  e.message )
              text= untag_a_mention(text,attr[0].to_i )
            end
         end
       end

       if m.length > 0
         text = flatten_mentions(text)
       end
       text
    end
  end

end
