"use strict";

function loadDoc(){
    const xhr = new XMLHttpRequest();
    xhr.open("GET","text.txt");
    xhr.onload = () => {
        console.log(xhr.status);
        if (xhr.status !== 200){
            throw new Error("Could not fetch th e content");
        }   
        document.getElementById("texta").textContent = xhr.responseText;
        };
    xhr.send();
}


function loadDoc2(){
    const xhr = new XMLHttpRequest();
    xhr.open("GET","text.txt");
    xhr.onload = () => {
        if (xhr.status !== 200){
            throw new Error("Could not fetch th e content");
        }   
        let value = xhr.responseText;
        let color = 0;
        let string_array = value.split("<br/>")
        let div = document.getElementById("texta2")
        for (let string of string_array){
            let p = document.createElement("p");
            p.textContent = string;
            p.style.color = "rgb("+color.toString()+", "+(color+50).toString()+", "+(color+20).toString();
            div.appendChild(p);
            color+=50;
        }
    };
    xhr.send();
}

document.addEventListener("DOMContentLoaded",(event)=>{
    document.getElementById("b1").addEventListener("click",loadDoc);
    document.getElementById("b2").addEventListener("click",loadDoc2);
});