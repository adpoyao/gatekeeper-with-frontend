const express = require('express');
const queryString = require('query-string');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();

const USERS = [
  {
    id: 1,
    firstName: 'Joe',
    lastName: 'Schmoe',
    userName: 'joeschmoe@business.com',
    position: 'Sr. Engineer',
    isAdmin: true,
    // NEVER EVER EVER store passwords in plain text in real life. NEVER!!!!!!!!!!!
    password: 'password'
  },
  {
    id: 2,
    firstName: 'Sally',
    lastName: 'Student',
    userName: 'sallystudent@business.com',
    position: 'Jr. Engineer',
    isAdmin: true,
    // NEVER EVER EVER store passwords in plain text in real life. NEVER!!!!!!!!!!!
    password: 'password'
  },
  {
    id: 3,
    firstName: 'Lila',
    lastName: 'LeMonde',
    userName: 'lila@business.com',
    position: 'Growth Hacker',
    isAdmin: false,
    // NEVER EVER EVER store passwords in plain text in real life. NEVER!!!!!!!!!!!
    password: 'password'
  },
  {
    id: 4,
    firstName: 'Freddy',
    lastName: 'Fun',
    userName: 'freddy@business.com',
    position: 'Community Manager',
    isAdmin: false,
    // NEVER EVER EVER store passwords in plain text in real life. NEVER!!!!!!!!!!!
    password: 'password'
  }
];

app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method.toLowerCase() === 'options') {
    res.send(200);
  } else {
    next();
  }
});

function gateKeeper(req, res, next) {
  
  // if we have already logged in, 
  // app.locals.user will exist
  // so we want to expose that user
  // as req.user, and move on
  if (app.locals.user) {
    req.user = app.locals.user;
    next();
  }

  // `Object.assign` here gives us a clean way to express the following idea:
  //  We want to create an object with default
  //  values of `null` for `user` and `pass`,
  //  and *then*, if after parsing the request header
  //  we find values for `user` and `pass` set
  //  there, we'll use those over the default.
  //  Either way, we're guaranteed to end up
  //  with an object that has `user` and `pass` keys.


  const { user, pass } = Object.assign(
    { user: null, pass: null },
    queryString.parse(req.get('x-username-and-password'))
  );


  // app.locals is a place set aside for arbitrary data.
  // This is NOT how we persist user login in a real app; 
  // you will learn that later.
  app.locals.user = USERS.find(
    usr => usr.userName === user && usr.password === pass
  );
  
  // gotta call `next()`!!! otherwise this middleware
  // will hang.
  next();
}

// use `gateKeeper` for all routes in our app.
// this means `req.user` will always be added
// to the request object.
app.use(gateKeeper);

app.get('/api/users/me', (req, res) => {
  // send an error message if no or wrong credentials sent
  if (req.user === undefined) {
    return res
      .status(403)
      .json({ message: 'Must supply valid user credentials' });
  }
  // we're only returning a subset of the properties
  // from the user object. Notably, we're *not*
  // sending `password` or `isAdmin`.
  const { firstName, lastName, id, userName, position } = req.user;
  return res.json({ firstName, lastName, id, userName, position });
});

app.post('/api/auth/login', function(req, res) {
  if (req.user) {
    res.cookie('isLoggedIn', true)
      .sendStatus(204);
  }
  // send an error message if no or wrong credentials sent
  if (req.user === undefined) {
    res
      .status(403)
      .json({ message: 'Must supply valid user credentials' });
  }
});

app.listen(8080, () => {
  console.log(`Your app is listening on port ${8080}`);
});
