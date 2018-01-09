class Comment {
    constructor(comment) {
        this.id = comment.id
        this.content = comment.content
        this.owner_username = comment.user.username
        this.owner_profile_image_url = comment.user.profile_image_url
        this.owner_rating = comment.user.rating
        this.comment_status_id = comment.comment_status_id
        this.created_at = comment.created_at
        this.commentable_type = comment.commentable_type
        this.commentable_id = comment.commentable_id
    }
}


$(function(){
    //Add event listeners on page load
    newCommentSubmit();
    getComments();
})

function newCommentSubmit(){
    $("#js-listing-comment").submit(function (event) {
        event.preventDefault();

        let comment_values = $(this).serialize();
        $.post('/comments', comment_values).done(function(data){
            getComments();
        })
    })
}


function getComments(){
    const listingCommentsPath = window.location.pathname + '/listing_comments'
    const location = window.location.pathname.split('/')[2]

    $.getJSON( listingCommentsPath, {
        id: location
    }, function(response){
       response.forEach(function(comment_data){
           debugger;
            let new_comment = new Comment(comment_data)
            let template = Handlebars.compile($("#comment-template").html());
            let result = template(new_comment)
            $("#js-listing-comments").append(result)
            debugger;
       })
    })
}