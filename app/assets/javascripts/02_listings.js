// GLOBAL VARIABLE DECLARATIONS //
let currentUser;
let locationListingIds;
let currentListingId;
let listingsPath;
let currentLocation = window.location.pathname.split('/')[2];;
let currentPath = window.location.pathname;
let currentListingFilter = "Everything";

// CLASS CONSTRUCTORS //

class BaseListing {
    constructor(listing){
        this.id = listing.id;
        this.title = listing.title;
        this.description = listing.description;
        this.price = listing.price;
        this.locationSlug = listing.location.slug
        this.primaryImage = listing.listing_images[0].image_url;
        this.user_id = listing.user_id
    }

    formattedPrice(){
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

}

// LISTING INDEX PAGE LOAD FUNCTIONS

$(document).ready(function(){
    //Check for logged in user
    loggedInUser();

    if ($(".listings.index")[0]){
        loadListingsIndex();
    } else if ($(".listings.show")[0]){
        loadListingsShow();
    }
})

function loadListingsIndex(){
    $(".listings.index").ready(function () {
        //Load location listings
        loadListings();
        //Attach event listeners
        searchListingsEvent();
        filterListingsEvent();
    })
}

function loadListingsShow(){
    // LISTING SHOW PAGE LOAD FUNCTIONS/EVENT LISTENERS//

    $(".listings.show").ready(function () {
        //Check for logged in user
        loggedInUser();

        //Load listing
        findCurrentListing();
        loadListing();

        //Load Location Listing ID's for Next/Prev Listing Buttons
        loadLocationListingArray();

        //Event Listeners
        $('#js-next-listing').click(function (event) {
            event.preventDefault();
            //find current index of listing on page inside the location listing ids array, load next listing id
            //by finding next element in array. if element is at end of array, cycle through beggining of array to find 
            //next index

            let listingIdIndex = locationListingIds.indexOf(currentListingId);
            let nextListingId = locationListingIds[(listingIdIndex + 1) % locationListingIds.length];

            // set current listing id to next listing in array
            currentListingId = nextListingId;
            loadListing();
        });

        $('#js-prev-listing').click(function (event) {
            event.preventDefault();
            //find current index of listing on page inside the location listing ids array, load next listing id
            //by finding next element in array. if element is at end of array, cycle through beggining of array to find 
            //next index
            let listingIdIndex = locationListingIds.indexOf(currentListingId);
            let prevListingId = locationListingIds[(listingIdIndex - 1)] || locationListingIds.slice(-1).join("");
            // set current listing id to prev listing in array
            currentListingId = parseInt(prevListingId);
            loadListing();
        });

    })
}

// SHOW PAGE GENERAL FUNCTIONS //

function loggedInUser() {
    $.getJSON('/logged_in_user', function (resp){
        currentUser = resp;
    });
}

// SHOW LISTING FUNCTIONS //

function findCurrentListing(){
    currentListingId = window.location.pathname.split('/')[4];
}

function loadListing(){
    $('#js-listing, #js-listing-comments').empty();
    let path = currentPath.split('/').slice(0,-1).join('/')
    // &ajax=1 was added to prevent caching issues when user hits back button and erroneously is served JSON instead of html
    $.getJSON(`${path}/${currentListingId}?ajax=1`, function (response) {
        buildListing(response);
        currentListingId = response.id;
        loadComments();
    });

}

function buildListing(listingParams){
    let newListing = new Listing(listingParams);
    let listingImageArray = listingParams.listing_images;
    let tagsArray = listingParams.tags;

    for(let i = 1; i < listingImageArray.length; i++){
        newListing.listingImagesArray.push(listingImageArray[i].image_url);
    };

    for (let i = 0; i < tagsArray.length; i++) {
        newListing.tagsArray.push(tagsArray[i].name);
    };

    let listingTemplate = HandlebarsTemplates['listing'](newListing);
    $('#js-listing').append(listingTemplate);

    if (currentUser){
        if (currentUser.id === newListing.user_id || currentUser.role.title === 'admin') {
            listing_controls_template = HandlebarsTemplates['listing_show_controls'](newListing);
            $(`#listing-owner-controls`).append(listing_controls_template);
        };
    }
}

function loadLocationListingArray(){
    let path = currentPath.split('/').slice(0, -1).join('/')

    $.getJSON(path + '/listing_ids', {
        id: currentLocation
    }, function(response) {
        locationListingIds = response;
    });
}


// INDEX LISTINGS FUNCTIONS

//searchQuery and categoryFilter are optional arguments passed in via listing search function
//and listings filter function
function loadListings(searchQuery, categoryFilter){
    listingsPath = window.location.pathname.split("/").slice(0, -1).join('/');
    $.getJSON(listingsPath + '/listings', {
        searchQuery: searchQuery,
        categoryFilter: categoryFilter
    }, function(response){
        $('.listings-index').empty();
        response.forEach(function(listing){
            buildListingsIndex(listing);
        })
        setCurrentListingFilter(response);
    });
}

function buildListingsIndex(listing){

    let newListing = new BaseListing(listing);
    let listingTemplate = HandlebarsTemplates['listing_index'](newListing);
    $('.listings-index').append(listingTemplate)

    if (currentUser !== null) {
        buildListingIndexControls(newListing);
    }
}

function buildListingIndexControls(listing){
        let path = currentPath.split('/').slice(0, -1).join('/')

    if (currentUser.id === listing.user_id  || currentUser.role.title === 'admin') {
        listing_controls_template = HandlebarsTemplates['listing_index_controls'](listing);
        $(`#listing-${listing.id}-footer`).append(listing_controls_template);
    };

    $(`#listing-${listing.id}-delete`).on('click', function(event){
        event.preventDefault();
        $.ajax({
            url: `${path}/listings/${listing.id}`,
            type: 'DELETE',
            dataType: "json",
            success: function(response){
                loadListings();
            }
        })
    })
}

function searchListingsEvent(){
    $("#listings-search-submit").on('click', function(event){
        event.preventDefault();
        //submit form
        $("#search-form").submit();

        //reset button and prevent default
        $("#search-form")[0].reset();
    })

    $('#search-form').on('submit', function (event) {
        event.preventDefault();
        let searchQuery = $(this).serializeArray()[1].value;
        loadListings(searchQuery, undefined);
    });
}

function filterListingsEvent(){
    $("#listings-filter-submit").on('click', function(event){
        event.preventDefault();
        //submit form
        $("#listings-filter-form").submit();
    })

    $('#listings-filter-form').on('submit', function (event) {
        event.preventDefault();
        let categoryFilter = $(this).serializeArray()[2].value;
        loadListings(undefined, categoryFilter);
    });
}

function setCurrentListingFilter(listings){
    
    if (listings.length !== 0){
        let categoryCheck = 0;
        for (let i = 0; i < (listings.length - 1); i++) {
            listings[i].category.id !== listings[i + 1].category.id ? categoryCheck-- : i;
        }
        currentListingFilter = categoryCheck < 0 ? 'Everything' : listings[0].category.name;
    } else {
        currentListingFilter = "There doesn't seem to be anything here. Please try another filter."
    }
    $("#listings-filter").empty().append(currentListingFilter);
}