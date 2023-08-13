import axios from 'axios';
import Notiflix from 'notiflix';

import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');
let page = 1;
let per_page = 100;
let totalFaund = per_page;

const fetchListItems = async (searchText) => {
  const pbObject = await axios.get(`https://pixabay.com/api/?key=36294375-9fa9664476d2bc95b254b24c2&&q=${searchText}&&image_type=photo&&orientation=horizontal&&safesearch=true&&page=${page}&&per_page=${per_page}`);
  return pbObject;
}


form.addEventListener('submit', onSubmit);

function onSubmit(event) {
  event.preventDefault();
  ifNewSubmit()
  const searchText = event.currentTarget.firstElementChild.value;
  
  if (searchText.trim() === "") {
    return Notiflix.Notify.failure(`Please, enter your query in the search box!`);
    
  }

  fetchListItems(searchText)
    .then(response => {
      const totalHitsElements = response.data.totalHits;
      const picturesArr = response.data.hits;
      const totalPages = response.data.totalHits / per_page;

      if (totalHitsElements > 0) {
        Notiflix.Notify.success(`Hooray! We found ${totalFaund} out of ${totalHitsElements} images.`);
         totalFaund += per_page
      }
      
      if ( page > totalPages) {
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      }
      

      listRendering(picturesArr);
      
      new SimpleLightbox('.gallery a');
       
      if (totalHitsElements > 0) {
         loadMore.classList.remove("is-hidden");
      } 
    })
    .catch(err => console.log(err))
  page += 1;
};




loadMore.addEventListener('click', onClick);

function onClick(event) {
  const searchText = form.firstElementChild.value;



  fetchListItems(searchText)
    .then(response => {
      const totalHitsElements = response.data.totalHits;
      const picturesArr = response.data.hits;
      const totalPages = response.data.totalHits / per_page;
      
      if (totalHitsElements >= totalFaund) {
        Notiflix.Notify.success(`Hooray! We found ${totalFaund} out of ${totalHitsElements} images.`);  
      }
      
      if ( totalHitsElements < totalFaund) {
        Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
        return loadMore.classList.add("is-hidden");
      }
      setTimeout(() => totalFaund += per_page, 0);
      // totalFaund += per_page

      listRendering(picturesArr);

      let lightbox = new SimpleLightbox('.gallery a');
      
      
    })
    .catch(err => console.log(err))
  page += 1;
}


function ifNewSubmit() {
  gallery.innerHTML = ""
  page = 1;
  loadMore.classList.add("is-hidden");
}
      


function listRendering(obj) {
  const gallaryArr = obj.map(({largeImageURL, tags, webformatURL, previewURL, likes, views, comments, downloads }) => {
    return `
      <div class="gallery__item">
        <a href="${largeImageURL}" class="gallery__link">
          <img class="gallery__image" src="${webformatURL}" alt="Likes: ${likes}" />
             <div class="info">
              <p class="info-item">
                <b>Likes:</b>
                <b>${likes}</b>
              </p>
              <p class="info-item">
                <b>Views:</b>
                <b> ${views}</b>
              </p>
              <p class="info-item">
                <b>Comments:</b>
                <b>${comments}</b>
              </p>
              <p class="info-item">
                <b>Downloads:</b>
                <b>${downloads}</b>
              </p>
            </div>
        </a>
      </div>`    
        })
      .join("");
      gallery.insertAdjacentHTML("beforeend", gallaryArr);
}






