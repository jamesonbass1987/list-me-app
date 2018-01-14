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

function loadComments(comments) {
    if (comments.length === 0) {
        $("#js-listing-comments").append('<p>No comments have been added.</p>')
    } else {
        comments.forEach(comment => buildComment(comment));
    }
}

function buildComment(commentParent) {
    let newComment = new Comment(commentParent);
    let commentTemplate = HandlebarsTemplates['comment'](newComment);

    newComment.commentableType === "Listing" ? $("#js-listing-comments").append(commentTemplate) : $(`#comment-${newComment.commentableId}`).append(commentTemplate);
    currentUser ? buildCommentControls(newComment) : false
    commentParent.comments.length >= 1 ? commentParent.comments.forEach(comment => buildComment(comment)) : false 
}

function buildCommentControls(newComment) {
    if (currentUser.id === newComment.ownerId || currentUser.role.title === 'admin') {
        let owner_controls_template = HandlebarsTemplates['comment_controls']({ id: `${newComment.id}` });
        $(`#comment-${newComment.id}-controls`).append(owner_controls_template);
    };

    if (currentUser || currentUser.role.title === 'admin') {
        buildCommentReply(newComment.id)
    };
    attachCommentControlListeners(newComment.id);
}



function buildListingCommentForm(){
    $('#js-listing-comment-form-show').append(
            `<a href="#" class="btn btn-block btn-outline-info">Click here to ask the seller a question!</a>`);

    attachListingCommentFormListener();
}

function attachListingCommentFormListener(formId){
    $('#js-listing-comment-form-show').click(function(event){

        let listingCommentForm = HandlebarsTemplates['comment_form']({
            authToken: $('meta[name=csrf-token]').attr('content'),
            commentableType: 'Listing',
            commentableId: currentListingId,
        });

        $('#js-listing-comment-form').empty().append(listingCommentForm)
        
        $('html, body').animate({
            scrollTop: $("#js-listing-comment-form").offset().top
        }, 2000);

        submitListingCommentListener()
    })

}


function submitListingCommentListener() {
    $("#js-listing-comment-submit").on('click', function (event) {
        event.preventDefault();
        //submit form
        $("#new-listing-comment").submit();
        //reset button and prevent default
        $("#new-listing-comment")[0].reset();
    })

    $('#new-listing-comment').on('submit', function(event) {
        event.preventDefault();
        submitComment(this);
    });
}


function attachCommentControlListeners(commentId){
    //Delete Comment
    deleteCommentListener(commentId);

    //Reply To Comment
    $(`#js-comment-reply-${commentId}`).click(function(event){
        event.preventDefault();
    })

}

//COMMENT REPLY FUNCTIONS AND LISTENERS

function buildCommentReply(commentId) {
    buildCommentReplyControl(commentId);
    buildCommentReplyFormListener(commentId);
}

function buildCommentReplyControl(commentId) {
    reply_controls_template = HandlebarsTemplates['comment_reply_controls']({ id: commentId });
    $(`#comment-${commentId}-controls`).append(reply_controls_template);
}

function buildCommentReplyFormListener(commentId) {
    $(`#js-comment-reply-${commentId}`).click(function (event) {
        event.preventDefault();

        let listingCommentForm = HandlebarsTemplates['comment_form']({
            authToken: $('meta[name=csrf-token]').attr('content'),
            commentableType: 'Comment',
            commentableId: commentId,
        });
        $(this).parent().append(listingCommentForm);
        addReplyHideControls(this, commentId);
        addCommentReplySubmissionListener(commentId);
    })
}

function addCommentReplySubmissionListener(data) {
    $(`#comment-${data}-controls form input`).click(function (event) {
        submitComment(this.parentElement);
    })
}

function addReplyHideControls(replyButton, commentId) {

    let replyHideControl = HandlebarsTemplates['comment_reply_hide_controls']({ id: commentId })

    $(replyHideControl).insertAfter(replyButton);

    $(`#js-comment-hide-${commentId}`).click(function (event) {
        event.preventDefault();
        hideListingCommentReplyForm(commentId);
        buildCommentReply(commentId);
    })
    $(replyButton).remove();
}

function hideListingCommentReplyForm(commentId) {
    $(`#comment-${commentId}-controls`).empty();
}


//SUBMIT COMMENT

function submitComment(form) {
    let values = $(form).serialize();

    $.ajax({
        url: '/comments',
        type: 'POST',
        data: values,
        dataType: 'json',
        success: function (resp) {
            buildComment(resp)
        }
    });
}


//DELETE COMMENT FUNCTIONS AND LISTENERS

function deleteCommentListener(commentId){
    $(`#comment-${commentId}-delete`).click(function (event) {
        event.preventDefault();
        deleteComment(this)
    }).bind(commentId);
}

function deleteComment(comment){
    let commentId = comment.href.split('/').slice(-1).join()
    $.ajax({
        type: "POST",
        url: `/comments/${commentId}`,
        dataType: 'json',
        data: { "_method": "delete" },
        complete: function () {
            $(`#comment-${commentId}`).remove();
        }
    })

}