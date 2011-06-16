require 'delayed_job'
class DocumentJob < Struct.new(:owner,:activity,  :path  )
  def enqueue(job)
    Rails.logger.info("DocumentJob Enqueue")
  end

  def perform
    Rails.logger.info("DocumentJob Perform")
    @id = Document.DelayCreate(self.owner,self.activity, self.path)
  end

  def before(job)
    Rails.logger.info("DocumentJob Before")
  end

  def after(job)
    Rails.logger.info("DocumentJob After")
  end

  def success(job)
    Rails.logger.info("DocumentJob Success")
  end

  def error(job, exception)

  rescue => exception
    Rails.logger.error("DocumentJob raised an exception => #{exception.message}")
  end

  def failure
    Rails.logger.info("DocumentJob Failure")
  end
end