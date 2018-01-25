// CLASS CONSTRUCTORS //

class BaseListing {
    constructor(listing) {
        this.id = listing.id;
        this.title = listing.title;
        this.description = listing.description;
        this.price = listing.price;
        this.locationSlug = listing.location.slug
        this.primaryImage = listing.listing_images[0].image_url;
        this.userId = listing.user.id
    }

    formattedPrice() {
        return '$' + Number(this.price).toFixed(2)
    }

}

class Listing extends BaseListing {
    constructor(listing) {
        super(listing);

        this.category = listing.category.name
        this.locationCity = listing.location.city;
        this.locationState = listing.location.state;
        this.listingImagesArray = [];
        this.tagsArray = [];
        this.userEmail = listing.user.email
        this.username = listing.user.username
        this.userProfileImage = listing.user.profile_image_url
        this.userRating = listing.user.rating
    }

    tagsList() {
        return this.tagsArray.join(', ');
    }

    loadImages(images) {
        images.forEach(image => this.listingImagesArray.push(image.image_url))
    }

    loadTags(tags) {
        tags.forEach(tag => this.tagsArray.push(tag.name))
    }

}

// LISTING INDEX PAGE LOAD FUNCTIONS

//Load listings for current location and attach event listeners to index page for search and filter
//Parses welcome page query params if anything is sumitted via form and passes to load listings function

function loadListingsIndex(){

    $(".listings.index").ready(function () {
        const queryParams = getUrlParams();
        loadListings(null, queryParams.categoryFilter);
        searchListingsEvent();
        filterListingsEvent();
    })
}

function getUrlParams(){
    const params = window.location.search.split('?');
    let returnParams = {};
    params.forEach(function(parameter){
        if (parameter.length > 0){
            const key = parameter.split("=")[0];
            const val = parameter.split("=")[1]
            returnParams[key] = val;
        }
    })
    return returnParams
}

// LISTING SHOW PAGE LOAD FUNCTIONS

//Load listings show page for current listing
function loadListingsShow(){
    $(".listings.show").ready(function () {

        //Set current listing id
        currentListingId = parseInt(window.location.pathname.slice(-1));

        //Load Location Listing ID's for Next/Prev Listing Button Events and set current listing owner
        loadLocationListingArray();
        
        //Load listing to DOM
        loadListing();

        //Event Listeners
        nextListingBtnListener();
        prevListingBtnListener();

        addListingEventListeners();
    })
}

// SHOW PAGE EVENT LISTENERS //

//Find current index of listing on page inside the location listing ids array, loads next listing id
//by finding next element in array. If element is at end of array, cycle through to beggining of array  
//for the next index. Then, set current listing id to next listing in array and load the listing.
function nextListingBtnListener(){
    $('#js-next-listing').click(function (event) {
        event.preventDefault();

        const nextListingIndex = (currentListingIdIndex() + 1) % locationListingHashes.length;
        const nextListingId = locationListingHashes[nextListingIndex].id;
        currentListingId = nextListingId;

        loadListing();
    });
}

//Find current index of listing on page inside the location listing ids array, load previous listing id
//by finding the previous element in array. if element is at beginning of array, choose the last array
//index. Then, set current listing id to the prev listing in array and load the listing
function prevListingBtnListener(){
    $('#js-prev-listing').click(function (event) {
        event.preventDefault();

        const prevListingId = (locationListingHashes[(currentListingIdIndex() - 1)] || locationListingHashes.slice(-1)[0]).id;
        currentListingId = prevListingId;

        loadListing();
    });
}

function currentListingOwner(){
    return locationListingHashes.find(listing => listing.id === currentListingId).user_id
}

function currentListingIdIndex(){
    return locationListingHashes.findIndex(listing => { return listing.id === currentListingId })
}

// SHOW LISTING FUNCTIONS //

//Empty listing from DOM if coming from next/prev button events, send an ajax getJSON request for the
//newly set current listing, and build the listing from the response.
function loadListing(){
    const path = window.location.pathname.slice(0, -2)
    $('#js-listing, #js-listing-comments, #js-listing-comment-form-btn').empty();
    $.getJSON(`${path}/${currentListingId}`)
    .done(function(response){
        buildListing(response);
    })
}

//Build listing from json response, and load any comments to the DOM. If user is logged in, add reply
//controls to listing, as well as any listing controls if the current user is viewing their own listing
function buildListing(listingParams){
    //build new listing from response listing params
    const listing = new Listing(listingParams);

    // load listing images and tags into listing
    listing.loadImages(listingParams.listing_images)
    listing.loadTags(listingParams.tags)

    // build listing template from new listing object, set owner and listing id,
    // and append to DOM
    let newListing = $(HandlebarsTemplates['listing'](listing));
    newListing.data('owner', listing.user_id)

    $('#js-listing').append(newListing);

    // load listing comments to DOM
    loadComments(listingParams.comments)

    //if user is logged in, append listing controls and comment form to DOM
    if (currentUser) {
        appendListingOwnerControls(listing);
        buildListingCommentFormButton()
    } 
}

