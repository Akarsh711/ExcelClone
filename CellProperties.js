let sheetDB = [];

for(let i = 0; i < rows; i++){
    let sheetRow = [];
    for(let j = 0; j<cols; j++){
        let cellProp = {
            bold : false,
            italic : false,
            underline : false,
            alignment : "left",
            fontfamily : "monospace",
            fontSize : "14",
            fontColor : "#0000",
            bgColor : "#00000"
        }
        sheetRow.push(cellProp);
    }
    sheetDB.push(sheetRow);
}

// Selectors for cell props
let bold = document.querySelector(".bold");
let italic = document.querySelector(".italic");
let underline = document.querySelector(".underline");
let fontsize = document.querySelector(".font-size-prop");
let fontFamily = document.querySelector(".font-family-prop");
let fontColor = document.querySelector(".font-color-prop");
let bgColor = document.querySelector("bg-color-prop");
let alignment = document.querySelector(".allignment");
let leftAlign = alignment[0];
let centerAlign = alignment[1];
let rightAlign = alignment[2];

let addressBar = document.querySelector(".address-bar");
// Application of two way binding
// Attach property Listener
bold.addEventListener("click", (e) =>{
    let address = addressBar.ariaValueMax;
    activecell(address);
})

function activecell(address){
    let [rid, cid] = decodeRIDCIDFromAddress(address);
    // Access cell & storage object
    let cell = document.querySelector(".cell[rid='${rid}'][cid='${cid}']");
}   

function decodeRIDCIDFromAddress(address){
    // address -> "A1"
    let rid = Number(address.slice(1))-1; // "1" -> 0
    let cid = Number(String.charCodeAt(0)) - 65; // "A" -> 65
    return [rid, cid];
}