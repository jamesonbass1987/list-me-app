class Comment {
    constructor(comment) {
        this.id = comment.id
        this.content = comment.content
        this.ownerUsername = comment.user.username
        this.ownerProfileImageUrl = comment.user.profile_image_url
        this.ownerRating = comment.user.rating
        this.status = comment.comment_status.name
        this.createdAt = comment.created_at
        this.commentableType = comment.commentable_type
        this.commentableId = comment.commentable_id
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
        for(let i = 0; i < response.length; i++){
            buildComments(response[i])
        }
    })
}

function buildComments(commentParent){
        let newComment = new Comment(commentParent)
        let commentTemplate = HandlebarsTemplates['comments'](newComment);

        if (newComment.commentableType === 'Listing'){ 
            $("#js-listing-comments").append(commentTemplate)
        } else if (newComment.commentableType === "Comment") {
            $(`#comment-${newComment.commentableId}`).append(commentTemplate)
        }

        if (commentParent.comments.length >= 1){
            commentParent.comments.forEach(comment => buildComments(comment));
        }

}
