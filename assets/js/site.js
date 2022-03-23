

var html = document.querySelector('html');

// Add a `js` class for any JavaScript-dependent CSS
// See https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
html.classList.add('js');

if(html.id === 'payment') {
  formPayment = document.querySelector('form[name="payment"]');
  restoreFormDataFromLocalStorage(formPayment.name);
  formPayment.addEventListener('input', debounce(handleFormInputActivity, 850));
  formPayment.addEventListener('change', handleFormInputActivity);
  formPayment.addEventListener('submit', handleFormSubmission);
}

/*
  Core Functions
*/

function handleFormInputActivity(event) {
  var inputElements = ['INPUT', 'SELECT'];
  var targetElement = event.target;
  var targetType = targetElement.getAttribute('type');
  var errorText = capitalizeFirstLetter(targetElement.name);
  var submitButton = document.getElementById('submit');
  var errorClass = targetElement.name + '-error';
  var errorEl = document.querySelector('.' + errorClass);

  // Regex for validating inputs
  var ccCheck = /^(?:(4[0-9]{12}(?:[0-9]{3})?)|(5[1-5][0-9]{14})|(6(?:011|5[0-9]{2})[0-9]{12})|(3[47][0-9]{13})|(3(?:0[0-5]|[68][0-9])[0-9]{11})|((?:2131|1800|35[0-9]{3})[0-9]{11}))$/;
  var cvvCheck = /^[0-9]{3,4}$/;
  var zipCheck = /^\d{5}(?:[-\s]\d{4})?$/;
  var telCheck = /\d{9}/;

  if (!inputElements.includes(targetElement.tagName) || targetElement.name === 'billing-address-two' || targetElement.name === 'shipping-address-two' || targetElement.name === 'billing-city' || targetElement.name === 'shipping-city') {
    return; // this is not an element we care about
  }

function writeFormDataToLocalStorage(formName, inputElement) {
    var formData = findOrCreateLocalStorageObject(formName);

    // Set just a single input value
    if (inputElement) {
      formData[inputElement.name] = inputElement.value;
    } else {
      // Set all form input values, e.g., on a submit event
      var formElements = document.forms[formName].elements;
      for (var i = 0; i < formElements.length; i++) {
        // Don't store empty elements, like the submit button
        if (formElements[i].value !== "") {
          formData[formElements[i].name] = formElements[i].value;
        }
      }
    }

    // Write the formData JS object to localStorage as JSON
    writeJsonToLocalStorage(formName, formData);
  }

  function findOrCreateLocalStorageObject(keyName) {
    var jsObject = readJsonFromLocalStorage(keyName);

    if (Object.keys(jsObject).length === 0) {
      writeJsonToLocalStorage(keyName, jsObject);
    }

    return jsObject;
  }

  function readJsonFromLocalStorage(keyName) {
    var jsonObject = localStorage.getItem(keyName);
    var jsObject = {};

    if (jsonObject) {
      try {
        jsObject = JSON.parse(jsonObject);
      } catch(e) {
        console.error(e);
        jsObject = {};
      }
    }

    return jsObject;
  }

  function writeJsonToLocalStorage(keyName, jsObject) {
    localStorage.setItem(keyName, JSON.stringify(jsObject));
  }

  function destroyFormDataInLocalStorage(formName) {
    localStorage.removeItem(formName);
  }

  function restoreFormDataFromLocalStorage(formName) {
    var jsObject = readJsonFromLocalStorage(formName);
    var formValues = Object.entries(jsObject);
    if (formValues.length === 0) {
      return; // nothing to restore
    }
    var formElements = document.forms[formName].elements;
    for (var i = 0; i < formValues.length; i++) {
      console.log('Form input key:', formValues[i][0], 'Form input value:', formValues[i][1]);
      formElements[formValues[i][0]].value = formValues[i][1];
    }
  }

  function renderFormDataFromLocalStorage(storageKey) {
    var jsObject = readJsonFromLocalStorage(storageKey);
    var formValues = Object.entries(jsObject);
    if (formValues.length === 0) {
      return; // nothing to restore
    }
    var previewElement = document.querySelector('#post');
    for (var i = 0; i < formValues.length; i++) {
      var el = previewElement.querySelector('#'+formValues[i][0]);
      el.innerText = formValues[i][1];
    }
  }
  function handleFormSubmission(event) {
  var targetElement = event.target;
  event.preventDefault(); // STOP the default browser behavior
  writeFormDataToLocalStorage(targetElement.name); // STORE all the form data
  window.location.href = targetElement.action; // PROCEED to the URL referenced by the form action
}
