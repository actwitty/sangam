class DocumentObserver < ActiveRecord::Observer

  def after_destroy(doc)
    Rails.logger.info("[OBSERVER] [DocumentObserver] [after_destroy] #{doc}")

    #no need to catch rescue here. if create fails its OK for time being
    if doc.uploaded == true && doc.source_name == AppConstants.source_actwitty
       GarbageDocument.create(:action => AppConstants.cloud_action_document_destroy, :url =>doc.url,
                            :table_name => "documents")
       GarbageDocument.cloud_delete
    end

  end
end
