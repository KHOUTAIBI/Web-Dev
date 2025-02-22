"use strict";

// import whole module
import express from "express"; 
import {readFileSync, writeFileSync } from "fs";

const app = express();
app.use(express.json());

// list of middlewares

// list of routes
app.get('/', (req, res) => res.send('Hi'));


// Handling killing the server
app.get("/kill",(req,res)=> {
    try {
        res.setHeader("contentType","text/plain;charset = utf-8");
        res.send("Killing the server");
        process.exit(0);
    }
    catch(err){
        res.end("Error !");
        console.log("Error :", err);
    }
});

// Handling clean reuqest
app.get("/clean",(req,res) => {
    try{
        res.setHeader("Content-Type","text/plain; charset=utf-8");
        res.send("db.json reloaded");
    }
    catch(err){
        res.end("Error !");
        console.log("Error :", err);
    }
});


// Handling number of papers
app.get("/nbpapers", (req,res) => {
    try{
        let fileContent = readFileSync("db.json");
        let parsedContent = JSON.parse(fileContent);
        res.setHeader("Content-Type","text/plain; charset=utf-8");
        res.status(200).send(`${parsedContent.length}`);
    }
    catch(err){
        res.status(404).end("Error !");
        console.log("Error :", err);
    }
})

// Handling 
app.get("/byauthor/*", (req,res) => {
    try{
        const query = req.url.substring(10);
        let count = 0
        let fileContent = readFileSync("db.json");
        let parsedContent = JSON.parse(fileContent);
        for (let i = 0; i < parsedContent.length; i++){
            if (parsedContent[i].authors.join('').toLowerCase().includes(query.toLowerCase())){
                count++;
            }
        }
        res.setHeader("Content-Type","text/plain; charset=utf-8");
        res.status(200).send(`${count}`);
    }
    catch(err){
        res.status(404).end("Error !");
        console.log("Error :", err);
    }
})

// Handling papers from
app.get("/papersfrom/*",(req,res) => {
    try{
        const query = req.url.substring(12);
        let arrayDescriptors = [];
        let fileContent = readFileSync("db.json");
        let parsedContent = JSON.parse(fileContent);
        for (let i = 0; i < parsedContent.length; i++){
            if (parsedContent[i].authors.join('').toLowerCase().includes(query.toLowerCase())){
                arrayDescriptors.push(parsedContent[i]);
            }
        }
        let stringifiedJson = JSON.stringify(arrayDescriptors);
        res.setHeader("Content-Type","application/json; charset=utf-8");
        res.status(200).send(`${stringifiedJson}`);
    }
    
    catch(err){
        res.status(404).end("Error !");
        console.log("Error :", err);
    }
})

// Handling titles
app.get("/titles/*",(req,res) => {
    try{
        const query = req.url.substring(8);
        let arrayDescriptors = [];
        let fileContent = readFileSync("db.json");
        let parsedContent = JSON.parse(fileContent);
        for (let i = 0; i < parsedContent.length; i++){
            if (parsedContent[i].authors.join('').toLowerCase().includes(query.toLowerCase())){
                arrayDescriptors.push(parsedContent[i].title);
            }
        }
        let stringifiedJson = JSON.stringify(arrayDescriptors);
        res.setHeader("Content-Type","application/json; charset=utf-8");
        res.status(200).send(`${stringifiedJson}`);
    }
    
    catch(err){
        res.status(404).end("Error !");
        console.log("Error :", err);
    }
})

// Handling keys
app.get("/ref/*",(req,res) => {
    try{
        const query = req.url.substring(5);
        let arrayDescriptors = {};
        let fileContent = readFileSync("db.json");
        let parsedContent = JSON.parse(fileContent);
        for (let i = 0; i < parsedContent.length; i++){
            if (parsedContent[i].key.toLowerCase() === query.toLowerCase()){
                arrayDescriptors = parsedContent[i];
                break;
            }
        }
        let stringifiedJson = JSON.stringify(arrayDescriptors);
        res.setHeader("Content-Type","application/json; charset=utf-8");
        res.status(200).send(`${stringifiedJson}`);
    }
    
    catch(err){
        res.status(404).end("Error !");
        console.log("Error :", err);
    }
})

// Handling DELETE
app.delete("/ref/*",(req,res) => {
    try{
        const query = req.url.substring(5);
        let arrayDescriptors = [];
        let fileContent = readFileSync("db.json");
        let parsedContent = JSON.parse(fileContent);
        let newData = []; 
        for (let i = 0; i < parsedContent.length; i++){
            if (parsedContent[i].key.toLowerCase() !== query.toLowerCase()){
                newData.push(parsedContent[i])
            }
        }
        let stringifiedJson = JSON.stringify(newData);
        writeFileSync("db.json",stringifiedJson,{
            flag : 'w'
        });
        res.setHeader("Content-Type","application/json; charset=utf-8");
        res.status(200).send(`${stringifiedJson}`);
    }
    catch(err){
        res.status(404).end("Error !");
        console.log("Error :", err);
    }
})

// Handling post
app.post("/ref/",(req,res)=>{
    try{
        const query = req.url.substring(5);
        let fileContent = readFileSync("db.json");
        let parsedContent = JSON.parse(fileContent);
        let newData = {}; 
        newData.key = 'imaginary';
        for (const [key, value] of Object.entries(req.body)){
            newData[key] = value ;
        }
        parsedContent.push(newData);
        let stringifiedJson = JSON.stringify(parsedContent);
        writeFileSync("db.json",stringifiedJson,{
            flag : 'w'
        });
        console.log(stringifiedJson);
        res.setHeader("Content-Type","application/json; charset=utf-8");
        res.status(200).send(`${stringifiedJson}`);
    }
    catch(err){
        res.status(404).end("Error !");
        console.log("Error :", err);
    }
});

// Handling PUT
app.put("/ref/*",(req,res)=>{
    try{
        const query = req.url.substring(5);
        let fileContent = readFileSync("db.json");
        let parsedContent = JSON.parse(fileContent);
        let newData = {}; 
        newData.key = query;
        for (const [key, value] of Object.entries(req.body)){
            newData[key] = value ;
        }
        console.log(newData)
        for (let i = 0 ; i < parsedContent.length; i++){
            if (parsedContent[i].key === query){
                for (const [key, value] of Object.entries(parsedContent[i])){
                    newData[key] === undefined ? true : parsedContent[i][key] = newData[key] ;
                }
                break;
            }
        }
        let stringifiedJson = JSON.stringify(parsedContent);
        let stringifieddata = JSON.stringify(newData);
        writeFileSync("db.json",stringifiedJson,{
            flag : 'w'
        });
        res.setHeader("Content-Type","application/json; charset=utf-8");
        res.status(200).send(`${stringifieddata}`);
    }
    catch(err){
        res.status(404).end("Error !");
        console.log("Error :", err);
    }
})


// start listening
app.listen(process.argv[2], () => console.log(`server listening on port ${process.argv[2]}...`));