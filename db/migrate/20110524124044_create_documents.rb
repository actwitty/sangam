class CreateDocuments < ActiveRecord::Migration
  def self.up
    create_table :documents do |t|
      t.integer :owner_id , :null => false

      t.integer :activity_id

      t.integer :activity_word_id

      t.text  :name, :null => false

      t.text    :mime

      #t.string :document_data  #need to enable for carrierwave
      t.text    :caption

      t.integer :comments_count

      t.integer :summary_id

      t.text    :url
      t.text    :thumb_url

      t.integer :status, :null => false     # 0 => saved, 1 => public share, 2 => private
                                            # 3 => shared to group of people or group.When this value is 3,
                                            # we need to see access_visibility table to see the access

      t.text    :source_name, :null => false    #"actwitty", "facebook", # "twitter",
                                                # "G+", "DropBox", "Mobile +919980906102","a@b.com

      t.boolean :uploaded, :null => false       #checks if uploaded document or mentioned document

      t.text    :provider, :null => false    #actwitty.com , youtube.com, etc check constant.yml
      t.text    :category, :null => false    #image, video, audio, document check constant.yml

      t.integer :location_id
      t.integer :web_link_id
      t.integer :campaigns_count

      t.text :social_counters_array

      t.timestamps
    end

    add_index :documents, :owner_id
    add_index :documents, :summary_id
    add_index :documents, :activity_id

    add_index :documents, :activity_word_id
    add_index :documents, :location_id


    add_index :documents,  :source_name

    add_index :documents, :category
    add_index :documents, :status

    add_index :documents, :updated_at

    add_index :documents, :web_link_id

  end

  def self.down
    drop_table :documents
  end
end
