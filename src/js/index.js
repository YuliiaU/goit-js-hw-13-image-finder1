import imageCardTpl from '/templates/CardTpl.hbs';
import debounce from 'lodash.debounce';
import PicturesApiService from '/js/api-service';
import '/sass/main.scss';
import { error } from '@pnotify/core';
import '@pnotify/core/dist/BrightTheme.css';
import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/dist/basicLightbox.min.css';


const refs = {
  searchForm: document.querySelector('#search-form'),
  imageContainer: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('[data-action="load-more"]'),
};

const picturesApiService = new PicturesApiService();

refs.searchForm.addEventListener('input', debounce(onSearch, 500));
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onSearch(e) {

  picturesApiService.query = e.target.value;

  if (picturesApiService.query.length < 3) {
    errorSetting.text = 'Please enter your specific query!';
    errorSetting.mode = 'light';
    return error(errorSetting);
  }
  picturesApiService.resetPage();
  picturesApiService.fetchArticles()
    .then(hits => {
      if (!hits.length) {
        errorSetting.text = 'Please enter a more specific query!';
        errorSetting.mode = 'dark';
          error(errorSetting);
      }
      clearGaleryContainer();
      createGaleryMurcup(hits);
      refs.loadMoreBtn.removeAttribute('disabled');
    })
    .catch(err => {
      errorSetting.text = `${err}`;
      errorSetting.mode = 'light';
      error(errorSetting);
    }
    );
}

function onLoadMore() {
  picturesApiService.fetchArticles().then(createGaleryMurcup);
}


function createGaleryMurcup(hits) {
  refs.imageContainer.insertAdjacentHTML('beforeend', imageCardTpl(hits));
  
  refs.imageContainer.scrollIntoView({
    behavior: 'smooth',
    block: 'end',
  });
}

function clearGaleryContainer() {
  refs.imageContainer.innerHTML = '';
}


refs.imageContainer.addEventListener('click', onImage);

function onImage(e) {
  if (e.target.nodeName !== 'IMG') {
    return;
  }
  const instance = basicLightbox.create(
    `<img src="${e.target.dataset.url}"/>`
  );
  instance.show();
}

let errorSetting = {
    text: "It's a fetching error",
    mode: "dark",
    closer: true,
    hide: true,
    sticker: false,
    mouseReset: true,
    shadow: true,
    addClass: "pnotify-position",
    width: "350px",
    minHeight: "14px",
    delay: 2000,
  };
