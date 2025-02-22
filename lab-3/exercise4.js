"use strict";

var timeOutArray = [];
var nextSlidesTime = [];
var prevSlideTime = [];
var slideJson;

function slideShow(){
    var xhr = new XMLHttpRequest();
    xhr.open("GET","slides.json");
    xhr.onload = () => {
        // putting the slideJson in a global variable
        for (const slide of JSON.parse(xhr.responseText).slides){
            timeOutArray.push(setTimeout(() => {
                // getting the ids
                let div = document.getElementById("SLSH")
                let new_frame = document.createElement("iframe");
                // getting frame id
                new_frame.id = "slideframe"
                // getting old frame
                let old_frame = document.getElementById("slideframe");
                new_frame.src = slide.url;
                // pushing the time of timeout
                nextSlidesTime.push(slide.time);
                prevSlideTime.push(slide.time);
                div.removeChild(old_frame);
                div.appendChild(new_frame);
            },slide.time*1000));
        }
    };
    xhr.send();
}

function pauseSlideShow(){
    timeOutArray.forEach((element,index) => {
        clearTimeout(element);
    });
}

function nextSlide(){
    pauseSlideShow();
    // Getting the timestep of next
    if (nextSlidesTime.length === 0){
        let timestep = 0; 
        console.log(slideJson)
        let next_slide_url = slideJson[timestep].url;
        console.log(next_slide_url)
        // modifying the div just like the previous exercise
        let div = document.getElementById("SLSH")
        let new_frame = document.createElement("iframe");
        new_frame.id = "slideframe"
        let old_frame = document.getElementById("slideframe");
        new_frame.src = next_slide_url;
        // pushing the time of timeout
        div.removeChild(old_frame);
        div.appendChild(new_frame);
        nextSlidesTime.push(timestep*2)
        prevSlideTime.push(timestep*2)
        return;
    }
    
    // Beginning
    let timestep = (nextSlidesTime.slice(-1)/2 + 1)%5;
    let next_slide_url = slideJson[timestep].url;
    // modifying the div just like the previous exercise
    let div = document.getElementById("SLSH")
    let new_frame = document.createElement("iframe");
    new_frame.id = "slideframe"
    let old_frame = document.getElementById("slideframe");
    new_frame.src = next_slide_url;
    // pushing the time of timeout
    div.removeChild(old_frame);
    div.appendChild(new_frame);
    nextSlidesTime.push(timestep*2)
    prevSlideTime.push(timestep*2)
    return;
}

function previousSlide(){
    pauseSlideShow();
    
    if (prevSlideTime.length === 0){
        let timestep = 0; 
        let next_slide_url = slideJson[timestep].url;
        // modifying the div just like the previous exercise
        let div = document.getElementById("SLSH")
        let new_frame = document.createElement("iframe");
        new_frame.id = "slideframe"
        let old_frame = document.getElementById("slideframe");
        new_frame.src = next_slide_url;
        // pushing the time of timeout
        div.removeChild(old_frame);
        div.appendChild(new_frame);
        nextSlidesTime.push(timestep*2)
        prevSlideTime.push(timestep*2)
        return;
    }

    // Getting the timestep
    let timestep = ((prevSlideTime.slice(-1)/2 - 1 + 5)%5);
    let next_slide_url = slideJson[timestep].url;
    // just like the previous exercise
    let div = document.getElementById("SLSH")
    let new_frame = document.createElement("iframe");
    new_frame.id = "slideframe"
    let old_frame = document.getElementById("slideframe");
    new_frame.src = next_slide_url;
    // pushing the time of timeout
    div.removeChild(old_frame);
    div.appendChild(new_frame);
    prevSlideTime.push(timestep*2);
    nextSlidesTime.push(timestep*2);
    return;
}

document.addEventListener("DOMContentLoaded", (event) =>{
    document.getElementById("start").addEventListener("click",slideShow);
    document.getElementById("PAUSE").addEventListener("click",pauseSlideShow);
    document.getElementById("NEXT").addEventListener("click",nextSlide);
    document.getElementById("but_prev").addEventListener("click",previousSlide);
    var xhr = new XMLHttpRequest();
    xhr.open("GET","slides.json");
    xhr.onload = () => {
        slideJson = JSON.parse(xhr.responseText).slides
    }
    xhr.send();
});
