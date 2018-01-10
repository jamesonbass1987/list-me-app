let currentUser;

class Comment {
    constructor(comment) {
        this.id = comment.id
        this.content = comment.content
        this.ownerUsername = comment.user.username
        this.ownerId = comment.user.id
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

    //Check for logged in user
    loggedInUser();
})

function loggedInUser() {
    $.getJSON('/logged_in_user', function (resp) {
        currentUser = resp;
    });
}

function newCommentSubmit(){
    $("#js-listing-comment").submit(function (event) {
        event.preventDefault();

        let comment_values = $(this).serialize();
        $.post('/comments', comment_values).done(function(data){
            getComments();
        });
    });
}

function getComments(){
    const listingCommentsPath = window.location.pathname + '/listing_comments';
    const location = window.location.pathname.split('/')[2];

    $.getJSON( listingCommentsPath, {
        id: location
    }, function(response){
        for(let i = 0; i < response.length; i++){
            buildComments(response[i]);
        }
    });
}

function buildComments(commentParent){
    let newComment = new Comment(commentParent);
    let commentTemplate = HandlebarsTemplates['comments'](newComment);

    if (newComment.commentableType === 'Listing'){ 
        $("#js-listing-comments").append(commentTemplate);
    } else if (newComment.commentableType === "Comment") {
        $(`#comment-${newComment.commentableId}`).append(commentTemplate);
    };

    if (currentUser !== null){
        buildCommentControls(newComment);
    }

    if (commentParent.comments.length >= 1){
        commentParent.comments.forEach(comment => buildComments(comment));
    };
}

function buildCommentControls(newComment){
    if (currentUser.id === newComment.ownerId || currentUser.role.title === 'admin') {
        owner_controls_template = HandlebarsTemplates['comment_controls']({ id: `${newComment.id}` });

        $(`#comment-${newComment.id}-controls`).append(owner_controls_template);
    };

    if (currentUser || currentUser.role.title === 'admin') {
        reply_controls_template = HandlebarsTemplates['comment_reply_controls']();

        $(`#comment-${newComment.id}-controls`).append(reply_controls_template);
    };
}