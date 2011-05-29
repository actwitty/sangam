# == Schema Information
# Schema version: 20110528065055
#
# Table name: word_forms
#
#  id             :integer(4)      not null, primary key
#  activity_dict  :integer(4)      not null
#  word_form_type :integer(4)      not null
#  word_form_name :string(255)     not null
#  created_at     :datetime
#  updated_at     :datetime
#

class WordForm < ActiveRecord::Base
 belongs_to :activity_dict

 validates_existence_of :activity_dict

 validates_presence_of :word_form_name
 validates_length_of   :word_form_name,  :in => 1..255

end
