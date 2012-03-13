Sangam::Application.routes.draw do


  get "home/sketch"
  get "home/thanks"
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


  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)
  

  match '/home/get_entities' => 'home#get_entities'
  match '/home/get_entities_verified' => 'home#get_entities_verified'
  match '/home/get_analytics_timeline' => 'home#get_analytics_timeline'

  match '/home/settings' => 'home#settings'
  match '/home/settings_save' => 'home#settings_save'
  match '/home/deactivate' => 'home#deactivate_account'
  match '/home/change_profile_pic' => 'home#change_profile_pic'



  match '/home/get_summary' => 'home#get_summary'
  match '/home/get_streams' => 'home#get_streams'

  match '/home/search_any' => 'home#search_any'


  match '/authentications/failure' => 'authentications#failure'
  match '/users/auth/:provider/callback' => 'authentications#process_authentication'
  match '/welcome/confirmation_wait' => 'welcome#confirmation_wait'
  match '/authentications/auth_signup_provider' => 'authentications#auth_signup_provider'
  match '/authentications/auth_signin_provider' => 'authentications#auth_signin_provider'
  match '/authentications/auth_signin' => 'authentications#auth_signin'


  match '/facebook/invite' => 'facebook#invite'

  match '/about/show' => 'about#show'
  match '/team/show' => 'team#show'

  
  match '/invites/inviteds' => 'invites#inviteds'
  match '/invites/accepted' => 'invites#accepted'
  match '/invites/registered' => 'invites#registered'

  match '/invites/create_new' => 'invites#create_new'

  match '/sign_out' => 'welcome#new'
  match '/welcome/new' => 'welcome#new'





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
