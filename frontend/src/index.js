import './index.scss';
import debounce from 'lodash.debounce';

import store, { actions } from './store';

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

const menu = document.querySelector('.menu'),
  menuShow = document.querySelector('.menu-show'),
  menuInput = document.querySelector('.menu-input'),
  mainFrame = document.querySelector('#main_frame'),
  mainList = document.querySelector('.menu-list');

window.mainFrame = mainFrame;

const toggleMenu = () => {
  if (store.getState().showPanel) {
    menu.classList.add('active');
    menuShow.innerText = 'hide';
    menuInput.focus();
  } else {
    menu.classList.remove('active');
    menuShow.innerText = 'show';
  };
};

const renderSearchResults = () => {
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
};

const setIframeUrl = () => {
  const state = store.getState();
  const prevState = store.getPrevState();
  if (state.targetUrl !== prevState.targetUrl) {
    mainFrame.src = state.targetUrl;
  }
};
  

document.addEventListener('DOMContentLoaded', () => {
  menuShow.focus();
  store.subscribe([toggleMenu, renderSearchResults, setIframeUrl]);

  menuShow.addEventListener('click', () => store.dispatch(actions.showPanel()));
  mainList.addEventListener('click', (e) => {
    let url;
    if (e.target.classList.contains('menu-list')) {
      return;
    }
    e.preventDefault();
    url = e.target.href ? e.target.href : e.target.parentNode.href;
    store.dispatch(actions.targetUrl(url));
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

