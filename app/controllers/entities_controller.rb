class EntitiesController < ApplicationController
  before_filter :authenticate_user!

   def top_entities
     user_entities=[{ :id => '1001', :name => 'Pizza', :count => '34', :image => '/images/actwitty/unknown_entity.png'},
                      { :id => '1002', :name => 'Summer of 69', :count => '23', :image => '/images/actwitty/unknown_entity.png'},
                      { :id => '1006', :name => 'Kal Ho Na Ho', :count => '19', :image => '/images/actwitty/unknown_entity.png'},
                      { :id => '1003', :name => 'Barrack Hussien Obama', :count => '14', :image => '/images/actwitty/unknown_entity.png'},
                      { :id => '1004', :name => 'Mangalore Bhajji',:count => '12', :image => '/images/actwitty/unknown_entity.png'},
                      { :id => '1005', :name => 'Sachin Tendulkar', :count => '10', :image => '/images/actwitty/unknown_entity.png'},
                      { :id => '1006', :name => 'Apple Iphone', :count => '8', :image => '/images/actwitty/unknown_entity.png'},
                      { :id=> '1006', :name => 'Mount Kailash Summers Yatra', :count => '3', :image => '/images/actwitty/unknown_entity.png'}
                     ]

     if request.xhr?
       render :json => user_entities
     end
   end

end
