require 'spec_helper'
require 'factory_girl'

describe Post do
  before(:each) do
    @post = Factory(:post)
  end

  describe "Validations" do
    it "should must have author id" do
      p = Post.new
      p.should_not be_valid
      p.errors[:author_id].should_not be_nil
    end

  end
end
