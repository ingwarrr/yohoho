import { API_URL } from './app.config'
console.log(API_URL);
function getSearchResults(q) {
  console.log('fetch');
  fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(q),
  })
    .then(res => res.json())
    .then(req => store.dispatch(actions.searchResults(req)))
};

function createStore(rootReducer, initialState) {
  let prevState = {};
  let state = rootReducer(initialState, { type: '__INIT__' });
  const subscribers = [];

  function subscribe(sub) {
    Array.isArray(sub)
      ? subscribers.push(...sub)
      : subscribers.push(sub);
  }
  function getState() {
    return state;
  }
  function getPrevState() {
    return prevState;
  }

  function getSubscribers() {
    return subscribers;
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

export default store;
export { actions };
