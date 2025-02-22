"use strict";

function sendPrompt(){
    var xhr = new XMLHttpRequest();
    let textarea = document.getElementById('text=area');
    xhr.open('GET',`http://localhost:8000/prompt/${textarea.value}`);
    xhr.onload = () => {
        if (xhr.status !== 200){
            throw new Error('Error fetching the prompt response');
        }
        textarea.value = '';
    }
    xhr.send();
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('submit').addEventListener('click',sendPrompt);
})