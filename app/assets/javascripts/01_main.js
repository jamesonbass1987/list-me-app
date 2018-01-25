// GLOBAL VARIABLE DECLARATIONS //
let locationListingHashes;
let listingIdIndex;
let locationListingIds;
let currentListingId;
let currentListingOwnerId;
let currentLocation = window.location.pathname.split('/')[2];
let listingsPath = `/locations/${currentLocation}/listings`
let currentListingFilter = "Everything";
let currentUser;

//MAIN PAGE LOAD FUNCTIONS

//Check for logged in user and fire appropriate load functions based on current view
$(document).ready(() => {
    checkUser();
    if ($(".listings.index")[0]) {
        loadListingsIndex();
    } else if ($(".listings.show")[0]) {
        loadListingsShow();
    } else if ($(".welcome.index")[0]){
        welcomeFormListener();
    }
})


//GLOBAL JS FUNCTIONS

//Check for current user, if so, set to global variable
function checkUser() {
    $.getJSON('/logged_in_user', { format: 'json' }).then(resp => currentUser = resp);
}

//WELCOME PAGE FORM LISTENERS

function welcomeFormListener(){
    $("#welcome-filter-form").submit(event => {
        event.preventDefault();
        const location_id = $("#locationFilter").val()

        $.getJSON('/locations/get_location', {
            location_id: location_id
        }).done(resp => {
            const categoryFilter = $('#categoryFilter').val()
            window.location = `/locations/${resp.slug}/listings?categoryFilter=${categoryFilter}`
        })
    })
}