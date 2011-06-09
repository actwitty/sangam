  class CreateEntities < ActiveRecord::Migration
		def self.up
			create_table :entities do |t|

				t.string    :entity_name, :null => false

        #uniqe global uid
        t.string    :entity_guid, :null => false
        t.text     :entity_doc, :null => false
				t.timestamps
      end

			  add_index :entities, :entity_guid, :uniqne => true
        add_index :entities, :entity_name

		end

		def self.down

      remove_index :entities, :entity_guid
			remove_index :entities, :entity_name

			drop_table :entities
		end
	end
