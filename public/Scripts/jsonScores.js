function getJsonScores(){
    let requestURL = "./ex"
    var request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();
    request.onload = function() {
        var superHeroes = request.response;
        populateHeader(superHeroes);
        showHeroes(superHeroes);
      }
}

function renderTable(row){
  let tableRow =  document.createElement('tr');
      tableRow.innerHTML = 
      `<th scope="row">${row.Points}</th>
        <td>${row.MDL}</td>
        <td>${row.SPT}</td>
        <td>${row.SDC}</td>
        <td>${row.LTK}</td>
        <td>${row.TMR}</td>`;
tableBody.appendChild(tableRow);
}


function getPointsTableData(){
  const response = await fetch('../JSON/ACFT.json');
  const myJson = await response.json();
  console.log(JSON.stringify(myJson));
  
}

document.getElementById("save").addEventListener("click", ()=>{
  saveScore();
});