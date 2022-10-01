"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $episodeList = $('#episodesList');
const $searchForm = $("#searchForm");

const TVMAZE_API_URL = `http://api.tvmaze.com/`;
const MISSING_IMAGE_URL = "https://tinyurl.com/missing-tv";

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  const parameters = { params: { q: term } };

  const showData = await axios.get(`${TVMAZE_API_URL}search/shows`, parameters);

  let showsOfSearchName = [];

  for (let result of showData.data) {
    const showObject = {
      id: result.show.id,
      name: result.show.name,
      summary: result.show.summary,
      image: result.show.image ?
        result.show.image.medium : MISSING_IMAGE_URL,
    };
    showsOfSearchName.push(showObject);
  }

  return showsOfSearchName;
}

/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src="${show.image}"
              alt=""
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button id="${show.id}"
              class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($show);
  }
}

/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

/** Event listener on submit button to search for shows and display results */

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});

/** Event listener on 'Episodes' button to display episodes list */
$("#showsList").on("click", "button", showEpisodeList);

/** Handles retrieving of episodes list by clicked button ID, gets list from
 * API, updates list to episodes area, and display results
 */
async function showEpisodeList(event) {
  event.preventDefault();

  const episodesList = await getEpisodesOfShow(event.target.id);

  $episodeList.empty();
  populateEpisodes(episodesList);
}

/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {
  const episodesData = await axios.get(`${TVMAZE_API_URL}shows/${id}/episodes`);

  let episodesList = [];

  for (let result of episodesData.data) {
    const episodeObject = {
      id: result.id,
      name: result.name,
      season: result.season,
      number: result.number,
    };
    episodesList.push(episodeObject);
  }

  return episodesList;
}

/** Given episodes object data, creates an episodes list, and appends the
 * episode's name, season, and episode number to the DOM,
 * reveals episode list area
*/

function populateEpisodes(episodesList) {

  for (let episode of episodesList) {
    const $episodeInfo = $(
      `<li> ${episode.name}
      (Season: ${episode.season},
        Number: ${episode.number})
        </li>`
      );

    $episodeList.append($episodeInfo);
  }

  $episodesArea.show();
}
