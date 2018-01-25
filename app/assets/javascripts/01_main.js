// GLOBAL VARIABLE DECLARATIONS //
let locationListingHashes;
let currentListingId;
let currentUser;
let currentListingFilter = "Everything";

//MAIN PAGE LOAD FUNCTIONS

//Check for logged in user and fire appropriate load functions based on current view
$(document).ready(() => {
    getUser();
    if ($(".listings.index")[0]) {
        loadListingsIndex();
        addListingIndexEventListeners();
    } else if ($(".listings.show")[0]) {
        loadListingsShow();
        addListingShowEventListeners();
    } else if ($(".welcome.index")[0]){
        welcomeFormListener();
    }
})


//GLOBAL JS FUNCTIONS

//Check for current user, if so, set to global variable
function getUser() {
    $.getJSON('/logged_in_user', { format: 'json' }).then(resp => currentUser = resp);
}

//WELCOME PAGE FORM LISTENERS

//on main page form submission, parse query information and redirect to listings index page
function welcomeFormListener(){
    $("#welcome-filter-form").submit(event => {
        event.preventDefault();

        //Pull location id
        let locationId = $("#locationFilter").val();

        //Make ajax request to get location, and forward user submitting category filter as url param
        $.getJSON('/locations/get_location', {
            location_id: locationId
        }).done(resp => {
            let categoryFilter = $('#categoryFilter').val();
            window.location = `/locations/${resp.slug}/listings?categoryFilter=${categoryFilter}`;
        })
    })
}