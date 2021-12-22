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

function showMoviesByObj(movies) {
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

      $anchor.dataset.vote = vote_average;
      $anchor.dataset.date = release_date;
      $anchor.classList.add('mix-target');

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

      $score.classList.add(`${getClassByVote(parseInt(vote_average))}`);

      $poster.classList.remove('animated-bg');
      $score.classList.remove('animated-bg');
    });
  }, 1000);
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

function CreatePagination(pages, page) {
  page = parseInt(page);
  pages = parseInt(pages);

  let str = '<ul>';
  let active;
  let pageCutLow = page - 1;
  let pageCutHigh = page + 1;

  if (page > 1) {
    str += `
      <li class="page-item previous no">
        <i class="fas fa-chevron-left"></i>
        <a>Previous</a>
      </li>`;
  }

  if (pages < 6) {
    for (let p = 1; p <= pages; p++) {
      active = page == p ? 'active' : 'no';
      str += `<li class="${active}"><a>${p}</a></li>`;
    }
  } else {
    if (page > 2) {
      str += '<li class="no page-item"><a>1</a></li>';
      if (page > 3) {
        // inline 이벤트가 안먹힌다.. createPagination이 전역에 없어서 그런듯..
        // 결국 addEvent로 구현해야하나? 그래도 한번쯤은 inline으로 해보고 싶었는데...
        str += `
          <li class="out-of-range backward">
            <a>...</a>
          </li>`;
      }
    }

    if (page <= 2) {
      pageCutLow = 1;
      pageCutHigh = 4;
    }

    if (page >= pages - 1) {
      pageCutLow = pages - 3;
      pageCutHigh = pages;
    }

    for (let p = pageCutLow; p <= pageCutHigh; p++) {
      active = page == p ? 'active' : 'no';
      str += `
        <li class="${active}">
          <a>${p}</a>
        </li>`;
    }

    if (page < pages - 1) {
      if (page < pages - 2) {
        str += `
          <li class="out-of-range forward">
            <a>...</a>
          </li>`;
      }
      str += `
        <li class="page-item no">
          <a>${pages}</a>
        </li>`;
    }
  }

  if (page < pages) {
    str += `
      <li class="page-item next no">
        <a>Next</a>
        <i class="fas fa-chevron-right"></i>
      </li>`;
  }

  str += '</ul>';
  return str;
}

export { showMoviesByObj, CreatePagination };
