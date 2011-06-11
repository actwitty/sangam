# == Schema Information
# Schema version: 20110611114344
#
# Table name: documents
#
#  id            :integer         not null, primary key
#  owner_id      :integer         not null
#  activity_id   :integer
#  document_name :string(255)     not null
#  document_type :string(255)     not null
#  document_url  :string(255)     not null
#  created_at    :datetime
#  updated_at    :datetime
#

class Document < ActiveRecord::Base

   belongs_to     :owner, :class_name => "User", :touch => true
   belongs_to     :activity

   validates_existence_of :owner
   validates_existence_of :activity,  :allow_blank => true

   validates_presence_of :document_name, :document_type,:document_url

   validates_length_of :document_name, :in => 3..255 #a.b
   validates_length_of :document_type, :in => 3..255
   validates_length_of :document_url,  :in =>  3..255

   validates_format_of :document_url, :with => eval(AppConstants.url_validator)

   mount_uploader :data_file, DataFileUploader
end
