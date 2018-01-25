// CLASS CONSTRUCTORS //

class BaseListing {
    constructor(listing) {
        this.id = listing.id;
        this.title = listing.title;
        this.description = listing.description;
        this.price = listing.price;
        this.locationSlug = listing.location.slug;
        this.primaryImage = listing.listing_images[0].image_url;
        this.userId = listing.user.id;
    }

    formattedPrice() {
        return '$' + Number(this.price).toFixed(2);
    }

}

class Listing extends BaseListing {
    constructor(listing) {
        super(listing);

        this.category = listing.category.name;
        this.locationCity = listing.location.city;
        this.locationState = listing.location.state;
        this.listingImagesArray = [];
        this.tagsArray = [];
        this.userEmail = listing.user.email;
        this.username = listing.user.username;
        this.userProfileImage = listing.user.profile_image_url;
        this.userRating = listing.user.rating;
    }

    tagsList() {
        return this.tagsArray.join(', ');
    }

    loadImages(images) {
        images.forEach(image => this.listingImagesArray.push(image.image_url));
    }

    loadTags(tags) {
        tags.forEach(tag => this.tagsArray.push(tag.name));
    }

}

//Load index page event handlers
function addListingIndexEventListeners() {
    deleteListingEventListener();
    searchListingsListener();
    filterListingsListener();
}

//Load show page event handlers
function addListingShowEventListeners() {
    commentReplyFormListener();
    submitCommentListener();
    hideCommentFormListener();
    editCommentListener();
    deleteCommentListener();
    editCommentFormListener();
    listingCommentFormButtonListener();
    nextListingBtnListener();
    prevListingBtnListener();
}

// LISTING INDEX PAGE LOAD FUNCTIONS

//Load listings for current location and attach event listeners to index page for search and filter
//Parses welcome page query params if anything is sumitted via form and passes to load listings function
function loadListingsIndex(){
    $(".listings.index").ready(() => {
        let queryParams = getUrlParams();
        loadListings(null, queryParams.categoryFilter);
    })
}

//Parses any variables/queries submitted from main welcome page passed as url params
//Currently only have category, but written so code can be expanded upon in future
function getUrlParams(){
    //Get params from url
    let filterParams = window.location.search.split('?');
    let returnParams = {};

    //Iterate through setting parameter key and values to returnParams object
    filterParams.forEach(parameter => {
        if (parameter.length > 0){
            let key = parameter.split("=")[0];
            let val = parameter.split("=")[1];
            returnParams[key] = val;
        }
    })
    //Return object
    return returnParams;
}

//Parses url to get current location
function getCurrentLocation(){
    return window.location.pathname.split('/')[2];
}
// Parses url to get current location id
function getCurrentListingId(){
    return parseInt(window.location.pathname.slice(-1));
}

//Parses location listing hashes, and returns index of current listing on show page
function currentListingIdIndex() {
    return locationListingHashes.findIndex(listing => listing.id === currentListingId );
}

// LISTING SHOW PAGE LOAD FUNCTIONS

//Load listings show page for current listing
function loadListingsShow(){
    $(".listings.show").ready(function () {

        //Set current listing id
        currentListingId = getCurrentListingId();

        //Load Location Listing ID's hash for Next/Prev Listing Button Events
        loadLocationListings();
        
        //Load listing to DOM
        loadListing();
    })
}

// SHOW PAGE EVENT LISTENERS //

//Loads next listing from location listings hash by finding next element in obj. If element is at end of array, 
//cycle through to beginning of object for the next index.
function nextListingBtnListener(){
    $(document).on('click', '#js-next-listing', event => {
        event.preventDefault();
        //set next listing index and id variables
        let nextListingIndex = (currentListingIdIndex() + 1) % locationListingHashes.length;
        let nextListingId = locationListingHashes[nextListingIndex].id;

        //update current listing id to next listing
        currentListingId = nextListingId;

        //load new listing
        loadListing();
    });
}

//Loads previous listing from location listings hash by finding previous element in obj. If element is at beginning of array, 
//select last key/value in obj
function prevListingBtnListener(){
    $(document).on('click', '#js-prev-listing', event => {
        event.preventDefault();

        //set last listing id
        let prevListingId = (locationListingHashes[(currentListingIdIndex() - 1)] || locationListingHashes.slice(-1)[0]).id;
        
        //update current listing id to last listing
        currentListingId = prevListingId;

        //load new listing
        loadListing();
    });
}

// SHOW LISTING FUNCTIONS //

//Empty listing from DOM if coming from next/prev button events, send an ajax getJSON request for the
//newly set current listing, and build the listing from the response.
function loadListing(){
    let currentLocation = getCurrentLocation();
    let url = `/locations/${currentLocation}/listings/${currentListingId}`;

    //Empty elements if coming from another listing
    $('#js-listing, #js-listing-comments, #js-listing-comment-form-btn').empty();
    
    //Make JSON request, and build listing
    $.getJSON(url).done(listing => buildListing(listing));
}

//Build listing from json response, and load any comments to the DOM. Adds controls based on logged
//in status.
function buildListing(listingParams){
    //build new listing from response listing params
    let listing = new Listing(listingParams);

    // load listing images and tags into listing
    listing.loadImages(listingParams.listing_images)
    listing.loadTags(listingParams.tags)

    // build listing template from new listing object, and append to DOM
    let newListing = $(HandlebarsTemplates['listing'](listing));
    $('#js-listing').append(newListing);

    // load listing comments to DOM
    loadComments(listingParams.comments);

    //if user is logged in, append listing controls and comment form to DOM
    if (currentUser) {
        appendListingOwnerControls.apply(listing);
        buildListingCommentFormButton();
    } 
}

