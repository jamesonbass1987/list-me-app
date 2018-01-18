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

}

Comment.prototype.status = function(){
    return this.commentStatusId === 1 ? "Answer Pending" : "Resolved";
}

Comment.prototype.formattedDate = function(){
    return new Date(this.createdAt).toLocaleDateString()
}

// SHOW LISTING COMMENTS FUNCTIONS AND EVENT LISTENERS //

//Checks if passed in array of listing comments is empty. If so, appends message. Otherwise, loops through top level
//comments, appending them to the DOM
function loadComments(comments) {
    comments.length === 0 ? resetCommentNotificationCheck() : comments.forEach(comment => buildComment(comment));
}

//Builds comment and creates a new comment template based on passed in comment parameters. If the comment's commentable type
//is 'Listing', it is appended to the listing-comments element in the DOM. If it is a 'Comment', the new comment is appended
//to the parent comment as a reply. If user is signed in and is the comment owner or admin, comment controls are 
//appended. If the submitted comment has any child comment nodes, they are each recursively
//sent to the buildComment function for appending to the DOM.

function buildComment(commentParent, commentDiv) {
    const newComment = new Comment(commentParent);

    if (newComment.ownerId === currentListingOwnerId) {
        newComment.currentListingOwner = true;
    }

    const commentTemplate = HandlebarsTemplates['comment'](newComment);
    if (commentDiv !== undefined){     
        $(commentDiv).empty();
        $(commentDiv).append(commentTemplate);
    } else if (newComment.commentableType === "Listing" && !commentDiv){
        $("#js-listing-comments").append(commentTemplate)
    } else if (newComment.commentableType === "Comment" && !commentDiv){
        const commentParentUsername = $(`#comment-${newComment.commentableId} h6`)[0].innerHTML.split(" ")[4]
        $(`#comment-${newComment.commentableId}`).append(commentTemplate);
        $(`#comment-${newComment.id}-reply-notification`).append(`(Replying to ${commentParentUsername})`)
    }
    
    if (currentUser){
        currentUser.id === newComment.ownerId || currentUser.role.title === 'admin' ? buildCommentOwnerControls(newComment.id) : false;
        buildReplyControls(newComment.id)
    }

    commentParent.comments.length >= 1 ? commentParent.comments.forEach(comment => buildComment(comment)) : false;
}

//Attaches reply/edit/delete comment controls and sets delete and reply comment listeners.
function buildCommentOwnerControls(commentId) {
    const owner_controls_template = HandlebarsTemplates['comment_controls']({ id: `${commentId}` });
    $(`#comment-${commentId}-controls`).append(owner_controls_template);
    
    editCommentListener();
    deleteCommentListener();
}

//EDIT COMMENT FUNCTIONS AND LISTENERS

function editCommentListener(){
    $('.edit-comment').click(function(event){
        event.preventDefault();
        const commentDiv = $(this).parents()[1];
        const commentId = $(this).parents()[0].id.split('-')[1]
        buildEditCommentForm(commentDiv, commentId);
    });
}

function buildEditCommentForm(commentDiv, id){
    const commentStatus = checkStatus(commentDiv)
    const commentUser = $(commentDiv).children()[0].innerText.split(" ")[4]
    const content = $(commentDiv).children()[1].innerText

    const commentValues = {
        auth_token: $('meta[name=csrf-token]').attr('content'),
        content: content,
        status: commentStatus,
        id: id,
        user: commentUser
    }

    if (id === currentListingOwnerId) {
        commentValues.currentListingOwner = true;
    }

    const editCommentForm = HandlebarsTemplates['comment_edit_form'](commentValues)
    
    if ($(commentDiv).find('form').length < 1){
        $(commentDiv).children('.comment-content, .comment-status').empty()
        $(commentDiv).append(editCommentForm)

        editCommentFormListener(commentDiv);
    } 
}

function checkStatus(commentDiv){
    const status = $(commentDiv).children('.comment-status').text().trim().split('Status: ')[1];
    if (status === 'Answer Pending'){
        return '1';
    }
}

function editCommentFormListener(){
    $('.edit-comment').submit(function(event){
        event.preventDefault();
        const formUser = $(this).find('input')[2].value;
        const content = $(this).find('.commentContent')[0].innerHTML

        if (content === '') {
            alert("Content can't be blank. Please try again");
            return false;
        } else if (currentUser.username !== formUser && currentUser.role.title === 'user'){
            alert("Only the comment owner can edit this comment.");
            return false;
        }

        editComment(this)
    })
}

