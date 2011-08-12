class GarbageDocument < ActiveRecord::Base

  validates_presence_of :action, :url, :table_name

  #no need to put unnecessary validations here as all data here will be populated from documents table only
  validates_numericality_of :action, :greater_than_or_equal_to => AppConstants.cron_action_document_delete,
                            :less_than_or_equal_to => AppConstants.cron_action_document_delete
end
