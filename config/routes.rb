Sangam::Application.routes.draw do

  get "home/show"

  get "home_controller/show"

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
  match '/users/auth/:provider/callback' => 'authentications#process_authentication'
  match '/users/registrations/confirmation_wait' => 'users/registrations#confirmation_wait'

  match '/authentications/auth_signin' => 'authentications#auth_signin'
  match '/contacts/facebook_friends' => 'contacts#facebook_friends'
  match '/contacts/friends' => 'contacts#friends'
  match '/contacts/pending_friend_requests' => 'contacts#pending_friend_requests'

  match '/contacts/friendship' => 'contacts#friendship'
  match '/contacts/search' => 'contacts#search'
  match '/contacts/provider_add' => 'contacts#provider_add'


  match '/contacts/add' => 'contacts#add'
  match '/contacts/accept' => 'contacts#accept'
  match '/contacts/remove' => 'contacts#remove'



  match '/facebook/facebook_friends_list' => 'facebook#facebook_friends_list'
  match '/facebook/invite' => 'facebook#invite'


  match '/sign_out' => 'welcome#new'


  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products
  resources :users
  resources :profiles
  resources :authentications
  resources :contacts

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
