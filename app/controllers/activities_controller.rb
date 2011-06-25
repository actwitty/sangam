class ActivitiesController < ApplicationController
  before_filter :authenticate_user!

  def top_activities
    user_activities=[{ :id => '1001', :name => 'Travelling', :count => '15'},
                     { :id => '1002', :name => 'Eating', :count => '13'},
                     { :id => '1006', :name => 'Own', :count => '11'},
                     { :id => '1003', :name => 'Watching', :count => '10'},
                     { :id => '1004', :name => 'Drinking',:count => '10'},
                     { :id => '1005', :name => 'Cooking', :count => '9'},
                     { :id => '1006', :name => 'Living', :count => '8'},
                     { :id=> '1006', :name => 'Working', :count => '3'}
                    ]

    if request.xhr?
      render :json => user_activities
    end
  end


end
