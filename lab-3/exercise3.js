"use strict";

function slideShow(){
    const xhr = new XMLHttpRequest();
    xhr.open("GET","slides.json");
    xhr.onload = () => {
        for (const slide of JSON.parse(xhr.responseText).slides){
            setTimeout(() => {
                let div = document.getElementById("SLSH")
                let new_frame = document.createElement("iframe");
                new_frame.id = "slideframe"
                let old_frame = document.getElementById("slideframe");
                new_frame.src = slide.url;
                div.removeChild(old_frame);
                div.appendChild(new_frame);
            },slide.time*1000);
        }
    };
    xhr.send();
}

document.addEventListener("DOMContentLoaded", (event) =>{
    document.getElementById("start").addEventListener("click",slideShow);
});