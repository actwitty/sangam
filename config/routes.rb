Sangam::Application.routes.draw do

  get "home/show"
  get "home/streams"
  #get "home/alpha"
  get '/users/sign_in', :to => 'welcome#new'
  get '/users/sign_up', :to => 'welcome#new'
  
  match '/home/change_password' => 'home#change_password'
 # devise_for :users
  devise_for :users, :controllers => {:registrations => "users/registrations",
                                      :sessions => "users/sessions",
                                      :confirmations => "users/confirmations",
                                      :unlocks => "users/unlocks",
                                      :passwords => "users/passwords"}

  devise_scope :user do
    post "/confirm_user"  =>  "users/confirmations#accept"
    #match "/change_password"  =>  "users/passwords#change"
  end









  match '/channel_settings/edit' => 'channel_settings#edit'
  match '/channel_settings/update' => 'channel_settings#update_channels'


  #match '/home/settings' => 'user_settings#settings'
  #match '/home/settings_save' => 'user_settings#settings_save'

  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)
  match '/home/facebook_friends' => 'home#facebook_friends'


  match '/home/settings' => 'home#settings'
  match '/home/settings_save' => 'home#settings_save'
  match '/home/deactivate' => 'home#deactivate_account'
  match '/home/change_profile_pic' => 'home#change_profile_pic'



  match '/home/get_channels' => 'home#get_channels'
  match '/home/get_entities' => 'home#get_entities'
  match '/home/delete_entities_from_post' => 'home#delete_entities_from_post'
  match '/home/get_related_entities' => 'home#get_related_entities'
  match '/home/get_locations' => 'home#get_locations'
  match '/home/get_related_locations' => 'home#get_related_locations'
  match '/home/get_enriched_activities' => 'home#get_enriched_activities'
  match '/home/get_all_comments' => 'home#get_all_comments'
  match '/home/get_users_of_campaign' => 'home#get_users_of_campaign'
  match '/home/get_related_friends' => 'home#get_related_friends'
  match '/home/create_campaign' => 'home#create_campaign'
  match '/home/delete_campaign' => 'home#delete_campaign'
  match '/home/delete_stream' => 'home#delete_stream'
  match '/home/delete_comment' => 'home#delete_comment'
  match '/home/create_comment' => 'home#create_comment'
  match '/home/create_activity' => 'home#create_activity'
  match '/home/get_summary' => 'home#get_summary'
  match '/home/get_friends_summary' => 'home#get_friends_summary'
  match '/home/get_streams' => 'home#get_streams'
  match '/home/remove_document' => 'home#remove_document'

  match '/home/search_any' => 'home#search_any'

  match '/view' => 'home#activity'
  match '/home/get_single_activity' => 'home#get_single_activity'

  match '/home/get_draft_activities' => 'home#get_draft_activities'
  match '/home/publish_activity' => 'home#publish_activity'

  match '/home/process_edit_activity' => 'home#process_edit_activity'

  match '/authentications/failure' => 'authentications#failure'
  match '/users/auth/:provider/callback' => 'authentications#process_authentication'
  match '/welcome/confirmation_wait' => 'welcome#confirmation_wait'
  match '/authentications/auth_signup_provider' => 'authentications#auth_signup_provider'
  match '/authentications/auth_signin_provider' => 'authentications#auth_signin_provider'
  match '/authentications/auth_signin' => 'authentications#auth_signin'


  match '/mention_page' => 'home#mention_page'
  match '/home/get_mention_specific_stream'   => 'home#get_mention_specific_stream'

  match '/location_page' => 'home#location_page'
  match '/home/get_location_specific_stream' => 'home#get_location_specific_stream'

  match '/channel_page' => 'home#channel_page'
  match '/home/get_channel_specific_stream' => 'home#get_channel_specific_stream'


  match '/home/get_document_channel' => 'home#get_document_channel'
  match '/home/get_document_stream' => 'home#get_document_stream'

  match '/home/get_subscribers' => 'home#subscribers'
  match '/home/get_subscriptions' => 'home#subscriptions'

  match '/home/create_theme' => 'home#create_theme'

  match '/home/get_latest_summary' => 'home#get_latest_summary'

  match '/home/rename_channel_of_post' => 'home#rename_channel_of_post'


  match 'activity_words/activity_word_list' => 'activity_words#activity_word_list'


  match '/facebook/facebook_friends_list' => 'facebook#facebook_friends_list'
  match '/facebook/invite' => 'facebook#invite'

  match '/about/show' => 'about#show'
  match '/team/show' => 'team#show'

  match '/feedback/new' => 'feedback#new'
  match '/feedback/create' => 'feedback#create'

  match '/sign_out' => 'welcome#new'
  match '/welcome/new' => 'welcome#new'
  match '/home/update_social_media_share' => 'home#update_social_media_share'
  match '/home/get_social_counter' => 'home#get_social_counter'

  match '/home/subscribe_summary' => 'home#subscribe_summary'
  match '/home/unsubscribe_summary' => 'home#unsubscribe_summary'

  match '/facebook/wall' => 'facebook#get_last_few_from_wall'
  #Alok Adding pusher support
  match '/pusher/auth' => 'home#pusher_auth'



  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products
  resources :users
  resources :profiles
  resources :authentications
  resources :contacts
  resources :feedbacks
  resource  :documents

  # Sample resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
  # root :to => "welcome#index"
    
  root :to => "welcome#new"



  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # match ':controller(/:action(/:id(.:format)))'
end
