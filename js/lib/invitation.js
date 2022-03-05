"use strict";
var Airtable = require("airtable");
export default class FormHandler {
  inputState = {
    nom: "invalid",
    prenom: "invalid",
    number: "invalid",
    mail: "invalid",
    day: "invalid",
  };

  constructor() {
    document.querySelectorAll("input").forEach((node) => this.watch(node));

    document.querySelector(".button").addEventListener("click", this.clickHandler);

    Airtable.configure({
      endpointUrl: "https://api.airtable.com",
      apiKey: "keynxJ5aRc7cWp5cv",
    });
    this.base = Airtable.base("appcfQ0ZWuwuSayr4");
  }

  watch(target) {
    target.oninput = (e) => {
      this.isValid(e.target);
    };
  }

  isValid(target) {
    const validate = () => {
      this.inputState[id] = "valid";
    };

    let id = target.getAttribute("id");
    switch (id) {
      case "nom":
        if (this.textMatch(target.value)) validate();
        else {
          this.inputState[id] = "Ton nom n'est pas valide";
        }
        break;
      case "prenom":
        if (this.textMatch(target.value)) validate();
        else {
          this.inputState[id] = "invalid";
        }
        break;
      case "number":
        if (this.numberMatch(target.value)) validate();
        else {
          this.inputState[id] = "invalid";
        }
        break;
      case "mail":
        if (this.mailMatch(target.value)) validate();
        else {
          this.inputState[id] = "invalid";
        }
        break;
    }

    this.inputState.day =
      document.querySelector(".checked") != null ? "valid" : "invalid";
    this.checkInputState();
  }

  checkInputState() {
    let button = document.querySelector(".button");
    let test = Object.values(this.inputState).every(
      (input) => input == "valid"
    );
    if (test) {
      button.classList.remove("disabled");
      return true;
    } else {
      button.classList.add("disabled");
      return this.error;
    }
  }

  clickHandler = () => {
    console.log(this)
    if (this.checkInputState()) {
      this.sendData();
      alert("Ton invitation à bien été envoyée");
      document.querySelector(".button").removeEventListener("click", this.clickHandler)
    } else
      alert(
        "Merci de vérifier que : \n - Ton nom est rempli \n - Ton prénom est bien indiqué \n - Ton mail est valide \n - Ton numéro de téléphone est valide \n - Tu nous as bien indiqué si tu venais le 23 Juillet"
      );
  }

  textMatch(string) {
    return /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{1,}$/.test(
      string
    );
  }

  numberMatch(string) {
    return true;
  }

  mailMatch(string) {
    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(string);
  }

  sendData() {
    let dataToSend = {
      nom: "",
      prenom: "",
      number: "",
      mail: "",
      day: "",
    };
    let day = [];
    Object.keys(this.inputState).forEach((key) => {
      let node = document.getElementById(key);
      if (node) dataToSend[key] = node.value;
    });
    document.querySelectorAll(".radio").forEach((radio) => {
      if (radio.classList.contains("checked")) {
        day.push(radio.dataset.value);
      }
    });
    dataToSend.day = day.join(" ");
    this.base("Coming").create(
      [
        {
          fields: dataToSend,
        },
      ],
      function (err, records) {
        console.log(records);
        if (err) {
          console.log(err);
          return;
        }
      }
    );
  }
}
