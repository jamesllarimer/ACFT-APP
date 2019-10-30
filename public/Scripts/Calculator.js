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

// function parseCsv(){
//     const input = document.querySelector("input[type=file]");
//           readCSv(input.value);

// }
function initializeApp(){
  app       = firebase.app();
  db        = app.firestore();
  provider  = new firebase.auth.GoogleAuthProvider();

  app.auth().signInWithPopup(provider).then(function(result) {
  console.log(result);
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

 document.querySelector("button").addEventListener("click", (e)=>{
   e.preventDefault();
   getValues();
 });
}

function loadUserValues(user){

  db.collection("scores").where('uid' ,'==', user).orderBy('createdDate', 'desc')
  .onSnapshot(function(querySnapshot) {
      scoreList.innerHTML = '';
      querySnapshot.forEach(function(doc) {
          renderScores(doc.data())
      });
  });
}

function getValues(){
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