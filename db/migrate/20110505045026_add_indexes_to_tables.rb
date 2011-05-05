class AddIndexesToTables < ActiveRecord::Migration
  def self.up

    #user
    add_index :users, :username, :unique => true    
    
    #profile
    add_index :profiles, :user_id
    
    #contact
    add_index :contacts, [:user_id, :friend_id], :unique => true
    
    #hub
    add_index :hubs, :user_id #, :unique => true
    add_index :hubs, :post_id #, :unique => true
    add_index :hubs, :entity_id #,:unique => true
    add_index :hubs, :activity_id #,:unique => true
    add_index :hubs, [:entity_id,:post_id], :unique => true
    add_index :hubs, :created_at
    
    #post    
    add_index :posts, :created_at
    
    #comment
    add_index :comments, :post_id
    add_index :comments, :author_id
    add_index :comments, :created_at
    
    
    #like
    add_index :likes, :post_id
    add_index :likes, :author_id
    add_index :likes, :created_at 
    
    #activity
    add_index :activities, :activity_name
    
    #entity
    add_index :entities, :entity_name
    add_index :entities, :entity_type
    
    #userboard_post_caches
    add_index :userboard_post_caches, :user_id
    
    #post_visibilities
    add_index :post_visibilities, :post_id  
    
    #loop
    add_index :loops, :user_id
    add_index :loops, :name
  end
  
  def self.down  
    
    
    #user
    remove_index :users, :username
    
    #profile
    remove_index :profiles, :user_id
    
    #contact
    remove_index :contacts, [:user_id, :friend_id]
    
    #hub
    remove_index :hubs, :user_id #, :unique => true
    remove_index :hubs, :post_id #, :unique => true
    remove_index :hubs, :entity_id #,:unique => true
    remove_index :hubs, :activity_id #,:unique => true
    remove_index :hubs, [:entity_id,:post_id] #, :unique => true
    remove_index :hubs, :created_at
    
    #post    
    remove_index :posts, :created_at
    
    #comment
    remove_index :comments, :post_id
    remove_index :comments, :author_id
    remove_index :comments, :created_at
    
    #like
    remove_index :likes, :post_id
    remove_index :likes, :author_id
    remove_index :likes, :created_at
    
    #activity
    remove_index :activities, :activity_name
    
    #entity
    remove_index :entities, :entity_name
    remove_index :entities, :entity_type

    #userboard_post_caches
    remove_index :userboard_post_caches, :user_id
    
    #post_visibilities
    remove_index :post_visibilities, :post_id
    #loop
    remove_index :loops, :user_id
    remove_index :loops, :name
    
  end
end
