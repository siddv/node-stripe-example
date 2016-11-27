var express = require('express');
var router = express.Router();
var stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

var products = [
  {
    productName: 'Soylent',
    productDescription: 'Meal replacement that tastes like pancake batter.',
    productPrice: 10.99
  },
  {
    productName: 'Barnados',
    productDescription: 'wevs.',
    productPrice: 5
  }
];

router.get('/', function(req, res, next) {
  var productName = 'Soylent';
  for (var i = 0; i < products.length; i++) {
    if(productName === products[i].productName) {
      return res.render('product', {productInfo: products[i]});
    } else {
      return res.send('Product does not exist.');
    }
  }});

router.get('/products/:name', function(req, res, next) {
  var productName = req.params.name;
  for (var i = 0; i < products.length; i++) {
    if(productName === products[i].productName) {
      return res.render('product', {productInfo: products[i]});
    } else {
      return res.send('Product does not exist.');
    }
  }
});

router.post('/charge', function(req, res,next) {
  var stripeToken = req.body.stripeToken;
  var amount = req.body.price * 100;
  var charity = req.body.charity;

  // ensure amount === actual product amount to avoid fraud

  stripe.charges.create({
    card: stripeToken,
    currency: 'gbp',
    amount: amount
  },
  function(err, charge) {
    if (err) {
      console.log(err);
      res.send('error');
    } else {
      res.send(charge);
      console.log('charge', charge)
    }
  });
});

module.exports = router;