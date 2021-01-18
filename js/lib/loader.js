import anime from 'animejs';
import { loaderAway } from './animations.js'

(function() {
  var updates = 0;
  var stages = [randomInt(20, 40), randomInt(41, 69), randomInt(70, 89)];

  var animation = anime({
    targets: '#loader svg path:last-child',
    strokeDashoffset: [anime.setDashoffset, 0],
    easing: 'easeInOutSine',
    duration: 2500,
    direction: 'forwards',
    autoplay: true,
    update: function(anim) {
      updates++;
      document.querySelector('.progress') ? document.querySelector('.progress').innerHTML = Math.round(anim.progress)+'%' : "";
      if(stages.indexOf(updates) != -1) {
        animation.pause();
        if(stages.indexOf(updates) == 2) return;
        setTimeout(() => {
          updates++;
          animation.play();
        }, randomInt(1500, 3500));
      }
    },
    complete: function() {
      setTimeout(() => {
        loaderAway(500);
      }, 300);
    }
  });


  document.onreadystatechange = function() {
    if(document.readyState == 'complete') {
      animation.seek(2900)
    }
  }

  function randomInt(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}) ()


