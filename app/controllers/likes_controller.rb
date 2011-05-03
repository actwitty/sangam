class LikesController < ApplicationController
  before_filter :authenticate_user!

end
