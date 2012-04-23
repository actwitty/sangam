class ChangeDataTypeForActgreenComment < ActiveRecord::Migration
  def up
      change_table :actgreens do |t|
          t.change :comment, :string
      end
  end

  def down
      change_table :actgreens do |t|
          t.change :comment, :text
      end
  end
end