function editComment(form) {
    const id = $(form).children()[3].value

    $.ajax({
        url: `/comments/${id}`,
        type: 'PATCH',
        data: $(form).serialize(),
        dataType: 'json'
    }).done(function (resp) {
        const commentDiv = $(this).parents()[2];
        buildComment(resp, commentDiv);
    }.bind(form));
}

//DELETE COMMENT FUNCTIONS AND LISTENERS

//Adds a listener to each comments delete click event, and calls the deleteComment function for that comment.
function deleteCommentListener() {
    $(`.delete-comment`).click(function (event) {
        event.preventDefault();
        let commentDiv = $(this).parents()[3]
        deleteComment(commentDiv)
    });
}

//Fires delete comment ajax call, passing in id from comment div variable that was
//passed in. Once done, comment div is removed.
function deleteComment(comment) {
    let commentId = comment.id.split('-').slice(-1).join()
    $.ajax({
        type: "POST",
        url: `/comments/${commentId}`,
        dataType: 'json',
        data: { "_method": "delete" },
    })

    $(comment).remove()
    resetCommentNotificationCheck();
}

//Checks to see how many comments are present. If none, no comments message is
//appended, Otherwise, message is removed.
function resetCommentNotificationCheck(){

    if ($('#js-listing-comments').text().trim() !== "" && $('#js-listing-comments p')[0] !== undefined) {
        $('#js-listing-comments p')[0].remove();
    } else if ($('#js-listing-comments').text().trim() === "" && $('#js-listing-comments p').length === 0) {
        $("#js-listing-comments").append('<p>No comments have been added.</p>');
    }
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
        hideCommentForm(170)
    });
}


//When 'Hide' button is clicked (when Listing comment form is in expanded state)
//scroll up page to bottom of comments div, remove the comment form and hide 
//comment link. Call buildListingCommentFormButton() function to reappend link
//to expand comment form.
function hideCommentForm(position){
    $('#js-listing-comment-form form, #js-listing-comment-form a').remove();
    buildListingCommentFormButton();
}

//Add listener to comment form submit. event.stopImmediatePropagation() was 
//added to stop propogation up the DOM (preventing multiple form submits from
//firing). Check for blank form submission and alert if so. After submission, 
//reset comment form.
function submitCommentListener() {
    $(".new-comment").on('submit', function (event) {
        event.preventDefault();
        event.stopImmediatePropagation();

        const content = $.trim($(this).find('.form-control')[0].value);
        const commentableType = this[3].value
        
        if (content === '') {
            alert("Content can't be blank. Please try again");
            return false;
        }

        submitComment(this)
        
        const hideCommentButton = $(this).siblings('.hide-comment')
        $(hideCommentButton).trigger('click');

        $(this).remove();
        resetCommentNotificationCheck();
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
        buildComment(resp)
        hideCommentForm(85)
    });
}


//COMMENT REPLY FUNCTIONS AND LISTENERS

//Adds reply button controls to each comment and attaches form listener to the 
//comment reply form.
function buildReplyControls(commentId) {
    reply_controls_template = HandlebarsTemplates['comment_reply_controls']({ id: commentId });
    $(`#comment-${commentId}-controls`).append(reply_controls_template);
    commentReplyFormListener(commentId);
}

//On click, the comment form is appended, 'reply' button removed.
function commentReplyFormListener(commentId) {
    $(`.reply-comment`).click(function (event) {
        event.preventDefault();
        event.stopImmediatePropagation();

        const listingCommentForm = HandlebarsTemplates['comment_form']({
            authToken: $('meta[name=csrf-token]').attr('content'),
            commentableType: 'Comment',
            commentableId: commentId,
            commentStatusId: '1'
        });
        $(this).parent().append(listingCommentForm);
        addReplyHideControls(this, commentId);
        $(this).remove()
        submitCommentListener()
    })
}

//Hide button is appended to comment reply div.
function addReplyHideControls(replyButton, commentId) {
    const replyHideControl = HandlebarsTemplates['comment_reply_hide_controls']({ id: commentId })
    $(replyHideControl).insertAfter(replyButton);

    hideCommentListener(commentId);
}

//When hide button is clicked, the comment form and hide button is removed, and the reply button control function is called to rebuild the reply button.
function hideCommentListener(commentId){
    $(".hide-comment").click(function (event) {
        event.preventDefault();
        const form = $(this).siblings('form')[0]
        $(this).remove()
        $(form).remove()
        buildReplyControls(commentId);
    })
}
