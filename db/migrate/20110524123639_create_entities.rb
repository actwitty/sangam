  class CreateEntities < ActiveRecord::Migration
		def self.up
			create_table :entities do |t|

				t.string    :entity_name, :null => false

        #uniqe global uid
        t.string    :entity_guid, :null => false
        t.text   :entity_image, :null => false

        t.text     :entity_doc, :null => false

        t.text  :social_counters
				t.timestamps
      end

			  add_index :entities, :entity_guid, :unique => true
        add_index :entities, :entity_name
        add_index :entities, :updated_at

		end

		def self.down

      remove_index :entities, :entity_guid
			remove_index :entities, :entity_name
      remove_index :entities, :updated_at

			drop_table :entities
		end
	end
