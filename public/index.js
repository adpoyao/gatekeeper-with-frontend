/* global Cookies */
'use strict';

// This will store a boolean that reports
// if the 'isLoggedIn' cookie exists.
// it will be updated on page load,
// and upon form submission
let isLoggedIn;

$(function() {
  // check the isLoggedIn cookie,
  // in case there's a user from a previous visit
  isLoggedIn = Cookies.get('isLoggedIn') === 'true';

  // on first render, there is no need
  // to show the feedback
  renderApp({ showFeedback: false });
  handleLogin();
});

// this function is simple now,
// but could be useful for organizing render
// if the UI gets more complex
function renderApp(opts) {
  renderNav();
  renderForm(opts.showFeedback);
}

function handleLogin() {
  $('form').on('submit', function(e) {
    e.preventDefault();

    // Here, we quickly convert the form
    // into a query string.
    // See $ docs on .serialize():
    // https://api.jquery.com/serialize/
    const serializedForm = $('form').serialize();
    const authHeader = {
      'x-username-and-password': serializedForm
    };

    const requestObj = {
      url: '/api/auth/login',
      method: 'POST',
      headers: authHeader,
      success: processResponse,
      error: processResponse
    };

    $.ajax(requestObj);
  });
}

function processResponse(res) {
  // update our global isLoggedIn
  isLoggedIn = Cookies.get('isLoggedIn') === 'true';
  // since we've attempted to use the form,
  // we want to show the feedback section of
  // our app.
  renderApp({ showFeedback: true });
  console.log(res);
}

function renderNav() {
  $('.js-navigation').html(generateNavHTML());
}

function generateNavHTML() {
  let loginTxt = 'Login';
  if (isLoggedIn) {
    loginTxt = 'Hi, user!';
  }
  return (
    `<a href="#">Home</a>
    <a href="#">${loginTxt}</a>`
  );
}

// Our parent render function takes an argument
// representing a collection of render options.
// showFeedback is a true/false boolean from that object.

function renderForm(showFeedback) {
  $('form')
    .find('input')
    .val('')
    // end allows us to go back to our first query,
    // the form.
    .end()
    .prop('hidden', isLoggedIn);

  if (showFeedback) {
    $('.js-login-alert')
      .html(generateFeedback())
      .focus();
  }
}
function generateFeedback() {
  let feedback = '<p>We couldn\'t find that user!</p>';

  if (isLoggedIn) {
    feedback = '<p>You\'re logged in!</p>';
  }
  return feedback;
}
