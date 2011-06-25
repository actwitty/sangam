# == Schema Information
# Schema version: 20110616040229
#
# Table name: documents
#
#  id            :integer         not null, primary key
#  owner_id      :integer         not null
#  activity_id   :integer
#  document_name :string(255)     not null
#  document_type :string(255)     not null
#  document_data :string(255)
#  created_at    :datetime
#  updated_at    :datetime
#

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
require 'file_size_validator'

class Document < ActiveRecord::Base
   include ActionView::Helpers::UrlHelper
   attr_accessible  :document_data , :owner_id, :activity_id, :document_name, :document_type

   belongs_to     :owner, :class_name => "User", :touch => true
   belongs_to     :activity

   validates_existence_of :owner_id
   validates_existence_of :activity_id,  :allow_nil => true

   validates_presence_of :document_name, :document_type

   validates_length_of :document_name, :in => 3..255 #a.b
   validates_length_of :document_type, :in => 3..255

   mount_uploader :document_data, DocumentDataUploader


   validates :document_data, :presence => true, :file_size => { :maximum => 0.5.megabytes.to_i }

   class << self
     def delay_create(owner_id, activity_id,path)
       name = File.basename(path)
       puts "==========================  #{path}"
       d = Document.create!(:owner_id => owner_id, :activity_id => (activity_id.nil? ? nil : activity_id) ,
                        :document_name => name, :document_type => MIME::Types.type_for(name.to_s).first.to_s,
                        :document_data => File.open(path))
       #puts  d.document_data
     rescue => e
       Rails.logger.error("Document => delay_create => Failed with #{e.message}")
     end

     def create_document(owner_id, activity_id, path)
       Delayed::Job.enqueue DocumentJob.new(owner_id, activity_id,path)
     end

     #useful for invocation from controllers as they give ActionDispatch::HTTP::Uploader aas params
     #callin "new" creates a cache snapshot of file in Rails.root/tmp/uploads as per initializers/fog.rb
     #tmp is chosen as Heroku makes only this folder writable
     def UploadDocument(owner_id, activity_id, params )
        d = Document.new(params[:document])
        create_document(owner_id, activity_id,"#{Rails.root}/tmp#{d.document_data.to_s}")
     end

    end
end

