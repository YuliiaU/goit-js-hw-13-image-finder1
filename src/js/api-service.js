const API_KEY = '21941214-a78e4db07bb432cdcb3475a2b';

const BASE_URL = `https://pixabay.com/api/?key=${API_KEY}`;
const PER_PAGE = 12;

export default class PicturesApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }
  
  fetchArticles() {
    const options = {
    Authorization: API_KEY,
  };
  
  
  return fetch(`${BASE_URL}&q=${this.searchQuery}&image_type=photo&per_page=${PER_PAGE}&page=${this.page}`, options)
  .then(r => r.json())
  .then(data => {
      this.page += 1;
      return data.hits;
   })
  .catch(err => console.log('Error fetching data', err));
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQery) {
    this.searchQuery = newQery;
  }
}