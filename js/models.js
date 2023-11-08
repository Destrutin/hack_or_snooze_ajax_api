"use strict";

const BASE_URL = "https://hack-or-snooze-v3.herokuapp.com";

/******************************************************************************
 * Story: a single story in the system
 */

class Story {

  /** Make instance of Story from data object about story:
   *   - {title, author, url, username, storyId, createdAt}
   */

  constructor({ storyId, title, author, url, username, createdAt }) {
    this.storyId = storyId;
    this.title = title;
    this.author = author;
    this.url = url;
    this.username = username;
    this.createdAt = createdAt;
  }

  /** Parses hostname out of URL and returns it. */

  getHostName() {
    // UNIMPLEMENTED: complete this function!
    const url = new URL(this.url);
    return url.hostname;
  }


}


/******************************************************************************
 * List of Story instances: used by UI to show story lists in DOM.
 */

class StoryList {
  constructor(stories) {
    this.stories = stories;
  }

  /** Generate a new StoryList. It:
   *
   *  - calls the API
   *  - builds an array of Story instances
   *  - makes a single StoryList instance out of that
   *  - returns the StoryList instance.
   */

  static async getStories() {
    // Note presence of `static` keyword: this indicates that getStories is
    //  **not** an instance method. Rather, it is a method that is called on the
    //  class directly. Why doesn't it make sense for getStories to be an
    //  instance method?

    // query the /stories endpoint (no auth required)
    const response = await axios({
      url: `${BASE_URL}/stories`,
      method: "GET",
    });

    // turn plain old story objects from API into instances of Story class
    const stories = response.data.stories.map(story => new Story(story));

    // build an instance of our own class using the new array of stories
    return new StoryList(stories);
  }

  /** Adds story data to API, makes a Story instance, adds it to story list.
   * - user - the current instance of User who will post the story
   * - obj of {title, author, url}
   *
   * Returns the new Story instance
   */

  async addStory(user, {title, author, url}/*newStory*/) {
    // Put an object parameter of {title, author, url} in the params. Not sure what to do with newStory param that was in there previously or if that was just a placeholder.
    // UNIMPLEMENTED: complete this function!
    let response = await axios({
      url: `${BASE_URL}/stories`,
      method: 'POST',
      // Follow the documentation on the api to create a story. (access the stories attribute and sent a post request to it.)
      data: {
        // Include this data in the post request.
        token: user.loginToken,
        // Assign the user loginToken attribute (that was established in the constructor in the User class below) to the token attribute of data.
        story: {title, author, url}
        // Collect the story data to add to the api.
      }
    });
    let story = response.data.story;
    // Access the collected story data and store it in a variable.
    let newUserStory = new Story(story);
    // Create a new story instance and fill it with the story variable (collected story data) from above.

    this.stories.unshift(newUserStory);
    // Add this new populated story instance to the stories variable created in the constructor.
    return newUserStory;
    // Return the new story instance as a result of the addStory function.
  }
}


/******************************************************************************
 * User: a user in the system (only used to represent the current user)
 */

class User {
  /** Make user instance from obj of user data and a token:
   *   - {username, name, createdAt, favorites[], ownStories[]}
   *   - token
   */

  constructor({
                username,
                name,
                createdAt,
                favorites = [],
                ownStories = []
              },
              token) {
    this.username = username;
    this.name = name;
    this.createdAt = createdAt;

    // instantiate Story instances for the user's favorites and ownStories
    this.favorites = favorites.map(s => new Story(s));
    this.ownStories = ownStories.map(s => new Story(s));

    // store the login token on the user so it's easy to find for API calls.
    this.loginToken = token;
  }

  /** Register new user in API, make User instance & return it.
   *
   * - username: a new username
   * - password: a new password
   * - name: the user's full name
   */

  static async signup(username, password, name) {
    const response = await axios({
      url: `${BASE_URL}/signup`,
      method: "POST",
      data: { user: { username, password, name } },
    });

    let { user } = response.data

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories
      },
      response.data.token
    );
  }

  /** Login in user with API, make User instance & return it.

   * - username: an existing user's username
   * - password: an existing user's password
   */

  static async login(username, password) {
    const response = await axios({
      url: `${BASE_URL}/login`,
      method: "POST",
      data: { user: { username, password } },
    });

    let { user } = response.data;

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories
      },
      response.data.token
    );
  }

  /** When we already have credentials (token & username) for a user,
   *   we can log them in automatically. This function does that.
   */

  static async loginViaStoredCredentials(token, username) {
    try {
      const response = await axios({
        url: `${BASE_URL}/users/${username}`,
        method: "GET",
        params: { token },
      });

      let { user } = response.data;

      return new User(
        {
          username: user.username,
          name: user.name,
          createdAt: user.createdAt,
          favorites: user.favorites,
          ownStories: user.stories
        },
        token
      );
    } catch (err) {
      console.error("loginViaStoredCredentials failed", err);
      return null;
    }
  }

  async addToFavorites(storyId) {
      if(currentUser) {
        const response = await axios({
          url: `${BASE_URL}/users/${this.username}/favorites/${storyId}`,
          method: "POST",
          data: {token: currentUser.loginToken}
      });
      // Add the story to the users favorites using an api request.
      if(response.status === 200) {
        currentUser.favorites.push(storyId);
      } else {
        console.error("Failed to add story");
      }
    }
  }

  async removeFromFavorites(storyId) {
    const response = await axios({
      url: `${BASE_URL}/users/${this.username}/favorites/${storyId}`,
      method: "DELETE",
      data: {token: this.loginToken}
    });
    let {favorites} = response.data.user;
    this.favorites = favorites.map((story) => new Story(story));
  }

  isFavorite(storyId) {
    return this.favorites.some((story) => story.storyId === storyId);
  }
  // Check if the story is in the users favorites by going through the array to see if any of the elements are true. Will return false if it is not in the array.
}

