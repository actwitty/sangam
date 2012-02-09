  class CreateEntities < ActiveRecord::Migration
		def self.up
			create_table :entities do |t|

				t.text    :entity_name, :null => false

        #uniqe global uid
        t.text    :entity_guid, :null => false

        t.text    :entity_type_id #service specific type
        t.text    :entity_type_name

        t.text    :entity_svc

				t.timestamps
      end

			  add_index :entities, :entity_guid, :unique => true
        add_index :entities, :entity_name
        add_index :entities, :updated_at

		end

		def self.down

			drop_table :entities
		end
	end
