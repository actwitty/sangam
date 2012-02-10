class CreateDocuments < ActiveRecord::Migration
  def self.up
    create_table :documents do |t|
      t.integer :owner_id , :null => false

      t.integer :activity_id

      t.integer :activity_word_id

      t.integer :summary_id

      t.text    :url


      t.integer :status, :null => false     # 0 => saved, 1 => public share, 2 => private
                                            # 3 => shared to group of people or group.When this value is 3,
                                            # we need to see access_visibility table to see the access

      t.text    :source_name, :null => false    #"actwitty", "facebook", # "twitter",
                                                # "G+", "DropBox", "Mobile +919980906102","a@b.com
      t.text    :source_object_id           #object id of document at source
      t.text    :source_msg_id              #id of message to which this document belongs .. at source like fb, t, g+ etc
      t.integer :status_at_source           #same as msg's status at sources

      t.boolean :uploaded, :null => false       #checks if uploaded document or mentioned document

      t.text    :category, :null => false    #image, video, audio, document check constant.yml

      t.integer :web_link_id

      t.datetime :backup_created_timestamp, :default => Time.now.utc

      t.timestamps
    end

    add_index :documents, :owner_id
    add_index :documents, :summary_id
    add_index :documents, :activity_id

    add_index :documents, :activity_word_id

    add_index :documents,  :source_name

    add_index :documents, :category
    add_index :documents, :status

    add_index :documents, :updated_at

    add_index :documents, :web_link_id

    add_index :documents, :backup_created_timestamp

  end

  def self.down
    drop_table :documents
  end
end
