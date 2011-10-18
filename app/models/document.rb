#require 'file_size_validator'

class Document < ActiveRecord::Base

   include  ActionView::Helpers
   serialize       :social_counters_array, Array

   belongs_to     :owner, :class_name => "User"
   belongs_to     :activity_word
   belongs_to     :location

   belongs_to     :summary, :counter_cache => true

   belongs_to     :activity, :counter_cache => true

   has_many       :documents

  #TODO commenting it for time being.. we can enable it but as this feature is not in scope
  #so commented. Though this feature is complete in implementation
#   has_many       :comments,  :dependent => :destroy, :order => "updated_at DESC"
#   has_many       :campaigns,  :dependent => :destroy, :order => "updated_at DESC"

   validates_existence_of :owner_id
   validates_existence_of :activity_id , :allow_nil => true
   validates_existence_of :activity_word_id  , :allow_nil => true
   validates_existence_of :summary_id , :allow_nil => true
   validates_existence_of :location_id , :allow_nil => true

   validates_presence_of  :name, :url, :mime, :source_name, :provider, :category, :status

   validates_format_of    :url , :with =>  eval(AppConstants.url_validator)
   validates_format_of    :thumb_url , :with =>  eval(AppConstants.url_validator), :unless => Proc.new{|a| a.thumb_url.nil?}

   validates_length_of    :name, :in => 1..AppConstants.document_name_length
   validates_length_of    :mime, :in => 1..AppConstants.document_mime_length
   validates_length_of    :url, :in => 1..AppConstants.url_length
   validates_length_of    :thumb_url, :maximum => AppConstants.url_length, :unless => Proc.new{|a| a.thumb_url.nil?}
   validates_length_of    :source_name,  :in => 1..AppConstants.source_name_length
   validates_length_of    :caption, :maximum => AppConstants.caption_text_length, :unless => Proc.new{|a| a.caption.nil?}
   validates_length_of    :provider, :in => 1..AppConstants.document_provider_length
   validates_length_of    :category, :in => 1..AppConstants.document_category_length

#   mount_uploader         :document_data, DocumentDataUploader
#
#
#   validates              :document_data, #:presence => true, #commenting as data uploader is not used from Rails server
#                          :file_size => { :maximum => AppConstants.max_document_size.megabytes.to_i }

   before_save           :sanitize_data

   after_destroy         :remove_theme

   def remove_theme
     Rails.logger.debug("[MODEL] [DOCUMENT] [remove_theme] ")
     Theme.where(:document_id => self.id).all.each do |attr|
       puts "theme reset"
       Theme.create_theme(:theme_type => AppConstants.theme_default,:summary_id => attr.summary_id,:author_id =>attr.author_id)
     end
   end

   def sanitize_data
     Rails.logger.debug("[MODEL] [DOCUMENT] [sanitize_data] ")
     self.caption = sanitize(self.caption) if !self.caption.blank?
   end

   public

     class << self
       #This clears and adjusts the summary of document being deleted ""explicitly"
       #This function should always be called after deleting document explicitly
       #and not as outcome of activity delete
       def reset_summary(summary_id)

          a = nil
          s = nil
          puts "deleting document pre"

          if summary_id.nil?
            return
          end

          #Remove from summary
          s=Summary.where(:id => summary_id).first
         #Recreate Document Array for given summary
          s.document_array = []
          a = Document.where(:summary_id => summary_id).group(:id).limit(AppConstants.max_number_of_a_type_in_summmary).
              order("MAX(created_at) DESC").count
          s.document_array = a.keys if !a.blank?
          s.update_attributes(:document_array  => s.document_array)

         #this block only bring one document
#          if !s.blank? && !s.document_array.nil?
#             puts "deleting document"
#
#             #Get the minimum element from document array
#             id  = s.document_array.min
#
#             if s.document_array.include?(params[:id])
#
#               #then delete the input id form document array
#               s.document_array.delete(params[:id])
#
#               #find the id which is just less than minimum present in doc array
#               d = Document.where(:id.lt => id, :summary_id => s.id).first
#
#               s.serialize_data({"document"  => [d.id]}) if !d.blank?
#
#             end
#
#          end
       end

       #for normal uploads only document name and URLS will come.
       def create_document(params)

         params[:provider]= AppConstants.provider_actwitty if params[:provider].nil?

         #uploaded will be set false in mentioned links
         params[:uploaded] = true if params[:uploaded].nil?

         params[:uploaded] == true ? name = File.basename(params[:url]) : name = "remote"

         params[:mime] = MIME::Types.type_for(File.basename(params[:url]).to_s).first.to_s if params[:mime].nil?
         params[:category] = params[:mime].split('/')[0]

         #set mandatory parameters if missing
         params[:status] = AppConstants.status_public if params[:status].nil?
         params[:source_name] =  AppConstants.source_actwitty if params[:source_name].nil?

         d = Document.create!(:owner_id => params[:owner_id], :activity_id => params[:activity_id] ,
                              :activity_word_id => params[:activity_word_id],
                              :summary_id => params[:summary_id], :name => name, :mime => params[:mime],
                              :url => params[:url], :thumb_url => params[:thumb_url],:caption => params[:caption],
                              :source_name => params[:source_name],
                              :uploaded => params[:uploaded],:provider => params[:provider],
                              :category => params[:category], :location_id => params[:location_id], :status => params[:status])
       rescue => e
         Rails.logger.error("Document => create_document => Failed =>  #{e.message} #{name} ")
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
#  id                    :integer         not null, primary key
#  owner_id              :integer         not null
#  activity_id           :integer
#  activity_word_id      :integer
#  name                  :text            not null
#  mime                  :text
#  caption               :text
#  comments_count        :integer
#  summary_id            :integer
#  url                   :text            not null
#  thumb_url             :text
#  status                :integer         not null
#  source_name           :text            not null
#  uploaded              :boolean         not null
#  provider              :text            not null
#  category              :text            not null
#  location_id           :integer
#  social_counters_array :text
#  created_at            :datetime
#  updated_at            :datetime
#

