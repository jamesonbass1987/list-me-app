//CLASS CONSTRUCTORS

class Comment {
    constructor(comment) {
        this.id = comment.id
        this.content = comment.content
        this.ownerUsername = comment.user.username
        this.ownerId = comment.user.id
        this.ownerProfileImageUrl = comment.user.profile_image_url
        this.ownerRating = comment.user.rating
        this.commentStatusId = comment.comment_status_id
        this.createdAt = comment.created_at
        this.commentableType = comment.commentable_type
        this.commentableId = comment.commentable_id
    }
    status() {
        return this.status_id === 1 ? "Answer Pending" : "Resolved";
    }

}

// SHOW LISTING COMMENTS FUNCTIONS //

//Checks if passed in array of listing comments is empty. If so, appends message. Otherwise, loops through top level
//comments, appending them to the DOM
function loadComments(comments) {
    comments.length === 0 ? $("#js-listing-comments").append('<p>No comments have been added.</p>') : comments.forEach(comment => buildComment(comment));
}

//Builds comment and creates a new comment template based on passed in comment parameters. If the comment's commentable type
//is 'Listing', it is appended to the listing-comments element in the DOM. If it is a 'Comment', the new comment is appended
//to the parent comment as a reply. If user is signed in and is the comment owner or admin, comment controls are 
//appended. If the submitted comment has any child comment nodes, they are each recursively
//sent to the buildComment function for appending to the DOM.

function buildComment(commentParent) {
    const newComment = new Comment(commentParent);
    const commentTemplate = HandlebarsTemplates['comment'](newComment);

    newComment.commentableType === "Listing" ? $("#js-listing-comments").append(commentTemplate) : $(`#comment-${newComment.commentableId}`).append(commentTemplate);
    
    currentUser.id === newComment.ownerId || currentUser.role.title === 'admin' ? buildCommentControls(newComment) : false;

    commentParent.comments.length >= 1 ? commentParent.comments.forEach(comment => buildComment(comment)) : false;
}

//Attaches reply/edit/delete comment controls and sets delete and reply comment listeners.
function buildCommentControls(newComment) {
    const owner_controls_template = HandlebarsTemplates['comment_controls']({ id: `${newComment.id}` });
    $(`#comment-${newComment.id}-controls`).append(owner_controls_template);
    
    deleteCommentListener(newComment.id);
    replyCommentListener(newComment.id)
}


// LISTING COMMENT FORM FUNCTIONS AND EVENT LISTENERS

//Append listing comment reply button to bottom of page and attach form
//listeners to submit comment link
function buildListingCommentFormButton(){
    $('#js-listing-comment-form-btn').append(HandlebarsTemplates['listing_comment_reply_controls']);

    attachListingCommentFormButtonListener();
}

//Empty comment form button div, removing 'Ask seller a question' button, 
//and append comment form to listing, setting the commentable type to 
//'Listing' and passing in the commentable id (aka listing_id in this instance).
// Attach listeners for form submission and hide button.
function attachListingCommentFormButtonListener(formId){
    $('#js-comment-form-btn-link').click(function(event){
        event.preventDefault();

        //set comment form, form button, and template variables
        const commentFormBtn = $(this).parents()[0];
        const commentForm = $(this).parents()[1];
        const listingCommentForm = HandlebarsTemplates['comment_form']({
            authToken: $('meta[name=csrf-token]').attr('content'),
            commentableType: 'Listing',
            commentableId: currentListingId,
            commentStatusId: '1'
        });
        const replyHideControls = HandlebarsTemplates['listing_comment_reply_hide_controls']

        //empty comment form button div and append both the comment form, and hide form button
        $(commentFormBtn).empty();
        $(commentForm).append(listingCommentForm).append(replyHideControls);

        //add listener to hide button
        hideListingCommentFormButtonListener();
        
        //scroll to bottom of window, once done, add listener for listing comment
        //submission
        $('html, body').animate({
            scrollTop: $(document).height() - $(window).height()
            }, 650, null, function(){
                submitCommentListener();
            }
        );
    });
}

//Adds event listener for hide listing comment form
function hideListingCommentFormButtonListener() {
    $('#js-comment-form-btn-link').click(function (event) {
        event.preventDefault();
        hideCommentForm(230);
    });
}


//When 'Hide' button is clicked (when Listing comment form is in expanded state)
//scroll up page to bottom of comments div, remove the comment form and hide 
//comment link. Call buildListingCommentFormButton() function to reappend link
//to expand comment form.
function hideCommentForm(position){
    $('html, body').animate({
        scrollTop: $(document).height() - $(window).height() - position
    }, 650, null, function () {
            $('#js-listing-comment-form form').remove();
            $('#js-listing-comment-form a').remove();
            buildListingCommentFormButton();
        }
    )
}

//Add listener to comment form submit. event.stopImmediatePropagation() was 
//added to stop propogation up the DOM (preventing multiple form submits from
//firing). After submission, reset comment form.
function submitCommentListener() {
    $(".new-comment").on('submit', function (event) {
        event.preventDefault();
        event.stopImmediatePropagation();

        const commentableType = this[3].value

        submitComment(this)
        $(this)[0].reset();
    })
}

//Submit comment form action, after completion, hide form and add comment to
//the DOM.
function submitComment(form) {
    $.ajax({
        url: '/comments',
        type: 'POST',
        data: $(form).serialize(),
        dataType: 'json'
    }).done(function (resp) {
        hideCommentForm(85)
        buildComment(resp)
    });
}





//COMMENT REPLY FUNCTIONS AND LISTENERS

function replyCommentListener(commentId) {
    reply_controls_template = HandlebarsTemplates['comment_reply_controls']({ id: commentId });
    $(`#comment-${commentId}-controls`).append(reply_controls_template);

    commentReplyFormListener(commentId);
}


function commentReplyFormListener(commentId) {
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