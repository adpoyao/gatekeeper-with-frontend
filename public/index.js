'use strict';
/* global Cookies */

function generateNavHTML() {
  const isLoggedIn = Cookies.get('isLoggedIn') === 'true';

  let loginTxt = 'Login';
  if (isLoggedIn) {
    loginTxt = 'Hi, user!';
  }

  return (
    `<a href="#">Home</a>
    <a href="#">${loginTxt}</a>`
  );
}

function renderNav(html) {
  $('.js-navigation').html(html);
}

function generateFeedback() {
  const isLoggedIn = Cookies.get('isLoggedIn') === 'true';
  let feedback = '<p>We couldn\'t find that user!</p>';

  if (isLoggedIn) {
    feedback = '<p>You\'re logged in!</p>';
  }
  return feedback;
}

function renderForm(feedback, loginAttempted) {
  const isLoggedIn = Cookies.get('isLoggedIn') === 'true';
  
  $('form')
    .find('input')
    .val('')
    .end()
    .prop('hidden', isLoggedIn);

  if (loginAttempted) {
    $('.js-form-alert')
      .html(feedback)
      .focus();
  }
}

function handleLogin() {
  $('form').on('submit', function(e) {
    e.preventDefault();

    const serializedForm = $('form').serialize();
    const authHeader = { 'x-username-and-password': serializedForm };

    const requestObj = {
      url: '/api/auth/login',
      method: 'POST',
      headers: authHeader,
      success: function(res) {
        renderNav(generateNavHTML());
        renderForm(generateFeedback(), true);
        console.log(res);
      }
    };

    $.ajax(requestObj);
  });
}

$(function() {
  renderNav(generateNavHTML());
  renderForm(generateFeedback(), false);
  handleLogin();
});
