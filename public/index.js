'use strict';
/* global Cookies */

function generateNavHTML() {
  let loginTxt = 'Login';
  if (Cookies.get('isLoggedIn')) {
    loginTxt = 'Hi, user!';
  }
  return `<a href="#">Home</a>
    <a href="#">${loginTxt}</a>`;
}

function renderNav(html) {
  $('.js-navigation').html(html);
}

function renderForm() {
  $('form')
    .find('input')
    .val();
}

function handleLogin() {
  $('form').on('submit', function(e) {
    e.preventDefault();

    const usr = {};

    $('input').each(function(i, input) {
      usr[input.name] = input.value;
    });

    const requestObj = {
      url: '/api/auth/login',
      method: 'POST',
      beforeSend: function(req) {
        const { user, pass } = usr;
        const userPassQuery = `user=${user}&pass=${pass}`;
        req.setRequestHeader('x-username-and-password', userPassQuery);
      },
      success: function(res) {
        renderNav(generateNavHTML());
        renderForm();
        console.log(res);
      }
    };

    $.ajax(requestObj);
  });
}

$(function() {
  renderNav(generateNavHTML());
  renderForm();
  handleLogin();
});
