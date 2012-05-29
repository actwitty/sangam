class SitemapsController < ApplicationController
  respond_to :xml
  caches_page :show

  def show
    @users = User.where(:username.not_eq => "actwittywebadmin").all
    @other_routes = [ "/", "about/show" ]
    respond_to do |format|
      format.xml
    end
  end
end
