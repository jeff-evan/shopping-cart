// retrieve all products
exports.list = function (model, response) {
  model.find({}, function(error, result) {
    if (error) {
      console.error(error);
      return null;
    }
    if (response !== null) {
      response.setHeader('content-type', 'application/json');
      response.end(JSON.stringify(result));
    }
    return JSON.stringify(result);
  });
};

// create product if it not exist yet
exports.create = function (model, requestBody, response) {
  var product = toProduct(requestBody, model);
  var primarykey = requestBody.productid;
  product.save(function(error) {
    if (!error) {
       product.save();
    } else {
        console.log('Checking if product already exist, ID:' + primarykey);
        model.findOne({productid: primarykey}, 
        function(error, data) {
          if (error) {
            console.log(error);
            if (response !== null) {
              response.writeHead(500,{'Content-Type' : 'text/plain'});
              response.end('Internal server error');
            }
            return;
          } else {
              var product = toProduct(requestBody, model);
              if (!data) {
                console.log('Item does not exist. It will be created');
                product.save(function(error) {
                  if (!error) {
                     product.save();
                  } else {
                      console.log(error);
                  }
                 });
                 if (response !== null) {
                    response.writeHead(201, {'Content-Type' : 'text/plain'});
                    response.end('Created');
                 }
                 return;
              } else {
                 console.log('Updating proudct with ID:' + primarykey);
                 data.productname = product.productname;
                 data.category = product.category;
                 data.stock = product.stock;
                 data.color = product.color;
                 data.price = product.price;
                 data.size = product.size;
                 data.groups =  product.groups;
                
                 data.save(function (error) {
                     if (!error) {
                         data.save();
                         response.end('Updated');
                         console.log('Successfully Updated item with ID: ' + primarykey);
                     } else {
                          console.log('Error while saving product with ID:' + primarykey);
                          console.log(error);
                     }
                  }); //end of data.save
              }
            }
         }); // end of model.findone function
      }
    }); // end of product.save function
};

function toProduct(body, Product) {
     return new Product(
     {
        productname: body.productname,
        productid: body.productid,
        category: body.category,
        stock: body.stock,
        color: body.color,
        size: body.size,
        price: body.price,
        groups: body.groups,
      });
}

// find by productID
exports.findByID = function (model, _primarykey, response) {
    model.findOne({productid: _primarykey}, 
        function(error, result) {
            if (error) {
               console.error(error);
               response.writeHead(500, {'Content-Type' : 'text/plain'});
               response.end('Internal server error');
               return;
            } else {
               if (!result) {
                  if (response !== null) {
                      response.writeHead(404, {'Content-Type' : 'text/plain'});
                      response.end('Not Found');
                   }
                   return;
               }
           if (response !== null){
               response.setHeader('Content-Type', 'application/json');
               response.send(result);
            }
            console.log(result);
       }
   });
};

exports.update = function (model, requestBody, response) {
	var primarykey = requestBody.productid;
	model.findOne({productid: primarykey}, 
       function(error, data) {
			if (error) {
				console.log(error);
				if (response !== null) {
					response.writeHead(500, {'Content-Type' : 'text/plain'});
					response.end('Internal server error');
				}
				return;
			} else {
				var product = toProduct(requestBody, model);
				if (!data) {
					console.log('Product with ID: '+ primarykey + ' does not exist.  will be created.');
					product.save(function(error) {
						if (!error)
							product.save();
					});
					if (response !== null) {
						response.writeHead(201, {'Content-Type' : 'text/plain'});
						response.end('Created');
					}
					return;
				}
               //populate the document with the updated values
                data.productid = product.productid;
                data.productname = product.productname;
                data.category = product.category;
                data.stock = product.stock;
                data.color = product.color;
                data.size = contact.size;
                data.price = contact.price;
                data.groups = contact.groups;
        // now save
        data.save(function (error) {
        if (!error) {
          console.log('Successfully updated product with ID: '+ primarykey);
          data.save();
        } else {
          console.log('error on save');
        }
      });
        if (response !== null) {
          response.send('Updated');
        }
      }
    });
  };

exports.remove = function (model, _primarykey, response)
{
  console.log('Deleting product with ID: ' + _primarykey);
  model.findOne({productid: _primarykey}, 
  function(error, data) {
    if (error) {
      console.log(error);
      if (response !== null) {
        response.writeHead(500, {'Content-Type' : 'text/plain'});
        response.end('Internal server error');
      }
      return;
    } else {
      if (!data) {
        console.log('not found');
        if (response !== null) {
          response.writeHead(404, {'Content-Type' : 'text/plain'});
          response.end('Not Found');
        }
        return;
        } else {
          data.remove(function(error){
            if (!error) {
              data.remove();
            }
            else {
              console.log(error);
            }
          });
          if (response !== null){
              response.send('Deleted');
            }
            return;
          }
        }
  });
};
 