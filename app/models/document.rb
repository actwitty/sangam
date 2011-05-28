#TODO whole document validations should happpen
class Document < ActiveRecord::Base

   belongs_to     :owner, :class_name => "User", :touch => true

   validates_existence_of :owner

   validates_presence_of :document_name, :document_type,:document_url

   #TODO need to add Paperclip stuffs
   validates_length_of :document_name, :in => 3..255 #a.b
   validates_length_of :document_type, :in => 3..255
   validates_length_of :document_url, :maximum => 255

   validates_format_of :document_url, :with => URI::regexp(%w(http https))
   # TODO Paperclip validates_format_of :document_name
   # TODO Paperclip validates_format_of :document_type
end
