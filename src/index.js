import './css/styles.css';
import fetchCountries from './fetchCountries';

import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector(`[id="search-box"]`),
  countryList: document.querySelector(`.country-list`),
  countryInfo: document.querySelector(`.country-info`),
};

let markup = '';

refs.input.addEventListener(`input`, debounce(onSearchInput, DEBOUNCE_DELAY));

function onSearchInput() {
  if (!refs.input.value.trim()) {
    refs.countryList.innerHTML = '';
    return;
  }
  fetchCountries(refs.input.value.trim())
    .then(createMarkup)
    .catch(error => {
      console.log(error);
      Notiflix.Notify.failure(`Oops, there is no country with that name`);
    });
}

function createMarkup(countries) {
  if ((countries.length >= 2) & (countries.length <= 10)) {
    createCountriesListMarkup(countries);
  } else if (countries.length === 1) {
    createCountryMarkup(countries);
  } else if (countries.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  }
  refs.countryList.innerHTML = markup;
}

function createCountriesListMarkup(countries) {
  markup = countries
    .map(country => {
      return `<li>
    <img src="${country.flags.svg}" width = 30 alt="" />
    <span>${country.name.official}</span>
  </li>`;
    })
    .join(``);
}

function createCountryMarkup(countries) {
  markup = countries.map(country => {
    return `<li>
    <img src="${country.flags.svg}" width = 30 alt="" />
    <span>${country.name.official}</span>
  </li>
  <div>Capital: ${country.capital}</div>
  <div>Population: ${country.population}</div>
  <div>Languages: ${Object.values(country.languages).join(`, `)}</div>`;
  });
}
