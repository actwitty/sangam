class WelcomeController < ApplicationController
  #caches_page :new
  def new
    Rails.logger.info("[CNTRL] [WELCOME] [NEW] New page requested")

    if user_signed_in?
      Rails.logger.info("[CNTRL] [WELCOME] [NEW] User signed in")
      redirect_to :controller => "home", :action => "show"
      #redirect_to :controller => "home", :action => "alpha"
      Rails.logger.info("[CNTRL] [WELCOME] [NEW] Redirect to home show")
    else
      @page_mode="landing_page"
      Rails.logger.info("[CNTRL] [WELCOME] [NEW] Main Page requested")
      #response.headers['Cache-Control'] = 'public, max-age=300'
       #FB: Open graph tags start
      set_meta_tags :open_graph => {
                                    :title => "ActWitty - Check-in your interests",
                                    :type => "activity",
                                    :site_name => "ActWitty",
                                    :image => "http://www.actwitty.com/images/actwitty/refactor/aw_common/aw_logo.png",
                                    :description => "An interest based social network which gathers your social foot print organized under interest channels from your favorite social networks.",
                                    :url => "www.actwitty.com",
                                    :locality => "Bangalore",
                                    :region => "KA",
                                    :'country-name' => "INDIA"
                                  },
                  :title => "Check-in your interests",
                  :keywords => "social media, social networking, feeds, aggregator, location, declutter, SEO, blogger, checkin, ranks, badges, facebook, twitter",



    #FB: Open graph tags end
    end
   Rails.logger.info("[CNTRL] [WELCOME] [NEW] Done")
  end


end
