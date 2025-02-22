"use strict";

import {readFileSync,statSync,existsSync} from "fs";
import { createServer } from "http";

var nameMemory = [];

// request processing
function webserver(request, response){
    // Here we handle closing the server
    if (request.url === "/exit"){
        try{
            response.setHeader("Content-Type", "text/html; charset=utf-8");  
            response.end("<!doctype html><html><body>The server will stop now.</body></html>");
            process.exit(0);
        }
        catch(err){
            response.end("404");
            console.error("Exited the program with error:",err);
        }
    }
    // Here we handle the http request for file opening
    if (request.url.startsWith("/www/")){
        try{
            let path = request.url.substring(5);
            if (path === ''){
                response.writeHead(404,{});
                response.end("404");
            }
            else {
                if(!existsSync(path)){
                    response.writeHead(404,{});
                    response.end("404");
                }
                else {
                // Getting index of file 
                    let fileContent = readFileSync(path,"utf-8");
                    let pathEnding = path.substring(path.indexOf('.'));
                    let contentType;
                    // Setting the contentType according to file
                    switch(pathEnding){
                        case ".js"  :
                            contentType = "text/javascript";
                            break;
                        case ".mjs" :
                            contentType = "text/javascript";
                            break;
                        case ".css":
                            contentType = "text/css";
                            break;
                        case ".jpg":
                            contentType = "image/jpeg";
                            break;
                        case ".html":
                            contentType = "text/html";
                            break;
                        default :
                            contentType = "text/html";
                            break;
                    }
                    response.setHeader("Content-Type", `${contentType}`); 
                    response.end(fileContent);
                }
            }
        }
        catch (err){
            response.end("404");
            console.error("Exited the code with error", err);
        }   
    }

    // Handling the query hallo
    if (request.url.startsWith("/hallo")){
        try{
            let query = decodeURIComponent(request.url.substring(16));
            let unescapedQuery = query.replace(/%/g, " ");
            response.setHeader("Content-Type", "text/html; charset=utf-8");  
            response.end("<!doctype html><html><body>hallo "+unescapedQuery+"</body></html>");
        }
        catch(err){
            response.end("404");
            console.error("Exited the code with error", err);
        }
    }

    // handling the query ciao
    if(request.url.startsWith("/ciao")){
        try{
            if(!cleardHistory){
                let query = decodeURIComponent(request.url.substring(11));
                let correctedQuery = query.replace(/>/g,"_").replace(/</g,"_");
                nameMemory.push(correctedQuery);
                response.setHeader("Content-Type", "text/html; charset=utf-8");  
                response.end("<!doctype html><html><body>ciao "+correctedQuery+", the following users have already visited this page: "+nameMemory.join(", ")+"</body></html>");
            }
            else {
                let query = decodeURIComponent(request.url.substring(11));
                let correctedQuery = query.replace(/>/g,"_").replace(/</g,"_");
                nameMemory.push(correctedQuery);
                response.setHeader("Content-Type", "text/html; charset=utf-8");  
                response.end("<!doctype html><html><body>ciao "+correctedQuery+", the following users have already visited this page:</body></html>");
                cleardHistory = false;
                }
        }
        catch(err){
            response.end("404");
            console.error("Exited the code with error", err);
        }
    }

    // Handling clear request 
    if(request.url.startsWith("/clear")){
        try{
            cleardHistory = true;
            nameMemory = [];
            response.end();
        }
        catch(err){
            response.end("404");
            console.error("Exited the code with error", err);
        }
    }

    // Handling "/" 
    if (request.url === '/'){
        try{
            response.setHeader("Content-Type", "text/html; charset=utf-8");  
            response.end("<!doctype html><html><body>Server works!</body></html>");
        }
        catch(err){
            response.end("404");
            console.err("Exited with error",err);
        }
    }
}

// instanciate server
const server = createServer(webserver);
let cleardHistory = false;

// start listening
server.listen(process.argv[2], () => {
    console.log(`server is listening on port ${process.argv[2]}...`)
});