class CreateActgreens < ActiveRecord::Migration
  def change
    create_table :actgreens do |t|
      t.text :name
      t.text :email
      t.text :location
      t.text :latitude
      t.text :longitude
      t.text :comment

      t.timestamps
    end
  end
end
