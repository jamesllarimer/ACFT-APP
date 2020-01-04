let app;
let db;
let provider;
let sptInput;
let mdlInput;
let puInput;
let sdcInput;
let ltInput;
let tmrInput;
document.addEventListener('DOMContentLoaded', function () {
  // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
  // // The Firebase SDK is initialized and available here!
  //
  // firebase.auth().onAuthStateChanged(user => { });
  // firebase.database().ref('/path/to/ref').on('value', snapshot => { });
  // firebase.messaging().requestPermission().then(() => { });
  // firebase.storage().ref('/path/to/ref').getDownloadURL().then(() => { });
  //
  // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥

  try {
    initializeApp()
  } catch (e) {
    console.error(e);
  }
});


function initializeApp() {
  app = firebase.app();
  db = app.firestore();
  provider = new firebase.auth.GoogleAuthProvider();
  scoreList = document.getElementById('score-list');
  tableBody = document.querySelector('tbody');
  mdlInput = document.getElementById('MaxDeadLift');
  sptInput = document.getElementById('StandingPowerThrow')
  puInput  = document.getElementById('PushUp');
  sdcInput = document.getElementById('SprintDragCarry');
  ltInput= document.getElementById('LegTuck');
  tmrInput= document.getElementById('TwoMileRun');
  setUpEventListeners();
  getPointsTableData();
  app.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log(user.displayName + "is signed in")
    } else {
      app.auth().signInWithPopup(provider).then(function (result) {

      }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
    }
  });
}

function setUpEventListeners() {

  document.addEventListener("change", (e) => {
   updateScoreUi(e);
  });

  document.getElementById("save").addEventListener("click", () => {
    saveScore();
  });
}


function getValues() {

  let scores = {
    MDL: document.getElementById("MaxDeadLift").value.toString(),
    HRP: document.getElementById("PushUp").value.toString(),
    SPT: document.getElementById("StandingPowerThrow").value.toString(),
    SDC: `${document.getElementById("SprintDragCarryMinutes").value}:${document.getElementById("SprintDragCarrySeconds").value}`,
    LTK: document.getElementById("LegTuck").value.toString(),
    TMR: `${document.getElementById("TwoMileRunMinutes").value}:${document.getElementById("TwoMileRunSeconds").value}`

  }
  return scores;
}

function getTotalScore(){
 let inputs = document.querySelectorAll("select");
 let totalScore = 0;
 inputs.forEach((input) =>{
  totalScore += parseInt(input.value);
 });
 return totalScore;
}

function updateScoreUi(e) {
  if (e) {
   let selectItem = e.target;
   let score = selectItem.value;
   let prev = selectItem.previousSibling.previousSibling;
   let next = selectItem.nextSibling.nextSibling;
   let total = document.getElementById("TotalScore");
   prev.querySelector('.score').textContent = `${score}/100`;
   total.textContent = `${getTotalScore()}/600`;
    let progressBar = next.querySelector('div.progress-bar');
    let outcomeClass = ""
    if (score >= 70) {
      outcomeClass = "bg-dark"
    } else if (score >= 65) {
      outcomeClass = "bg-secondary"
    } else if (score >= 60) {
      outcomeClass = "bg-warning"
    } else {
      outcomeClass = "bg-danger"
    }
    progressBar.classList.remove("bg-dark", "bg-secondary", "bg-warning", "bg-danger")
    progressBar.classList.add(outcomeClass);
    progressBar.style.width = `${score}%`;
  }
}

