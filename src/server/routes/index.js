var express = require('express');
var router = express.Router();
var environment =  process.env.MODE || 'DEVELOPMENT';
var stripe;
var publicKey;

if (environment === 'PRODUCTION') {

  stripe = require('stripe')(process.env.STRIPE_SECRET_KEY_LIVE);
  publicKey = process.env.STRIPE_PUBLIC_KEY_LIVE;

} else {

  stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  publicKey = process.env.STRIPE_PUBLIC_KEY;

}

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


router.use('/key', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,OPTIONS');

  res.send(publicKey)
});

router.use('/charge', function(req, res, next) {

  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'POST,OPTIONS');

  if (req.method == 'POST') {
  var stripeToken = req.body.stripeToken,
      amount = req.body.amount * 100,
      charity = req.body.charity,
      name = req.body.name;

  stripe.charges.create({
    card: stripeToken,
    currency: 'gbp',
    amount: amount
  },
  function(err, charge) {

    if (err) {

      console.log(err);

      res.status(err.statusCode).json({error: err.message});

    } else {

      res.send({
        amount: charge.amount,
        charity: charity,
        name: name
      });

      console.log('charge', charge);

    }

  });
  } else {
    res.sendStatus(405);
  }
});

module.exports = router;