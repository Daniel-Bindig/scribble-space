const User = require('./models/user.js');

// test query to make sure connection is working (select * from Users)
User.findAll()
  .then(users => {
    console.log(users);
  }
);