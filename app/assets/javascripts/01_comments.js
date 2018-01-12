class Comment {
    constructor(comment) {
        this.id = comment.id
        this.content = comment.content
        this.ownerUsername = comment.user.username
        this.ownerId = comment.user.id
        this.ownerProfileImageUrl = comment.user.profile_image_url
        this.ownerRating = comment.user.rating
        this.status_id = comment.comment_status_id
        this.createdAt = comment.created_at
        this.commentableType = comment.commentable_type
        this.commentableId = comment.commentable_id
    }

    status() {
        return this.status_id === 1 ? "Answer Pending" : "Resolved";
    }
}
// SHOW LISTING COMMENTS FUNCTIONS //

function loadComments() {
    const location = window.location.pathname.split('/')[2];
    let path = currentPath.split('/').slice(0, -1).join('/')

    $.getJSON(`${path}/${currentListingId}/listing_comments`, {id: location}, function(resp){
        if (resp.length === 0) {
            $("#js-listing-comments").append('<p>No comments have been added.</p>')
        } else {
            resp.forEach(comment => buildComments(comment));
            // for (let i = 0; i < resp.length; i++) {
            //     buildComments(resp[i]);
            // }
        }
    });
}

function buildComments(commentParent) {
    let newComment = new Comment(commentParent);
    let commentTemplate = HandlebarsTemplates['comments'](newComment);

    newComment.commentableType === "Listing" ? $("#js-listing-comments").append(commentTemplate) : $(`#comment-${newComment.commentableId}`).append(commentTemplate);

    if (currentUser !== null) {
        buildCommentControls(newComment);
    }

    if (commentParent.comments.length >= 1) {
        commentParent.comments.forEach(comment => buildComments(comment));
    };
}

function buildCommentControls(newComment) {
    if (currentUser.id === newComment.ownerId || currentUser.role.title === 'admin') {
        owner_controls_template = HandlebarsTemplates['comment_controls']({ id: `${newComment.id}` });
        $(`#comment-${newComment.id}-controls`).append(owner_controls_template);
    };

    if (currentUser || currentUser.role.title === 'admin') {
        reply_controls_template = HandlebarsTemplates['comment_reply_controls']();
        $(`#comment-${newComment.id}-controls`).append(reply_controls_template);
    };
}

