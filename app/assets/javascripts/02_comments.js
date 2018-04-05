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

//Checks if passed in array of listing comments is empty. If so, appends 'no comments' message. Otherwise, appends comments to DOM
function loadComments(comments) {
    comments.length === 0 ? checkCommentCount() : comments.forEach(comment => buildComment(comment));
}

//Builds comment and creates a new comment template based on passed in comment parameters. 
function buildComment(commentParent, commentDiv) {
    let comment = new Comment(commentParent);
    let listingOwnerId = $('.listing').attr('data-listing-owner-id');
    if (comment.ownerId === parseInt(listingOwnerId)) {comment.currentListingOwner = true};
    let newComment = $(HandlebarsTemplates['comment'](comment));

    //Checks for parent comment or if comment is coming from edit action
    if (!commentDiv){
    comment.commentableType === "Listing" ? 
        $("#js-listing-comments").append(newComment) : 
        $(`.comment[data-comment-id=${comment.commentableId}]`).append(newComment);
    } else {
        commentDiv.replaceWith(newComment);
    }

    //Adds reply controls if user is signed in
    currentUser ? 
        buildReplyControls.apply(newComment) : 
        null

    //Appends owner controls if comment owner is signed in and/or an admin
    if (currentUser && (currentUser.id === comment.ownerId || currentUser.role.title === 'admin')){
        buildCommentOwnerControls.apply(newComment);
    }

    //If comment has comment child nodes, recursively calls buildComment for all child comments
    if (commentParent.comments.length >= 1) {
        commentParent.comments.forEach(comment => buildComment(comment))
    }
}

//Attaches reply/edit/delete comment controls and sets delete and reply comment listeners.
function buildCommentOwnerControls() {
    let owner_controls_template = HandlebarsTemplates['comment_controls']();
    this.children().find('.comment-controls').append(owner_controls_template);
}

//EDIT COMMENT FUNCTIONS AND LISTENERS

//When edit button is clicked, form is appended to comment div
function editCommentListener(){
    $(document).on('click','.edit-comment-btn', function(e) {
        e.preventDefault();
        let comment = $(this).parents().eq(3);

        //Checks to see if form is present, if not, builds comment form on comment.
        if ($(comment).find('form').length === 0) {
            let commentForm = buildEditCommentForm(comment);
            $(comment).append(commentForm);
        }
    });
}

//Builds comment form, pre-filling values into form template
function buildEditCommentForm(comment) {
    let auth_token = $('meta[name=csrf-token]').attr('content');
    let content = $(comment).children().find('.comment-content').eq(0).text().trim();
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

    //Adds currentListingOwner boolean to run show/hide logic in HandlebarsTemplate for showing comment status
    if ($(comment).attr('data-owner-id') === $('.listing').attr('data-listing-owner-id')) {
        commentValues.currentListingOwner = true;
    }

    //Builds edit comment form and returns form
    let editCommentForm = HandlebarsTemplates['comment_edit_form'](commentValues)
    return editCommentForm;
}

//Calls editComment with the form submitted as the variable
function editCommentFormListener(){
    $(document).on('submit', '.edit-comment', function(event){
        event.preventDefault();
        event.stopImmediatePropagation();
        editComment(this);
    })
}

//Use async function to create ajax promise for comment edit. Once complete, rebuild updated comment.
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

        //build edited comment
        buildComment(editedComment, parentComment);

    } catch(error){
        alert("Something went wrong. Please try again.");
        $(form).empty();
    }
}

//DELETE COMMENT FUNCTIONS AND LISTENERS

//Adds a listener to each comments delete click event, and calls the deleteComment function for that comment.
function deleteCommentListener() {
    $(document).on('click', '.delete-comment', function (e) {
        e.preventDefault();
        let comment = $(this).parents().eq(3);
        deleteComment(comment);
    });
}

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

