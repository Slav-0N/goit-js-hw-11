import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { fetchListItems } from './js/pixabay';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');
let page = 1;
let per_page = 40;




form.addEventListener('submit', onSubmit);

function onSubmit(event) {
  const searchText = event.currentTarget.firstElementChild.value;
 
  event.preventDefault();

  ifNewSubmit()
  
  
  if (searchText.trim() === "") {
    return Notiflix.Notify.failure(`Please, enter your query in the search box!`);
  }

  fetchListItems(searchText, page, per_page)
    .then(response => {
      const totalHitsElements = response.data.totalHits;
      const picturesArr = response.data.hits;
      const totalPages = Math.ceil(totalHitsElements / per_page);
      console.log("page:", page);
      console.log("totalPage:", totalPages);

      if (totalHitsElements >= per_page) {
        Notiflix.Notify.success(`Hooray! We found ${per_page} out of ${totalHitsElements} images.`);
      } else if (totalHitsElements > 0){
        Notiflix.Notify.success(`Hooray! We found ${totalHitsElements} out of ${totalHitsElements} images.`);
      } else {
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      };

      listRendering(picturesArr);

      if (totalPages > 1) {
         loadMore.classList.remove("is-hidden");
      } 
      new SimpleLightbox('.gallery a',  {
        captionsData: "alt", 
        captionDelay: 250,
        });
    })
    .catch(err => console.log(err))
};




//---
//--- loadMore
//---

loadMore.addEventListener('click', onClick);

function onClick(event) {
  const searchText = form.firstElementChild.value;
  page += 1;


  fetchListItems(searchText, page, per_page)
    .then(response => {
      const totalHitsElements = response.data.totalHits;
      const picturesArr = response.data.hits;
      const totalPages = Math.ceil(totalHitsElements / per_page);
      
      Notiflix.Notify.success(`Hooray! We found ${per_page * page} out of ${totalHitsElements} images.`);

      console.log("page:", page);
      console.log("totalPage:", totalPages);
      
      if ( page >= totalPages) {
        Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
        loadMore.classList.add("is-hidden");
      }

      listRendering(picturesArr);

      let lightbox = new SimpleLightbox('.gallery a', {
        captionsData: "alt", 
        captionDelay: 250,
        });      
      
    })
    .catch(err => console.log(err))
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
          <img class="gallery__image" src="${webformatURL}" alt="Likes: ${tags}" />
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






