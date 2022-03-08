import * as animations from "./lib/animations.js";
import FormHandler from "./lib/invitation.js";
import lottie from "lottie-web";

(function () {
  lottie.loadAnimation({
    container: document.querySelector(".loader"),
    renderer: "svg",
    autoplay: true,
    loop: true,
    path: "https://assets10.lottiefiles.com/packages/lf20_0yes5qep.json"
  });
  var img = new Image();
  img.onload = function () {
    document.querySelector(".loader").style.pointerEvents = "none";
    document.querySelector(".loader").style.opacity = 0;
  };
  img.src = "http://www.lolo-et-lolo.com/foreground.8c2999fe.png";

  document.addEventListener(
    "click",
    () => animations.section0Away().then(() => animations.section1In()),
    { once: true }
  );

  document.querySelector("#switch").addEventListener("click", () => {
    document
      .querySelector(".inscription")
      .classList.toggle("inscription--open");
    document.querySelector(".ctaContainer").style.display = "none";
    document.querySelector("#switch").remove();
  });

  document
    .querySelector(".programme")
    .addEventListener("click", animations.programIn);
  document
    .querySelector(".programmeFirst")
    .addEventListener("click", animations.programIn);

  const formHandler = new FormHandler();
  document.querySelectorAll("div.radio").forEach(
    (radio) =>
      (radio.onclick = (e) => {
        document
          .querySelectorAll("div.radio")
          .forEach((radio) => radio.classList.remove("checked"));
        e.target.classList.toggle("checked");
        formHandler.isValid(radio);
      })
  );

  // Program display
  let program = document.getElementById("program");
  let navButtons = document.querySelectorAll("#program nav p");
  navButtons.forEach((node) => {
    node.addEventListener("click", function (e) {
      navButtons.forEach((node) => node.classList.remove("day--selected"));
      e.target.classList.add("day--selected");
      let day = e.target.dataset.day;
      program.querySelector(".program--content").innerHTML =
        document.querySelector("." + day).innerHTML;
    });
  });

  // mobile height
  // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
  let vh = window.innerHeight * 0.01;
  // Then we set the value in the --vh custom property to the root of the document
  document.documentElement.style.setProperty("--vh", `${vh}px`);
})();