function saveScore() {

  let maxDeadLiftSelect = document.getElementById("MaxDeadLift");
  let pushUpSelect =  document.getElementById("PushUp");
  let standingPowerThrowSelect = document.getElementById("StandingPowerThrow");
  let sprintDragCarrySelect = document.getElementById("SprintDragCarry");
  let legTuckSelect = document.getElementById("LegTuck");
  let twoMileRunSelect = document.getElementById("TwoMileRun");
   
  db.collection("Scores").add(
    {
      uid: firebase.auth().currentUser.uid,
      userName: firebase.auth().currentUser.displayName,
      createdDate: Date.now(),

      maxDeadLiftRaw: parseInt(maxDeadLiftSelect.options[maxDeadLiftSelect.selectedIndex].text),
      maxDeadLiftScore: parseInt(maxDeadLiftSelect.value),

      pushUpRaw: parseInt(pushUpSelect.options[pushUpSelect.selectedIndex].text),
      pushUpScore: parseInt(pushUpSelect.value),

      standingPowerThrowRaw: parseInt(standingPowerThrowSelect.options[standingPowerThrowSelect.selectedIndex].text),
      standingPowerThrowScore: parseInt(standingPowerThrowSelect.value),

      sprintDragCarryRaw: sprintDragCarrySelect.options[sprintDragCarrySelect.selectedIndex].text,
      sprintDragCarryScore: parseInt(sprintDragCarrySelect.value),
      
      legTuckRaw: parseInt(legTuckSelect.options[legTuckSelect.selectedIndex].text),
      legTuckScore: parseInt(legTuckSelect.value),

      TwoMileRunRaw: twoMileRunSelect.options[twoMileRunSelect.selectedIndex].text,
      TwoMileRunScore: parseInt(twoMileRunSelect.value),    
    }
  )
    .then(function (docRef) {
      console.log("Document written with ID: ", docRef.id);
      document.querySelector('form').reset();
    })
    .catch(function (error) {
      console.error("Error adding document: ", error);
    });
}

 function getPointsTableData() {
  jsonScores.forEach((row) => {
    renderSelects(row);
  });
}

function renderSelects(row) {
  let points =  row.Points;
  if (row.MDL) {
    let option = document.createElement('option');
    option.value = points;
    option.innerText = row.MDL;
    mdlInput.appendChild(option)
  }
  if (row.HRP !== "") {
    let option = document.createElement('option');
    option.value = points;
    option.innerText = row.HRP;
    puInput.appendChild(option)
  }
  if (row.SPT) {
    let option = document.createElement('option');
    option.value = points;
    option.innerText = row.SPT;
    sptInput.appendChild(option)
  }
  if (row.LTK !== "") {
    let option = document.createElement('option');
    option.value = points;
    option.innerText = row.LTK;
    ltInput.appendChild(option)
  }
  if (row.SDC) {
    let option = document.createElement('option');
    option.value = points;
    option.innerText = row.SDC;
    sdcInput.appendChild(option)
  }
  if (row.TMR) {
    let option = document.createElement('option');
    option.value = points;
    option.innerText = row.TMR;
    tmrInput.appendChild(option)
  }
}


