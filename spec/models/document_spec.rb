require 'spec_helper'

describe Document do
  include CarrierWave::Test::Matchers

   describe "Create" do
   include DelayedJobSpecHelper

    it "should save the not create thumbnail for pdfs etc , other than images" do
      u = Factory(:user)
      @doc = Document.create_document_uploader(u.id,Factory(:activity).id, "#{Rails.root}/public/test/test.pdf")
      @doc1 = Document.create_document_uploader(u.id,Factory(:activity).id, "#{Rails.root}/public/test/test.pdf")
       puts "hello"
       work_off
      d_array= u.documents.all
      d_array.count.should == 2
#      #d.should == @doc
#      puts d.document_data_url
      d_array.each do |d|
        puts d.id
        puts d.document_data.thumb.url
      end
#      puts d.type
#      #d.destroy
    end
    it "should save the file in amazon bucket" do
      @doc = Document.create_document_uploader(Factory(:user).id,Factory(:activity).id, "#{Rails.root}/public/test/test.pdf")
       puts "hello"
       work_off
       d = Document.where(:name => "test.pdf").first
       d.destroy
       d =  Document.where(:name => "test.pdf").first
       d.should be_nil
    end
    it "should be able to create document metadata without uploader" do
      @doc = Document.create_document(:owner_id => Factory(:user).id, :activity_id => Factory(:activity).id,
                                      :activity_word_id => Factory(:activity_word).id,
                                      :summary_id => Factory(:summary).id,
                                      :url => "https://www.s3.amazon.com/1234/test.jpg",
                                      :uploaded => true)
      puts @doc.inspect
      @doc.should_not be_nil

      @doc.destroy
      Document.count.should == 0
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

