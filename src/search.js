const $btn = document.querySelector('.btn');
const $search = document.querySelector('.search');
const $form = document.querySelector('.form');
const $input = document.querySelector('.input');

const $main = document.querySelector('#main');

const $logo = document.querySelector('.logo');

$btn.addEventListener('click', e => {
  $search.classList.add('active');
});
