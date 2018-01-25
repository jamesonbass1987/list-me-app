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
        return this.commentStatusId === 1 ? "Answer Pending" : "Resolved";
    }

    formattedDate() {
        return new Date(this.createdAt).toLocaleDateString()
    }
}

// SHOW LISTING COMMENTS FUNCTIONS AND EVENT LISTENERS //

//REFACTORED
//Checks if passed in array of listing comments is empty. If so, appends message. Otherwise, loops through top level
//comments, appending them to the DOM
function loadComments(comments) {
    comments.length === 0 ? checkCommentCount() : comments.forEach(comment => buildComment(comment));
}

//REFACTORED
//Builds comment and creates a new comment template based on passed in comment parameters. If the comment's commentable type
//is 'Listing', it is appended to the listing-comments element in the DOM. If it is a 'Comment', the new comment is appended
//to the parent comment as a reply. If user is signed in and is the comment owner or admin, comment controls are 
//appended. If the submitted comment has any child comment nodes, they are each recursively
//sent to the buildComment function for appending to the DOM.
function buildComment(commentParent) {
    let comment = new Comment(commentParent);
    if (comment.ownerId === currentListingOwnerId) {comment.currentListingOwner = true};
    let newComment = $(HandlebarsTemplates['comment'](comment));

    comment.commentableType === "Listing" ? 
        $("#js-listing-comments").append(newComment) : 
        $(`.comment[data-comment-id=${comment.commentableId}]`).append(newComment);

    if (currentUser && (currentUser.id === comment.ownerId || currentUser.role.title === 'admin')){
        buildCommentOwnerControls.apply(newComment);
        buildReplyControls.apply(newComment);
    }

    if (commentParent.comments.length >= 1) {
        commentParent.comments.forEach(comment => buildComment(comment))
    }
}

//REFACTORED
//Attaches reply/edit/delete comment controls and sets delete and reply comment listeners.
function buildCommentOwnerControls() {
    let owner_controls_template = HandlebarsTemplates['comment_controls']();
    this.children().find('.comment-controls').append(owner_controls_template);
    editCommentListener();
    deleteCommentListener();
}

//EDIT COMMENT FUNCTIONS AND LISTENERS

// REFACTORED
function editCommentListener(){
    $('.edit-comment').click(function(e) {
        e.preventDefault();
        let comment = $(this).parents().eq(3);

        if ($(comment).find('form').length === 0) {
            appendEditCommentForm.apply(comment);
        }
    });
}

// REFACTORED
function appendEditCommentForm() {
    let commentForm = buildEditCommentForm(this);
    $(this).append(commentForm);
    editCommentFormListener();
}

// REFACTORED
function buildEditCommentForm(comment) {
    let auth_token = $('meta[name=csrf-token]').attr('content');
    let content = $(comment).children().find('.comment-content').text().trim();
    let commentStatus = $(comment).attr('data-comment-status');
    let id = $(comment).attr('data-comment-id');
    let user = $(comment).attr('data-owner-username');
    let commentValues = {
        auth_token: auth_token,
        content: content,
        status: commentStatus,
        id: id,
        user: user
    }

    if ($(comment).attr('data-owner-id') === $('.listing').attr('data-listing-owner-id')) {
        commentValues.currentListingOwner = true;
    }

    let editCommentForm = HandlebarsTemplates['comment_edit_form'](commentValues)
    return editCommentForm;
}

// REFACTORED
function editCommentFormListener(){
    $('.edit-comment').submit(function(event){
        event.preventDefault();
        editComment(this);
    })
}

// REFACTORED
//Use async function to create ajax promise for comment edit. Then build comment.
async function editComment(form) {
    let commentId = $(form).attr('data-comment-id');
    let parentComment = $(form).parent();
    let editedComment;
    try {
        editedComment = await $.ajax({
            url: `/comments/${commentId}`,
            type: 'PATCH',
            data: $(form).serialize(),
            dataType: 'json'
        })
    } catch(error){
        alert("Something went wrong. Please try again.");
        $(form).empty();
    }
    
    if (editedComment){ 
        parentComment.empty();
        buildComment(editedComment); 
    }
}

//DELETE COMMENT FUNCTIONS AND LISTENERS

// REFACTORED
//Adds a listener to each comments delete click event, and calls the deleteComment function for that comment.
function deleteCommentListener() {
    $(`.delete-comment`).click(function (e) {
        e.preventDefault();
        let comment = $(this).parents().eq(3);
        deleteComment(comment);
    });
}

// REFACTORED
//Fires delete comment ajax call, passing in id from comment div variable that was
//passed in. Once done, comment div is removed.
function deleteComment(comment) {
    let id = $(comment).attr('data-comment-id');

    $.ajax({
        type: "POST",
        url: `/comments/${id}`,
        dataType: 'json',
        data: { "_method": "delete" },
    })

        $(comment).remove();
        checkCommentCount();

}

