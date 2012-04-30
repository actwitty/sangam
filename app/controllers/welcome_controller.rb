class WelcomeController < ApplicationController
  #caches_page :new
  def new
    Rails.logger.info("[CNTRL] [WELCOME] [NEW] New page requested")

    if user_signed_in?
      Rails.logger.info("[CNTRL] [WELCOME] [NEW] User signed in")
      url = "#{current_user.username}.#{request.host}:#{request.port}"
      puts url
      redirect_to url
      #redirect_to :controller => "home", :action => "alpha"
      Rails.logger.info("[CNTRL] [WELCOME] [NEW] Redirect to home sketch")
    else
      @page_mode="landing_page"
      Rails.logger.info("[CNTRL] [WELCOME] [NEW] Main Page requested")
      #response.headers['Cache-Control'] = 'public, max-age=300'
       #FB: Open graph tags start
      set_meta_tags(:open_graph => {
                                     :title => "Actwitty - The Complete You.",
                                     :type => "product",
                                     :site_name => "Actwitty",
                                     :image => "http://actwitty.com/images/actwitty/refactor/aw_common/aw_logo.png",
                                     :description => "Actwitty integrates your multiple social profiles like Facebook, Twitter, LinkedIn, Youtube, Tumblr etc. Actwitty processes your data from these sources and categorizes data into the topics like Technology, Food, Entertainment etc. This generate a complete you. Start acting witty at http://www.actwitty.com ",
                                     :url => "http://www.actwitty.com",
                                     :locality => "Bangalore",
                                     :region => "KA",
                                     :email => "contact@actwitty.com",
                                     :'country-name' => "INDIA"
                                   },
                    :title => "The Complete You",
                    :keywords => "actwitty, social profile, persona, interests, topics, activities, social analytics, social media",
                    :author => "Actwitty",
                    :copyright => "Actwitty",
                    :ABSTRACT => "Actwitty integrates your multiple social profiles like Facebook, Twitter, LinkedIn, Youtube, Tumblr etc. Actwitty processes your data from these sources and categorizes data into the topics like Technology, Food, Entertainment etc. This generate a complete you. Start acting witty at http://www.actwitty.com ",
                    :description => "Actwitty integrates your multiple social profiles like Facebook, Twitter, LinkedIn, Youtube, Tumblr etc. Actwitty processes your data from these sources and categorizes data into the topics like Technology, Food, Entertainment etc. This generate a complete you. Start acting witty at http://www.actwitty.com ")







    #FB: Open graph tags end
    end
   Rails.logger.info("[CNTRL] [WELCOME] [NEW] Done")
  end


end
