require 'cloud_aws'
class GarbageDocument < ActiveRecord::Base

  validates_presence_of :url, :action, :table_name
#
#  #no need to put unnecessary validations here as all data here will be populated from documents table only
#  validates_numericality_of :action, :greater_than_or_equal_to => AppConstants.cron_action_document_delete,
#                            :less_than_or_equal_to => AppConstants.cron_action_document_delete

  class << self
    include CloudAws
    def cloud_delete

      if GarbageDocument.count > AppConstants.max_document_destroy_from_cloud

        s3_handle = GarbageDocument.create_s3_connection

        GarbageDocument.all.each do |attr|
          Rails.logger.info("[MODEL] [GARBAGE_DOCUMENT] [cloud_delete] calling cloud delete #{attr.inspect}")

          status = GarbageDocument.delete_s3_key(s3_handle, attr.url)
          GarbageDocument.delete_s3_key(s3_handle,attr.thumb_url) if !attr.thumb_url.blank? if status == true

          attr.delete if status == true
        end
      end

    end
  end
end


# == Schema Information
#
# Table name: garbage_documents
#
#  id         :integer         not null, primary key
#  table_name :text            not null
#  url        :text            not null
#  thumb_url  :text
#  action     :integer         not null
#  created_at :datetime
#  updated_at :datetime
#

