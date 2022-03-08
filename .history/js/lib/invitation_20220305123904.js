"use strict";
export default class FormHandler {
  inputState = {
    nom: 'invalid',
    prenom: 'invalid',
    number: 'invalid',
    mail: 'invalid',
    day: 'invalid'
  }

  error = null

  constructor() {
    document.querySelectorAll('input').forEach(node => this.watch(node));

    document.querySelector('.button').addEventListener('click', () => {
      if (this.checkInputState()) this.sendData();
      else console.log(this.inputState)
    });

    var Airtable = require('airtable');
    Airtable.configure({
      endpointUrl: 'https://api.airtable.com',
      apiKey: 'keynxJ5aRc7cWp5cv'
    });
    this.base = Airtable.base('appcfQ0ZWuwuSayr4');
  }

  watch(target) {
    target.oninput = (e) => {
      this.isValid(e.target);
    }
  }

  isValid(target) {
    
    const validate = () => {
      this.inputState[id] = 'valid';
    }

    let id = target.getAttribute('id');
    switch (id) {
      case 'nom':
        if (this.textMatch(target.value)) validate();
        else {
          this.inputState[id] = "Ton nom n'est pas valide";
        }
        break;
      case 'prenom':
        if (this.textMatch(target.value)) validate();
        else {
          this.inputState[id] = 'invalid';
          alert("Ton prénom n'est pas valide")
        }
        break;
      case 'number':
        if (this.numberMatch(target.value)) validate();
        else {
          this.inputState[id] = 'invalid';
          alert("Ton numéro de téléphone n'est pas valide")
        }
        break;
      case 'mail':
        if (this.mailMatch(target.value)) validate();
        else {
          this.inputState[id] = 'invalid';
          alert("Ton mail n'est pas valide")
        }
        break;
    }

    this.inputState.day = (document.querySelector('.checked') != null) ? 'valid' : 'invalid';
    if(!this.inputState.day) alert("N'oublie pas de nous indiquer si tu seras avec nous !")
    this.checkInputState();
  }

  checkInputState() {
    let button = document.querySelector('.button');
    let test = Object.values(this.inputState).every(input => input == 'valid');
    if (test) {
      button.classList.remove('disabled');
      return true;
    }
    else {
      button.classList.add('disabled');
      return this.error
    }
  }

  textMatch(string) {
    return /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{1,}$/.test(string);
  }

  numberMatch(string) {
    return /^(\+*[0-9\ \-]{10,})$/.test(string)
  }

  mailMatch(string) {
    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(string)
  }

  sendData() {
    let dataToSend = {
      nom: '',
      prenom: '',
      number: '',
      mail: '',
      day: ''
    };
    let day = [];
    Object.keys(this.inputState).forEach(key => {
      let node = document.getElementById(key);
      if (node) dataToSend[key] = node.value;
    })
    document.querySelectorAll('.radio').forEach(radio => {
      if (radio.classList.contains('checked')) {
        day.push(radio.dataset.value);
      }
    })
    dataToSend.day = day.join(' ');
    this.base('Coming').create([
      {
        "fields": dataToSend
      },
    ], function (err, records) {
      if (err) {
        console.log(err);
        return;
      }
    });
  }
}


