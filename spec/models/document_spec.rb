require 'spec_helper'

describe Document do
  include CarrierWave::Test::Matchers

   describe "Create" do
   include DelayedJobSpecHelper

    it "should save the not create thumbnail for pdfs etc , other than images" do
      u = Factory(:user)
      @doc = Document.create_document(u.id,nil, "#{Rails.root}/public/test/test.pdf")
      @doc1 = Document.create_document(u.id,nil, "#{Rails.root}/public/test/test.pdf")
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
#      puts d.document_type
#      #d.destroy
    end
    it "should save the file in amazon bucket" do
      @doc = Document.create_document(Factory(:user).id,nil, "#{Rails.root}/public/test/test.pdf")
       puts "hello"
       work_off
       d = Document.where(:document_name => "test.pdf").first
       d.destroy
       d =  Document.where(:document_name => "test.pdf").first
       d.should be_nil
      end
    end
end


# == Schema Information
#
# Table name: documents
#
#  id               :integer         not null, primary key
#  owner_id         :integer         not null
#  activity_id      :integer
#  activity_word_id :integer
#  document_name    :string(255)     not null
#  document_type    :string(255)
#  document_data    :string(255)
#  created_at       :datetime
#  updated_at       :datetime
#  thumb_url        :text
#  url              :text
#

