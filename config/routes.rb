Sangam::Application.routes.draw do


  #get "home/alpha"
  get '/users/sign_in', :to => 'welcome#new'
  get '/users/sign_up', :to => 'welcome#new'
 
  get   '/actgreen', :to => 'actgreen#show'
  match '/actgreen/new', :to => 'actgreen#new'

  match '/api', :to => 'api#show'
  match '/blog', :to => 'blog#show'


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


  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)
  
  constraints(Subdomain) do
    match '/' => 'home#show'
  end

  post "/crawled_user"  =>  "home#create_crawled_user"
  post "/open_user"     => "home#create_open_user"

  match '/show' => 'home#show'
  match '/thanks' => 'home#thanks'
  match '/waiting' => 'home#waiting'

  match '/home/get_entities' => 'home#get_entities'
  match '/home/get_entities_verified' => 'home#get_entities_verified'
  match '/home/get_analytics_timeline' => 'home#get_analytics_timeline'
  match '/home/get_sketch_data_status' => 'home#get_sketch_data_status'


  match '/home/settings' => 'home#settings'
  match '/home/settings_save' => 'home#settings_save'
  match '/home/deactivate' => 'home#deactivate_account'
  match '/home/change_profile_pic' => 'home#change_profile_pic'



  match '/home/get_summary' => 'home#get_summary'
  match '/home/get_streams' => 'home#get_streams'

  match '/home/search_user' => 'home#search_user'


  match '/authentications/failure' => 'authentications#failure'
  match '/users/auth/:provider/callback' => 'authentications#process_authentication'
  match '/welcome/confirmation_wait' => 'welcome#confirmation_wait'
  match '/authentications/auth_signup_provider' => 'authentications#auth_signup_provider'
  match '/authentications/auth_signin_provider' => 'authentications#auth_signin_provider'
  match '/authentications/auth_signin' => 'authentications#auth_signin'



  match '/about' => 'about#show'

  
  match '/invites/admin' => 'invites#admin'
  match '/invites/userbase' => 'invites#userbase'
  match '/invites/uninviteds' => 'invites#uninviteds'
  match '/invites/pending' => 'invites#pending'
  match '/invites/get_user_counts' => 'invites#get_user_counts'
  match '/invites/get_user_to_delete' => 'invites#get_user_to_delete'
  match '/invites/get_user_service_to_delete' => 'invites#get_user_service_to_delete'
  match '/invites/delete_user' => 'invites#delete_user'
  match '/invites/delete_user_service' => 'invites#delete_user_service'

  match '/invites/create_new' => 'invites#create_new'
  match '/invites/backdoor_enable_service' => 'invites#backdoor_enable_service'
  match '/invites/force_inject_job_for_user' => 'invites#force_inject_job_for_user'

  match '/sign_out' => 'welcome#new'
  match '/welcome/new' => 'welcome#new'




  #Alok Adding pusher support
  match '/pusher/auth' => 'home#pusher_auth'

  resource :sitemaps, :only => :show

  #match ":username" => "home#show"
  match ":username" => "home#show"
  match ":username/mentions/:mention" => "home#show"
  match ":username/streams/:stream" => "home#show"

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products
  resources :users
  resources :profiles
  resources :authentications
  resources :contacts
  resources :feedbacks
  resource  :documents
  #

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
