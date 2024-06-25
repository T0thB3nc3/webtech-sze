//  npm install nodemon -g
//  npx nodemon .\index.js
const http = require('http') // web server module
const fs = require('fs')     // file system module
// const url = require('url')
const requestListener = function(req, res){
    // router

    switch (true){

        // Nézetek
            // Kezdőlap
        case req.url === '/' && req.method === 'GET':
            fs.readFile(__dirname+'/views/home.html',function(err,data){ // fs.readFile(fájlnév, callback fv.) -> fájl megnyitás
                res.setHeader('content-type','text/html; charset=utf-8') // fájl típus FONTOS!!!
                res.writeHead(200) // üzenet a böngészőnek -> minden OK
                res.end(data) // elküldi a kapott adatot böngésző
            })
        break
        // Scriptek
        case req.url === '/script.js' && req.method === 'GET':
            fs.readFile(__dirname+'/public/scripts/script.js',function(err,data){
                res.setHeader('content-type','text/html; charset=utf-8')
                res.writeHead(200)
                res.end(data)
            })
        break
        // Stílus

        case req.url === '/style.css' && req.method === 'GET':
            fs.readFile(__dirname+'/public/styles/style.css',function(err,data){
                res.setHeader('content-type','text/css')
                res.writeHead(200)
                res.end(data)
            })
        break

        // Képek(lokális)

        case req.url === '/banner.jpg' && req.method === 'GET':
            fs.readFile(__dirname+'/public/other/banner.jpg',function(err,data){
                res.setHeader('content-type','image/jpeg')
                res.writeHead(200)
                res.end(data)
            })
        break
        case req.url === '/icon.png' && req.method === 'GET':
            fs.readFile(__dirname+'/public/other/icon.png',function(err,data){
                res.setHeader('content-type','image/jpeg')
                res.writeHead(200)
                res.end(data)
            })
        break


        // adatlekérések
          // kacsák kilistázása
        case req.url === '/ducks' && req.method === 'GET':
            fs.readFile(__dirname+'/data/storedducks.json',function(err,data){
                res.setHeader('content-type','application/json')
                res.writeHead(200)
                res.end(data)
            })
        break
          // minta kacsák kilistázása
        case req.url === '/ducks/types' && req.method === 'GET':
            fs.readFile(__dirname+'/data/ducks.json',function(err,data){
                res.setHeader('content-type','application/json')
                res.writeHead(200)
                res.end(data)
            })
        break;
        // adatfeltöltések
          // új kacsa hozzáadása
        case req.url === '/ducks' && req.method === 'POST':
            let body='';  // body változóban gyűjtjük az adatokat
            // data eseménnyel fogadjuk a kliens által küldött adatokat
            req.on('data',function(stream){
                console.log(stream.toString());
                body += stream.toString();
            });
            // ha megjöttek az adatok, akkor lefut az 'end' esemény
            req.on('end',function(){
                const newDuck = JSON.parse(body);
                console.log('newDuck',newDuck);
                // fájlkezelés:
                fs.readFile('./data/storedducks.json',(err,data)=>{
                    const ducks = JSON.parse(data);
                    ducks.push(newDuck);
                    console.log('ducks',ducks);
                    fs.writeFile('./data/storedducks.json',JSON.stringify(ducks,null,2),()=>{
                        res.end();
                    });
                })
            });
        break
        default:
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
        break;
    }
}

const server = http.createServer(requestListener) // createServer() ->szerver létrehozás
server.listen(3000,()=>{console.log('Server is running http://localhost:3000 port.')}) // .listen() -> szerver indítás