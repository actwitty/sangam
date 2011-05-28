class WordForm < ActiveRecord::Base
 belongs_to :activity_dict

 validates_existenece_of :activity_dict

 validate_presence_of :word_form_name
 validate_length_of   :word_form_name,  :in => 1..255

end
