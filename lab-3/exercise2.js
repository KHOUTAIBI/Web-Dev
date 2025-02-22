"use strict";

function sendMessage(){
    const xhr = new XMLHttpRequest();
    let valueText = document.getElementById("textedit").value.trim();
    if (valueText === '') return ;
    xhr.open("GET",`chat.php?phrase=${valueText}`);     
    xhr.onload = () => {
        document.getElementById("textedit").value = '';
    };
    xhr.send();
}

function readChatlog(){
    const xhr = new XMLHttpRequest();
    xhr.open("GET","chatlog.txt");
    xhr.onload = () => {
        let textValue = xhr.responseText;
        if (textValue !== ''){
            let textValueArray = textValue.trim().split('\n');
            let slicedArray = textValueArray.slice(-10).reverse();
            let div = document.getElementById("texta")
            div.innerHTML = '';
            for (const sentence of slicedArray){
                let p = document.createElement("p");
                p.textContent = sentence;
                div.appendChild(p);
            }
        }
    }
    xhr.send();
}

document.addEventListener("DOMContentLoaded",(event)=>{
    document.getElementById("sendbutton").addEventListener("click",sendMessage);
    setInterval(readChatlog,1000);
}); 