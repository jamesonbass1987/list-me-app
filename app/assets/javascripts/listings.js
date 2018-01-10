let currentUser;

class Listing {
    constructor(listing){
        this.id = listing.id;
        this.title = listing.title;
        this.description = listing.description;
        this.price = listing.price;
        this.locationCity = listing.location.city;
        this.locationState = listing.location.state;
        this.primaryImage = listing.listing_images[0].image_url;
        this.listingImagesArray = [];
        this.tagsArray = [];
        this.userEmail = listing.user.email
        this.username = listing.user.username
        this.userProfileImage = listing.user.profile_image_url
        this.userRating = listing.user.rating
        this.userId = listing.user.id
    }

}

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


$(document).ready(function () {
    //Load listing and comments
    loadListing();
    loadComments();

    //Add event listeners on page load
    // newCommentSubmit();

    //Check for logged in user
    loggedInUser();
})

function loadListing(){
    const listingPath = window.location.pathname;
    $.getJSON(listingPath, function (response) {
        buildListing(response);
    });
}

function buildListing(listingParams){
    let newListing = new Listing(listingParams);
    let listingImageArray = listingParams.listing_images;
    let tagsArray = listingParams.tags

    for(let i = 1; i < listingImageArray.length; i++){
        newListing.listingImagesArray.push(listingImageArray[i].image_url)
    }

    for (let i = 0; i < tagsArray.length; i++) {
        newListing.tagsArray.push(tagsArray[i].name)
    }

    let listingTemplate = HandlebarsTemplates['listing'](newListing);
    $('#js-listing').append(listingTemplate)
}


function loggedInUser() {
    $.getJSON('/logged_in_user', function (resp) {
        currentUser = resp;
    });
}

function loadComments() {
    const listingCommentsPath = window.location.pathname + '/listing_comments';
    const location = window.location.pathname.split('/')[2];

    $.getJSON(listingCommentsPath, {
        id: location
    }, function (response) {
        for (let i = 0; i < response.length; i++) {
            buildComments(response[i]);
        }
    });
}

function buildComments(commentParent) {
    let newComment = new Comment(commentParent);
    let commentTemplate = HandlebarsTemplates['comments'](newComment);

    if (newComment.commentableType === 'Listing') {
        $("#js-listing-comments").append(commentTemplate);
    } else if (newComment.commentableType === "Comment") {
        $(`#comment-${newComment.commentableId}`).append(commentTemplate);
    };

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