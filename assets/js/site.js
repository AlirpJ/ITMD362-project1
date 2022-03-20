/*
  Core Functions
*/

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
