'use strict';
const express = require('express');
let router = express.Router();

//middleware that's only used on this router
// router.use(function (req, res, next){
//   console.log('router middleware:', req.url);
//   next();
// });

router
  .route('/one')
  .get((req, res) => {
    res.send('ONNEEE');
  })
  .post((req, res) => {
    res.send('one post');
  });

// router
//   .route('/two/:id')
//   .get((req, res) => {
//     res.send('two get ' + req.params.id);
//   })
//   .put((req, res) => {
//     res.send('two put id: ', + req.params.id);
//   });

module.exports = router;