let jsonScores = [
  { "Points": 100, "MDL": 340, "SPT": 12.5, "HRP": 60, "SDC": "1:33", "LTK": 20, "TMR": "13:30" }
  , { "Points": 99, "MDL": "", "SPT": 12.4, "HRP": 59, "SDC": "1:36", "LTK": "", "TMR": "13:39" }
  , { "Points": 98, "MDL": "", "SPT": 12.2, "HRP": 58, "SDC": "1:39", "LTK": 19, "TMR": "13:48" }
  , { "Points": 97, "MDL": 330, "SPT": 12.1, "HRP": 57, "SDC": "1:41", "LTK": "", "TMR": "13:57" }
  , { "Points": 96, "MDL": "", "SPT": 11.9, "HRP": 56, "SDC": "1:43", "LTK": 18, "TMR": "14:06" }
  , { "Points": 95, "MDL": "", "SPT": 11.8, "HRP": 55, "SDC": "1:45", "LTK": "", "TMR": "14:15" }
  , { "Points": 94, "MDL": 320, "SPT": 11.6, "HRP": 54, "SDC": "1:46", "LTK": 17, "TMR": "14:24" }
  , { "Points": 93, "MDL": "", "SPT": 11.5, "HRP": 53, "SDC": "1:47", "LTK": "", "TMR": "14:33" }
  , { "Points": 92, "MDL": 310, "SPT": 11.3, "HRP": 52, "SDC": "1:48", "LTK": 16, "TMR": "14:42" }
  , { "Points": 91, "MDL": "", "SPT": 11.2, "HRP": 51, "SDC": "1:49", "LTK": "", "TMR": "14:51" }
  , { "Points": 90, "MDL": 300, "SPT": 11.0, "HRP": 50, "SDC": "1:50", "LTK": 15, "TMR": "15:00" }
  , { "Points": 89, "MDL": "", "SPT": 10.9, "HRP": 49, "SDC": "1:51", "LTK": "", "TMR": "15:09" }
  , { "Points": 88, "MDL": 290, "SPT": 10.7, "HRP": 48, "SDC": "1:52", "LTK": 14, "TMR": "15:18" }
  , { "Points": 87, "MDL": "", "SPT": 10.6, "HRP": 47, "SDC": "1:53", "LTK": "", "TMR": "15:27" }
  , { "Points": 86, "MDL": 280, "SPT": 10.4, "HRP": 46, "SDC": "1:54", "LTK": 13, "TMR": "15:36" }
  , { "Points": 85, "MDL": "", "SPT": 10.3, "HRP": 45, "SDC": "1:55", "LTK": "", "TMR": "15:45" }
  , { "Points": 84, "MDL": 270, "SPT": 10.1, "HRP": 44, "SDC": "1:56", "LTK": 12, "TMR": "15:54" }
  , { "Points": 83, "MDL": "", "SPT": 10.0, "HRP": 43, "SDC": "1:57", "LTK": "", "TMR": "16:03" }
  , { "Points": 82, "MDL": 260, "SPT": 9.8, "HRP": 42, "SDC": "1:58", "LTK": 11, "TMR": "16:12" }
  , { "Points": 81, "MDL": "", "SPT": 9.7, "HRP": 41, "SDC": "1:59", "LTK": "", "TMR": "16:21" }
  , { "Points": 80, "MDL": 250, "SPT": 9.5, "HRP": 40, "SDC": "2:00", "LTK": 10, "TMR": "16:30" }
  , { "Points": 79, "MDL": "", "SPT": 9.4, "HRP": 39, "SDC": "2:01", "LTK": "", "TMR": "16:39" }
  , { "Points": 78, "MDL": 240, "SPT": 9.2, "HRP": 38, "SDC": "2:02", "LTK": 9, "TMR": "16:48" }
  , { "Points": 77, "MDL": "", "SPT": 9.1, "HRP": 37, "SDC": "2:03", "LTK": "", "TMR": "16:57" }
  , { "Points": 76, "MDL": 230, "SPT": 8.9, "HRP": 36, "SDC": "2:04", "LTK": 8, "TMR": "17:06" }
  , { "Points": 75, "MDL": "", "SPT": 8.8, "HRP": 35, "SDC": "2:05", "LTK": "", "TMR": "17:15" }
  , { "Points": 74, "MDL": 220, "SPT": 8.6, "HRP": 34, "SDC": "2:06", "LTK": 7, "TMR": "17:24" }
  , { "Points": 73, "MDL": "", "SPT": 8.5, "HRP": 33, "SDC": "2:07", "LTK": "", "TMR": "17:33" }
  , { "Points": 72, "MDL": 210, "SPT": 8.3, "HRP": 32, "SDC": "2:08", "LTK": 6, "TMR": "17:42" }
  , { "Points": 71, "MDL": "", "SPT": 8.2, "HRP": 31, "SDC": "2:09", "LTK": "", "TMR": "17:51" }
  , { "Points": 70, "MDL": 200, "SPT": 8.0, "HRP": 30, "SDC": "2:10", "LTK": 5, "TMR": "18:00" }
  , { "Points": 69, "MDL": "", "SPT": 7.8, "HRP": 28, "SDC": "2:14", "LTK": "", "TMR": "18:12" }
  , { "Points": 68, "MDL": 190, "SPT": 7.5, "HRP": 26, "SDC": "2:18", "LTK": 4, "TMR": "18:24" }
  , { "Points": 67, "MDL": "", "SPT": 7.1, "HRP": 24, "SDC": "2:22", "LTK": "", "TMR": "18:36" }
  , { "Points": 66, "MDL": "", "SPT": 6.8, "HRP": 22, "SDC": "2:26", "LTK": "", "TMR": "18:48" }
  , { "Points": 65, "MDL": 180, "SPT": 6.5, "HRP": 20, "SDC": "2:30", "LTK": 3, "TMR": "19:00" }
  , { "Points": 64, "MDL": 170, "SPT": 6.2, "HRP": 18, "SDC": "2:35", "LTK": "", "TMR": "19:24" }
  , { "Points": 63, "MDL": 160, "SPT": 5.8, "HRP": 16, "SDC": "2:40", "LTK": "", "TMR": "19:48" }
  , { "Points": 62, "MDL": 150, "SPT": 5.4, "HRP": 14, "SDC": "2:45", "LTK": 2, "TMR": "20:12" }
  , { "Points": 61, "MDL": "", "SPT": 4.9, "HRP": 12, "SDC": "2:50", "LTK": "", "TMR": "20:36" }
  , { "Points": 60, "MDL": 140, "SPT": 4.5, "HRP": 10, "SDC": "3:00", "LTK": 1, "TMR": "21:00" }
  , { "Points": 59, "MDL": "", "SPT": "", "HRP": "", "SDC": "3:01", "LTK": "", "TMR": "21:01" }
  , { "Points": 58, "MDL": "", "SPT": "", "HRP": "", "SDC": "3:02", "LTK": "", "TMR": "21:03" }
  , { "Points": 57, "MDL": "", "SPT": "", "HRP": "", "SDC": "3:03", "LTK": "", "TMR": "21:05" }
  , { "Points": 56, "MDL": "", "SPT": "", "HRP": "", "SDC": "3:04", "LTK": "", "TMR": "21:07" }
  , { "Points": 55, "MDL": "", "SPT": 4.4, "HRP": 9, "SDC": "3:05", "LTK": "", "TMR": "21:09" }
  , { "Points": 54, "MDL": "", "SPT": "", "HRP": "", "SDC": "3:06", "LTK": "", "TMR": "21:10" }
  , { "Points": 53, "MDL": "", "SPT": "", "HRP": "", "SDC": "3:07", "LTK": "", "TMR": "21:12" }
  , { "Points": 52, "MDL": "", "SPT": "", "HRP": "", "SDC": "3:08", "LTK": "", "TMR": "21:14" }
  , { "Points": 51, "MDL": "", "SPT": "", "HRP": "", "SDC": "3:09", "LTK": "", "TMR": "21:16" }
  , { "Points": 50, "MDL": 130, "SPT": 4.3, "HRP": 8, "SDC": "3:10", "LTK": "", "TMR": "21:18" }
  , { "Points": 49, "MDL": "", "SPT": "", "HRP": "", "SDC": "", "LTK": "", "TMR": "21:19" }
  , { "Points": 48, "MDL": "", "SPT": "", "HRP": "", "SDC": "3:11", "LTK": "", "TMR": "21:21" }
  , { "Points": 47, "MDL": "", "SPT": "", "HRP": "", "SDC": "", "LTK": "", "TMR": "21:23" }
  , { "Points": 46, "MDL": "", "SPT": "", "HRP": "", "SDC": "3:12", "LTK": "", "TMR": "21:25" }
  , { "Points": 45, "MDL": "", "SPT": 4.2, "HRP": 7, "SDC": "", "LTK": "", "TMR": "21:27" }
  , { "Points": 44, "MDL": "", "SPT": "", "HRP": "", "SDC": "3:13", "LTK": "", "TMR": "21:28" }
  , { "Points": 43, "MDL": "", "SPT": "", "HRP": "", "SDC": "", "LTK": "", "TMR": "21:30" }
  , { "Points": 42, "MDL": "", "SPT": "", "HRP": "", "SDC": "3:14", "LTK": "", "TMR": "21:32" }
  , { "Points": 41, "MDL": "", "SPT": "", "HRP": "", "SDC": "", "LTK": "", "TMR": "21:34" }
  , { "Points": 40, "MDL": 120, "SPT": 4.1, "HRP": 6, "SDC": "3:15", "LTK": "", "TMR": "21:36" }
  , { "Points": 39, "MDL": "", "SPT": "", "HRP": "", "SDC": "", "LTK": "", "TMR": "21:37" }
  , { "Points": 38, "MDL": "", "SPT": "", "HRP": "", "SDC": "3:16", "LTK": "", "TMR": "21:39" }
  , { "Points": 37, "MDL": "", "SPT": "", "HRP": "", "SDC": "", "LTK": "", "TMR": "21:41" }
  , { "Points": 36, "MDL": "", "SPT": "", "HRP": "", "SDC": "3:17", "LTK": "", "TMR": "21:43" }
  , { "Points": 35, "MDL": "", "SPT": 4.0, "HRP": 5, "SDC": "", "LTK": "", "TMR": "21:45" }
  , { "Points": 34, "MDL": "", "SPT": "", "HRP": "", "SDC": "3:18", "LTK": "", "TMR": "21:46" }
  , { "Points": 33, "MDL": "", "SPT": "", "HRP": "", "SDC": "", "LTK": "", "TMR": "21:48" }
  , { "Points": 32, "MDL": "", "SPT": "", "HRP": "", "SDC": "3:19", "LTK": "", "TMR": "21:50" }
  , { "Points": 31, "MDL": "", "SPT": "", "HRP": "", "SDC": "", "LTK": "", "TMR": "21:52" }
  , { "Points": 30, "MDL": 110, "SPT": 3.9, "HRP": 4, "SDC": "3:20", "LTK": "", "TMR": "21:54" }
  , { "Points": 29, "MDL": "", "SPT": "", "HRP": "", "SDC": "", "LTK": "", "TMR": "21:55" }
  , { "Points": 28, "MDL": "", "SPT": "", "HRP": "", "SDC": "3:21", "LTK": "", "TMR": "21:57" }
  , { "Points": 27, "MDL": "", "SPT": "", "HRP": "", "SDC": "", "LTK": "", "TMR": "21:59" }
  , { "Points": 26, "MDL": "", "SPT": "", "HRP": "", "SDC": "3:22", "LTK": "", "TMR": "22:01" }
  , { "Points": 25, "MDL": "", "SPT": 3.8, "HRP": 3, "SDC": "", "LTK": "", "TMR": "22:03" }
  , { "Points": 24, "MDL": "", "SPT": "", "HRP": "", "SDC": "3:23", "LTK": "", "TMR": "22:04" }
  , { "Points": 23, "MDL": "", "SPT": "", "HRP": "", "SDC": "", "LTK": "", "TMR": "22:06" }
  , { "Points": 22, "MDL": "", "SPT": "", "HRP": "", "SDC": "3:24", "LTK": "", "TMR": "22:08" }
  , { "Points": 21, "MDL": "", "SPT": "", "HRP": "", "SDC": "", "LTK": "", "TMR": "22:10" }
  , { "Points": 20, "MDL": 100, "SPT": 3.7, "HRP": 2, "SDC": "3:25", "LTK": "", "TMR": "22:12" }
  , { "Points": 19, "MDL": "", "SPT": "", "HRP": "", "SDC": "", "LTK": "", "TMR": "22:13" }
  , { "Points": 18, "MDL": "", "SPT": "", "HRP": "", "SDC": "3:26", "LTK": "", "TMR": "22:15" }
  , { "Points": 17, "MDL": "", "SPT": "", "HRP": "", "SDC": "", "LTK": "", "TMR": "22:17" }
  , { "Points": 16, "MDL": "", "SPT": "", "HRP": "", "SDC": "3:27", "LTK": "", "TMR": "22:19" }
  , { "Points": 15, "MDL": "", "SPT": 3.6, "HRP": 1, "SDC": "", "LTK": "", "TMR": "22:21" }
  , { "Points": 14, "MDL": "", "SPT": "", "HRP": "", "SDC": "3:28", "LTK": "", "TMR": "22:22" }
  , { "Points": 13, "MDL": "", "SPT": "", "HRP": "", "SDC": "", "LTK": "", "TMR": "22:24" }
  , { "Points": 12, "MDL": "", "SPT": "", "HRP": "", "SDC": "3:29", "LTK": "", "TMR": "22:26" }
  , { "Points": 11, "MDL": "", "SPT": "", "HRP": "", "SDC": "", "LTK": "", "TMR": "22:28" }
  , { "Points": 10, "MDL": 90, "SPT": 3.5, "HRP": "", "SDC": "3:30", "LTK": "", "TMR": "22:30" }
  , { "Points": 9, "MDL": "", "SPT": "", "HRP": "", "SDC": "", "LTK": "", "TMR": "22:31" }
  , { "Points": 8, "MDL": "", "SPT": "", "HRP": "", "SDC": "3:31", "LTK": "", "TMR": "22:33" }
  , { "Points": 7, "MDL": "", "SPT": "", "HRP": "", "SDC": "", "LTK": "", "TMR": "22:35" }
  , { "Points": 6, "MDL": "", "SPT": "", "HRP": "", "SDC": "3:32", "LTK": "", "TMR": "22:37" }
  , { "Points": 5, "MDL": "", "SPT": 3.4, "HRP": "", "SDC": "", "LTK": "", "TMR": "22:39" }
  , { "Points": 4, "MDL": "", "SPT": "", "HRP": "", "SDC": "3:33", "LTK": "", "TMR": "22:40" }
  , { "Points": 3, "MDL": "", "SPT": "", "HRP": "", "SDC": "", "LTK": "", "TMR": "22:42" }
  , { "Points": 2, "MDL": "", "SPT": "", "HRP": "", "SDC": "3:34", "LTK": "", "TMR": "22:44" }
  , { "Points": 1, "MDL": "", "SPT": "", "HRP": "", "SDC": "", "LTK": "", "TMR": "22:46" }
  , { "Points": 0, "MDL": 80, "SPT": 3.3, "HRP": 0, "SDC": "3:35", "LTK": 0, "TMR": "22:48" }
];
