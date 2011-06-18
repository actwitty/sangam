require 'spec_helper'

describe Campaign do
  before(:each) do
    @camp1 = Factory(:campaign)
    @camp2 = Factory(:campaign)
    @camp3 = Factory(:campaign)
  end
  describe "Validations" do
    it "should have valid user" do
       lambda {
         Factory(:campaign, :author => nil)
       }.should raise_error ActiveRecord::RecordInvalid
    end
  end
end
