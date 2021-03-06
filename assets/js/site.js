'use strict';

var html = document.querySelector('html');

// Add a `js` class for any JavaScript-dependent CSS
// See https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
html.classList.add('js');

if(html.id === 'shipping') {
  formShip = document.querySelector('form[name="ship"]');
  restoreFormDataFromLocalStorage(formShip.name);
  formShip.addEventListener('input', debounce(handleFormInputActivity, 850));
  formShip.addEventListener('change', handleFormInputActivity);
  formShip.addEventListener('pbutton', handleFormSubmission);

  newAddressFieldset = document.querySelector('fieldset[name="shipping-address"]');
  newAddressCheckbox = document.querySelector('#shipping-is-billing');

  newAddressFieldset.setAttribute('disabled', 'disabled');
  newAddressFieldset.setAttribute('aria-hidden', 'true');

  newAddressCheckbox.addEventListener('change', function(event) {
    // Add logic to set values only on checked state
    if(event.target.checked) {
      newAddressFieldset.setAttribute('disabled', 'disabled');
      newAddressFieldset.setAttribute('aria-hidden', 'true');
    } else {
      newAddressFieldset.removeAttribute('disabled');
      newAddressFieldset.setAttribute('aria-hidden', 'false');
    }
  });
}

if(html.id === 'billing') {
  formPayment = document.querySelector('form[name="bill"]');
  restoreFormDataFromLocalStorage(formPayment.name);
  formPayment.addEventListener('input', debounce(handleFormInputActivity, 850));
  formPayment.addEventListener('change', handleFormInputActivity);
  formPayment.addEventListener('pbutton', handleFormSubmission);
}

/*
  Core Functions
*/

function handleFormInputActivity(event) {
  var inputElements = ['INPUT', 'SELECT'];
  var targetElement = event.target;
  var targetType = targetElement.getAttribute('type');
  var errorText = capitalizeFirstLetter(targetElement.name);
  var submitButton = document.getElementById('.pbutton');
  var errorClass = targetElement.name + '-error';
  var errorEl = document.querySelector('.' + errorClass);

  var cvvCheck = /^[0-9]{3,4}$/;
  var zipCheck = /^\d{5}(?:[-\s]\d{4})?$/;

  if (!inputElements.includes(targetElement.tagName) || targetElement.name === 'ship' || targetElement.name === 'bill' || targetElement.name === 'zip') {
    return; // this is not an element we care about

    // Security Code
    if(targetElement.tagName === 'sec') {
      //window.alert("sec");
      if (targetElement.value.length < 3) {
        //window.alert("3");
        // Don't add duplicate errors
        if (!errorEl) {
          errorText += ' Too short! Invalid';

          errorEl.className = errorClass;
          errorEl.innerText = errorText;
          targetElement.before(errorEl);
          submitButton.disabled = true;
        }
      } else {
        if (errorEl) {
          errorEl.remove();
          submitButton.disabled = false;
        }
      }
    }
    // Card
    if(targetType === 'number') {
       if(targetElement.name === 'card') {
         if(!ccCheck.test(targetElement.value)) {
           if(!errorEl) {
             errorText += 'Must be a valid credit card';
             errorEl.className = errorClass;
             errorEl.innerText = errorText;
             targetElement.before(errorEl);
             submitButton.disabled = true;
           }
         } else {
           if (errorEl) {
             errorEl.remove();
             submitButton.disabled = false;
           }
         }
       }
}
// Zip Code
if(targetElement.name === '' || targetElement.name === 'zip') {
  if (targetElement.value.length != 5) {
    if(!zipCheck.test(targetElement.value)) {
      window.alert("bro");
      if(!errorEl) {
        errorText += ' must be a valid ZIP code';
        errorEl.className = errorClass;
        errorEl.innerText = errorText;
        targetElement.before(errorEl);
        submitButton.disabled = true;
      }
  } else {
    if (errorEl) {
      errorEl.remove();
      submitButton.disabled = false;
    }
  }
}
}

}

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
