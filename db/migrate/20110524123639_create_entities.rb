  class CreateEntities < ActiveRecord::Migration
		def self.up
			create_table :entities do |t|

				t.string    :entity_name, :null => false

				t.timestamps
      end

			  add_index :entities, :entity_name

		end

		def self.down

			remove_index :entities, :entity_name

			drop_table :entities
		end
	end
