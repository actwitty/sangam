class CreatePostVisibilities < ActiveRecord::Migration
  def self.up
    create_table :post_visibilities do |t|
      t.boolean :hidden
      t.integer :post_id
      t.integer :contact_id

      t.timestamps
    end
  end

  def self.down
    drop_table :post_visibilities
  end
end
