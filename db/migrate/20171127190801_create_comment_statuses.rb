class CreateCommentStatuses < ActiveRecord::Migration[5.1]
  def change
    create_table :comment_statuses do |t|
      t.string :name

      t.timestamps
    end
  end
end