//Checks to see how many comments are present. If none,'no comments' message is
//appended, Otherwise, message is removed.
function checkCommentCount(){
    if ($('#js-listing-comments').children().length === 0) {
        $("#js-listing-comments").append('<p>No comments have been added.</p>');
    } else if ($('#js-listing-comments p').length > 0) {
        $('#js-listing-comments p')[0].remove();
    }
}


// LISTING COMMENT FORM FUNCTIONS AND EVENT LISTENERS

//Append listing comment reply button below comments.
function buildListingCommentFormButton() {
    $('#js-listing-comment-form-btn').append(HandlebarsTemplates['listing_comment_reply_controls']);
}

//Builds listing comment form when user clicks "Ask the seller a question"
function listingCommentFormButtonListener(){
    $(document).on('click', '#js-comment-form-btn-link', function(event){
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
    });
}

//When hide button is clicked, the comment form and hide button is removed, and the reply button control function is called to rebuild the reply button.
function hideCommentFormListener() {
    $(document).on('click', ".hide-comment", function(event) {
        event.preventDefault();
        let parentElement = $(this).parent();
        
        //hide current comment form
        hideCommentForm.apply(this);

        //Checks to see if comment form being referenced is a comment reply, or the main listing comment form and calls the appropriate method
        parentElement.attr('id') === 'js-listing-comment-form' ? 
            buildListingCommentFormButton() : 
            buildReplyControls.apply(parentElement);
    })
}

//When 'Hide' button is clicked (when comment form is in expanded state)
//removes the form and hides comment link. 
function hideCommentForm() {
    let form = $(this).siblings('form')[0];
    $(this).remove();
    $(form).remove();
}


//Stops propogation(bubbling) and calls submitComment async function
function submitCommentListener() {
    $(document).on('submit', ".new-comment", function (event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        submitComment(this);
    })
}

//Submit comment form action, after completion, hide form and add comment to
//the DOM.
async function submitComment(form) {
    let comment;
    
    //Create new ajax Promise. If error, hide form and alert user.
    try {
        comment = await $.ajax({
            url: '/comments',
            type: 'POST',
            data: $(form).serialize(),
            dataType: 'json'
        })

        console.log(comment)

        //If comment was set, build comment and hide comment form
        if (comment) {
            let hideCommentButton = $(form).siblings('.hide-comment');
            buildComment(comment);
            $(hideCommentButton).trigger('click');
            checkCommentCount();
        }

    } catch(error) {
        alert("Something went wrong. Please try again.");
        hideCommentForm();
    }
}


//COMMENT REPLY FUNCTIONS AND LISTENERS

//Adds reply button controls to each comment and attaches form listener to the 
//comment reply form.
function buildReplyControls() {
    replyControls = HandlebarsTemplates['comment_reply_controls']();

    //Accounts for both situations where function may be called (either initially on comment build, or after 'hide' has been clicked)
    this.hasClass('comment-controls') ? 
        this.append(replyControls) :
        this.children().find('.comment-controls').append(replyControls);
}

//Hide button is appended to comment reply div.
function addReplyHideControls() {
    let commentId = $(this).parents().eq(3).attr('data-comment-id')
    let replyHideControl = HandlebarsTemplates['comment_hide_controls']()
    $(this).parent().append(replyHideControl)
}

//On click, the comment form is appended, 'reply' button removed.
function commentReplyFormListener() {
    $(document).on('click', '.reply-comment', function (event) {
        event.preventDefault();
        event.stopImmediatePropagation();

        //Set comment form information
        let parentCommentableId = $(this).parents().eq(3).attr('data-comment-id');
        let listingCommentForm = HandlebarsTemplates['comment_form']({
            authToken: $('meta[name=csrf-token]').attr('content'),
            commentableType: 'Comment',
            commentableId: parentCommentableId,
            commentStatusId: '1'
        });

        //Append comment form template, add hide button, and remove current reply button
        $(this).parent().append(listingCommentForm);
        addReplyHideControls.apply(this);
        $(this).remove()
    })
}

