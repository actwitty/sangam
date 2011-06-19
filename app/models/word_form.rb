# == Schema Information
# Schema version: 20110609094335
#
# Table name: word_forms
#
#  id               :integer         not null, primary key
#  activity_word_id :integer         not null
#  related_word_id  :integer         not null
#  relation_type    :string(255)     not null
#  word_form_name   :string(255)     not null
#  created_at       :datetime
#  updated_at       :datetime
#

class WordForm < ActiveRecord::Base
 belongs_to :related_word, :class_name => "ActivityWord"
 belongs_to :activity_word

 validates_existence_of :activity_word_id
 validates_existence_of :related_word_id

 validates_presence_of :word_form_name, :relation_type
 validates_length_of    :word_form_name,  :in => 1..255
 validates_length_of    :relation_type,  :in => 1..255

 validates_uniqueness_of :related_word_id ,:scope => [:relation_type, :word_form_name]
end
