'use strict';

// tests

it('Shipping form should exist', function(browser) {
  browser
    .url('http://localhost:8080/shipping')
    .assert
      .elementPresent('form[name="ship"]');
});
it('Billing form should exist', function(browser) {
  browser
    .url('http://localhost:8080/billing')
    .assert
      .elementPresent('form[name="bill"]');
});
