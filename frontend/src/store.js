import { API_URL, FETCH_COOLDOWN } from './app.config';
import { copyObj } from './utils';
import debounce from 'lodash.debounce';

function getSearchResults(q) {
  console.log('fetch');
  try {
    fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(q),
    })
      .then(res => res.json())
      .then(req => store.dispatch(actions.searchResults(req)))
      .catch(err => store.dispatch(actions.setError(err)))
  } catch (error) {
    console.log(error)
  }  
};

const debouncedSearch = debounce((q) => getSearchResults(q), FETCH_COOLDOWN);

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
        ...copyObj(state),
        init: true,
      }
    case 'show_panel':
      return {
        ...copyObj(state),
        showPanel: !state.showPanel,
      }
    case 'search_query':
      debouncedSearch(action.payload)
      return {
        ...copyObj(state),
        searchQuery: action.payload,
        error: false,
      }
    case 'search_results':
      return {
        ...copyObj(state),
        searchResults: action.payload,
      }
    case 'target_url':
      return {
        ...copyObj(state),
        targetUrl: action.payload,
      }
    case 'set_error':
      return {
        ...copyObj(state),
        error: action.payload,
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
  error: false,
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
  },
  setError(payload) {
    return {
      type: 'set_error',
      payload
    }
  },
};

const store = createStore(rootReducer, initialState);

export default store;
export { actions };
