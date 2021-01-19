import Parallax from 'parallax-js';

var mobile = window.innerWidth < 800 ? true : false;

if(mobile) document.body.addEventListener('touchmove', function(e){ e.preventDefault(); });

// Init parallax on first Section #section0
const section0 = document.getElementById('section0');
const section1 = document.getElementById('section1');
let section1Instance;

// OnLoad
if (!mobile) {
  var section0Instance = new Parallax(section0, {
    'calibrateX': true,
    'calibrateY': true,
    'selector': '.layer',
    relativeInput: true,
    hoverOnly: true
  })
} else {
  section1.style.display = 'none';
}

async function loaderAway(fadeOutDuration) {
  const loader = document.getElementById('loader');
  loader.classList.add('fadeOut');
  setTimeout(() => {
    loader.remove();
  }, fadeOutDuration);
}

// Animate and destroy section0
async function section0Away(resolveAfter = 600) {
  document.querySelector('.discover').remove()
  // Animation
  section0.querySelector('.title').classList.add('title--away')
  document.querySelector('body').classList.add('body--pink')
  setTimeout(() => {
    section0.querySelector(`.${'farLandscape'}`).classList.add(`${'farLandscape'}--away`);
  }, 200);
  setTimeout(() => {
    section0.querySelector(`.${'town'}`).classList.add(`${'town'}--away`)
  }, 300);
  setTimeout(() => {
    section0.querySelector(`.${'vineFront'}`).classList.add(`${'vineFront'}--away`)
  }, 500);
  setTimeout(() => {
    section0.querySelector(`.${'vineBack'}`).classList.add(`${'vineBack'}--away`)
  }, 400);

  // Garbage
  section0Instance?.destroy();
  setTimeout(() => {
    section0.remove();
  }, 1200);

  // resolve after
  await new Promise(resolve => setTimeout(resolve, resolveAfter));
}

async function section1In(resolveAfter = 700) {

  if (mobile) { 
    section1.style.opacity = 1;
    section1.querySelector('.subject').remove(); 
    section1.querySelector('.background').remove();
    return; 
  }

  section1.querySelector('.subject').classList.add('subject--rotated');
  section1.querySelector('.background').classList.add('background--visible');
  section1.querySelector('#invitation').classList.remove('invitation--hidden')
  section1.querySelector('#invitation').style.transition = '';

  setTimeout(() => {
    section1.querySelector('.subject').style.transition = 'none'; // Parallax sanity
  }, 700);

  section1Instance = new Parallax(section1, {
    'calibrateX': true,
    'calibrateY': true,
    'selector': '.layer',
    relativeInput: true,
    hoverOnly: true,
    pointerEvents: true
  });

  // resolve after
  await new Promise(resolve => setTimeout(resolve, resolveAfter));
}

async function programIn(resolveAfter) {
  section1.querySelector('#invitation').classList.add('invitation--hidden');
  section1.querySelector('#program').classList.remove('program--hidden');
  setTimeout(() => {
    document.body.addEventListener('click', closeProgram);
    document.querySelector('.close--program').style.position = 'fixed';
  }, 200);
}

function closeProgram(e) {
  let closeProgramButton = document.querySelector('.close--program');
  let program = document.getElementById('program');
  if (e.target == closeProgramButton || e.path.every(node => node != program)) {
    section1.querySelector('#invitation').classList.remove('invitation--hidden');
    program.classList.add('program--hidden');
    document.body.removeEventListener('click', closeProgram);
    document.querySelector('.close--program').style.position = 'absolute';
  }
}

const animateCSS = (element, animation, prefix = 'animate__') => {
  // We create a Promise and return it
  return new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    const node = document.querySelector(element);

    node.classList.add(`${prefix}animated`, animationName);

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd() {
      node.classList.remove(`${prefix}animated`, animationName);
      resolve('Animation ended');
    }

    node.addEventListener('animationend', handleAnimationEnd, { once: true });
  });
}

export { section0Away, section1In, programIn, animateCSS, loaderAway };