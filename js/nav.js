"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

function navSubmitStoryClick(evt) {
  console.debug("navSubmitStoryClick", evt);
  // Followed structure of pre-existing functions and added the console.debug.
  hidePageComponents();
  $allStoriesList.show();
  // Show the allStoriesList variable that was established in main.js (same as previous functions)
  $storyForm.show();
  // Show the story submit form from main.js
}

$navSubmit.on("click", navSubmitStoryClick);
// Add a click event listener to the submit anchor tag using the variable that was established in main.js.

function navFavoriteStoryClick(evt) {
  console.debug("navFavoriteStoryClick", evt);
  console.log(currentUser);

  hidePageComponents();
  putFavoritesOnPage();
  // $favoriteStories.show();

  // if (currentUser) {
  //   hidePageComponents();
  //   putFavoritesOnPage();
  //   $favoriteStories.show();
  // }
}
$navFavorites.on("click", navFavoriteStoryClick);

