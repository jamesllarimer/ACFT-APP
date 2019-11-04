let app;
let db;
let provider;
const scoreList = document.querySelector('#score-list')
document.addEventListener('DOMContentLoaded', function() {
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
function initializeApp(){
  app       = firebase.app();
  db        = app.firestore();
  provider  = new firebase.auth.GoogleAuthProvider();

  app.auth().signInWithPopup(provider).then(function(result) {
 
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  }); 

  app.auth().onAuthStateChanged(function(user) {
    if (user) {
        loadUserValues(app.auth().currentUser.uid); 
    } else {
      // No user is signed in.
    }
  });

 document.querySelector("form").addEventListener("submit", (e)=>{
   e.preventDefault();
   calculateScore();
 });

 document.getElementById("save").addEventListener("click", ()=>{
  saveScore();
});
}

function loadUserValues(user){

  db.collection("scores").where('uid' ,'==', user).orderBy('createdDate', 'desc').limit(1)
  .onSnapshot(function(querySnapshot) {
      scoreList.innerHTML = '';
      querySnapshot.forEach(function(doc) {
          renderScores(doc.data())
      });
  });
}

function getValues(){

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

function renderScores(result){
    let ul                  = document.createElement('ul');
    let userHeader          = document.createElement('h2');
    let createdDateLI       = document.createElement('li');
    let maxDeadLiftValueLi  = document.createElement('li');
    let pushUpValueLi       = document.createElement('li');     
    let sprintDragCarryLi   = document.createElement('li');    
    let legTuckLi           = document.createElement('li');
    let TwoMileRunLi        = document.createElement('li');

    userHeader.textContent          = result.userName || result.uid;                        
    createdDateLI.textContent       = Date(result.createdDate).toString();  
    maxDeadLiftValueLi.textContent  = result.maxDeadLiftValue;
    pushUpValueLi.textContent       = result.pushUpValue;
    sprintDragCarryLi.textContent   = result.sprintDragCarryMinutes + ":" + result.sprintDragCarrySeconds;
    legTuckLi.textContent           = result.legTuck;
    TwoMileRunLi.textContent        = result.TwoMileRunMinutes + ":" + result.TwoMileRunSeconds;

    ul.appendChild(createdDateLI);
    ul.appendChild(maxDeadLiftValueLi);
    ul.appendChild(pushUpValueLi);
    ul.appendChild(sprintDragCarryLi);
    ul.appendChild(legTuckLi);
    ul.appendChild(TwoMileRunLi);
    scoreList.appendChild(userHeader)
    scoreList.appendChild(ul)
    scoreList.classList.add('user-results');
}

function calculateScore(){
  let rawScores = getValues();
  for (let [key, value] of Object.entries(rawScores)) {
    db.collection("Points").where(key ,'==', value)
    .onSnapshot(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
       updateScoreUi(key, doc.data().Points);
       });
    });
  }
}

function updateScoreUi(key, value){
  if(key && value){
    console.log(key);
    document.getElementById(key).querySelector("div.score").textContent = `${value}/100`;
    let progressBar = document.getElementById(key).querySelector('div.progress').querySelector('div.progress-bar');
    let outcomeClassList = ["bg-dark", "bg-secondary", "bg-warning", "bg-danger"]
    let outcomeClass = ""
    if(value >=70){
      outcomeClass = "bg-dark"
    }else if(value >=65){
      outcomeClass = "bg-secondary"
    }else if(value >=60){
      outcomeClass = "bg-warning"
    }else{
      outcomeClass = "bg-danger"
    }
    progressBar.classList.remove(outcomeClassList)
    progressBar.classList.add(outcomeClass);
    progressBar.style.width = `${value}%`;
  }
}

function saveScore(){
  db.collection("scores").add(
    {
        uid:                       firebase.auth().currentUser.uid,
        userName:                  firebase.auth().currentUser.displayName,
        createdDate:               Date.now(),
        maxDeadLiftValue:          document.getElementById("MaxDeadLift").value,
        pushUpValue:               document.getElementById("PushUp").value,
        standingPowerThrow:        document.getElementById("StandingPowerThrow").value,
        sprintDragCarryMinutes:    document.getElementById("SprintDragCarryMinutes").value,
        sprintDragCarrySeconds:    document.getElementById("SprintDragCarrySeconds").value,
        legTuck:                   document.getElementById("LegTuck").value,
        TwoMileRunMinutes:         document.getElementById("TwoMileRunMinutes").value,
        TwoMileRunSeconds:         document.getElementById("TwoMileRunSeconds").value
    }
    )
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
        document.querySelector('form').reset();
    })
    .catch(function(error) {
    console.error("Error adding document: ", error);
    });
}
