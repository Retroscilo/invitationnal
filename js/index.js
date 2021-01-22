import * as animations from './lib/animations.js';
import FormHandler from './lib/invitation.js';

(function() {
  screen.orientation.lock("portrait");   // webkit only
  screen.lockOrientationUniversal = screen.lockOrientation || screen.mozLockOrientation || screen.msLockOrientation;
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

  window.addEventListener('resize', () => console.log(window.innerHeight));

  var mobile = window.innerWidth < 800 ? true : false;
  if(mobile) {
    section1.querySelector(' .subject').remove(); 
    section1.querySelector(' .background').remove();
    section1.querySelector(' .foreground').remove();
  }

  document.querySelector('#switch').addEventListener('click', function() {
    section1.style.overflowY = 'auto';
  })

  var ua = window.navigator.userAgent;
  var iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
  var webkit = !!ua.match(/WebKit/i);
  var iOSSafari = iOS && webkit && !ua.match(/CriOS/i);
  if(iOSSafari) {
    document.querySelector('#section0 .title').style.width = '17rem';
  }
}) ()
