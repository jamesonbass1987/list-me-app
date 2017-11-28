module CommentsHelper

  def display_comment_controls(comment)
   if comment.user == current_user
     link_to("Edit Comment", edit_location_listing_comment_path(@listing.location, @listing, comment), :class => 'btn btn-info') + 
     link_to("Delete Comment", location_listing_comment_path(@listing.location, @listing, comment), :method => :delete, :class => 'btn btn-danger')
   end
  end


end
