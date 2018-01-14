// GLOBAL VARIABLE DECLARATIONS //
let locationListingIds;
let currentListingId;
let listingsPath;
let currentLocation = window.location.pathname.split('/')[2];;
let currentPath = window.location.pathname;
let currentListingFilter = "Everything";

// CLASS CONSTRUCTORS //

class BaseListing {
    constructor(listing) {
        this.id = listing.id;
        this.title = listing.title;
        this.description = listing.description;
        this.price = listing.price;
        this.locationSlug = listing.location.slug
        this.primaryImage = listing.listing_images[0].image_url;
        this.user_id = listing.user.id
    }

    formattedPrice() {
        return '$' + Number(this.price).toFixed(2)
    }

}

class Listing extends BaseListing {
    constructor(listing) {
        super(listing, listing);

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

    loadTags(tags){
        tags.forEach(tag => this.tagsArray.push(tag.name))
    }
}




// LISTING INDEX PAGE LOAD FUNCTIONS

//Load listings for current location and attach event listeners to index page for search and filter
function loadListingsIndex(){
    $(".listings.index").ready(function () {
        loadListings();
        searchListingsEvent();
        filterListingsEvent();
    })
}


// LISTING SHOW PAGE LOAD FUNCTIONS

//Load listings show page for current listing
function loadListingsShow(){
    $(".listings.show").ready(function () {

        //Find and load listing to DOM
        findCurrentListing();
        loadListing();

        //Load Location Listing ID's for Next/Prev Listing Button Events
        loadLocationListingArray();

        //Event Listeners
        nextListingBtnListener();
        prevListingBtnListener();
    })
}

// SHOW PAGE EVENT LISTENERS //

//Find current index of listing on page inside the location listing ids array, loads next listing id
//by finding next element in array. If element is at end of array, cycle through to beggining of array  
//for the next index. Then, set current listing id to next listing in array and load the listing.
function nextListingBtnListener(){
    $('#js-next-listing').click(function (event) {
        event.preventDefault();

        const listingIdIndex = locationListingIds.indexOf(currentListingId);
        const nextListingId = locationListingIds[(listingIdIndex + 1) % locationListingIds.length];
        
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
 
        const listingIdIndex = locationListingIds.indexOf(currentListingId);
        const prevListingId = locationListingIds[(listingIdIndex - 1)] || locationListingIds.slice(-1).join("");
        
        currentListingId = parseInt(prevListingId);
        loadListing();
    });
}

// SHOW LISTING FUNCTIONS //

//Finds the current listing that is loaded on the page after reload, or if it is linked to via the listings
//index page.
function findCurrentListing(){
    currentListingId = parseInt(window.location.pathname.split('/')[4]);
}

//Empty listing from DOM if coming from next/prev button events, send an ajax getJSON request for the
//newly set current listing, and build the listing from the response.
function loadListing(){
    $('#js-listing, #js-listing-comments, #js-listing-comment-form-btn').empty();
    const path = currentPath.split('/').slice(0,-1).join('/')

    $.getJSON(`${path}/${currentListingId}?ajax=1`, { format: 'json' }, (response => buildListing(response)));
}

//Build listing from json response, and load any comments to the DOM. If user is logged in, add reply
//controls to listing, as well as any listing controls if the current user is viewing their own listing
function buildListing(listingParams){
    //build new listing from response listing params
    const listing = new Listing(listingParams);

    // load listing images and tags into listing
    listing.loadImages(listingParams.listing_images)
    listing.loadTags(listingParams.tags)

    // build listing template from new listing object and append to DOM
    const listingTemplate = HandlebarsTemplates['listing'](listing);
    $('#js-listing').append(listingTemplate);

    // load listing comments to DOM
    loadComments(listingParams.comments)

    //if user is logged in, append listing controls and comment form to DOM
    if (currentUser) {
        appendListingOwnerControls(listing);;
        buildListingCommentForm()
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
    let path = currentPath.split('/').slice(0, -1).join('/')

    $.getJSON(path + '/listing_ids', {
        id: currentLocation,
        format: 'json'
    }, function(response) {
        locationListingIds = response;
    });
}


// INDEX LISTINGS FUNCTIONS

//Empty listings index div (to clear in case of filtering via search or category). Then load //listings for index page based on current location. searchQuery and categoryFilter are optional 
//arguments passed in via listing search function and listings filter functions. Build listing card
//for each listing returned via ajax call. Set the current listing filter based off of returned listings.
function loadListings(searchQuery, categoryFilter){
    listingsPath = window.location.pathname.split("/").slice(0, -1).join('/');
    $('#listings-index').empty()

    $.ajax({
        url: listingsPath + '/listings',
        data: {searchQuery: searchQuery, categoryFilter: categoryFilter, format: 'json'},
        dataType: 'json'
    }).done(function(response){
        $('.listings-index').empty();
        response.forEach(listing => buildListingCard(listing));
        setCurrentListingFilter(response);
    });
}

//Build listing card for each listing returned in loadListings function ajax call and append to DOM body.
//If user is signed in, append edit/delete controls to listing card for current user's listings.
function buildListingCard(listingParams){
    const listing = new BaseListing(listingParams);
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
    const path = currentPath.split('/').slice(0, -1).join('/');
    $.ajax({
        url: `${path}/listings/${listing.id}`,
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
    $("#listings-search-submit").on('click', function(event){
        event.preventDefault();
        $("#search-form").submit();
        $("#search-form")[0].reset();
    })

    $('#search-form').on('submit', function (event) {
        event.preventDefault();
        const searchQuery = $(this).serializeArray()[1].value;
        loadListings(searchQuery, undefined);
    });
}

//Add click event for category filtering. On click, submit filter form load listings in selected
//category.
function filterListingsEvent(){
    $("#listings-filter-submit").on('click', function(event){
        event.preventDefault();
        $("#listings-filter-form").submit();
    })

    $('#listings-filter-form').on('submit', function (event) {
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