//Check to see if current user is the listing owner and append listing controls, if so.
function appendListingOwnerControls(listing){
    if (currentUser.id === listing.user_id || currentUser.role.title === 'admin') {
        listing_controls_template = HandlebarsTemplates['listing_owner_controls'](listing);
        $(`#js-listing-owner-controls`).append(listing_controls_template);
    };
}

//Make an axaj request to listing_ids API path, setting global locationListingIds array to response.
//Array contains all listing ids for current location to use in next/previous button event listener
//functions.
function loadLocationListingArray(){
    $.getJSON(listingsPath + '/listing_ids', {
        id: currentLocation,
        format: 'json'
    })
    .done(function(response) {
        locationListingHashes = response;
    });
}


// INDEX LISTINGS FUNCTIONS

//Empty listings index div (to clear in case of filtering via search or category). Then load //listings for index page based on current location. searchQuery and categoryFilter are optional 
//arguments passed in via listing search function and listings filter functions. Build listing card
//for each listing returned via ajax call. Set the current listing filter based off of returned listings.
function loadListings(searchQuery, categoryFilter){
    $('#listings-index').empty();

    $.ajax({
        url: listingsPath,
        data: {searchQuery: searchQuery, categoryFilter: categoryFilter, format: 'json'},
        dataType: 'json'
    }).done(function(response){
        response.forEach(listing => buildListingCard(listing));
        setCurrentListingFilter(response);
    });
}

//Build listing card for each listing returned in loadListings function ajax call and append to DOM body.
//If user is signed in, append edit/delete controls to listing card for current user's listings.
function buildListingCard(listingParams){
    let listing = new BaseListing(listingParams);
    const listingTemplate = HandlebarsTemplates['listing_index'](listing);
    $('#listings-index').append(listingTemplate);

    if (currentUser){
        buildListingCardControls(listing);
    } 
}

//If the listing belongs to the current user or the current user is an admin, append edit/delete listing card 
//controls and add an event listener to the delete button.
function buildListingCardControls(listing){
    if (currentUser.id === listing.user_id  || currentUser.role.title === 'admin') {
        listing_controls_template = HandlebarsTemplates['listing_index_controls'](listing);
        $(`#listing-${listing.id}-footer`).append(listing_controls_template);
        
        deleteListingEventListener(listing)
    };
}

//Event listener for listing index card delete button. When clicked, runs the deleteListing function, passing
//in the current listing object, and listing DOM element.
function deleteListingEventListener(listing){
    $(`#listing-${listing.id}-delete`).on('click', function (event) {
        event.preventDefault();
        const listingCard = $(this).parents()[1]
        deleteListing(listing, listingCard);
    })
}

//Make ajax call for listing deletion from the index page. Remove DOM element on success.
function deleteListing(listing, element){
    $.ajax({
        url: `locations/${currentLocation}/listings/${listing.id}`,
        type: 'DELETE',
        dataType: "json",
        success: function (response) {
            $(this).remove();
        }.bind(element)
    })
}

//Add click event for search filtering. On click, submit search form and reset input to clear
//search query.
function searchListingsEvent(){
    $('#search-form').on('submit', function (event) {
        event.preventDefault();
        const searchQuery = $(this).serializeArray()[1].value;
        loadListings(searchQuery, undefined);
        this.reset();
    });
}

//Add click event for category filtering. On click, submit filter form load listings in selected
//category.
function filterListingsEvent(){
    $('#listings-filter-form').submit(function (event) {
        event.preventDefault();
        const categoryFilter = $(this).serializeArray()[2].value;
        loadListings(undefined, categoryFilter);
    });
}


//Set category filter based on current indexed listings. If no listings are present, append 'no
//listings' message to div. If listings are present, check for category based on listings by //checking categoryids and comparing values. If category id's are different, 'Everything' is being
//displayed on the page. If they are the same, the value of the first listing category name is
//displayed in the element.
function setCurrentListingFilter(listings){
    if (listings.length !== 0){
        let categoryCheck = 0;

        for (let i = 0; i < (listings.length - 1); i++) {
            listings[i].category.id !== listings[i + 1].category.id ? categoryCheck-- : false;
        }
        currentListingFilter = categoryCheck < 0 ? 'Everything' : listings[0].category.name;
    } else {
        currentListingFilter = "There doesn't seem to be anything here. Please try another filter."
    }

    $("#listings-filter").empty().append(currentListingFilter);
}