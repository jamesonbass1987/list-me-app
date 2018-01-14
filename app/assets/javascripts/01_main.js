let currentUser;

//GLOBAL JS FUNCTIONS

//Check for current user, if so, set to global variable
function checkUser() {
    $.getJSON('/logged_in_user', { format: 'json' }, function (resp) {
        currentUser = resp;
    });
}