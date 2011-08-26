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

      t.text    :url, :null => false
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

      t.text :social_counters_array

      t.timestamps
    end

    add_index :documents, [:owner_id, :category, :status]
    add_index :documents, [:summary_id, :category, :status]
    add_index :documents, [:activity_id, :category, :status]

    add_index :documents, [:owner_id,:activity_word_id, :location_id], :name => "index_documents_on_owner_word_location"
    add_index :documents, [:owner_id, :location_id]

    add_index :documents, [:summary_id,:activity_word_id, :location_id],  :name => "index_documents_on_summary_word_location"
    add_index :documents, [:summary_id, :location_id]

    add_index :documents, [:owner_id,:source_name]
    add_index :documents, [:summary_id, :source_name]

    add_index :documents, [:category, :status]
    add_index :documents, :status

    add_index :documents, [:id, :category]
    add_index :documents, [:owner_id, :id]

    add_index :documents, :updated_at

  end

  def self.down

    remove_index :documents, [:owner_id, :category, :status]
    remove_index :documents, [:summary_id, :category, :status]
    remove_index :documents, [:activity_id, :category, :status]

    remove_index :documents, :name => "index_documents_on_owner_word_location"
    remove_index :documents, [:owner_id, :location_id]

    remove_index :documents, :name => "index_documents_on_summary_word_location"
    remove_index :documents, [:summary_id, :location_id]

    remove_index :documents, [:owner_id,:source_name]
    remove_index :documents, [:summary_id, :source_name]

    remove_index :documents, [:category, :status]
    remove_index :documents, :status

    remove_index :documents, [:id, :category]
    remove_index :documents, [:owner_id, :id]

    remove_index :documents, :updated_at

    drop_table :documents
  end
end
