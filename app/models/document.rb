#require 'file_size_validator'
require 'thread'

class Document < ActiveRecord::Base

   include  ActionView::Helpers

   belongs_to     :owner, :class_name => "User"
   belongs_to     :activity_word

   belongs_to     :web_link, :counter_cache => true, :dependent => :destroy

   belongs_to     :summary

   belongs_to     :activity, :counter_cache => true

   validates_existence_of :owner_id
   validates_existence_of :activity_id , :allow_nil => true
   validates_existence_of :activity_word_id  , :allow_nil => true
   validates_existence_of :summary_id , :allow_nil => true
   validates_existence_of :web_link_id , :allow_nil => true

   validates_presence_of   :source_name, :category, :status

   public

     class << self
       include TextFormatter
       include QueryPlanner



       #for normal uploads only document name and URLS will come.
       def create_document(params)

         Rails.logger.info("[MODEL] [Document] [create_document] #{params[:url]}")

         web_link_id  = nil

         #uploaded will be set false in mentioned links
         params[:uploaded] = true if params[:uploaded].nil?

         params[:mime] = MIME::Types.type_for(File.basename(params[:url]).to_s).first.to_s if params[:mime].nil?
         params[:category] = params[:mime].split('/')[0]
         params[:category] = "document" if params[:category] == "application"

         #set mandatory parameters if missing
         params[:status] = AppConstants.status_public if params[:status].nil?
         params[:source_name] =  AppConstants.source_actwitty if params[:source_name].nil?

         #web_link_id will come if link is coming from pulled data from Facebook, Twitter etc
         if params[:uploaded] == false
           Rails.logger.info("[MODEL] [Document] [create_document] creating WEB LINK for #{params[:url]} ")
           link = WebLink.create_web_link({:url => params[:url], :mime => params[:mime],
                                              :title => params[:title], :description => params[:description],
                                              :image_url => params[:image_url], :image_width => params[:image_width],
                                              :image_height => params[:image_height], :category_id => params[:category_id],
                                              :canonical_url => params[:canonical_url], :provider => params[:provider],
                                              :cache_age => params[:cache_age]} )
           if link.blank?
              Rails.logger.info("[MODEL] [Document] [create_document] create WEB LINK  FAILED for #{params[:url]} ")
              return nil
           end
           web_link_id = link.id
         end

         #created_at and updated_at will take input value only when ActiveRecord::Base.record_timestamps is false
         #ootherwise default

         d = Document.create!(:owner_id => params[:owner_id], :activity_id => params[:activity_id] ,
                              :activity_word_id => params[:activity_word_id],
                              :summary_id => params[:summary_id],
                              :url => params[:url],
                              :source_name => params[:source_name], :source_object_id => params[:source_object_id],
                              :source_msg_id => params[:source_msg_id], :status_at_source => params[:status_at_source],
                              :uploaded => params[:uploaded],
                              :category => params[:category],
                              :status => params[:status],  :web_link_id => web_link_id,
                              :created_at => params[:created_at], :updated_at => params[:updated_at]
                            )

         Rails.logger.info("[MODEL] [Document] [create_document] leaving  for #{params[:url]} ")
         return d
       rescue => e
         Rails.logger.error("[MODEL] [Document] [create_document] **** RESCUE **** => Failed =>  #{e.message} for #{params[:url]}")
         nil
       end

       #INPUT => {:document_id => 123, :current_user_id => 345} #self user
       #OUTPUT => deleted doc or blank {}
       def remove_document(params)

          Rails.logger.debug("[MODEL] [Document] [remove_document] entering")

          d = Document.where(:owner_id => params[:current_user_id], :id => params[:document_id]).first

          if d.blank?
            Rails.logger.debug("[MODEL] [Document]  [remove_document] returning blank JSON")
            return {}
          end

          d.destroy

          Rails.logger.debug("[MODEL] [Document] [remove_document] leaving")
          d
       rescue => e
         Rails.logger.error("[MODEL] [Document] [create_document] **** RESCUE **** #{e.message} for #{params.inspect}")
         return {}
       end

     end
end





















# == Schema Information
#
# Table name: documents
#
#  id                       :integer         not null, primary key
#  owner_id                 :integer         not null
#  activity_id              :integer
#  activity_word_id         :integer
#  summary_id               :integer
#  url                      :text
#  status                   :integer         not null
#  source_name              :text            not null
#  source_object_id         :text
#  source_msg_id            :text
#  status_at_source         :integer
#  uploaded                 :boolean         not null
#  category                 :text            not null
#  web_link_id              :integer
#  backup_created_timestamp :datetime        default(2012-02-09 11:32:01 UTC)
#  created_at               :datetime
#  updated_at               :datetime
#

