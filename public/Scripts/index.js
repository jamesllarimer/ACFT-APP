let app;
let db;
let provider;
let scoreList;
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

  setUpEventListeners();
  app.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log(user.userName + "is signed in")
      loadUserValues(app.auth().currentUser.uid);
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

}
function loadUserValues(user) {

  db.collection("Scores").where('uid', '==', user).orderBy('createdDate', 'desc').limit(1)
    .onSnapshot(function (querySnapshot) {
      scoreList.innerHTML = '';
      querySnapshot.forEach(function (doc) {
        renderScores(doc.data())
      });
    });
}



function renderScores(result) {
  let ul = document.createElement('ul');
  let userHeader = document.createElement('h2');
  let createdDateLI = document.createElement('li');
  let maxDeadLiftValueLi = document.createElement('li');
  let pushUpValueLi = document.createElement('li');
  let sprintDragCarryLi = document.createElement('li');
  let legTuckLi = document.createElement('li');
  let TwoMileRunLi = document.createElement('li');

  userHeader.textContent = "Your most recent score";
  createdDateLI.textContent = Date(result.createdDate).toString();
  maxDeadLiftValueLi.textContent = result.maxDeadLiftScore;
  pushUpValueLi.textContent = result.pushUpScore;
  sprintDragCarryLi.textContent = result.sprintDragCarryScore;
  legTuckLi.textContent = result.legTuckScore;
  TwoMileRunLi.textContent = result.TwoMileRunScore;

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


