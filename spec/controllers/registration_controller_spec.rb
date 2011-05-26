require 'spec_helper'

describe Users::RegistrationsController do


  render_views

  before do
    request.env["devise.mapping"] = Devise.mappings[:user]
    @valid_params = {:user => {
      :username => "sudhanshu",
      :email    => "sudhanshu@lemonbag.com",
      :password => "topsecret",
      :password_confirmation => "topsecret"
      }
    }
  end



  describe "#create" do

      it "creates a user" do
        lambda {
          get :create, @valid_params
        }.should change(User, :count).by(1)
      end
      it "assigns @user" do
        get :create, @valid_params
        assigns(:user).should be_true
      end
      it "redirects to the root path" do
        get :create, @valid_params
        response.should redirect_to :controller => "/profiles", :action => "new"
      end

  end
end

