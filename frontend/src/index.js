import './index.scss';
import debounce from 'lodash.debounce';

function createStore(rootReducer, initialState) {
  let prevState = {};
  let state = rootReducer(initialState, { type: '__INIT__' });
  const subscribers = [];

  function subscribe(cb) {
    subscribers.push(cb);
  }
  function getState() {
    return state;
  }
  function getPrevState() {
    return prevState;
  }
  function dispatch(action) {
    prevState = JSON.parse(JSON.stringify(state));
    state = {
      ...state,
      ...rootReducer(state, action)
    };
    subscribers.forEach((sub) => sub());
  }
  return {
    subscribe,
    getState,
    getPrevState,
    dispatch,
  }
};

const rootReducer = (state, action) => {
  switch (action.type) {
    case '__INIT__':
      return {
        ...state,
        init: true,
      }
    case 'show_panel':
      return {
        ...state,
        showPanel: !state.showPanel,
      }
    case 'search_query':
      getSearchResults(action.payload)
      return {
        ...state,
        searchQuery: action.payload,
      }
    case 'search_results':
      return {
        ...state,
        searchResults: action.payload,
      }
    case 'target_url':
      return {
        ...state,
        targetUrl: action.payload,
      }
    case 'clear_state':
      return state;
    default:
      return state;
  }
};

const initialState = {
  init: false,
  showPanel: false,
  searchResults: [],
  searchQuery: '',
  targetUrl: '',
};

const actions = {
  showPanel() {
    return {
      type: 'show_panel',
    }
  },
  searchQuery(payload) {
    return {
      type: 'search_query',
      payload,
    }
  },
  searchResults(payload) {
    return {
      type: 'search_results',
      payload
    }
  },
  targetUrl(payload) {
    return {
      type: 'target_url',
      payload,
    }
  },
  clearState() {
    return {
      type: 'clear_state',
    }
  }
};


const store = createStore(rootReducer, initialState);
window.store = store;


const createPreview = ({ id, year, yoho, title }, i) => {
  return `
    <a tab-index="${i + 1}" data-id='${id}' href='${yoho}' class='preview'>
      <div class='preview-title'>${title}</div>
      <img src='https://kinopoisk.ru/images/sm_film/${id}.jpg' class='preview-image'>
      ${year && '<div class="preview-year">' + year + '</div>'}
    </a>
  `
}
const fetchData = async (q) => {
  const url = `${q}`;
  const req = await fetch(url);
  const res = await req.json();
}
// parent.insertAdjacentHTML('afterend', temp);
function compareTypes(a,b) {
  if (a.type === 'film' && a.type !== b.type) {
    return -1
  }
  if (a.type === 'series' && a.type !== b.type) {
    return 1
  }
  if (a.type === b.type) {
    return 0
  }
}

function getSearchResults(q) {
  console.log('fetch');
  fetch('http://0.0.0.0:5000/q', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(q),
  })
    .then(res => res.json())
    .then(req => store.dispatch(actions.searchResults(req)))
};

const menu = document.querySelector('.menu'),
  menuShow = document.querySelector('.menu-show'),
  menuInput = document.querySelector('.menu-input'),
  mainFrame = document.querySelector('#main_frame'),
  mainList = document.querySelector('.menu-list');

window.mainFrame = mainFrame;

document.addEventListener('DOMContentLoaded', () => {
  menuShow.focus();
  store.subscribe(() => {
    if (store.getState().showPanel) {
      menu.classList.add('active');
      menuShow.innerText = 'hide';
      menuInput.focus();
    } else {
      menu.classList.remove('active');
      menuShow.innerText = 'show';
    };
  });

  store.subscribe(() => {
    const state = store.getState();
    const prevState = store.getPrevState();
    if (state.searchResults && state.searchResults.length > 0) {
      const list = state.searchResults
        .sort(compareTypes)
        .sort((a, b) => a.year - b.year)
        .map((el, i) => createPreview(el, i))
        .join('');
      mainList.innerHTML = '';
      mainList.insertAdjacentHTML('afterbegin', list);
    }
  });

  store.subscribe(() => {
    const state = store.getState();
    const prevState = store.getPrevState();
    if (state.targetUrl !== prevState.targetUrl) {
      mainFrame.src = state.targetUrl;
    }
  });

  menuShow.addEventListener('click', () => store.dispatch(actions.showPanel()));
  mainList.addEventListener('click', (e) => {
    e.preventDefault();
    store.dispatch(actions.targetUrl(e.target.parentNode.href));
  });

  mainList.addEventListener('keydown', (e) => {

    if (e.keyCode === 13) {
      e.preventDefault();
      store.dispatch(actions.targetUrl(e.target.href));
      store.dispatch(actions.showPanel());
    }    
  });

  const debouncedDispatch = debounce((e) => {
    store.dispatch(actions.searchQuery(e.target.value));
  }, 600);

  menuInput.addEventListener('input', debouncedDispatch);

});