// REFACTORED
//Checks to see how many comments are present. If none, no comments message is
//appended, Otherwise, message is removed.
function checkCommentCount(){
    if ($('#js-listing-comments').children().length === 0) {
        $("#js-listing-comments").append('<p>No comments have been added.</p>');
    } else if ($('#js-listing-comments p').length > 0) {
        $('#js-listing-comments p')[0].remove();
    }
}


// LISTING COMMENT FORM FUNCTIONS AND EVENT LISTENERS

//REFACTORED
//Append listing comment reply button to bottom of page and attach form
//listeners to submit comment link
function buildListingCommentFormButton(){
    $('#js-listing-comment-form-btn').append(HandlebarsTemplates['listing_comment_reply_controls']);
    attachListingCommentFormButtonListener();
}

//REFACTORED
function attachListingCommentFormButtonListener(){
    $('#js-comment-form-btn-link').click(function(event){
        event.preventDefault();

        //set comment form, form button, and template variables
        let commentFormBtn = $(this).parents()[0];
        let commentForm = $(this).parents()[1];
        let commentData = {
            authToken: $('meta[name=csrf-token]').attr('content'),
            commentableType: 'Listing',
            commentableId: currentListingId,
            commentStatusId: '1'
        }
        let listingCommentForm = HandlebarsTemplates['comment_form'](commentData);
        let replyHideControls = $(HandlebarsTemplates['comment_hide_controls']());

        //empty comment form button div and append both the comment form, and hide form button
        $(commentFormBtn).empty();
        $(commentForm).append(listingCommentForm).append(replyHideControls);

        //add listener to hide button
        hideCommentFormListener();
        submitCommentListener();
    });
}

//REFACTORED
//When hide button is clicked, the comment form and hide button is removed, and the reply button control function is called to rebuild the reply button.
function hideCommentFormListener() {
    $(".hide-comment").click(function(event) {
        event.preventDefault();

        let parentElement = $(this).parent();
        hideCommentForm.apply(this);

        parentElement.attr('id') === 'js-listing-comment-form' ? 
            buildListingCommentFormButton() : 
            buildReplyControls.apply(parentElement);
    })
}

// REFACTORED
//When 'Hide' button is clicked (when comment form is in expanded state)
//remove the comment form and hide comment link. 
function hideCommentForm() {
    let form = $(this).siblings('form')[0];
    $(this).remove();
    $(form).remove();
}


// REFACTORED
//Add listener to comment form submit. event.stopPropagation() was 
//added to stop propogation up the DOM (preventing multiple form submits from
//firing). Check for blank form submission and alert if so. After submission, 
//reset comment form.
function submitCommentListener() {
    $(".new-comment").on('submit', function (event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        submitComment(this);
    })
}

// REFACTORED
//Submit comment form action, after completion, hide form and add comment to
//the DOM.
async function submitComment(form) {
    let comment;
    
    try {
        comment = await $.ajax({
            url: '/comments',
            type: 'POST',
            data: $(form).serialize(),
            dataType: 'json'
        })
    } catch(error) {
        alert("Something went wrong. Please try again.");
        hideCommentForm();
    }

    if (comment) {
        let hideCommentButton = $(form).siblings('.hide-comment');
        buildComment(comment);
        $(hideCommentButton).trigger('click');
    }
}


//COMMENT REPLY FUNCTIONS AND LISTENERS

//REFACTORED
//Adds reply button controls to each comment and attaches form listener to the 
//comment reply form.
function buildReplyControls() {
    replyControls = HandlebarsTemplates['comment_reply_controls']();

    this.hasClass('comment-controls') ? 
        this.append(replyControls) :
        this.children().find('.comment-controls').append(replyControls);

    commentReplyFormListener();
}

//REFACTORED
//Hide button is appended to comment reply div.
function addReplyHideControls() {
    let commentId = $(this).parents().eq(3).attr('data-comment-id')
    let replyHideControl = HandlebarsTemplates['comment_hide_controls']()
    $(this).parent().append(replyHideControl)
    hideCommentFormListener();
}

//REFACTORED
//On click, the comment form is appended, 'reply' button removed.
function commentReplyFormListener() {
    $(document).on('click', '.reply-comment', function (event) {
        event.preventDefault();
        event.stopImmediatePropagation();

        let parentCommentableId = $(this).parents().eq(3).attr('data-comment-id');

        let listingCommentForm = HandlebarsTemplates['comment_form']({
            authToken: $('meta[name=csrf-token]').attr('content'),
            commentableType: 'Comment',
            commentableId: parentCommentableId,
            commentStatusId: '1'
        });

        $(this).parent().append(listingCommentForm);
        addReplyHideControls.apply(this);
        $(this).remove()
        submitCommentListener()
    })
}



//Event handlers
function addListingEventListeners() {
    // commentReplyFormListener();
}