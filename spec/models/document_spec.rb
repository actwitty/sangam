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
#      puts d.document_data.thumb.url
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
