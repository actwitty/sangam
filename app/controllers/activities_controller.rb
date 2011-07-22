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
    puts "---------------------------------------"
    puts "#{params}"
    puts "---------------------------------------"
    #incoming params
    last_id=0

    if params[:last_id].nil?
      last_id = 0
    else
      last_id = params[:last_id].to_i
    end


    if last_id == 0
        user_activities= [
                      {:post =>
                          {
                            :id =>  1234,
                            :user => { :id => 1, :full_name => "Sudhanshu Saxena", :photo => "/images/actwitty/default_user.gif" },
                            :time => "12:53:31",
                            :word => { :id => 1923, :name => "Motorbiking" },
                            :text =>  "<a href=/entities/479 class=\"js_entity_mention\">pizza</a> at <a href=/entities/478 class=\"js_entity_mention\">pizza hut</a> with
                                       <a href=/users/3019 class=\"js_user_mention\">Alok Srivastava</a> <a href=/users/0 class=\"js_entity_mention\">PIZZA</a>, this is an interesting
                                      text and I dont know how it is seen on the screen as its long enough post talking about the movie
                                      <a href=/entities/481 class=\"js_entity_mention\">Kal Ho Na Ho</a> while I was eating pizza and
                                      suddenly seeing <a href=/entities/482 class=\"js_entity_mention\">Shahrukh</a> selling pizza to
                                       <a href=/entities/481 class=\"js_user_mention\">Karan Johar</a> I do not like such kind of stuff
                                        but I watched the movie and ate my <a href=/entities/482 class=\"js_user_mention\">Burger</a>
                                        extremely peacefully. Now lets see really how does this text appear."
                          },
                      :location => {:id => 23456, :lat => 23.6567, :long => 120.3, :name => "marathalli", :type => 2},
                      :documents =>
                           {:count => 2,
                            :array =>
                              [
                                {:id => 213, :name => "spring.jpg", :type => "image/jpg", :url => "/images/test/spring.jpg"},
                                {:id => 214,:name => "autum.jpg", :type => "image/jpg", :url => "/images/test/spring_2.jpg"},
                                {:id => 215,:name => "winter.jpg", :type => "image/jpg", :url => "/images/test/spring_3.jpg"}
                              ]
                            },
                      :campaign =>
                              [
                                {:id => 35, :name => "like", :count => 23, :user => true},
                                {:id => 36, :name => "support", :count => 23, :user => false}
                              ],
                      :comments =>
                        {
                          :count => 2,
                          :array => [
                            {
                              :id => 123,
                              :user => {:id => 129, :full_name => "Def Saxena", :photo => "/images/actwitty/default_user.gif"},
                              :word => {:id => 1923, :name => "&comment&"},
                              :campaign => [
                                {:id => 38, :name => "like", :count => 23, :user => true},
                                {:id => 39, :name => "support", :count => 23, :user => false}],
                               :text => "<a href=/entities/479 class=\"js_entity_mention\">pizza</a> at <a href=/entities/478 class=\"js_entity_mention\">pizza hut</a> with
                                        <a href=/users/3019 class=\"js_user_mention\">Alok Srivastava</a> and <a href=/users/0 class=\"js_user_mention\">Samarth Deo</a>, This is an interesting
                                        long comment. Lets see how it appears on the screen. I hope it doesn't matter how it looks. As long as it
                                        does not break my JSON"
                            },
                           {
                              :id => 124,
                              :user => {:id => 1, :full_name => "Sudhanshu Saxena", :photo => "/images/actwitty/default_user.gif"},
                              :word => {:id => 1924, :name => "&comment&"},
                              :campaign => [
                                {:id => 38, :name => "like", :count => 23, :user => true},
                                {:id => 39, :name => "support", :count => 23, :user => false}],
                               :text => " I ate <a href=/entities/479 class=\"js_entity_mention\">pizza</a> at <a href=/entities/478 class=\"js_entity_mention\">pizza hut</a> with
                                        <a href=/users/3019 class=\"js_user_mention\">Super Man</a> with lot of <a href=/users/0 class=\"js_entity_mention\">cheese</a> and
                                        we both liked it."
                            }
                          ]
                        }
                      },
                      {:post =>
                          {
                            :id =>  1235,
                            :user => { :id => 2, :full_name => "Some Other Dude", :photo => "/images/actwitty/default_user.gif" },
                            :time => "12:53:31",
                            :word => { :id => 1923, :name => "Photography" },
                            :text =>  "<a href=/entities/479 class=\"js_entity_mention\">Lalbagh</a> in <a href=/entities/478 class=\"js_entity_mention\">summers</a> with
                                        with <a href=/users/3019 class=\"js_user_mention\">Deepika Padukone</a> is a great place to use your
                                        <a href=/users/0 class=\"js_entity_mention\">Nikon</a> <a href=/users/0 class=\"js_entity_mention\">DSLR</a>.
                                      We went for 10kms of run and then she decided that we will go for a  <a href=/users/0 class=\"js_entity_mention\">Nescafe</a>
                                      and then I liked the idea to call <a href=/users/3019 class=\"js_user_mention\">Alok Shrivastava</a>  as
                                      he always wanted to meet <a href=/users/3019 class=\"js_user_mention\">Deepika Padukone</a> and have coffee with
                                      her. Then I used my phone to call him and then he felt bad as he could not join us for coffee.
                                      After coffee I clicked her snaps with the backdrop of <a href=/entities/479 class=\"js_entity_mention\">Lalbagh</a>
                                      The I called <a href=/users/3019 class=\"js_user_mention\">Anand Prakash</a> but he was busy with his coding
                                      on <a href=/users/0 class=\"js_entity_mention\">Ruby on Rails</a> and he also could not join us."
                          },
                      :location => {:id => 23457, :lat => 23.6567, :long => 120.3, :name => "LalBagh, Bangalore", :type => 2},
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
                          :count => 4,
                          :array => [
                            {
                              :id => 125,
                              :user => {:id => 129, :full_name => "Samarth Deo", :photo => "/images/actwitty/default_user.gif"},
                              :word => {:id => 1923, :name => "&comment&"},
                              :campaign => [
                                {:id => 38, :name => "like", :count => 23, :user => true},
                                {:id => 39, :name => "support", :count => 23, :user => false}],
                               :text => " Arre Sahi <a href=/entities/479 class=\"js_entity_mention\">Lal Bagh</a> at woh bhi pizza hut</a> with
                                        <a href=/users/3019 class=\"js_user_mention\">Deepika Padukone</a> didi ke saath <a href=/users/3019 class=\"js_user_mention\">Alok Shrivastava</a> to
                                        bahut dukhi honge. Khair aur kya kiya,   <a href=/entities/479 class=\"js_entity_mention\">Samosa</a>  khaya
                                        ki nahi ?"
                            },
                           {
                              :id => 126,
                              :user => {:id => 1, :full_name => "Sudhanshu Saxena", :photo => "/images/actwitty/default_user.gif"},
                              :word => {:id => 1923, :name => "&comment&"},
                              :campaign => [
                                {:id => 38, :name => "like", :count => 23, :user => true},
                                {:id => 39, :name => "support", :count => 23, :user => false}],
                               :text => " Nahi yaar
                                        <a href=/users/3019 class=\"js_user_mention\">Samarth Deo</a> bas chaaye pi kar aaye"
                            },
                            {
                              :id => 127,
                              :user => {:id => 3, :full_name => "Anand Prakash", :photo => "/images/actwitty/default_user.gif"},
                              :word => {:id => 1923, :name => "&comment&"},
                              :campaign => [
                                {:id => 38, :name => "like", :count => 23, :user => true},
                                {:id => 39, :name => "support", :count => 23, :user => false}],
                               :text => " Oh sirji
                                        <a href=/users/3019 class=\"js_user_mention\">Alok Shrivastava</a> ko phone lagaate hain
                                        maza aayegaa. He must be upset on not being able to meet <a href=/users/3019 class=\"js_user_mention\">Deepika Padukone</a>"
                            },
                              {
                              :id => 128,
                              :user => {:id => 4, :full_name => "Alok Shrivastava", :photo => "/images/actwitty/default_user.gif"},
                              :word => {:id => 1923, :name => "&comment&"},
                              :campaign => [
                                {:id => 38, :name => "like", :count => 23, :user => true},
                                {:id => 39, :name => "support", :count => 23, :user => false}],
                               :text => "Kameenon"
                            }
                          ]
                        }
                      }

                    ]

          if request.xhr?
            render :json => user_activities, :status => 200
          end
    else
      user_activities= [
                      {:post =>
                          {
                            :id =>  1337,
                            :user => { :id => 1, :full_name => "Sudhanshu Saxena", :photo => "/images/actwitty/default_user.gif" },
                            :time => "12:53:31",
                            :word => { :id => 1928, :name => "Programming" },
                            :text =>  "<a href=/entities/479 class=\"js_entity_mention\">pizza</a> at <a href=/entities/478 class=\"js_entity_mention\">pizza hut</a> with
                                       <a href=/users/3019 class=\"js_user_mention\">Alok Srivastava</a> <a href=/users/0 class=\"js_entity_mention\">PIZZA</a>, this is an interesting
                                      text and I dont know how it is seen on the screen as its long enough post talking about the movie
                                      <a href=/entities/481 class=\"js_entity_mention\">Kal Ho Na Ho</a> while I was eating pizza and
                                      suddenly seeing <a href=/entities/482 class=\"js_entity_mention\">Shahrukh</a> selling pizza to
                                       <a href=/entities/481 class=\"js_user_mention\">Karan Johar</a> I do not like such kind of stuff
                                        but I watched the movie and ate my <a href=/entities/482 class=\"js_user_mention\">Burger</a>
                                        extremely peacefully. Now lets see really how does this text appear."
                          },
                      :location => {:id => 23457, :lat => 23.6567, :long => 120.3, :name => "Home", :type => 2},
                      :documents =>
                              [
                                {:id => 213, :name => "spring.jpg", :type => "image/jpg", :url => "/images/test/spring.jpg"},
                                {:id => 214,:name => "autum.jpg", :type => "image/jpg", :url => "/images/test/spring_2.jpg"},
                                {:id => 215,:name => "winter.jpg", :type => "image/jpg", :url => "/images/test/spring_3.jpg"}
                              ],
                      :campaign =>
                              [
                                {:id => 45, :name => "like", :count => 23, :user => true},
                                {:id => 46, :name => "join", :count => 23, :user => false}
                              ],
                      :comment =>
                        {
                          :count => 2,
                          :array => [
                            {
                              :id => 133,
                              :user => {:id => 129, :full_name => "Def Saxena", :photo => "/images/actwitty/default_user.gif"},
                              :word => {:id => 1923, :name => "&comment&"},
                              :campaign => [
                                {:id => 55, :name => "like", :count => 23, :user => true},
                                {:id => 56, :name => "support", :count => 23, :user => false}],
                               :text => "<a href=/entities/479 class=\"js_entity_mention\">pizza</a> at <a href=/entities/478 class=\"js_entity_mention\">pizza hut</a> with
                                        <a href=/users/3019 class=\"js_user_mention\">Alok Srivastava</a> and <a href=/users/0 class=\"js_user_mention\">Samarth Deo</a>, This is an interesting
                                        long comment. Lets see how it appears on the screen. I hope it doesn't matter how it looks. As long as it
                                        does not break my JSON"
                            },
                           {
                              :id => 134,
                              :user => {:id => 1, :full_name => "Sudhanshu Saxena", :photo => "/images/actwitty/default_user.gif"},
                              :word => {:id => 1924, :name => "&comment&"},
                              :campaign => [
                                {:id => 38, :name => "like", :count => 23, :user => true},
                                {:id => 39, :name => "support", :count => 23, :user => false}],
                               :text => " I ate <a href=/entities/479 class=\"js_entity_mention\">pizza</a> at <a href=/entities/478 class=\"js_entity_mention\">pizza hut</a> with
                                        <a href=/users/3019 class=\"js_user_mention\">Super Man</a> with lot of <a href=/users/0 class=\"js_entity_mention\">cheese</a> and
                                        we both liked it."
                            }
                          ]
                        }
                      },
                      {:post =>
                          {
                            :id =>  1487,
                            :user => { :id => 2, :full_name => "Some Other Dude", :photo => "/images/actwitty/default_user.gif" },
                            :time => "12:53:31",
                            :word => { :id => 1923, :name => "Photography" },
                            :text =>  "<a href=/entities/479 class=\"js_entity_mention\">Lalbagh</a> in <a href=/entities/478 class=\"js_entity_mention\">summers</a> with
                                        with <a href=/users/3019 class=\"js_user_mention\">Deepika Padukone</a> is a great place to use your
                                        <a href=/users/0 class=\"js_entity_mention\">Nikon</a> <a href=/users/0 class=\"js_entity_mention\">DSLR</a>.
                                      We went for 10kms of run and then she decided that we will go for a  <a href=/users/0 class=\"js_entity_mention\">Nescafe</a>
                                      and then I liked the idea to call <a href=/users/3019 class=\"js_user_mention\">Alok Shrivastava</a>  as
                                      he always wanted to meet <a href=/users/3019 class=\"js_user_mention\">Deepika Padukone</a> and have coffee with
                                      her. Then I used my phone to call him and then he felt bad as he could not join us for coffee.
                                      After coffee I clicked her snaps with the backdrop of <a href=/entities/479 class=\"js_entity_mention\">Lalbagh</a>
                                      The I called <a href=/users/3019 class=\"js_user_mention\">Anand Prakash</a> but he was busy with his coding
                                      on <a href=/users/0 class=\"js_entity_mention\">Ruby on Rails</a> and he also could not join us."
                          },
                      :location => {:id => 23457, :lat => 23.6567, :long => 120.3, :name => "LalBagh, Bangalore", :type => 2},
                      :documents =>
                              [
                                {:id => 213, :name => "spring.jpg", :type => "image/jpg", :url => "/images/test/spring.jpg"},
                                {:id => 214,:name => "autum.jpg", :type => "image/jpg", :url => "/images/test/spring_2.jpg"},
                                {:id => 215,:name => "winter.jpg", :type => "image/jpg", :url => "/images/test/spring_3.jpg"}
                              ],
                      :campaign =>
                              [
                                {:id => 57, :name => "like", :count => 23, :user => true},
                                {:id => 58, :name => "support", :count => 23, :user => false}
                              ],
                      :comment =>
                        {
                          :count => 4,
                          :array => [
                            {
                              :id => 175,
                              :user => {:id => 129, :full_name => "Samarth Deo", :photo => "/images/actwitty/default_user.gif"},
                              :word => {:id => 1923, :name => "&comment&"},
                              :campaign => [
                                {:id => 38, :name => "like", :count => 23, :user => true},
                                {:id => 39, :name => "support", :count => 23, :user => false}],
                               :text => " Arre Sahi <a href=/entities/479 class=\"js_entity_mention\">Lal Bagh</a> at woh bhi pizza hut</a> with
                                        <a href=/users/3019 class=\"js_user_mention\">Deepika Padukone</a> didi ke saath <a href=/users/3019 class=\"js_user_mention\">Alok Shrivastava</a> to
                                        bahut dukhi honge. Khair aur kya kiya,   <a href=/entities/479 class=\"js_entity_mention\">Samosa</a>  khaya
                                        ki nahi ?"
                            },
                           {
                              :id => 176,
                              :user => {:id => 1, :full_name => "Sudhanshu Saxena", :photo => "/images/actwitty/default_user.gif"},
                              :word => {:id => 1923, :name => "&comment&"},
                              :campaign => [
                                {:id => 38, :name => "like", :count => 23, :user => true},
                                {:id => 39, :name => "support", :count => 23, :user => false}],
                               :text => " Nahi yaar
                                        <a href=/users/3019 class=\"js_user_mention\">Samarth Deo</a> bas chaaye pi kar aaye"
                            },
                            {
                              :id => 177,
                              :user => {:id => 3, :full_name => "Anand Prakash", :photo => "/images/actwitty/default_user.gif"},
                              :word => {:id => 1923, :name => "&comment&"},
                              :campaign => [
                                {:id => 38, :name => "like", :count => 23, :user => true},
                                {:id => 39, :name => "support", :count => 23, :user => false}],
                               :text => " Oh sirji
                                        <a href=/users/3019 class=\"js_user_mention\">Alok Shrivastava</a> ko phone lagaate hain
                                        maza aayegaa. He must be upset on not being able to meet <a href=/users/3019 class=\"js_user_mention\">Deepika Padukone</a>"
                            },
                              {
                              :id => 178,
                              :user => {:id => 4, :full_name => "Alok Shrivastava", :photo => "/images/actwitty/default_user.gif"},
                              :word => {:id => 1923, :name => "&comment&"},
                              :campaign => [
                                {:id => 38, :name => "like", :count => 23, :user => true},
                                {:id => 39, :name => "support", :count => 23, :user => false}],
                               :text => "Kameenon"
                            }
                          ]
                        }
                      }

                    ]

          if request.xhr?
            render :json => user_activities, :status => 200
          end
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

            :recent_text => "<a href=\"#\" id=\"479\" class=\"js_entity_mention\">pizza</a> at <a href=\"#\" id=\"478\" class=\"js_entity_mention\">pizza hut</a> with
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

            :recent_text => "<a href=\"#\" id=\"479\" class=\"js_entity_mention\">pizza</a> at <a href=\"#\" id=\"478\" class=\"js_entity_mention\">pizza hut</a> with
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

            :recent_text => "<a href=\"#\" id=\"479\" class=\"js_entity_mention\">pizza</a> at <a href=\"#\" id=\"478\" class=\"js_entity_mention\">pizza hut</a> with
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

            :recent_text => "<a href=\"#\" id=\"479\" class=\"js_entity_mention\">pizza</a> at <a href=\"#\" id=\"478\" class=\"js_entity_mention\">pizza hut</a> with
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
      #puts user_snapshots
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

            :recent_text => "<a href=\"#\" id=\"479\" class=\"js_entity_mention\">pizza</a> at <a href=\"#\" id=\"478\" class=\"js_entity_mention\">pizza hut</a> with
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

            :recent_text => "<a href=\"#\" id=\"479\" class=\"js_entity_mention\">pizza</a> at <a href=\"#\" id=\"478\" class=\"js_entity_mention\">pizza hut</a> with
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

            :recent_text => "<a href=\"#\" id=\"479\" class=\"js_entity_mention\">pizza</a> at <a href=\"#\" id=\"478\" class=\"js_entity_mention\">pizza hut</a> with
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

            :recent_text => "<a href=\"#\" id=\"479\" class=\"js_entity_mention\">pizza</a> at <a href=\"#\" id=\"478\" class=\"js_entity_mention\">pizza hut</a> with
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
      #puts user_snapshots
      render :json => user_snapshots, :status => 200
    end
  end

end
