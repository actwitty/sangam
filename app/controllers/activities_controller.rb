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
    last_id=0

    if params[:last_id].nil?
      last_id = 0
    else
      last_id = params[:last_id].to_i
    end


    if last_id == 0
      user_snapshots= [
          {
            :word => {:id => 1923, :name => "Motorbiking"},
            :time => "12:54:39",
            :id => 101,
            :count => 20,
            :user => {:id => 1, :full_name => "Sudhanshu Saxena", :photo => "/images/actwitty/default_user.gif"},
            :location => [
                          {:id => 23456, :lat => 23.6567, :long => 120.3, :name => "marathalli", :type => 2},
                          {:id => 23457, :name => "Samarths Home", :type => 3}
                         ],
            :documents => [
                            {:id => 213, :name => "spring.jpg", :type => "image/jpg", :url => "/images/test/spring.jpg"},
                            {:id => 214,:name => "spring_2.jpg", :type => "image/jpg", :url => "/images/test/spring_2.jpg"},
                            {:id => 214,:name => "spring_2.jpg", :type => "image/jpg", :url => "/images/test/spring_2.jpg"},
                            {:id => 214,:name => "spring_2.jpg", :type => "image/jpg", :url => "/images/test/spring_2.jpg"},
                            {:id => 215,:name => "spring_3.jpg", :type => "image/jpg", :url => "/images/test/spring_3.jpg"}
                          ],

            :recent_text => "<a href=\"#\" id=\"479\" class=\"js_activity_entity\">pizza</a> at <a href=\"#\" id=\"478\" class=\"js_activity_entity\">pizza hut</a> with
                            <a href=\"#\" id=\"2\" class=\"js_user_mention\">Alok Srivastava</a>",
            :entities => [
                          {:id => 2341, :name => "parle biscuits", :image => "/images/actwitty/unknown_entity.png"},
                          {:id => 2342, :name => "sachin tendulkar", :image => "/images/actwitty/unknown_entity.png"},
                          {:id => 2343, :name => "sonia gandhi", :image => "/images/actwitty/unknown_entity.png"}
                         ],
            :friends => [
                          {:id => 2, :name => "Alok Srivastava", :image => "/images/actwitty/default_user.gif"},
                          {:id => 3, :name => "Milind Parab", :image => "/images/actwitty/default_user.gif"},
                          {:id => 4, :name => "Samarth Deo", :image => "/images/actwitty/default_user.gif"}
                        ]

          },
          {
            :word => {:id => 1924, :name => "ChitChatting"},
            :time => "12:54:39",
            :id => 102,
            :count => 20,
            :user => {:id => 1, :full_name => "Sudhanshu Saxena", :photo => "/images/actwitty/default_user.gif"},
            :location => [
                          {:id => 23456, :lat => 23.6567, :long => 120.3, :name => "marathalli", :type => 2},
                          {:id => 23457, :name => "Samarths Home", :type => 3}
                         ],
            :documents => [
                            {:id => 213, :name => "spring.jpg", :type => "image/jpg", :url => "/images/test/spring.jpg"},
                            {:id => 214,:name => "spring_2.jpg", :type => "image/jpg", :url => "/images/test/spring_2.jpg"},
                            {:id => 214,:name => "spring_2.jpg", :type => "image/jpg", :url => "/images/test/spring_2.jpg"},
                            {:id => 214,:name => "spring_2.jpg", :type => "image/jpg", :url => "/images/test/spring_2.jpg"},
                            {:id => 215,:name => "spring_3.jpg", :type => "image/jpg", :url => "/images/test/spring_3.jpg"}
                          ],

            :recent_text => "<a href=\"#\" id=\"479\" class=\"js_activity_entity\">pizza</a> at <a href=\"#\" id=\"478\" class=\"js_activity_entity\">pizza hut</a> with
                            <a href=\"#\" id=\"2\" class=\"js_user_mention\">Alok Srivastava</a>",
            :entities => [
                          {:id => 2341, :name => "parle biscuits", :image => "/images/actwitty/unknown_entity.png"},
                          {:id => 2342, :name => "sachin tendulkar", :image => "/images/actwitty/unknown_entity.png"},
                          {:id => 2343, :name => "sonia gandhi", :image => "/images/actwitty/unknown_entity.png"}
                         ],
            :friends => [
                          {:id => 2, :name => "Alok Srivastava", :image => "/images/actwitty/default_user.gif"},
                          {:id => 3, :name => "Milind Parab", :image => "/images/actwitty/default_user.gif"},
                          {:id => 4, :name => "Samarth Deo", :image => "/images/actwitty/default_user.gif"}
                        ]

          }
      ]
    else
      user_snapshots= [
          {
            :word => {:id => 1925, :name => "NuclearPhysics"},
            :time => "12:54:39",
            :id => 103,
            :count => 20,
            :user => {:id => 1, :full_name => "Sudhanshu Saxena", :photo => "/images/actwitty/default_user.gif"},
            :location => [
                          {:id => 23456, :lat => 23.6567, :long => 120.3, :name => "marathalli", :type => 2},
                          {:id => 23457, :name => "Samarths Home", :type => 3}
                         ],
            :documents => [
                            {:id => 213, :name => "spring.jpg", :type => "image/jpg", :url => "/images/test/spring.jpg"},
                            {:id => 214,:name => "spring_2.jpg", :type => "image/jpg", :url => "/images/test/spring_2.jpg"},
                            {:id => 214,:name => "spring_2.jpg", :type => "image/jpg", :url => "/images/test/spring_2.jpg"},
                            {:id => 214,:name => "spring_2.jpg", :type => "image/jpg", :url => "/images/test/spring_2.jpg"},
                            {:id => 215,:name => "spring_3.jpg", :type => "image/jpg", :url => "/images/test/spring_3.jpg"}
                          ],

            :recent_text => "<a href=\"#\" id=\"479\" class=\"js_activity_entity\">pizza</a> at <a href=\"#\" id=\"478\" class=\"js_activity_entity\">pizza hut</a> with
                            <a href=\"#\" id=\"2\" class=\"js_user_mention\">Alok Srivastava</a>",
            :entities => [
                          {:id => 2341, :name => "parle biscuits", :image => "/images/actwitty/unknown_entity.png"},
                          {:id => 2342, :name => "sachin tendulkar", :image => "/images/actwitty/unknown_entity.png"},
                          {:id => 2343, :name => "sonia gandhi", :image => "/images/actwitty/unknown_entity.png"}
                         ],
            :friends => [
                          {:id => 2, :name => "Alok Srivastava", :image => "/images/actwitty/default_user.gif"},
                          {:id => 3, :name => "Milind Parab", :image => "/images/actwitty/default_user.gif"},
                          {:id => 4, :name => "Samarth Deo", :image => "/images/actwitty/default_user.gif"}
                        ]

          },
          {
            :word => {:id => 1926, :name => "Abcdef"},
            :time => "12:54:39",
            :id => 104,
            :count => 20,
            :user => {:id => 1, :full_name => "Sudhanshu Saxena", :photo => "/images/actwitty/default_user.gif"},
            :location => [
                          {:id => 23456, :lat => 23.6567, :long => 120.3, :name => "marathalli", :type => 2},
                          {:id => 23457, :name => "Samarths Home", :type => 3}
                         ],
            :documents => [
                            {:id => 213, :name => "spring.jpg", :type => "image/jpg", :url => "/images/test/spring.jpg"},
                            {:id => 214,:name => "spring_2.jpg", :type => "image/jpg", :url => "/images/test/spring_2.jpg"},
                            {:id => 214,:name => "spring_2.jpg", :type => "image/jpg", :url => "/images/test/spring_2.jpg"},
                            {:id => 214,:name => "spring_2.jpg", :type => "image/jpg", :url => "/images/test/spring_2.jpg"},
                            {:id => 215,:name => "spring_3.jpg", :type => "image/jpg", :url => "/images/test/spring_3.jpg"}
                          ],

            :recent_text => "<a href=\"#\" id=\"479\" class=\"js_activity_entity\">pizza</a> at <a href=\"#\" id=\"478\" class=\"js_activity_entity\">pizza hut</a> with
                            <a href=\"#\" id=\"2\" class=\"js_user_mention\">Alok Srivastava</a>",
            :entities => [
                          {:id => 2341, :name => "parle biscuits", :image => "/images/actwitty/unknown_entity.png"},
                          {:id => 2342, :name => "sachin tendulkar", :image => "/images/actwitty/unknown_entity.png"},
                          {:id => 2343, :name => "sonia gandhi", :image => "/images/actwitty/unknown_entity.png"}
                         ],
            :friends => [
                          {:id => 2, :name => "Alok Srivastava", :image => "/images/actwitty/default_user.gif"},
                          {:id => 3, :name => "Milind Parab", :image => "/images/actwitty/default_user.gif"},
                          {:id => 4, :name => "Samarth Deo", :image => "/images/actwitty/default_user.gif"}
                        ]

          }
      ]
    end



    if request.xhr?
      puts user_snapshots
      render :json => user_snapshots, :status => 200
    end
  end



  def get_friends_snapshots
    last_id=0

    if params[:last_id].nil?
      last_id = 0
    else
      last_id = params[:last_id].to_i
    end



    if last_id == 0
      user_snapshots= [
          {
            :word => {:id => 1923, :name => "Motorbiking"},
            :time => "12:54:39",
            :id => 101,
            :count => 20,
            :user => {:id => 2, :full_name => "SomeOne", :photo => "/images/actwitty/default_user.gif"},
            :location => [
                          {:id => 23456, :lat => 23.6567, :long => 120.3, :name => "marathalli", :type => 2},
                          {:id => 23457, :name => "Samarths Home", :type => 3}
                         ],
            :documents => [
                            {:id => 213, :name => "spring.jpg", :type => "image/jpg", :url => "/images/test/spring.jpg"},
                            {:id => 214,:name => "spring_2.jpg", :type => "image/jpg", :url => "/images/test/spring_2.jpg"},
                            {:id => 214,:name => "spring_2.jpg", :type => "image/jpg", :url => "/images/test/spring_2.jpg"},
                            {:id => 214,:name => "spring_2.jpg", :type => "image/jpg", :url => "/images/test/spring_2.jpg"},
                            {:id => 215,:name => "spring_3.jpg", :type => "image/jpg", :url => "/images/test/spring_3.jpg"}
                          ],

            :recent_text => "<a href=\"#\" id=\"479\" class=\"js_activity_entity\">pizza</a> at <a href=\"#\" id=\"478\" class=\"js_activity_entity\">pizza hut</a> with
                            <a href=\"#\" id=\"2\" class=\"js_user_mention\">Alok Srivastava</a>",
            :entities => [
                          {:id => 2341, :name => "parle biscuits", :image => "/images/actwitty/unknown_entity.png"},
                          {:id => 2342, :name => "sachin tendulkar", :image => "/images/actwitty/unknown_entity.png"},
                          {:id => 2343, :name => "sonia gandhi", :image => "/images/actwitty/unknown_entity.png"}
                         ],
            :friends => [
                          {:id => 2, :name => "Alok Srivastava", :image => "/images/actwitty/default_user.gif"},
                          {:id => 3, :name => "Milind Parab", :image => "/images/actwitty/default_user.gif"},
                          {:id => 4, :name => "Samarth Deo", :image => "/images/actwitty/default_user.gif"}
                        ]

          },
          {
            :word => {:id => 1924, :name => "Motorbiking"},
            :time => "12:54:39",
            :id => 102,
            :count => 20,
            :user => {:id => 3, :full_name => "AnyOne", :photo => "/images/actwitty/default_user.gif"},
            :location => [
                          {:id => 23456, :lat => 23.6567, :long => 120.3, :name => "marathalli", :type => 2},
                          {:id => 23457, :name => "Samarths Home", :type => 3}
                         ],
            :documents => [
                            {:id => 213, :name => "spring.jpg", :type => "image/jpg", :url => "/images/test/spring.jpg"},
                            {:id => 214,:name => "spring_2.jpg", :type => "image/jpg", :url => "/images/test/spring_2.jpg"},
                            {:id => 214,:name => "spring_2.jpg", :type => "image/jpg", :url => "/images/test/spring_2.jpg"},
                            {:id => 214,:name => "spring_2.jpg", :type => "image/jpg", :url => "/images/test/spring_2.jpg"},
                            {:id => 215,:name => "spring_3.jpg", :type => "image/jpg", :url => "/images/test/spring_3.jpg"}
                          ],

            :recent_text => "<a href=\"#\" id=\"479\" class=\"js_activity_entity\">pizza</a> at <a href=\"#\" id=\"478\" class=\"js_activity_entity\">pizza hut</a> with
                            <a href=\"#\" id=\"2\" class=\"js_user_mention\">Alok Srivastava</a>",
            :entities => [
                          {:id => 2341, :name => "parle biscuits", :image => "/images/actwitty/unknown_entity.png"},
                          {:id => 2342, :name => "sachin tendulkar", :image => "/images/actwitty/unknown_entity.png"},
                          {:id => 2343, :name => "sonia gandhi", :image => "/images/actwitty/unknown_entity.png"}
                         ],
            :friends => [
                          {:id => 2, :name => "Alok Srivastava", :image => "/images/actwitty/default_user.gif"},
                          {:id => 3, :name => "Milind Parab", :image => "/images/actwitty/default_user.gif"},
                          {:id => 4, :name => "Samarth Deo", :image => "/images/actwitty/default_user.gif"}
                        ]

          }
      ]
    else
      user_snapshots= [
          {
            :word => {:id => 1925, :name => "NuclearPhysics"},
            :time => "12:54:39",
            :id => 103,
            :count => 20,
            :user => {:id => 2, :full_name => "SomeOne", :photo => "/images/actwitty/default_user.gif"},
            :location => [
                          {:id => 23456, :lat => 23.6567, :long => 120.3, :name => "marathalli", :type => 2},
                          {:id => 23457, :name => "Samarths Home", :type => 3}
                         ],
            :documents => [
                            {:id => 213, :name => "spring.jpg", :type => "image/jpg", :url => "/images/test/spring.jpg"},
                            {:id => 214,:name => "spring_2.jpg", :type => "image/jpg", :url => "/images/test/spring_2.jpg"},
                            {:id => 214,:name => "spring_2.jpg", :type => "image/jpg", :url => "/images/test/spring_2.jpg"},
                            {:id => 214,:name => "spring_2.jpg", :type => "image/jpg", :url => "/images/test/spring_2.jpg"},
                            {:id => 215,:name => "spring_3.jpg", :type => "image/jpg", :url => "/images/test/spring_3.jpg"}
                          ],

            :recent_text => "<a href=\"#\" id=\"479\" class=\"js_activity_entity\">pizza</a> at <a href=\"#\" id=\"478\" class=\"js_activity_entity\">pizza hut</a> with
                            <a href=\"#\" id=\"2\" class=\"js_user_mention\">Alok Srivastava</a>",
            :entities => [
                          {:id => 2341, :name => "parle biscuits", :image => "/images/actwitty/unknown_entity.png"},
                          {:id => 2342, :name => "sachin tendulkar", :image => "/images/actwitty/unknown_entity.png"},
                          {:id => 2343, :name => "sonia gandhi", :image => "/images/actwitty/unknown_entity.png"}
                         ],
            :friends => [
                          {:id => 2, :name => "Alok Srivastava", :image => "/images/actwitty/default_user.gif"},
                          {:id => 3, :name => "Milind Parab", :image => "/images/actwitty/default_user.gif"},
                          {:id => 4, :name => "Samarth Deo", :image => "/images/actwitty/default_user.gif"}
                        ]

          },
          {
            :word => {:id => 1926, :name => "Abcdef"},
            :time => "12:54:39",
            :id => 104,
            :count => 20,
            :user => {:id => 3, :full_name => "NoOne", :photo => "/images/actwitty/default_user.gif"},
            :location => [
                          {:id => 23456, :lat => 23.6567, :long => 120.3, :name => "marathalli", :type => 2},
                          {:id => 23457, :name => "Samarths Home", :type => 3}
                         ],
            :documents => [
                            {:id => 213, :name => "spring.jpg", :type => "image/jpg", :url => "/images/test/spring.jpg"},
                            {:id => 214,:name => "spring_2.jpg", :type => "image/jpg", :url => "/images/test/spring_2.jpg"},
                            {:id => 214,:name => "spring_2.jpg", :type => "image/jpg", :url => "/images/test/spring_2.jpg"},
                            {:id => 214,:name => "spring_2.jpg", :type => "image/jpg", :url => "/images/test/spring_2.jpg"},
                            {:id => 215,:name => "spring_3.jpg", :type => "image/jpg", :url => "/images/test/spring_3.jpg"}
                          ],

            :recent_text => "<a href=\"#\" id=\"479\" class=\"js_activity_entity\">pizza</a> at <a href=\"#\" id=\"478\" class=\"js_activity_entity\">pizza hut</a> with
                            <a href=\"#\" id=\"2\" class=\"js_user_mention\">Alok Srivastava</a>",
            :entities => [
                          {:id => 2341, :name => "parle biscuits", :image => "/images/actwitty/unknown_entity.png"},
                          {:id => 2342, :name => "sachin tendulkar", :image => "/images/actwitty/unknown_entity.png"},
                          {:id => 2343, :name => "sonia gandhi", :image => "/images/actwitty/unknown_entity.png"}
                         ],
            :friends => [
                          {:id => 2, :name => "Alok Srivastava", :image => "/images/actwitty/default_user.gif"},
                          {:id => 3, :name => "Milind Parab", :image => "/images/actwitty/default_user.gif"},
                          {:id => 4, :name => "Samarth Deo", :image => "/images/actwitty/default_user.gif"}
                        ]

          }
      ]
    end



    if request.xhr?
      puts user_snapshots
      render :json => user_snapshots, :status => 200
    end
  end

end
