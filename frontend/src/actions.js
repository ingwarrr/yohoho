import store from './store';
import { menu, menuShow, menuInput, mainList, mainFrame} from './elements';
import { copyObj, createPreview, compareTypes } from './utils';

export const toggleMenu = () => {
  if (store.getState().showPanel) {
    menu.classList.add('active');
    menuShow.innerText = 'hide';
    menuInput.focus();
  } else {
    menu.classList.remove('active');
    menuShow.innerText = 'show';
  };
};

export const renderSearchResults = () => {
  const { searchResults } = store.getState();
  const prevState = store.getPrevState();
  if (searchResults && Array.isArray(searchResults) && searchResults.length > 0) {
    const list = searchResults
      .sort(compareTypes)
      .sort((a, b) => a.year - b.year)
      .map((el, i) => createPreview(el, i))
      .join('');
    mainList.innerHTML = '';
    mainList.insertAdjacentHTML('afterbegin', list);
  }
};

export const setIframeUrl = () => {
  const state = store.getState();
  const prevState = store.getPrevState();
  if (state.targetUrl !== prevState.targetUrl) {
    mainFrame.src = state.targetUrl;
  }
};
