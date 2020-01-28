document.addEventListener('DOMContentLoaded', function () {  
    try {
      getPointsTableData()
    } catch (e) {
      console.error(e);
    }
  });
 function getPointsTableData() {
  fetch('../Scripts/JSON/ACFT.json')
  .then(response => response.json())
  .then(data => {
    data.forEach((row) => {
      renderTable(row);
    });
  });
}
function renderTable(row) {
  let tableBody = document.querySelector('tbody');
  let tableRow = document.createElement('tr');
  if(row.Points == 60){
    tableRow.classList.add("bg-warning", "text-light")
  }
  if(row.Points == 65){
    tableRow.classList.add("bg-secondary", "text-light")
  }
  if(row.Points == 70){
    tableRow.classList.add("bg-dark", "text-light")
  }
  tableRow.innerHTML =
    `<th scope="row">${row.Points}</th>
        <td>${row.MDL || "--"}</td>
        <td>${row.SPT || "--"}</td>
        <td>${(row.HRP === 0) ?  0 : row.HRP || "--"}</td>
        <td>${row.SDC || "--"}</td>
        <td>${(row.LTK === 0) ?  0 : row.LTK || "--"}</td>
        <td>${row.TMR || "--"}</td>`;
  tableBody.appendChild(tableRow);
}
