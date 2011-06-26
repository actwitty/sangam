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
    user_activities= {:root =>
                          {        :user => {:user_id => 123, :full_name => "Sudha Saxena", :photo => "http://google.com"},
                                   :activity_word => {:word_id => 1923, :word_name => "Motorbiking"},
                                   :location => {:location_id => 23456, :geo_location => {:geo_latitude => 23.6567, :geo_longitude => 120.3, :geo_name => "marathalli"}} ,
                                   :documents => [{:document_id => 213, :document_name => "file.jpg", :document_type => "image/jpg", :document_url => "http://s3.amazonaws.com/1"},
                                                  {:document_id => 214,:document_name => "file1.jpg", :document_type => "image/jpg", :document_url => "http://s3.amazonaws.com/2"},
                                                  {:document_id => 215,:document_name => "file2.jpg", :document_type => "image/jpg", :document_url => "http://s3.amazonaws.com/3"} ],
                                   :campaign => [{:campaign_id => 35, :campaign_name => "like", :campaign_count => 23, :campaign_user => true},
                                                  {:campaign_id => 36, :campaign_name => "support", :campaign_count => 23, :campaign_user => false}],
                                   :activity_text => "<a href=/entities/479 class=\"activity_entity\">pizza</a> at <a href=/entities/478 class=\"activity_entity\">pizza hut</a> with
                                                 <a href=/users/3019 class=\"activity_mention\">Alok Srivastava</a> <a href=/users/0 class=\"activity_mention\">PIZZA</a>"
                          },
                      :children => { :count => 1,
                                     :array => [{:user => {:user_id => 123, :full_name => "Sudha Saxena", :photo => "http://google.com"},
                                                 :activity_word => {:word_id => 1923, :word_name => "&comment&"},
                                                 :campaign => [{:campaign_id => 38, :campaign_name => "like", :campaign_count => 23, :campaign_user => true},
                                                                {:campaign_id => 39, :campaign_name => "support", :campaign_count => 23, :campaign_user => false}],
                                                  :activity_text => "<a href=/entities/479 class=\"activity_entity\">pizza</a> at <a href=/entities/478 class=\"activity_entity\">pizza hut</a> with
                                                 <a href=/users/3019 class=\"activity_mention\">Alok Srivastava</a> <a href=/users/0 class=\"activity_mention\">PIZZA</a>"
                                                }]
                          }
                    }

    if request.xhr?
      render :json => user_activities
    end
  end
  def get_snapshots
    user_snapshots= [ {:activity_word => {:word_id => 1923, :word_name => "Motorbiking"},
                        :activity_count => 20,
                        :user => {:user_id => 123, :full_name => "Sudha Saxena", :photo => "http://google.com"},

                        :location => [{:location_id => 23456, :geo_location => {:geo_latitude => 23.6567, :geo_longitude => 120.3, :geo_name => "marathalli"}}] ,
                        :documents => [{:document_id => 213, :document_name => "file.jpg", :document_type => "image/jpg", :document_url => "http://s3.amazonaws.com/1"},
                                                  {:document_id => 214,:document_name => "file1.jpg", :document_type => "image/jpg", :document_url => "http://s3.amazonaws.com/2"},
                                                  {:document_id => 215,:document_name => "file2.jpg", :document_type => "image/jpg", :document_url => "http://s3.amazonaws.com/3"} ],

                        :recent_text => "<a href=/entities/479 class=\"activity_entity\">pizza</a> at <a href=/entities/478 class=\"activity_entity\">pizza hut</a> with
                                                 <a href=/users/3019 class=\"activity_mention\">Alok Srivastava</a> <a href=/users/0 class=\"activity_mention\">PIZZA</a>",
                        :entities => [{:entity_id => 2346, :entity_name => "parle biscuits", :entity_image => "http://google.com"}]
                      }
                    ]

    if request.xhr?
      render :json => user_snapshots
    end
  end

end
