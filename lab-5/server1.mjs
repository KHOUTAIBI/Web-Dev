"use strict";
import {readFileSync,existsSync,writeFileSync} from "fs";
import { parse } from "querystring";
import { createServer } from "http";
import { error } from "console";


// request processing
function webserver(request, response){

    // Here we handle closing the server
    if (request.url === "/end"){
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

    // Handling storage.json url
    if (request.url === "/Data"){
        try{
            let fileContent = readFileSync("storage.json","utf-8");
            response.setHeader("Content-Type", "application/json; charset=utf-8");
            // response.setHeader("Access-Control-Allow-Origin" , "*");
            response.end(fileContent);
        }
        catch(err){
            response.end("404");
            console.err("Exited the code with error", err);
        }
    }

    if (request.url.startsWith("/add")){
        // trying to query
        try{
            // Getting the URL Params , i.e : title, value and color
            const paramURL = parse(request.url.substring(5));
            let title = paramURL.title;
            let value = paramURL.value;
            let color = paramURL.color;
            // Writing in storage file
            let fileContent = readFileSync("storage.json","utf-8");
            let parsedContent = JSON.parse(fileContent);
            parsedContent.push(
                {"title": title, 
                "color": color, 
                "value":Number(value)},
            );
            // Stringifying content
            let stringifiedContent = JSON.stringify(parsedContent);
            writeFileSync("storage.json",stringifiedContent);
            response.end("Wrote file to storage successfully");
        }
        catch(err){
            response.end("404");
            console.error("Exited the program with error: ",err);
        }
    }

    // Handling restore request
    if (request.url === "/restore"){
        try{
            // Default restore JSON
            let restoreJson =
                [   
                    {"title": "C", "color": "blue", "value": 100},
                    
                    {"title": "C++", "color": "pink", "value": 120},

                    {"title": "Python", "color": "yellow", "value": 140}
                ];
            // Writing the restored file here
            writeFileSync("storage.json",JSON.stringify(restoreJson),{
                flag : "w",
            });
            response.end("Restored file successfully");
        }
        catch(err){
            response.end("404");
            console.error("Exited the program with error", error);
        }
    }

    // Handling remove index
    if (request.url.startsWith("/remove")){
        try{
            const paramURL = parse(request.url.substring(8));
            const indexToRemove = Number(paramURL.index);
            let fileContent = readFileSync("storage.json");
            let parsedContent = JSON.parse(fileContent);
            parsedContent.splice(indexToRemove,1);
            writeFileSync("storage.json",JSON.stringify(parsedContent),{
                flag : "w",
            });

            response.end("Removed index successfully");
        }
        catch(err){ 
            response.end("404");
            console.error("Exited the program with error :", err);
        }
    }

    // Handling clear request
    if (request.url === "/clear"){
        try{
            let stringJson = JSON.stringify([{"title": "empty", "color": "red", "value": 1}]);
            writeFileSync("storage.json",stringJson,{
                flag : "w",
            })
            response.end("Cleared File successfully");
        }
        catch(err){
            response.end();
            console.error("Exited the file with error :",err);
        }
    }

    // Handling the PieChart

    if (request.url === "/PieCh"){
        try{
            
            // Radius Here and initial coordinates too
            const radius = 300;
            let initialAngle = 0
            let coordinatesArray = [500,500]
            let fileContent = readFileSync("storage.json");
            let parsedData = JSON.parse(fileContent);
            let valueArray = [];
            let colorArray = [];

            for (const obj of parsedData){
                valueArray.push(obj.value);
                colorArray.push(obj.color);
            }

            // Getting wedges Here THE MOST IMPORTANT PART
            let wedgeArray = [];
            let percentageArray = valueArray.map((element) => calculatePercentage(element));
            let initermediateValues = [];
            let textAreaArray = [];

            // Getting the wedges
            for (let i = 0; i < valueArray.length; i++){
                // Here we add the intermidiate values
                initermediateValues.push(generateWedge(
                    coordinatesArray[0],
                    coordinatesArray[1],
                    percentageArray[i],
                    initialAngle,
                    radius,
                    )
                );

                // Here we add the wedges
                wedgeArray.push(initermediateValues[i][0]);
                initialAngle =  initermediateValues[i][3];
                textAreaArray.push([initermediateValues[i][4],initermediateValues[i][5]]);

            }

            // Creating svg element
            let svg = `<svg xmlns="http://www.w3.org/2000/svg" 
             width="1000" height="1000">`; 
            let text = '';

            for (let i = 0; i < wedgeArray.length; i++){
                svg += (`<path d="${wedgeArray[i]}" title="${parsedData[i].title}" fill="${colorArray[i]}"/>`); 
            }

            for (let i = 0; i < wedgeArray.length; i++){
                text+= `<text x="${textAreaArray[i][0]}" y="${textAreaArray[i][1]}">${parsedData[i].title}</text>`
                svg+=text;
                text='';
            }

            svg+= "</svg>";
            response.setHeader("Content-Type", "image/svg+xml");
            // response.setHeader("Access-Control-Allow-Origin" , "*")
            response.end(svg);
        }
        catch(err){
            response.end("404");
            console.error("Exited the program with error :",err);
        }
    }

    // Here we handle the http request for file opening
    if (request.url.startsWith("/WWW/")){
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
                        case ".json" :
                            contentType = "application/json";
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

// Generating wedges with this
function generateWedge(startX, startY,percentage,startAngle,radius){
    // Getting the angles and coordinates
    const endAngle = 2*(percentage*Math.PI)+ startAngle
    var x1 = startX + radius * Math.cos(startAngle);
    var y1 = startY + radius * Math.sin(startAngle);
    var x2 = startX + radius * Math.cos(endAngle);
    var y2 = startY + radius * Math.sin(endAngle);
    let midAngle = (startAngle + endAngle) / 2;

    const textRadius = radius * 0.7;
    const textX = 500 + textRadius * Math.cos(midAngle);
    const textY = 500 + textRadius * Math.sin(midAngle);

    // Getting the SVG info
    var pathString = "M"+ startX + " " + startY + " L" + x1 + " " + y1 + " A" + radius + " " + radius + " 0 0 1 " + x2 + " " + y2 + " Z";

    return [pathString,x2,y2,endAngle,textX,textY];
}

function calculatePercentage(value){
    return value / 360;
}

// instanciate server
const server = createServer(webserver);

// start listening
server.listen(process.argv[2], () => {
    console.log(`server is listening on port ${process.argv[2]}...`)
});