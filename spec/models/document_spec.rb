require 'spec_helper'

describe Document do
  include CarrierWave::Test::Matchers

  before(:each) do
    DataFileUploader.enable_processing = true

    @doc = Document.create!(:owner_id => 1, :activity_id => 2 , :document_name => "alok.jpg", :document_type => "jpeg",
     :document_url => "http://google.com")

  end

  describe "Create" do
    it "should save the file in folder" do

      @doc.data_file = File.open("#{Rails.root}/public/PAN.jpg")
      lambda{
        @doc.save!
       }.should_not raise_error
    end
    it "should save the not create thumbnail for pdfs etc , other than images" do
      @doc.data_file = File.open("#{Rails.root}/public/test.pdf")
      puts "opened"
      @doc.save!
      puts "saved"
      @doc.data_file.icon.url.should == "/test/thumb_pdf.jpeg"
    end
  end

end
