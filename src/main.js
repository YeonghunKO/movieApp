import Pagination from './components/pagination.js';

import {
  $searchBtn,
  $search,
  $form,
  $input,
  $logo,
  $dropDown,
  $main,
  $sortContent,
  $categoryContent,
} from './utils/doms.js';

import getMovies from './utils/api.js';
import { showMoviesByObj } from './utils/template.js';
import { routerDispatcher, initRouter } from './utils/router.js';

let mix = null;
const API_KEY = '71c72e51587ffa55d1c377e3ed0e5b0c';

let state = {
  dbType: 'trend',
  searchTerm: null,
};

const setState = nextState => {
  state = nextState;
};

const db = {
  trend: [],
  topRated: [],
  upComing: [],
  nowPlaying: [],
};

const page = new Pagination({
  onPage,
});

async function getDataByCurrentDbType({ page }) {
  let movieData;
  switch (state.dbType) {
    case 'trend':
      movieData = await getMovies(
        `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=true&include_video=false&page=${page}&with_watch_monetization_types=flatrate`
      );
      break;
    case 'topRated':
      movieData = await getMovies(
        `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=${page}`
      );

      break;
    case 'upComing':
      movieData = await getMovies(
        `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=en-US&page=${page}`
      );
      break;

    case 'nowPlaying':
      movieData = await getMovies(
        `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=${page}`
      );
      break;
    case 'searching':
      movieData = await getMovies(
        `https://api.themoviedb.org/3/search/movie?page=${page}&api_key=${API_KEY}&query="${state.searchTerm}`
      );
      break;

    default:
      break;
  }
  return movieData;
}

function setPagenation(totalPage) {
  if (totalPage > 20) {
    page.setState({ current: 1, total: 20 });
  } else {
    page.setState({ current: 1, total: totalPage });
  }
}

async function init({ dbType, searchTerm }) {
  let movieData;
  if (dbType === 'searching') {
    if (!db[searchTerm]) {
      db[searchTerm] = [];
    }
    setState({ dbType, searchTerm });
    movieData = await showMoviesByDb(state.searchTerm, 1);
  } else {
    setState({ ...state, dbType });
    movieData = await showMoviesByDb(state.dbType, 1);
  }

  const { total_pages } = movieData;
  setPagenation(total_pages);
}

function resetSortDropDownContent() {
  $sortContent.innerText = 'Sort by';
}

function resetCategoryDropDownContent() {
  $categoryContent.innerText = 'Category';
}

$form.addEventListener('submit', async function (e) {
  e.preventDefault();
  resetCategoryDropDownContent();
  const searchTerm = $input.value.trim();
  if (searchTerm.length > 0) {
    init({ dbType: 'searching', searchTerm });
    routerDispatcher({ dbType: 'searching', searchTerm, currentPage: 1 });
    if (mix) {
      mix.destroy();
    }
  }
  $input.value = '';
});

$logo.addEventListener('click', () => {
  init({ dbType: 'trend' });
  routerDispatcher({ dbType: 'trend', currentPage: 1 });
});

$searchBtn.addEventListener('click', e => {
  $search.classList.add('active');
});

$dropDown.addEventListener('click', async e => {
  const { nodeName, textContent, parentNode } = e.target;

  if (nodeName === 'LI') {
    mix = mixitup($main, {
      animation: {
        effects: 'fade rotateZ(-180deg)',
        duration: 700,
      },
      classNames: {
        // 버튼을 클릭했을때 버튼에 추가되는 클래스 이름
        // 필터버튼에는 'programs-filter-btn-active'
        // 정렬버튼에는 'programs-sort-btn-active' 요런식으로 클래스가 add됨
        // 만약, block property가 없으면 'mixitup' 이 default로 programs자리에 들어감
        block: 'programs',
        elementFilter: 'filter-btn',
        elementSort: 'sort-btn',
      },
      selectors: {
        target: '.mix-target',
      },
    });

    const $chosen = e.target.closest('.dropdown').querySelector('.chosen');

    if (parentNode.classList.contains('category')) {
      $chosen.innerText = textContent;
    } else {
      $chosen.innerText = 'By ' + textContent.trim();
    }

    switch (textContent.trim('')) {
      case 'Top rated':
        init({ dbType: 'topRated' });
        routerDispatcher({ dbType: 'topRated', currentPage: 1 });
        break;
      case 'Upcoming':
        init({ dbType: 'upComing' });
        routerDispatcher({ dbType: 'upComing', currentPage: 1 });
        break;
      case 'Now playing':
        init({ dbType: 'nowPlaying' });
        routerDispatcher({ dbType: 'nowPlaying', currentPage: 1 });
        break;
      case 'Vote':
        sortBy('vote');
        mix.sort('vote:desc');
        break;
      case 'Release date':
        sortBy('date');
        mix.sort('date:desc');
        break;
      default:
    }
    mix.destroy();
  }
});

function sortBy(type) {
  const { dbType, searchTerm } = state;
  if (dbType === 'searching') {
    if (type === 'vote') {
      db[searchTerm][page.state.current].sort(
        (a, b) => b.vote_average - a.vote_average
      );
    } else {
      db[searchTerm][page.state.current].sort(
        (a, b) => new Date(b.release_date) - new Date(a.release_date)
      );
    }
  } else {
    if (type === 'vote') {
      db[dbType][page.state.current].sort(
        (a, b) => b.vote_average - a.vote_average
      );
    } else {
      db[dbType][page.state.current].sort(
        (a, b) => new Date(b.release_date) - new Date(a.release_date)
      );
    }
  }
}

function onPage(page) {
  if (mix) {
    mix.destroy();
  }

  const { dbType, searchTerm } = state;
  if (dbType === 'searching') {
    if (!db[searchTerm]) {
      db[searchTerm] = [];
    }
    showMoviesByDb(searchTerm, page);
    routerDispatcher({ dbType, searchTerm, currentPage: page });
  } else {
    showMoviesByDb(dbType, page);
    routerDispatcher({ dbType, currentPage: page });
  }
}

async function showMoviesByDb(dbKey, page) {
  resetSortDropDownContent();
  let movieData;
  if (db[dbKey][page]) {
    showMoviesByObj(db[dbKey][page]);
    return db[dbKey];
  } else {
    movieData = await getDataByCurrentDbType({ page });
    const { results, total_pages } = movieData;
    showMoviesByObj(results);
    db[dbKey][page] = results;
    db[dbKey]['total_pages'] = total_pages > 20 ? 20 : total_pages;
  }
  return movieData;
}

function onRoute({ dbKey, currentPage, dbType }) {
  if (db[dbKey].length) {
    const pageObj = db[dbKey][currentPage];
    if (pageObj) {
      showMoviesByObj(pageObj);
      page.setState({ total: db[dbKey]['total_pages'], current: currentPage });
      if (dbType === 'searching') {
        setState({ dbType, searchTerm: dbKey });
        $categoryContent.innerText = 'Category';
      } else {
        setState({ ...state, dbType: dbKey });
        let categoryContent;
        if (dbType === 'topRated') {
          categoryContent = 'Top rated';
        } else if (dbType === 'upComing') {
          categoryContent = 'Upcoming';
        } else if (dbType === 'trend' || dbType === 'nowPlaying') {
          categoryContent = 'Now playing';
        }
        $categoryContent.innerText = categoryContent;
      }
    }
  }
}

init({ dbType: 'trend' });

initRouter(onRoute);
