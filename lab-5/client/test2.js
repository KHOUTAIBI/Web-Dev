"use strict"

function handleShowText(){
    const xhr = new XMLHttpRequest();
    xhr.open("GET","../../Data");
    xhr.onload = () => {
        let show = document.getElementById("MAINSHOW");
        show.textContent = xhr.responseText;
    }
    xhr.send();
}

function handleAddElement(){
    const xhr = new XMLHttpRequest();
    const value = document.getElementById("valueTF").value;
    const title = document.getElementById("titleTF").value;
    const color = document.getElementById("colorTF").value;
    xhr.open("GET",`../../add?title=${title}&value=${value}&color=${color}`);
    xhr.onload = () =>{
        console.log(xhr.responseText);
    }
    xhr.send();
}

function handleClear(){
    const xhr = new XMLHttpRequest();
    xhr.open("GET","../../clear");
    xhr.onload = () => {

    }
    xhr.send();
}

function handleRemove(){
    const xhr = new XMLHttpRequest();
    const index = document.getElementById("indexTF").value;
    xhr.open("GET",`../../remove?index=${index}`);
    xhr.onload = () => {
        
    }
    xhr.send();
}

function handleRestore(){
    const xhr = new XMLHttpRequest();
    xhr.open("GET","../../restore");
    xhr.onload = () => {
        
    }
    xhr.send();
}

function handleAddAddForm(){
    // removing old div
    let div = document.getElementById("MAINSHOW");
    div.innerHTML = '';
    // adding form
    let form = document.createElement("form");
    form.method = "get";
    
    // adding elements of form
    let inputTitle = document.createElement("input");
    let inputColor = document.createElement("input");
    let inputValue = document.createElement("input");
    let doAddButton = document.createElement("button")
    inputTitle.id = "titleTF";
    inputColor.id = "colorTF";
    inputValue.id = "valueTF";
    inputTitle.placeholder = "add Title here"
    inputColor.placeholder = "add Color here"
    inputValue.placeholder = "add Value here"
    doAddButton.id = "DOADD";
    doAddButton.textContent = "DOADD";
    // We need buttong type not submit
    doAddButton.type = "button";
    form.appendChild(inputTitle);
    form.appendChild(inputColor);
    form.appendChild(inputValue);
    form.appendChild(doAddButton);
    div.appendChild(form);

    // event listener to DOADD
    doAddButton.addEventListener("click",handleAddElement);
}

function handleAddRemoveForm(){
    // removing old div
    let div = document.getElementById("MAINSHOW");
    div.innerHTML = '';
    // adding form
    let form = document.createElement("form");
    form.method = "get";
    
    // adding elements of form
    let indexInput = document.createElement("input");
    let doRemoveButton = document.createElement("button");
    indexInput.id = "indexTF";
    indexInput.placeholder = "add index here";
    doRemoveButton.id = "SUBMITREM";
    doRemoveButton.textContent = "SUBMITREM";
    // We need buttong type not submit
    doRemoveButton.type = "button";
    form.appendChild(indexInput);
    form.appendChild(doRemoveButton);
    div.appendChild(form);

    // event listener to SUBMITREM
    doRemoveButton.addEventListener("click",handleRemove);

}

function handlePieChart(){
    let div = document.getElementById("MAINSHOW");
    div.innerHTML = '';
    const xhr = new XMLHttpRequest();
    xhr.open("GET","../../PieCh");
    xhr.responseType = "document";
    xhr.onload = () => {
        const svg = xhr.response.documentElement;
        div.appendChild(svg);
    }
    xhr.send();
}

function handleLocalPie(){
    const xhr = new XMLHttpRequest();
    xhr.open("GET","../storage.json");
    let div = document.getElementById("MAINSHOW");
    div.innerHTML = '';
    xhr.onload = () => {

        // Here we will be handling the whole Pie in browser
        const stringifiedData = xhr.responseText;
        const radius = 500;
        
        // init the angle
        let initialAngle = 0
        let coordinatesArray = [500,500]
        let parsedData = JSON.parse(stringifiedData);
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
        let svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
        svg.setAttribute("width","1000");
        svg.setAttribute("height","1000");
        let colorSVG = '';

        for (let i = 0; i < wedgeArray.length; i++){
            
            colorSVG += `${colorArray[i]}`;
            let path = document.createElementNS("http://www.w3.org/2000/svg","path");
            path.setAttribute('d',`${wedgeArray[i]}`);
            path.setAttribute('title',`{parsedData[i].title}`);
            path.setAttribute('fill',`${colorSVG}`);
            svg.appendChild(path);
            colorSVG = '';
        }

        for (let i = 0; i < wedgeArray.length; i++){

            let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute('x',textAreaArray[i][0])
            text.setAttribute('y',textAreaArray[i][1]);
            text.setAttribute('fill','black');
            text.setAttribute('stroke','black');
            text.setAttribute('font-size','30')
            text.innerHTML = `${parsedData[i].title}`;
            
            svg.appendChild(text);
        }

        console.log(svg);
        div.appendChild(svg);
    }

    xhr.send();
}

// Generating wedges here
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

// Calculating percentage Here
function calculatePercentage(value){
    return value / 360;
}


document.addEventListener("DOMContentLoaded",(event)=>{
    document.getElementById("SHOW_B").addEventListener("click",handleShowText);
    document.getElementById("BUT_ADD").addEventListener("click",handleAddAddForm);
    document.getElementById("REMOVE").addEventListener("click",handleAddRemoveForm);
    document.getElementById("CLEAR").addEventListener("click",handleClear);
    document.getElementById("RESTORE").addEventListener("click",handleRestore);
    document.getElementById("PIE").addEventListener("click",handlePieChart);
    document.getElementById("LOCAL_PIE").addEventListener("click",handleLocalPie);
});