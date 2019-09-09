import firebase from 'firebase';

    var firebaseConfig = {
        apiKey: "AIzaSyC26xJRxCPtAZhuiFYrCoGLqlnALkaXj_Q",
    authDomain: "plant-app-bd74e.firebaseapp.com",
    databaseURL: "https://plant-app-bd74e.firebaseio.com",
    projectId: "plant-app-bd74e",
    storageBucket: "",
    messagingSenderId: "212441590548",
    appId: "1:212441590548:web:a50e7f4433cc93b7d3b001"
  };
  
  firebase.initializeApp(firebaseConfig);

  export default firebase;
