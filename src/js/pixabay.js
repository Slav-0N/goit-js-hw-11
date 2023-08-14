import axios from 'axios';

export const fetchListItems = async (searchText, page, per_page) => {
  const pbObject = await axios.get(`https://pixabay.com/api/?key=36294375-9fa9664476d2bc95b254b24c2&&q=${searchText.trim()}&&image_type=photo&&orientation=horizontal&&safesearch=true&&page=${page}&&per_page=${per_page}`);
  return pbObject;
};