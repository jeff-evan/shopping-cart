
/**
 * Module dependencies.
 */

var express = require('express')
  , mongoose = require('mongoose')
  , http = require('http')
  , path = require('path')
  , dataservice = require('./modules/product-ds')
  , cartds = require('./modules/cart-ds');

var app = express();
mongoose.connect('mongodb://localhost/products');

var productSchema = new mongoose.Schema({
  productid: {type: String, index: {unique: true}},
  productname: String,
  category: String,
  stock: Number,
  color: [String],
  price: Number,
  size: [String],
  groups: [String]
});
var cartSchema = new mongoose.Schema({
	cartid: {type: String, index: {unique: true}},
	productid:[String],
	couponid:String,
	subtotal:Number
});

var Product = mongoose.model('Product', productSchema);
var Cart=mongoose.model('Product',cartSchema)

app.get('/products', function(request, response) {
	console.log('Listing all products ');
	dataservice.list(Product, response);
});

app.get('/product/:id', function(request, response) {
	console.log(request.url + ' : querying for ' + request.params.id);
    dataservice.findByID(Product, request.params.id,response);
});

app.post('/products', function(request, response) {
	dataservice.update(Product, request.body, response);
});

app.put('/products', function(request, response) {
    dataservice.create(Product, request.body, response);
 });

app.del('/products/:productid', function(request, response) {
	dataservice.remove(Product, request.params.productid, response);
});

app.get('/mycart', function(request, response) {
	console.log('Show items in cart');
	cartds.list(Cart, response);
});

app.post('/additem', function(request, response) {
	cartds.additem(Cart, request.body, response);
});

app.post('/removeitem', function(request, response) {
	cartds.removeitem(Cart, request.body, response);
});

app.post('/addcoupon', function(request, response) {
	cartds.addcoupon(Cart, request.body, response);
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

//development error handler
//will print stacktrace
if (app.get('env') === 'development') {
 app.use(function(err, req, res, next) {
     res.status(err.status || 500);
     res.render('error', {
         message: err.message,
         error: err
     });
 });
}

//production error handler
//no stacktraces leaked to user
app.use(function(err, req, res, next) {
 res.status(err.status || 500);
 res.render('error', {
     message: err.message,
     error: {}
 });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
