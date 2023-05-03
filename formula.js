for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
    let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
    cell.addEventListener("blur", (e) => {
      let address = addressBar.value;
      let [activeCell, cellProp] = getCellAndCellProp(address);
      let eneteredData = activeCell.innerText;
      if (eneteredData === cellProp.value) return;
      cellProp.value = eneteredData;
      //if data modifies remove P-c relation, formula empty, update children with new hardcoded (modified) value
      removeChildFromParent(cellProp.formula);
      cellProp.formula = "";
      updateChldrenCells(address);
      //   console.log(cellProp);
    });
  }
}

let formulaBar = document.querySelector(".formula-bar");
/*
Formula Evaluation
    Normal expression -> eg: (10+20)
    Dependency expression -> eg: (A1+A2+10)
*/
formulaBar.addEventListener("keydown", async (e) => {
  let inputFormula = formulaBar.value;
  if (e.key === "Enter" && formulaBar.value) {
    // let evaluatedValue = evaluateFormula(inputFormula);

    //if change in formula break old parent-child relation and evaluate new formula, add new p-c relation
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);
    if (inputFormula !== cellProp.formula)
      removeChildFromParent(cellProp.formula);

    addChildToGraphComponent(inputFormula, address);

    // check formula is cyclic or not, then only evaluate
    // True : Cycle, False: Not cyclic
    let cycleResponse = isGraphCyclic(graphComponentMatrix);
    if (cycleResponse) {
      // alert("Your formula detected a cycle");
      let response = confirm(
        "Your formula is cyclic. Do you want to trace your path?"
      );

      while (response === true) {
        // Keep on tracking color until user is satisfied
        await isGraphCyclicTracePath(graphComponentMatrix, cycleResponse); // I want to complete full iteration of color tracking, so I will attach wait here also.
        response = confirm(
          "Your formula is cyclic. Do you want to trace your path?"
        );
      }
      removeChildFromGraphComponent(inputFormula, address);
      return;
    }

    let evaluatedValue = evaluateFormula(inputFormula);

    // To update UI and DB
    setCellUIAndCellProp(evaluatedValue, inputFormula, address);
    addChildToParent(inputFormula);
    updateChldrenCells(address);
  }
});

function addChildToGraphComponent(formula, childAddress) {
  let [crid, ccid] = decodeRIDCIDFromAddress(childAddress);
  let encodedFormula = formula.split(" ");
  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiVal = encodedFormula[i].charCodeAt(0); //["A1", "+", "10"]
    if (asciiVal >= 65 && asciiVal <= 90) {
      let [prid, pcid] = decodeRIDCIDFromAddress(encodedFormula[i]);
      graphComponentMatrix[prid][pcid].push([crid, ccid]);
    }
  }
}

function removeChildFromGraphComponent(inputFormula, address) {
  let childAddress = addressBar.value;
  let encodedFormula = inputFormula.split(" ");
  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiVal = encodedFormula[i].charCodeAt(0); //["A1", "+", "10"]
    if (asciiVal >= 65 && asciiVal <= 90) {
      let [prid, pcid] = decodeRIDCIDFromAddress(encodedFormula[i]);
      graphComponentMatrix[prid][pcid].pop();
    }
  }
}

function updateChldrenCells(parentAddress) {
  let [parentCell, parentCellProp] = getCellAndCellProp(parentAddress);
  let children = parentCellProp.children;

  for (let i = 0; i < children.length; i++) {
    let childAddress = children[i];
    let [childCell, childCellProp] = getCellAndCellProp(childAddress);
    let childFormula = childCellProp.formula;

    let evaluatedValue = evaluateFormula(childFormula);
    setCellUIAndCellProp(evaluatedValue, childFormula, childAddress);
    updateChldrenCells(childAddress);
  }
}

function addChildToParent(formula) {
  let childAddress = addressBar.value;
  let encodedFormula = formula.split(" ");
  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiVal = encodedFormula[i].charCodeAt(0); //["A1", "+", "10"]
    if (asciiVal >= 65 && asciiVal <= 90) {
      let [parentCell, parentCellProp] = getCellAndCellProp(encodedFormula[i]);
      parentCellProp.children.push(childAddress);
    }
  }
}

function removeChildFromParent(formula) {
  let childAddress = addressBar.value;
  let encodedFormula = formula.split(" ");
  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiVal = encodedFormula[i].charCodeAt(0); //["A1", "+", "10"]
    if (asciiVal >= 65 && asciiVal <= 90) {
      let [parentCell, parentCellProp] = getCellAndCellProp(encodedFormula[i]);
      let idx = parentCellProp.children.indexOf(childAddress);
      parentCellProp.children.splice(idx, 1);
    }
  }
}

function evaluateFormula(formula) {
  // let decodedFormula = formula;
  formula = formula.replace("(", "");
  formula = formula.replace(")", "");

  let encodedFormula = formula.split(" "); // Assuming formula is having the space
  console.log(encodedFormula);
  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiVal = encodedFormula[i].charCodeAt(0); //["A1", "+", "10"]
    console.log(asciiVal);
    if (asciiVal >= 65 && asciiVal <= 90) {
      let [cell, cellProp] = getCellAndCellProp(encodedFormula[i]);
      encodedFormula[i] = cellProp.value;
      // decodedFormula = null;
      // console.log("in if");
    }
    // console.log("in loop");
  }
  decodedFormula = encodedFormula.join(" ");
  console.log(decodedFormula);
  return eval(decodedFormula);
}

function setCellUIAndCellProp(evaluatedValue, formula, address) {
  //   let address = addressBar.value;
  let [cell, cellProp] = getCellAndCellProp(address);

  // UI update
  cell.innerText = evaluatedValue;
  // DB update
  cellProp.value = evaluatedValue;
  cellProp.formula = formula;
}

//https://youtu.be/vEZ87sRmz30?t=2978