//Check to see if current user is the listing owner or admin and appends listing controls if true.
function appendListingOwnerControls(){
    if (currentUser.id === this.userId || currentUser.role.title === 'admin') {
        listing_controls_template = HandlebarsTemplates['listing_owner_controls'](this);
        $(`#js-listing-owner-controls`).append(listing_controls_template);
    }
}

//Loads location listings to object via JSON ajax call
async function loadLocationListings(){
    //set location and url variables
    let currentLocation = getCurrentLocation();
    let url = `/locations/${currentLocation}/listings/listing_ids`;
    
    try {
        //create JSON ajax call and await response on Promise
        locationListingHashes = await $.getJSON(url, {id: currentLocation, format: 'json'});

    } catch(error) {
        //If something went wrong, alert user and reload page
        alert("Something went wrong. The window will now refresh.");
        location.reload();
    }
}

// INDEX LISTINGS FUNCTIONS

//Empty listings in DOM in case of filtering via search or category. Then load listings based on current location.
//searchQuery and categoryFilter are optional arguments passed in via listing search function and listings filter functions. 
//Build listing card for each listing returned via ajax call. Set the current listing filter based off of returned listings.
async function loadListings(searchQuery, categoryFilter){
    //Declare and set variables for listings, url, location, and data
    let listings;
    let currentLocation = getCurrentLocation();
    let url = `/locations/${currentLocation}/listings`;
    let data = { searchQuery: searchQuery, categoryFilter: categoryFilter, format: 'json' };
    $('#listings-index').empty();

    try {
        //create JSON ajax call and await response on Promise
        listings = await $.getJSON({url: url, data: data});

        //Iterate through listings and build listing cards
        listings.forEach(listing => buildListingCard(listing));

        //Update current filter element
        setCurrentListingFilter(listings);
    } catch(error) {
        //If something went wrong, alert user and reload page
        alert("Something went wrong. The window will now refresh.");
        location.reload();
    }
}

//Build listing card for each listing returned in loadListings function call and append to DOM body.
//If user is signed in, append edit/delete controls to listing card for current user's listings.
function buildListingCard(listingParams){
    //Create new listing object and append to template
    let listingObj = new BaseListing(listingParams);
    let newListing = $(HandlebarsTemplates['listing_index'](listingObj));

    //Append new listing to DOM
    $('#listings-index').append(newListing);

    //If user is signed in, and is the listing owner, build owner edit/delete controls
    if (currentUser && (currentUser.id === listingObj.userId || currentUser.role.title === 'admin')){
        buildListingCardControls.call(newListing, listingObj);
    } 
}

//Appends edit/delete listing card  controlls to footer controls 
function buildListingCardControls(listing){
    listingControls = HandlebarsTemplates['listing_index_controls'](listing);
    this.children('.listing-footer').append(listingControls);
}

//Event listener for listing index card delete button. When clicked, runs the deleteListing function, passing
//in the listing element
function deleteListingEventListener(){
    $(document).on('click', `.listing-delete`, function(event){
        event.preventDefault();
        event.stopImmediatePropagation();
        
        //set listing element
        let listing = $(this).parents().eq(1)

        //call deleteListing, passing in listing 
        deleteListing(listing);
    })
}

//Make ajax call for listing deletion from the index page. Remove DOM element on success.
function deleteListing(listing){
    //set id from listing variable data attribute
    let id = $(listing).attr('data-listing-id')

    //make delete ajax request and remove listing upon success
    $.ajax(
        {url: `listings/${id}`,
        type: 'DELETE',
        dataType: "json",
        success: function(){
            $(this).remove();
        }.bind(listing)
    })
}

//On click, submit search form and reset input to clear search query.
function searchListingsListener(){
    $(document).on('submit', '#search-form', function (event) {
        event.preventDefault();

        //parse form search query
        let searchQuery = $(this).serializeArray()[1].value;

        //load listings based on search query
        loadListings(searchQuery);

        //reset search form
        this.reset();
    });
}

//On click, submit filter form and load listings in selected category
function filterListingsListener(){
    $(document).on('submit', '#listings-filter-form', function(event){
        event.preventDefault();

        //parse category from form
        let categoryFilter = $(this).serializeArray()[2].value;

        //load listings and submit category filter as variable
        loadListings(undefined, categoryFilter);
    });
}


//Set category filter based on current indexed listings. Appending message if no listings are present.
//If listings are present, check for category of listings shown on page
function setCurrentListingFilter(listings){
    //check number of listings
    if (listings.length > 0){

        //if more than one listing, check listing category and set to current listing Filter message
        currentListingFilter = checkListingCategories(listings);

    } else {

        //Update listings message if no listings are in that category
        currentListingFilter = "There doesn't seem to be anything here. Please try another filter."
    }

    //Replace html in listings-filter element with new message
    $("#listings-filter").html(currentListingFilter);
}

//Checking listings categoryIds and compare values. If category id's are different, 'Everything' is being
//displayed on the page. If they are the same, the value of the first listing category name is
//displayed in the element.
function checkListingCategories(listings){
    //set category check variable to 0
    let categoryCheck = 0;

    //Decrease categoryCheck variable if listings category ids do not match
    for (let i = 0; i < (listings.length - 1); i++) {
        listings[i].category.id !== listings[i + 1].category.id ?
            categoryCheck-- :
            false;
    }
    //If category id's are all the same, return category name from first listing, otherwise, return "Everything"
    return categoryCheck < 0 ?
        'Everything' :
        listings[0].category.name;
}