import * as animations from './lib/animations.js';
import FormHandler from './lib/invitation.js';

(function() {
  document.addEventListener('click', () => animations.section0Away().then(() => animations.section1In()), { once: true });

  document.querySelector('#switch').addEventListener('click', () => {
    document.querySelector('.inscription').classList.toggle('inscription--open');
    document.querySelector('#switch').remove();
  })

  document.querySelector('.programme').addEventListener('click', animations.programIn)

  const formHandler = new FormHandler();
  document.querySelectorAll('div.radio').forEach(radio => radio.onclick = () => {
    radio.classList.toggle('checked');
    formHandler.isValid(radio);
  });

  // Program display
  let program = document.getElementById('program');
  let navButtons = document.querySelectorAll('#program nav p');
  navButtons.forEach(node => {
    node.addEventListener('click', function(e) {
      navButtons.forEach(node => node.classList.remove('day--selected'));
      e.target.classList.add('day--selected');
      let day = e.target.dataset.day;
      program.querySelector('.program--content').innerHTML = document.querySelector('.'+day).innerHTML;
    })
  });

  // mobile height 
  // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
  let vh = window.innerHeight * 0.01;
  // Then we set the value in the --vh custom property to the root of the document
  document.documentElement.style.setProperty('--vh', `${vh}px`);

  document.querySelector('.reset').addEventListener('click', function() {
    document.location.reload();
  })
}) ()
