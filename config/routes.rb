Sangam::Application.routes.draw do

  get "home/show"
  #get "home/alpha"
  get '/users/sign_in', :to => 'welcome#new'
  get '/users/sign_up', :to => 'welcome#new'
 # devise_for :users
  devise_for :users, :controllers => {:registrations => "users/registrations",
                                      :sessions => "users/sessions",
                                      :confirmations => "users/confirmations",
                                      :unlocks => "users/unlocks",
                                      :passwords => "users/passwords"}

  devise_scope :user do
    post "/confirm_user"  =>  "users/confirmations#accept"
  end


  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)
  match '/home/settings' => 'home#settings'
  match '/home/settings_save' => 'home#settings_save'
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

  match '/home/search_people' => 'home#search_people'

  match '/view' => 'home#activity'
  match '/home/get_single_activity' => 'home#get_single_activity'

  match '/home/get_draft_activities' => 'home#get_draft_activities'
  match '/home/publish_activity' => 'home#publish_activity'

  match '/home/process_edit_activity' => 'home#process_edit_activity'

  match '/authentications/failure' => 'authentications#failure'
  match '/users/auth/:provider/callback' => 'authentications#process_authentication'
  match '/welcome/confirmation_wait' => 'welcome#confirmation_wait'
  match '/authentications/auth_signin_provider' => 'authentications#auth_signin_provider'
  match '/authentications/auth_signin' => 'authentications#auth_signin'


  match '/entity_page' => 'home#entity_page'
  match '/home/get_entity_stream'   => 'home#get_entity_stream'

  match '/location_page' => 'home#location_page'
  match '/home/get_location_stream' => 'home#get_location_stream'

  match '/channel_page' => 'home#channel_page'
  match '/home/get_activity_stream' => 'home#get_activity_stream'


  match '/home/get_document_channel' => 'home#get_document_channel'
  match '/home/get_document_stream' => 'home#get_document_stream'





  #match '/contacts/add' => 'contacts#add'
  #match '/contacts/accept' => 'contacts#accept'
  #match '/contacts/remove' => 'contacts#remove'
  #match '/contacts/friends' => 'contacts#friends'
  #match '/contacts/pending_friend_requests' => 'contacts#pending_friend_requests'
  #match '/contacts/provider_add' => 'contacts#provider_add'
  #match '/contacts/friendship' => 'contacts#friendship'

  match '/contacts/facebook_friends' => 'contacts#facebook_friends'
  match '/contacts/search' => 'contacts#search'
  match '/contacts/followers' => 'contacts#followers'
  match '/contacts/followings' => 'contacts#followings'
  match '/contacts/follow' => 'contacts#follow'
  match '/contacts/unfollow' => 'contacts#unfollow'
  match '/contacts/provider_follow' => 'contacts#provider_follow'

  match 'activity_words/activity_word_list' => 'activity_words#activity_word_list'


  match '/facebook/facebook_friends_list' => 'facebook#facebook_friends_list'
  match '/facebook/invite' => 'facebook#invite'

  match '/about/show' => 'about#show'
  match '/team/show' => 'team#show'

  match '/feedback/new' => 'feedback#new'
  match '/feedback/create' => 'feedback#create'

  match '/sign_out' => 'welcome#new'
  match '/home/update_social_media_share' => 'home#update_social_media_share'
  match '/home/get_social_counter' => 'home#get_social_counter'

  match '/home/subscribe_summary' => 'home#subscribe_summary'
  match '/home/unsubscribe_summary' => 'home#unsubscribe_summary'




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
