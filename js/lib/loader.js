import { tsParticles } from "tsparticles";
console.log(tsParticles)
console.log(document.querySelector('#particle'))
tsParticles.load('particle', {
  particles: {
      number: {
          value: 10,
      },
      move: {
          bounce: false,
          enable: true,
          direction: 'top',
          random: true,
          straight: false,
          out_mode: "bounce"
      },
      opacity: {
          random: true,
          value: 0.5,
      },
      shape: {
          type: "image",
          image: {
            src: "hearth.svg"
          }
      },
      size: {
          random: true,
          value: 10,
      },
  },
});
