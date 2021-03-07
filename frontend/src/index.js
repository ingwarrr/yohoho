import './index.scss';
import debounce from 'lodash.debounce';
import store, { actions } from './store';
import { toggleMenu, setIframeUrl, renderSearchResults} from './actions'
import {
  menu,
  menuShow,
  menuInput,
  mainFrame,
  mainList,
  form,
  ps,
} from './elements';

window.store = store;
window.mainFrame = mainFrame;

const showPanelHandler = () => store.dispatch(actions.showPanel());
const thumbHandler = (e) => {
  // e.preventDefault();
  if (e.keyCode === 13) {
    e.preventDefault();
    store.dispatch(actions.targetUrl(e.target.href));
    store.dispatch(actions.showPanel());
  } else {
    let url;
    if (e.target.classList.contains('menu-list')) {
      return;
    }
    // e.preventDefault();
    url = e.target.href ? e.target.href : e.target.parentNode.href;
    store.dispatch(actions.targetUrl(url));
  }
};
const isSubmit = true;

const formInputHandler = debounce((e) => {
  const val = e.target.value;
  store.dispatch(actions.searchQuery(val));
}, 600);

const formSubmitHandler = (e) => {
  e.preventDefault();
  const val = menuInput.value;
  store.dispatch(actions.searchQuery(val));
};

document.addEventListener('DOMContentLoaded', () => {
  menuShow.focus();
  store.subscribe([toggleMenu, renderSearchResults, setIframeUrl]);

  menuShow.addEventListener('click', showPanelHandler);
  mainList.addEventListener('click', thumbHandler);
  mainList.addEventListener('keypress', thumbHandler);
  if (isSubmit) {
    form.addEventListener('submit', formSubmitHandler);
  } else {
    menuInput.addEventListener('input', formInputHandler);
  }

});

