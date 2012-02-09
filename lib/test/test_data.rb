module Test
  class << self
     def test_create_data(user)

        @act = user.create_activity({:word => "Entertainment" , :text => " hello Pizza Hut http://youtube.com/watch?222 http://form6.flickr.com/ wow #italian ",
                                                 :location => {:lat => 23.45 ,:long => 45.45, :name => "marathalli"},
                                                 :enrich => true, :status_at_source => AppConstants.status_public_at_source, :documents => [{:url => "https://s3.amazonaws.com/2.jpg" },
                                                              {:url => "http://a.com/2_1.jpg" },],:category_id => "Entertainment"})

        @act1 =  user.create_activity({:word => "Entertainment" , :text => " Coorg is best place to visit in south india ",
                                                         :location => {:lat => 23.45 ,:long => 45.45, :name => "marathalli"},:source_name => "facebook",
                                                         :enrich => true, :status_at_source => AppConstants.status_private_at_source, :documents => [{:url => "https://s3.amazonaws.com/2.jpg" },
                                                                      {:url => "http://a.com/2_1.jpg" },],:category_id => "Entertainment"})

        @act2 =  user.create_activity({:word => "Technology" , :text => "Google is going big.. May be problems for facebook http://youtube.com/watch?222",
                                                         :location => {:lat => 23.45 ,:long => 45.45, :name => "marathalli"},
                                                         :enrich => true, :status_at_source => AppConstants.status_private_at_source, :documents => [{:url => "https://s3.amazonaws.com/2.jpg" },
                                                                      {:url => "http://a.com/2_1.jpg" },],:category_id => "Technology"})

        puts "Activity 1"
        puts @act
        puts "Activity 2"
        puts @act1
        puts "Activity 3"
        puts @act2

        @hub = Hub.includes(:entity, :location).where(:user_id => user.id)
        @doc=Document.where(:owner_id=> user.id)
    end
  end
end
