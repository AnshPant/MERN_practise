const fs = require('fs'); //for reading , creating , updating , deleting , renaming files
const http = require('http'); //use createServer method to create http server which have two input request and result (req,res) and later listen to port 8080 or desired port
const url = require('url'); // help to parse an url address into object to manipulate it
const slugify = require('slugify'); 
const replaceTemplate = require('./modules/replaceTemplate'); // tis object have important replace function that is used to fill templates

 // SERVER
 //these variables will act as object referring to files
const tempOverview = fs.readFileSync(
`${__dirname}/templates/template-overview.html`,
'utf-8'
);
const tempCard = fs.readFileSync(
`${__dirname}/templates/template-card.html`,
'utf-8'
);
const tempProduct = fs.readFileSync(
`${__dirname}/templates/template-product.html`,
'utf-8'
);

//dev-data folder have a json file which have objects stores in json format
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);  // this is array objects which have all data objects of data.json file in it
//data now relate to file and dataObj will be used  to access the objects in that file

const slugs = dataObj.map(el => slugify(el.productName, { lower: true }));
console.log(slugs);

const server = http.createServer((req, res) => {  //create a https server using createServer function
const { query, pathname } = url.parse(req.url, true);


// Overview page
if (pathname === '/' || pathname === '/overview') {  //check path name dynamically 
    res.writeHead(200, {
      'Content-type': 'text/html'
    });

    const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.end(output);

    
  } // Product page

else if (pathname === '/product') {
    res.writeHead(200, {
      'Content-type': 'text/html'
    });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
}
//API
else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-type': 'application/json'
    });
    res.end(data);

    
  } 
  // Not found
  else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world'
    });
    res.end('<h1>Page not found!</h1>');
  }
});
//due to asynchronous thing server listen will run first then rest code will run 

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to requests on port 8000');
  });