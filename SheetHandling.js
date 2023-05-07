let collectedSheetsDB = []; // contains all SheetDB
let sheetDB = [];

let collectedGraphComponent = [];
let graphComponentMatrix = [];

let sheetsFolderCont = document.querySelector(".sheet-folder-cont"); 
let addSheetBtn = document.querySelector(".sheet-add-icon");

/* ADD SHEET BUTTON LISTNER */
addSheetBtn.addEventListener("click", (e) => {
    let sheet = document.createElement("div");
    sheet.setAttribute("class", "sheet-folder");
    
    let allSheetFolders = document.querySelectorAll(".sheet-folder");
    sheet.setAttribute("id", allSheetFolders.length);

    sheet.innerHTML = `
        <div class="sheet-content"> Sheet${allSheetFolders.length + 1}</div>
    `;

    sheetsFolderCont.appendChild(sheet);

    // Creating DB
    createSheetDB();
    createGraphComponentMatrix();
    handelActiveSheet(sheet);
    handleSheetRemoval(sheet);
    sheet.click();
    
})

// Initializing Functions
function createSheetDB(){
    sheetDB = [];

    for (let i = 0; i < rows; i++) {
      let sheetRow = [];
      for (let j = 0; j < cols; j++) {
        let cellProp = {
          bold: false,
          italic: false,
          underline: false,
          alignment: "left",
          fontFamily: "monospace",
          fontSize: "14",
          fontColor: "#000000",
          bgColor: "#000000",
          value: "",
          formula: "",
          children: [],
        };
        sheetRow.push(cellProp);
      }
      sheetDB.push(sheetRow);
    }
    collectedSheetsDB.push(sheetDB);
}

function createGraphComponentMatrix() {
    let graphComponentMatrix = [];

    for (let i = 0; i < rows; i++) {
        let row = [];
        for (let j = 0; j < cols; j++) {
            row.push([]);
        }
        graphComponentMatrix.push(row);
    }
    collectedGraphComponent.push(graphComponentMatrix);
}



// Helper Functions for sheet click listner
function handelSheetDB(sheetIdx){
    sheetDB = collectedSheetsDB[sheetIdx];
    graphComponentMatrix = collectedGraphComponent[sheetIdx];
}

function handelSheetsUIProperties(){
    for(let i = 0; i < rows; i++){
        for(let j = 0; j < cols; j++){
            let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
            cell.click();
        }
    }

    // By default click on first cell via DOM
    let firstCell = document.querySelector(".cell");
    firstCell.click(); 
}

function setActiveSheetColor(sheet){
    let allSheetFolders = document.querySelectorAll(".sheet-folder");
    for(let i = 0; i < allSheetFolders.length; i++){
        allSheetFolders[i].style.backgroundColor = "transparent";
    }
    sheet.style.backgroundColor = "#ced6e0";
}


/* SHEET CLICK LISTNER */
function handelActiveSheet(sheet){
    sheet.addEventListener("click", (e) => {
        let sheetIdx = Number(sheet.getAttribute("id"));
        // console.log(sheetIdx);
        handelSheetDB(sheetIdx);
        handelSheetsUIProperties();
        setActiveSheetColor(sheet);
    })
}

function handleSheetRemoval(sheet){
    sheet.addEventListener("mousedown", (e) =>{
        // 0 for left click, 1 for wheel click, 2 for right click
        if(e.button !== 2) return;

        let allSheetFolders = document.querySelectorAll(".sheet-folder");
        if(allSheetFolders.length === 1){
            alert("You need to have atleast one sheet!");
            return;
        }

        let response = confirm("Your sheet will be removed permanently, Are you sure?");
        if(response === false) return;

        let sheetIdx = Number(sheet.getAttribute("id"));
        // DB
        collectedSheetsDB.splice(sheetIdx, 1);
        collectedGraphComponent.splice(sheetIdx, 1);
        
        // UI
        handleSheetUIRemoval(sheet);        
        // By default bring sheet 1 to active;
        sheetDB = collectedSheetsDB[0];
        graphComponentMatrix = collectedGraphComponent[0];

        handelSheetsUIProperties();
    });
}


function handleSheetUIRemoval(sheet){
    sheet.remove();
    let allSheetFolders = document.querySelectorAll(".sheet-folder");
    for(let i = 0; i < allSheetFolders.length; i++){
        allSheetFolders[i].setAttribute("id", i);
        let SheetContent = allSheetFolders[i].querySelector(".sheet-content");
        SheetContent.innerText = `Sheet${i+1}`;
        allSheetFolders[i].style.backgroundColor = "transparent";
        
    }
    allSheetFolders[0].style.backgroundColor = "#ced6e0"
}


