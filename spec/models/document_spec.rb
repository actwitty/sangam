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
                                      :thumb_url => "https://www.s3.amazon.com/1234/234/thumb_test.jpg",
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
#  id               :integer         not null, primary key
#  owner_id         :integer         not null
#  activity_id      :integer         not null
#  activity_word_id :integer         not null
#  name             :string(255)     not null
#  mime             :string(255)
#  document_data    :string(255)
#  caption          :string(255)
#  comments_count   :integer
#  summary_id       :integer         not null
#  url              :text            not null
#  thumb_url        :text
#  created_at       :datetime
#  updated_at       :datetime
#

