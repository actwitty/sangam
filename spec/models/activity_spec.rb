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

                a = @u.get_summary(:user_id => @u.id)
                puts a

                a = @u.up_vote_summary(:user_id => @u.id,:summary_id => a[0][:id])
                puts a

                a = @u.get_summary(:user_id => @u.id, :enabled_services => ["facebook"] )
                puts a

                a = @u.down_vote_summary(:user_id => @u.id,:summary_id =>  a[0][:id])
                puts a

                a = @u.get_summary(:user_id => @u.id, :enabled_services => ["facebook"] )
                puts a
      }.resume
    end
  end

  it "get summary properly" do
    #SocialAggregator.start_reactor
    EM.run do
      Fiber.new{
                @u = Factory(:user)
                #::Test.test_create_data(@u)


                Authentication.create!({:user_id => @u.id, :provider => "twitter", :uid => "43857071"})

                @u.mock_enable_service({:user_id => @u.id})
                ::Test.test_get_summary(@u)
                work_off
                sleep(10)
                puts "dfsfdfdsf"
                work_off

                a = @u.get_entities(:user_id => @u.id, :enabled_services => ["twitter"])
                puts a

                a = @u.get_entities_verified(:user_id => @u.id, :enabled_services => ["twitter"] )
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
#  id                 :integer         not null, primary key
#  activity_word_id   :integer         not null
#  activity_text      :text
#  activity_name      :text            not null
#  author_id          :integer         not null
#  base_location_id   :integer
#  status             :integer         not null
#  summary_id         :integer
#  source_object_id   :text
#  status_at_source   :integer
#  source_name        :text            not null
#  source_uid         :text
#  source_object_type :text            default("post")
#  category_type      :text
#  category_id        :text
#  source_created_at  :datetime        default(1970-01-01 00:00:00 UTC)
#  if_json            :boolean         default(FALSE)
#  created_at         :datetime        not null
#  updated_at         :datetime        not null
#

