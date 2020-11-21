
const PORT = 8080;
const SERVER = `http://localhost:${PORT}`;

let RECTANGLES = [];
let LAST_X = 0;
let LAST_Y = 0;
let LAST_ID = '';

function refreshArea() {
    const URL = `${SERVER}/read`;
    var xhttp = new XMLHttpRequest();
    xhttp.open('GET', URL, true);
    xhttp.send();

    xhttp.onreadystatechange = (e) =>{
        if (xhttp.readyState === XMLHttpRequest.DONE) {
            let rectangles = JSON.parse(xhttp.responseText);
            RECTANGLES = rectangles;
            const board = document.getElementById("drawing-board");
            board.querySelectorAll('*').forEach(n => n.remove());
            rectangles.forEach(addRectangle);
        }
    }
}

function addRectangle(jsonObject, index) {
    const board = document.getElementById("drawing-board");
    let x, y, width, height, colour, identifier;
    ({x, y, width, height, colour, identifier} = jsonObject);

    let rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');

    rect.setAttribute("id", identifier);
    rect.setAttribute("x", x);
    rect.setAttribute("y", y);
    rect.setAttribute("width", width);
    rect.setAttribute("height", height);
    rect.setAttribute("fill", colour);

    rect.addEventListener('mouseover', () => {
        const text = document.getElementById('identifier-hover')
        text.innerText = ` ${rect.id}`
        LAST_ID = rect.id
    })

    board.appendChild(rect);

}


function submitRectangle() {
    const URL = `${SERVER}/create`;

    let colour = document.getElementById('colour-input').value;
    let height = document.getElementById('height-input').value;
    let width = document.getElementById('width-input').value;
    let id = document.getElementById('id-input').value;

    console.log(colour, width, height, id);
    const h = parseInt(height);
    const w = parseInt(width);

    if (colour.length === 0 || height.length === 0 || width.length === 0|| id.length === 0) {
        alert("Missing Inputs");
        clearInputs()
        return
    } else if(h < 0 || w < 0 || h+parseInt(LAST_Y) > 500 || w+parseInt(LAST_X) > 500){
        alert("Bad width or height  values");
        clearInputs()
        return
    }

    var xhttp = new XMLHttpRequest();
    xhttp.open('POST', URL, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify({
        width: width,
        height: height,
        colour: colour,
        identifier: id,
        x: LAST_X,
        y: LAST_Y
    }));

    xhttp.onreadystatechange = (e) =>{
        if (xhttp.readyState === XMLHttpRequest.DONE) {
            console.log("request successful")
            refreshArea();
            clearInputs()
        }
    }
}



function updateRectangle() {
    const URL = `${SERVER}/update`;

    let colour = document.getElementById('colour-input').value;
    let height = document.getElementById('height-input').value;
    let width = document.getElementById('width-input').value;
    let id = document.getElementById('id-input').value;

    let obj = {colour:  colour, height: height, width:width, identifier:id};
    if (id.length === 0){
        alert("Missing Identifier")
        return
    }

    let payload = {}
    for(let [key, value] of Object.entries(obj)){
        if(value !== null && value !== 'undefined' && value.length !== 0){
            payload[key] = value
        }
    }
    console.log(payload)

    let xhttp = new XMLHttpRequest();
    xhttp.open('PUT', URL, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(payload));

    xhttp.onreadystatechange = (e) =>{
        if (xhttp.readyState === XMLHttpRequest.DONE) {
            console.log("request successful")
            refreshArea();
            clearInputs();
        }
    }

}

function deleteRectangle() {
    const id = document.getElementById('id-input').value;
    if(id.length === 0){
        alert("Missing identifier")
        clearInputs()
    } else {
        const URL = `${SERVER}/delete`
        let xhttp = new XMLHttpRequest();
        xhttp.open('DELETE', URL, true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        console.log(id)
        xhttp.send(JSON.stringify({identifier: id}));

        xhttp.onreadystatechange = (e) =>{
            if (xhttp.readyState === XMLHttpRequest.DONE) {
                console.log("request successful")
                refreshArea();
                clearInputs();
            }
        }
    }
}

document.addEventListener('click', function (event) {
    [xCoord, yCoord] = getCoords(event);
    if(xCoord < 0 || yCoord < 0 || xCoord > 500 || yCoord > 500){
        document.getElementById('coords').innerText = `(${LAST_X}, ${LAST_Y}) - Saved`
    } else {
        LAST_X = xCoord;
        LAST_Y = yCoord
        document.getElementById('id-input').value = `${LAST_ID}`
        document.getElementById('coords').innerText = `(${LAST_X}, ${LAST_Y})`
    }
})


function clearInputs() {
    document.getElementById('colour-input').value = '';
    document.getElementById('height-input').value = '';
    document.getElementById('width-input').value = '';
    document.getElementById('id-input').value = '';
}

function getCoords(event) {
    const board = document.getElementById('drawing-board');
    let dim = board.getBoundingClientRect();
    return [(event.clientX-dim.left).toFixed(0), (event.clientY-dim.top).toFixed(0)];
}