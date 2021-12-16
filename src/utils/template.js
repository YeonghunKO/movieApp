import { $main } from './doms.js';

const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';

const genreCodes = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 10770, name: 'TV Movie' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' },
];

function makeSkeleton(num) {
  $main.innerHTML = '';
  let vDOM = document.createDocumentFragment();
  for (let i = 0; i < num; i++) {
    // const $divEle = document.createElement('div');
    const $anchorEle = document.createElement('a');
    $anchorEle.setAttribute('target', '_blank');
    // $divEle.classList.add('movie');
    $anchorEle.innerHTML = `
      <div class='movie'>
        <div class="poster animated-bg"></div>
        <div class="movie-info">
          <div class="title">
            <span class="animated-bg animated-bg-text"></span>
          </div>
          <div class="genre">
            <span class="animated-bg animated-bg-text"></span>
          </div>
          <div class="date">
            <span class="animated-bg animated-bg-text"></span>
          </div>
          <div class="score animated-bg">&nbsp;</div>
        </div>
        <div class='overview'></div>
      </div>
       
      `;
    vDOM.appendChild($anchorEle);
  }
  $main.append(vDOM);
}

export default function showMovies(movies) {
  makeSkeleton(movies.length);
  setTimeout(() => {
    const $movies = document.querySelectorAll('.movie');
    movies.forEach((movie, idx) => {
      const {
        poster_path,
        title,
        overview,
        vote_average,
        genre_ids,
        release_date,
        id,
      } = movie;

      const $anchor = $movies[idx].parentElement;
      const $poster = $movies[idx].querySelector('.poster');
      const $title = $movies[idx].querySelector('.title');
      const $genre = $movies[idx].querySelector('.genre');
      const $date = $movies[idx].querySelector('.date');
      const $score = $movies[idx].querySelector('.score');
      const $overview = $movies[idx].querySelector('.overview');

      $anchor.setAttribute(
        'href',
        `https://www.themoviedb.org/movie/${id}${title}`
      );

      $poster.innerHTML = `
        
          <img src="${
            poster_path
              ? IMG_PATH + poster_path
              : './src/assets/img/no_poster.png'
          }" alt="${title}" />
       
  
        `;

      $title.innerHTML = title;
      $genre.innerHTML = decodeGenre(genre_ids);
      $date.innerHTML = release_date;
      $score.innerHTML = `${vote_average} / 10`;
      $overview.innerHTML = `
        <h3>Overview</h3>
        ${overview}
        `;

      $score.classList.add(`${getClassByVote(vote_average)}`);

      $poster.classList.remove('animated-bg');
      $score.classList.remove('animated-bg');
    });
  }, 1000);
  // this.setState()
}

function decodeGenre(genreArr) {
  return genreArr
    .map(genre => {
      let genreName;
      for (let i = 0; i <= genreCodes.length; i++) {
        const genreCode = genreCodes[i];
        if (genre === genreCode.id) {
          genreName = genreCode.name;
          break;
        }
      }
      return genreName;
    })
    .join(' / ');
}

function getClassByVote(vote) {
  if (vote >= 8) {
    return 'green';
  } else if (vote >= 5) {
    return 'yellow';
  } else {
    return 'red';
  }
}
