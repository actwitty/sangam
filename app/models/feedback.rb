# == Schema Information
#
# Table name: feedbacks
#
#  id            :integer         not null, primary key
#  name          :string(255)
#  email         :string(255)
#  feedback_text :text
#  created_at    :datetime
#  updated_at    :datetime
#
class Feedback < ActiveRecord::Base

  def self.feedback_add(name, email, post_text)
    if name.nil? || name.length == 0
      name="anonymous"
    end

    if email.nil?  || email.length == 0
      email="anonymous"
    end

    if post_text.nil?
      Rails.logger.info("Trying to send an empty feedback Name:#{name} Email:#{email}")
      return
    end
    Rails.logger.info("Adding feedback Name:#{name} Email:#{email} Post:#{post_text}")

    Feedback.create!(:name=>name, :email=>email, :feedback_text=>post_text)

    rescue => e
      Rails.logger.error("Feedback create by Name:#{name} Email:#{email} raised an exception: #{e}")
  end


end