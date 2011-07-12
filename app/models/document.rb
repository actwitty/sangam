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
   attr_accessible  :document_data , :owner_id, :activity_id, :document_name, :document_type

   belongs_to     :owner, :class_name => "User", :touch => true
   belongs_to     :activity
   belongs_to     :activity_word

   validates_existence_of :owner_id
   validates_existence_of :activity_id,  :allow_nil => true
   validates_existence_of :activity_word_id,  :allow_nil => true

   validates_presence_of :document_name

   validates_format_of :thumb_url , :with =>  eval(AppConstants.url_validator), :unless => Proc.new{|a| a.thumb_url.nil?}
   validates_format_of :url , :with =>  eval(AppConstants.url_validator), :unless => Proc.new{|a| a.url.nil?}

   validates_length_of :document_name, :in => 3..255 #a.b
   validates_length_of :document_type, :in => 3..255
   validates_length_of :url, :in => 1..AppConstants.max_url_length, :unless => Proc.new{|a| a.url.nil?}
   validates_length_of :thumb_url, :in => 1..AppConstants.max_url_length, :unless => Proc.new{|a| a.thumb_url.nil?}


   mount_uploader :document_data, DocumentDataUploader


   validates :document_data, :presence => true, :file_size => { :maximum => AppConstants.max_document_size.megabytes.to_i }

   class << self

     #this function is called from delayed job.. when upload i done through rails server.
     #for normal uploads only documen name and URLS will come.
     #for them Document.create! is sufficient

     def delay_create(owner_id, activity_id,path)
       name = File.basename(path)
       puts "==========================  #{path}"
       d = Document.create!(:owner_id => owner_id, :activity_id => (activity_id.nil? ? nil : activity_id) ,
                        :document_name => name, :document_type => MIME::Types.type_for(name.to_s).first.to_s,
                        :document_data => File.open(path))

       d.url = d.document_data.url
       d.thumb_url = d.document_data.thumb.url
       d.save!
       puts d.inspect
     rescue => e
       Rails.logger.error("Document => delay_create => Failed with #{e.message}")
     end

     def create_document(owner_id, activity_id, path)
       Delayed::Job.enqueue DocumentJob.new(owner_id, activity_id,path)
     end

     #useful for invocation from controllers as they give ActionDispatch::HTTP::Uploader as params
     #callin "new" creates a cache snapshot of file in Rails.root/tmp/uploads as per initializers/fog.rb
     #tmp is chosen as Heroku makes only this folder writable
     #owner_id, activity_id, data_array
     #data_array is array of ActionDispatch::HTTP::Uploader
     def UploadDocument(owner_id, activity_id, data_array )
        data_array.each do |attr|
          d = Document.new(:owner_id => owner_id, :activity_id => activity_id, :document_data => attr)
          create_document(owner_id, activity_id,"#{Rails.root}/tmp#{d.document_data.to_s}")
        end
     end

    end
end



# == Schema Information
#
# Table name: documents
#
#  id               :integer         not null, primary key
#  owner_id         :integer         not null
#  activity_id      :integer
#  activity_word_id :integer
#  document_name    :string(255)     not null
#  document_type    :string(255)
#  document_data    :string(255)
#  created_at       :datetime
#  updated_at       :datetime
#  thumb_url        :text
#  url              :text
#

