"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  const isFavorite = currentUser ? currentUser.isFavorite(story.storyId) : false;

  return $(`
      <li id="${story.storyId}">
        <input type="checkbox" class="favorite-box" ${isFavorite ? "checked" : ""}>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}


/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

async function submitNewStory(evt) {
  console.debug("submitNewStory");
  evt.preventDefault();
  // Stop the page from reloading upon sumbiting a new story.
  const title = $("#title").val();
  const author = $("#author").val();
  const url = $("#url").val();
  // Get all info from the form.
  const newStory = await storyList.addStory(currentUser, {title, author, url});
  // Add a new story to the list using the gathered form info.

  const $newStory = generateStoryMarkup(newStory);
  // Make the html for the new story.
  $allStoriesList.prepend($newStory);
  // Add this html to the story list on the page.
  $storyForm.trigger("reset");
  $storyForm.hide();
  // Reset the form and hide from the page when submitted.
}
$storyForm.on("submit", submitNewStory);




function putFavoritesOnPage() {
  $favoriteStories.empty();

  if(currentUser && currentUser.favorites) {
    for(let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
    $favoriteStories.append($story);
    }
  $favoriteStories.show();
  } else {
  console.error("No favorites");
  }
}

async function toggleFavorite(story) {
  if(currentUser) {
    if(currentUser.isFavorite(story.storyId)) {
      await currentUser.removeFromFavorites(story.storyId);
    } else {
      await currentUser.addToFavorites(story.storyId);
    }
  }
}

function favoriteClick(evt) {
  const $box = $(evt.target);
  const storyId = $box.parent().attr("id");
  console.log(currentUser);

  if(currentUser) {
    if($box.is(":checked")) {
      currentUser.addToFavorites(storyId);
      console.log($favoriteStories);
    } else {
      currentUser.removeFromFavorites(storyId);
    }
  }
}
$allStoriesList.on("change", ".favorite-box", favoriteClick);

