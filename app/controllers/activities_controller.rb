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
   def get_activities
    user_activities= [{:post =>
                          {
                            :id =>  1234,
                            :user => { :id => 128, :full_name => "Abc Saxena", :photo => "/images/actwitty/default_user.gif" },
                            :time => "12:53:31",
                            :word => { :id => 1923, :name => "Motorbiking" },
                            :text =>  "<a href=/entities/479 class=\"activity_entity\">pizza</a> at <a href=/entities/478 class=\"activity_entity\">pizza hut</a> with
                                       <a href=/users/3019 class=\"activity_mention\">Alok Srivastava</a> <a href=/users/0 class=\"activity_mention\">PIZZA</a>"
                          },
                        :location => {:id => 23456, :lat => 23.6567, :long => 120.3, :name => "marathalli", :type => 2},
                            :documents =>
                              [
                                {:id => 213, :name => "spring.jpg", :type => "image/jpg", :url => "/images/test/spring.jpg"},
                                {:id => 214,:name => "autum.jpg", :type => "image/jpg", :url => "/images/test/spring_2.jpg"},
                                {:id => 215,:name => "winter.jpg", :type => "image/jpg", :url => "/images/test/spring_3.jpg"}
                              ],
                            :campaign =>
                              [
                                {:id => 35, :name => "like", :count => 23, :user => true},
                                {:id => 36, :name => "support", :count => 23, :user => false}
                              ],
                      :comment =>
                        {
                          :count => 1,
                          :array => [
                            {
                              :id => 123,
                              :user => {:id => 129, :full_name => "Def Saxena", :photo => "/images/actwitty/default_user.gif"},
                              :word => {:id => 1923, :name => "&comment&"},
                              :campaign => [
                                {:id => 38, :name => "like", :count => 23, :user => true},
                                {:id => 39, :name => "support", :count => 23, :user => false}],
                               :text => "<a href=/entities/479 class=\"activity_entity\">pizza</a> at <a href=/entities/478 class=\"activity_entity\">pizza hut</a> with
                                        <a href=/users/3019 class=\"activity_mention\">Alok Srivastava</a> <a href=/users/0 class=\"activity_mention\">PIZZA</a>"
                            }
                          ]
                        }
                    }]

    if request.xhr?
      render :json => user_activities
    end
  end
  def get_snapshots
    #incoming params
    puts "User ID ====> " + params[:id]
    puts "Position ====> " + params[:position]
    position =  Integer(params[:position])

    if position == 0
      user_snapshots= [ {:activity_word => {:word_id => 1923, :word_name => "Motorbiking"},
                        :activity_count => 20,
                        :user => {:user_id => 123, :full_name => "Sudhanshu Saxena", :photo => "/images/actwitty/default_user.gif"},

                        :location => [{:location_id => 23456, :geo_location => {:geo_latitude => 23.6567, :geo_longitude => 120.3, :geo_name => "marathalli"}}] ,
                        :documents => [{:document_id => 213, :document_name => "spring.jpg", :document_type => "image/jpg", :document_url => "/images/test/spring.jpg"},
                                       {:document_id => 214,:document_name => "spring_2.jpg", :document_type => "image/jpg", :document_url => "/images/test/spring_2.jpg"},
                                       {:document_id => 214,:document_name => "spring_2.jpg", :document_type => "image/jpg", :document_url => "/images/test/spring_2.jpg"},
                                       {:document_id => 214,:document_name => "spring_2.jpg", :document_type => "image/jpg", :document_url => "/images/test/spring_2.jpg"},
                                       {:document_id => 215,:document_name => "spring_3.jpg", :document_type => "image/jpg", :document_url => "/images/test/spring_3.jpg"} ],

                        :recent_text => "<a href=/entities/479 class=\"activity_entity\">pizza</a> at <a href=/entities/478 class=\"activity_entity\">pizza hut</a> with
                                                 <a href=/users/3019 class=\"activity_mention\">Alok Srivastava</a> <a href=/users/0 class=\"activity_me/images/test/spring.jpgntion\">PIZZA</a>",
                        :entities => [{:entity_id => 2341, :entity_name => "parle biscuits", :entity_image => "/images/actwitty/unknown_entity.png"},
                                      {:entity_id => 2342, :entity_name => "sachin tendulkar", :entity_image => "/images/actwitty/unknown_entity.png"},
                                      {:entity_id => 2343, :entity_name => "sonia gandhi", :entity_image => "/images/actwitty/unknown_entity.png"}],
                        :friends => [{:friend_id => 1001, :friend_name => "Alok Srivastava", :friend_image => "/images/actwitty/default_user.gif"},
                                     {:friend_id => 1002, :friend_name => "Milind Parab", :friend_image => "/images/actwitty/default_user.gif"},
                                     {:friend_id => 1003, :friend_name => "Samarth Deo", :friend_image => "/images/actwitty/default_user.gif"}]

                      },
                      {:activity_word => {:word_id => 1924, :word_name => "EggCurry"},
                        :activity_count => 20,
                        :user => {:user_id => 123, :full_name => "Sudhanshu Saxena", :photo => "/images/actwitty/default_user.gif"},

                        :location => [{:location_id => 23456, :geo_location => {:geo_latitude => 23.6567, :geo_longitude => 120.3, :geo_name => "marathalli"}}] ,
                        :documents => [{:document_id => 213, :document_name => "spring.jpg", :document_type => "image/jpg", :document_url => "/images/test/spring.jpg"},
                                       {:document_id => 214,:document_name => "spring_2.jpg", :document_type => "image/jpg", :document_url => "/images/test/spring_2.jpg"},
                                       {:document_id => 215,:document_name => "spring_3.jpg", :document_type => "image/jpg", :document_url => "/images/test/spring_3.jpg"}  ],

                        :recent_text => "<a href=/entities/479 class=\"activity_entity\">pizza</a> at <a href=/entities/478 class=\"activity_entity\">pizza hut</a> with
                                         <a href=/users/3019 class=\"activity_mention\">Alok Srivastava</a> <a href=/users/0 class=\"activity_mention\">PIZZA</a>",
                        :entities => [{:entity_id => 2341, :entity_name => "parle biscuits", :entity_image =>"/images/actwitty/unknown_entity.png"},
                                      {:entity_id => 2342, :entity_name => "sachin tendulkar", :entity_image => "/images/actwitty/unknown_entity.png"},
                                      {:entity_id => 2343, :entity_name => "sonia gandhi", :entity_image => "/images/actwitty/unknown_entity.png"}],
                        :friends => [{:friend_id => 1001, :friend_name => "Alok Srivastava", :friend_image => "/images/actwitty/default_user.gif"},
                                     {:friend_id => 1002, :friend_name => "Milind Parab", :friend_image => "/images/actwitty/default_user.gif"},
                                     {:friend_id => 1003, :friend_name => "Samarth Deo", :friend_image => "/images/actwitty/default_user.gif"}]

                      }
                    ]
    else
      user_snapshots= [ {:activity_word => {:word_id => 1925, :word_name => "RubyOnRails"},
                        :activity_count => 20,
                        :user => {:user_id => 123, :full_name => "Sudhanshu Saxena", :photo => "/images/actwitty/default_user.gif"},

                        :location => [{:location_id => 23456, :geo_location => {:geo_latitude => 23.6567, :geo_longitude => 120.3, :geo_name => "marathalli"}}] ,
                        :documents => [{:document_id => 213, :document_name => "spring.jpg", :document_type => "image/jpg", :document_url => "/images/test/spring.jpg"},
                                       {:document_id => 214,:document_name => "spring_2.jpg", :document_type => "image/jpg", :document_url => "/images/test/spring_2.jpg"},
                                       {:document_id => 214,:document_name => "spring_2.jpg", :document_type => "image/jpg", :document_url => "/images/test/spring_2.jpg"},
                                       {:document_id => 214,:document_name => "spring_2.jpg", :document_type => "image/jpg", :document_url => "/images/test/spring_2.jpg"},
                                       {:document_id => 215,:document_name => "spring_3.jpg", :document_type => "image/jpg", :document_url => "/images/test/spring_3.jpg"} ],

                        :recent_text => "<a href=/entities/479 class=\"activity_entity\">pizza</a> at <a href=/entities/478 class=\"activity_entity\">pizza hut</a> with
                                                 <a href=/users/3019 class=\"activity_mention\">Alok Srivastava</a> <a href=/users/0 class=\"activity_mention\">PIZZA</a>",
                        :entities => [{:entity_id => 2341, :entity_name => "parle biscuits", :entity_image => "/images/actwitty/unknown_entity.png"},
                                      {:entity_id => 2342, :entity_name => "sachin tendulkar", :entity_image => "/images/actwitty/unknown_entity.png"},
                                      {:entity_id => 2343, :entity_name => "sonia gandhi", :entity_image => "/images/actwitty/unknown_entity.png"}],
                        :friends => [{:friend_id => 1001, :friend_name => "Alok Srivastava", :friend_image => "/images/actwitty/default_user.gif"},
                                     {:friend_id => 1002, :friend_name => "Milind Parab", :friend_image => "/images/actwitty/default_user.gif"},
                                     {:friend_id => 1003, :friend_name => "Samarth Deo", :friend_image => "/images/actwitty/default_user.gif"}]

                      },
                      {:activity_word => {:word_id => 1926, :word_name => "HimachalPradesh"},
                        :activity_count => 20,
                        :user => {:user_id => 123, :full_name => "Sudhanshu Saxena", :photo => "/images/actwitty/default_user.gif"},

                        :location => [{:location_id => 23456, :geo_location => {:geo_latitude => 23.6567, :geo_longitude => 120.3, :geo_name => "marathalli"}}] ,
                        :documents => [{:document_id => 213, :document_name => "spring.jpg", :document_type => "image/jpg", :document_url => "/images/test/spring.jpg"},
                                       {:document_id => 214,:document_name => "spring_2.jpg", :document_type => "image/jpg", :document_url => "/images/test/spring_2.jpg"},
                                       {:document_id => 215,:document_name => "spring_3.jpg", :document_type => "image/jpg", :document_url => "/images/test/spring_3.jpg"}  ],

                        :recent_text => "<a href=/entities/479 class=\"activity_entity\">pizza</a> at <a href=/entities/478 class=\"activity_entity\">pizza hut</a> with
                                         <a href=/users/3019 class=\"activity_mention\">Alok Srivastava</a> <a href=/users/0 class=\"activity_mention\">PIZZA</a>",
                        :entities => [{:entity_id => 2341, :entity_name => "parle biscuits", :entity_image =>"/images/actwitty/unknown_entity.png"},
                                      {:entity_id => 2342, :entity_name => "sachin tendulkar", :entity_image => "/images/actwitty/unknown_entity.png"},
                                      {:entity_id => 2343, :entity_name => "sonia gandhi", :entity_image => "/images/actwitty/unknown_entity.png"}],
                        :friends => [{:friend_id => 1001, :friend_name => "Alok Srivastava", :friend_image => "/images/actwitty/default_user.gif"},
                                     {:friend_id => 1002, :friend_name => "Milind Parab", :friend_image => "/images/actwitty/default_user.gif"},
                                     {:friend_id => 1003, :friend_name => "Samarth Deo", :friend_image => "/images/actwitty/default_user.gif"}]

                      }
                    ]
    end



    if request.xhr?
      puts user_snapshots
      render :json => user_snapshots, :status => 200
    end
  end



  def get_friends_snapshots
    #incoming params

    if !user_signed_in? || params[:id].nil? || current_user.id.to_s != params[:id].to_s
      puts "returning from here "  + current_user.id.to_s
      if request.xhr?
        user_snapshots=[]
        render :json => user_snapshots
      end
      return
    end
    puts "User ID ====> " + params[:id]
    puts "Position ====> " + params[:position]
    user_snapshots= [ {:activity_word => {:word_id => 1923, :word_name => "KickBoxing"},
                        :activity_count => 20,
                        :user => {:user_id => 124, :full_name => "Abc Saxena", :photo => "/images/actwitty/default_user.gif"},

                        :location => [{:location_id => 23456, :geo_location => {:geo_latitude => 23.6567, :geo_longitude => 120.3, :geo_name => "marathalli"}}] ,
                        :documents => [{:document_id => 213, :document_name => "spring.jpg", :document_type => "image/jpg", :document_url => "/images/test/spring.jpg"},
                                       {:document_id => 214,:document_name => "spring_2.jpg", :document_type => "image/jpg", :document_url => "/images/test/spring_2.jpg"},
                                       {:document_id => 215,:document_name => "spring_3.jpg", :document_type => "image/jpg", :document_url => "/images/test/spring_3.jpg"} ],

                        :recent_text => "<a href=/entities/479 class=\"activity_entity\">pizza</a> at <a href=/entities/478 class=\"activity_entity\">pizza hut</a> with
                                                 <a href=/users/3019 class=\"activity_mention\">Alok Srivastava</a> <a href=/users/0 class=\"activity_mention\">PIZZA</a>",
                        :entities => [{:entity_id => 2341, :entity_name => "parle biscuits", :entity_image => "/images/actwitty/unknown_entity.png"},
                                      {:entity_id => 2342, :entity_name => "sachin tendulkar", :entity_image => "/images/actwitty/unknown_entity.png"},
                                      {:entity_id => 2343, :entity_name => "sonia gandhi", :entity_image => "/images/actwitty/unknown_entity.png"}],
                        :friends => [{:friend_id => 1001, :friend_name => "Alok Srivastava", :friend_image => "/images/actwitty/default_user.gif"},
                                     {:friend_id => 1002, :friend_name => "Milind Parab", :friend_image => "/images/actwitty/default_user.gif"},
                                     {:friend_id => 1003, :friend_name => "Samarth Deo", :friend_image => "/images/actwitty/default_user.gif"}]

                      },
                      {:activity_word => {:word_id => 1924, :word_name => "GulabJamuns"},
                        :activity_count => 20,
                        :user => {:user_id => 125, :full_name => "Def Saxena", :photo => "/images/actwitty/default_user.gif"},

                        :location => [{:location_id => 23456, :geo_location => {:geo_latitude => 23.6567, :geo_longitude => 120.3, :geo_name => "marathalli"}}] ,
                        :documents => [{:document_id => 213, :document_name => "spring.jpg", :document_type => "image/jpg", :document_url => "/images/test/spring.jpg"},
                                       {:document_id => 214,:document_name => "spring_2.jpg", :document_type => "image/jpg", :document_url => "/images/test/spring_2.jpg"},
                                       {:document_id => 215,:document_name => "spring_3.jpg", :document_type => "image/jpg", :document_url => "/images/test/spring_3.jpg"}  ],

                        :recent_text => "<a href=/entities/479 class=\"activity_entity\">pizza</a> at <a href=/entities/478 class=\"activity_entity\">pizza hut</a> with
                                                 <a href=/users/3019 class=\"activity_mention\">Alok Srivastava</a> <a href=/users/0 class=\"activity_mention\">PIZZA</a>",
                        :entities => [{:entity_id => 2341, :entity_name => "parle biscuits", :entity_image => "http://google.com"},
                                      {:entity_id => 2342, :entity_name => "sachin tendulkar", :entity_image => "http://google.com"},
                                      {:entity_id => 2343, :entity_name => "sonia gandhi", :entity_image => "http://google.com"}],
                        :friends => [{:friend_id => 1001, :friend_name => "Alok Srivastava", :friend_image => "/images/actwitty/default_user.gif"},
                                     {:friend_id => 1002, :friend_name => "Milind Parab", :friend_image => "/images/actwitty/default_user.gif"},
                                     {:friend_id => 1003, :friend_name => "Samarth Deo", :friend_image => "/images/actwitty/default_user.gif"}]

                      }
                    ]
    puts user_snapshots

    if request.xhr?
      render :json => {}, :status => 200
    end
  end

end
