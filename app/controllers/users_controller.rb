class UsersController < ApplicationController
  #before_filter :authenticate_user!
  def index
    w_id6 = ActivityWord.CreateActivityWord("college")
    puts "======================hellooooooooooooooooo"
    w_id7 = ActivityWord.CreateActivityWord("sweet")
    puts "****************************hellooooooooooooooooo"
    w_id8 = ActivityWord.CreateActivityWord("engaged", "related")
    puts "++++++++++++++++++++++++++++++hellooooooooooooooooo"
  end
end
