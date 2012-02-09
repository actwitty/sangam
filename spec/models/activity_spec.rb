require 'spec_helper'
require 'factory_girl'
require 'api/api'
include DelayedJobSpecHelper

describe Activity do
  it "get streams properly" do
    #SocialAggregator.start_reactor
    EM.run do
      Fiber.new{
                @u = Factory(:user)
                ::Test.test_create_data(@u)
                ::Test.test_get_stream(@u)
      }.resume
    end
  end

  it "get summary properly" do
    #SocialAggregator.start_reactor
    EM.run do
      Fiber.new{
                @u = Factory(:user)
                ::Test.test_create_data(@u)
                ::Test.test_get_summary(@u)
                puts "hello"
                a = @u.get_summary({:user_id => @u.id})
                puts a
      }.resume
    end
  end

  it "get service properly" do
    #SocialAggregator.start_reactor
    EM.run do
      Fiber.new{
                @u = Factory(:user)
                ::Test.test_enable_service({:user_id => @u.id , :provider => AppConstants.test_service, :uid => "1212"})
                work_off
      }.resume
    end
  end
end




























# == Schema Information
#
# Table name: activities
#
#  id                       :integer         not null, primary key
#  activity_word_id         :integer         not null
#  activity_text            :text
#  activity_name            :text            not null
#  author_id                :integer         not null
#  base_location_id         :integer
#  documents_count          :integer         default(0)
#  tags_count               :integer         default(0)
#  hubs_count               :integer         default(0)
#  status                   :integer         not null
#  summary_id               :integer
#  source_object_id         :text
#  status_at_source         :integer
#  source_name              :text            not null
#  source_uid               :text
#  source_object_type       :text            default("post")
#  category_type            :text
#  category_id              :text
#  actions                  :text
#  backup_created_timestamp :datetime        default(2012-02-09 11:31:58 UTC)
#  created_at               :datetime
#  updated_at               :datetime
#

