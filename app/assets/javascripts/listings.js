let currentUser;
let locationListingIds;
let currentListingId;
let currentLocationListingsPath = window.location.pathname.split('/').slice(0, -1).join('/')

// CLASS CONSTRUCTORS //

class Listing {
    constructor(listing){
        this.id = listing.id;
        this.title = listing.title;
        this.description = listing.description;
        this.category = listing.category.name
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

    tags() {
        return this.tagsArray.join(', ');
    }

    formattedPrice(){
        return '$' + Number(this.price).toFixed(2)
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

// PAGE LOAD FUNCTIONS//

$(document).ready(function () {
    //Check for logged in user
    loggedInUser();
    
    //Load listing
    findCurrentListing();
    loadListing();

    //Load Location Listing ID's for Next/Prev Listing Buttons
    loadLocationListingArray();
})

// GENERAL PAGE FUNCTIONS //

function loggedInUser() {
    $.getJSON('/logged_in_user', function (resp) {
        currentUser = resp;
    });
}

// LISTING FUNCTIONS //

function findCurrentListing(){
    currentListingId = window.location.pathname.split('/')[4];
}

function loadListing(){

    $('#js-listing, #js-listing-comments').empty();

    // &ajax=1 was added to prevent caching issues when user hits back button and erroneously is served JSON instead of html
    $.getJSON(`${currentLocationListingsPath}/${currentListingId}?ajax=1`, function (response) {
        buildListing(response);
        currentListingId = response.id
        loadComments();
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

function loadLocationListingArray(){
    const listingsPath = window.location.pathname.split("/").slice(0, -1).join('/') 
    const location = window.location.pathname.split('/')[2];

    $.getJSON(listingsPath + '/listing_ids', {
        id: location
    }, function (response) {
        locationListingIds = response
    });
}

// COMMENT FUNCTIONS //

function loadComments() {
    const location = window.location.pathname.split('/')[2];

    $.getJSON(`${currentLocationListingsPath}/${currentListingId}/listing_comments`, {
        id: location
    }, function (response) {

        if (response.length === 0){
            $("#js-listing-comments").append('<p>No comments have been added. Log in to ask the seller a question!</p>')
        } else {
            for (let i = 0; i < response.length; i++) {
                buildComments(response[i]);
            }
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

// EVENT LISTENERS //

$(document).ready(function(){

    $('#js-next-listing').click(function(event) {
        event.preventDefault();
        //find current index of listing on page inside the location listing ids array, load next listing id
        //by finding next element in array. if element is at end of array, cycle through beggining of array to find 
        //next index
        let listingIdIndex = locationListingIds.indexOf(currentListingId)
        let nextListingId = locationListingIds[(listingIdIndex + 1) % locationListingIds.length]
        // set current listing id to next listing in array
        currentListingId = nextListingId;
        loadListing();
    });

    $('#js-prev-listing').click(function(event) {
        event.preventDefault();
        //find current index of listing on page inside the location listing ids array, load next listing id
        //by finding next element in array. if element is at end of array, cycle through beggining of array to find 
        //next index
        let listingIdIndex = locationListingIds.indexOf(currentListingId)
        let prevListingId = locationListingIds[(listingIdIndex - 1)] || locationListingIds.slice(-1).join("")
        // set current listing id to prev listing in array
        currentListingId = parseInt(prevListingId);
        loadListing();
    });

})
