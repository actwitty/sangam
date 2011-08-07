#require 'file_size_validator'

class Document < ActiveRecord::Base

   belongs_to     :owner, :class_name => "User"
   belongs_to     :activity_word

   belongs_to     :summary, :counter_cache => true

   belongs_to     :activity, :counter_cache => true

   has_many       :comments,  :dependent => :destroy, :order => "updated_at DESC"
   has_many       :campaigns,  :dependent => :destroy, :order => "updated_at DESC"

   validates_existence_of :owner_id
   validates_existence_of :activity_id
   validates_existence_of :activity_word_id
   validates_existence_of :summary_id

   validates_presence_of  :name, :url, :mime, :source_name, :status

   validates_format_of    :thumb_url , :with =>  eval(AppConstants.url_validator), :unless => Proc.new{|a| a.thumb_url.nil?}
   validates_format_of    :url , :with =>  eval(AppConstants.url_validator), :unless => Proc.new{|a| a.url.nil?}

   validates_length_of    :name, :in => 1..AppConstants.document_name_length
   validates_length_of    :mime, :in => 1..AppConstants.document_mime_length
   validates_length_of    :url, :in => 1..AppConstants.url_length
   validates_length_of    :source_name,    :in => 1..AppConstants.source_name_length
   validates_length_of    :thumb_url, :maximum => AppConstants.url_length, :unless => Proc.new{|a| a.thumb_url.nil?}
   validates_length_of    :caption, :maximum => AppConstants.caption_text_length, :unless => Proc.new{|a| a.caption.nil?} 
   #validates_length_of    :caption, :in => 1..AppConstants.caption_text_length, :unless => Proc.new{|a| a.caption.nil?}


#   mount_uploader         :document_data, DocumentDataUploader
#
#
#   validates              :document_data, #:presence => true, #commenting as data uploader is not used from Rails server
#                          :file_size => { :maximum => AppConstants.max_document_size.megabytes.to_i }


   before_destroy    :clear_serialized_summary

   protected
      def clear_serialized_summary
        s=Summary.where(:id => self.summary_id).first

         if !s.document_array.nil? && s.document_array.include?(self.id)
           puts "deleting document"
           s.document_array.delete(self.id)
         end
      end

   public
     class << self

       #for normal uploads only document name and URLS will come.
       def create_document(params)
         name = File.basename(params[:url])
         type =  MIME::Types.type_for(File.basename(params[:url]).to_s).first.to_s

         #set mandatory parameters if missing
         params[:status] = AppConstants.state_public if params[:status].nil?
         params[:source_name] =  AppConstants.source_actwitty if params[:source_name].nil?

         d = Document.create!(:owner_id => params[:owner_id], :activity_id => params[:activity_id] ,
                              :activity_word_id => params[:activity_word_id],
                              :summary_id => params[:summary_id], :name => name, :mime => type,
                              :url => params[:url], :thumb_url => params[:thumb_url],
                              :caption => params[:caption],
                              :status => params[:status], :source_name => params[:source_name],
                              :uploaded => params[:uploaded])
       rescue => e
         Rails.logger.error("Document => create_document => Failed =>  #{e.message} #{name}  #{type}")
         nil
       end



       #TODO => NEED TO support activity_word_id, Summary, Captions and url constraints
       #this function is called from delayed job.. when upload i done through rails server.
       #for normal uploads only document name and URLS will come.
       #for them Document.create! is sufficient

       def delay_create(owner_id, activity_id,path)
         name = File.basename(path)
         puts "==========================  #{path}"
         d = Document.create!(:owner_id => owner_id, :activity_id => (activity_id.nil? ? nil : activity_id) ,
                          :name => name, :mime => MIME::Types.type_for(name.to_s).first.to_s,
                          :document_data => File.open(path))

         d.url = d.document_data.url
         d.thumb_url = d.document_data.thumb.url
         d.save!
         puts d.inspect
       rescue => e
         Rails.logger.error("Document => delay_create => Failed with #{e.message}")
         nil
       end


       def create_document_uploader(owner_id, activity_id, path)
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
            create_document_uploader(owner_id, activity_id,"#{Rails.root}/tmp#{d.document_data.to_s}")
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
#  activity_id      :integer         not null
#  activity_word_id :integer         not null
#  name             :string(255)     not null
#  mime             :string(255)
#  document_data    :string(255)
#  caption          :string(255)
#  comments_count   :integer
#  summary_id       :integer         not null
#  url              :text            not null
#  thumb_url        :text
#  created_at       :datetime
#  updated_at       :datetime
#

