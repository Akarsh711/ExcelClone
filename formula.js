
// for(let i = 0; i < rows; i++){
//     for(let j = 0; j < cols; j++){
//         let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
//         cell.addEventListener("blur", (e) => {
//             let address = addressBar.value;
//             let [activeCell, cellProp] = getCellAndCellProp(address);
//             let eneteredData = activeCell.innerText;

//             cellProp.value = eneteredData;
//             console.log(cellProp);
//         })
//     }
// }

let formulaBar = document.querySelector(".formula-bar");

/*
Formula Evaluation
    Normal expression -> eg: (10+20)
    Dependency expression -> eg: (A1+A2+10)
*/
formulaBar.addEventListener("keydown" , (e)=> {
    let inputFormula = formulaBar.value;
    if(e.key === "Enter" && formulaBar.value){
        let evaluatedValue = evaluateFormula(inputFormula);
        // To update UI and DB
        setCellUIAndCellProp(evaluatedValue, inputFormula);
    }
})

function evaluateFormula(formula){
    // let decodedFormula = formula;
    formula = formula.replace('(', '');
    formula = formula.replace(')', '');

    let encodedFormula = formula.split(" "); // Assuming formula is havig the space
    console.log(encodedFormula);
    for(let i = 0; i < encodedFormula.length; i++){
        let asciiVal = encodedFormula[i].charCodeAt(0); //["A1", "+", "10"]
        console.log(asciiVal);
        if(asciiVal >= 65 && asciiVal <= 90){
            let [cell, cellProp] = getCellAndCellProp(encodedFormula[i]);
            encodedFormula[i] = cellProp.value;
            // decodedFormula = null;
            console.log("in if");
        }
        console.log("in loop");
    }
    decodedFormula = encodedFormula.join(" ");
    console.log(decodedFormula);
    return eval(decodedFormula);
}

function setCellUIAndCellProp(evaluatedValue, formula){
    let address = addressBar.value; 
    let [cell, cellProp] = getCellAndCellProp(address);

    // UI update
    cell.innerText = evaluatedValue;
    // DB update
    cellProp.value = evaluatedValue;
    cellProp.formula = formula;
}