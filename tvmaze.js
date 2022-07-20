"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const TVMAZE_SHOWID = `http://api.tvmaze.com/shows/`;


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.

  const TVMAZE_API_SEARCH = `http://api.tvmaze.com/search/shows?`;


  const parameters = { params: {q:term}};

  const showData = await axios.get(TVMAZE_API_SEARCH, parameters);
 // console.log(showData);

  let showsOfSameName = [];

  for(let instance of showData.data){
    const showObject = {
      id : instance.show.id,
      name: instance.show.name,
      summary : instance.show.summary,
      image: instance.show.image.medium
    }
    showsOfSameName.push(showObject);
  }

  console.log(showsOfSameName);

  return showsOfSameName;

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
              alt="https://tinyurl.com/tv-missing"
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button id="${show.id}" class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($show);  }
}

$("#showsList").on("click", "button", episodeList);

function episodeList(event){
  event.preventDefault;

  getEpisodesOfShow(event.target);

}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term); //array




  // let id = shows.data[0].show.id;
  // getEpisodesOfShow(id);

  //console.log(id);
  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

 async function getEpisodesOfShow(id) {
  // const episodeData = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);





 }

/** Write a clear docstring for this function... */

// function populateEpisodes(episodes) { }

