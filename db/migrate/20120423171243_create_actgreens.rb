class CreateActgreens < ActiveRecord::Migration
  def change
    create_table :actgreens do |t|
      t.string :name
      t.string :email
      t.string :location
      t.string :latitude
      t.string :longitude
      t.string :comment

      t.timestamps
    end
  end
end
