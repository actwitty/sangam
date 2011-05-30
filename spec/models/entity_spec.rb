require 'spec_helper'

describe Entity do

  describe "Validations"  do

  end

  describe "Associations" do
    it "should respond to associations" do
      @act.should respond_to(:author, :parent)
    end
  end

  describe "factory" do

  end

end
