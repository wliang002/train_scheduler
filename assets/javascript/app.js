/** 
 * Initialize Firebase;
 * Create submit button for adding new trains
 * update html and firebase
 * retrieve new train information from database
 * calculate Next arrival and minutes away */

// Initialize Firebase
var config = {
    apiKey: "AIzaSyAJkXzCTaS2TeydV2EoZABcLpq0sP9nfFI",
    authDomain: "coderbay-5647f.firebaseapp.com",
    databaseURL: "https://coderbay-5647f.firebaseio.com",
    projectId: "coderbay-5647f",
    storageBucket: "coderbay-5647f.appspot.com",
    messagingSenderId: "907896940496"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  // Create submit button for adding new trains
  document.querySelector("#addtrain").addEventListener("click", function(event) {
    event.preventDefault();

    // get user input
    var trainName = document.querySelector("#name").value.trim();
    var destination = document.querySelector("#dest").value.trim();
    var time = moment(document.querySelector("#time").value.trim(), "HH:mm").format("HH:mm");
    var frequency = document.querySelector("#freq").value.trim();

    var newTrain = {
        name: trainName,
        dest: destination,
        time: time,
        freq: frequency
    };

    // store new train info to database
    database.ref().push(newTrain);

    // clear input boxes
    document.querySelector("#name").value = "";
    document.querySelector("#dest").value = "";
    document.querySelector("#time").value = "";
    document.querySelector("#freq").value = "";

  });

  //update html and firebase
  database.ref().on("child_added", function(snapshot) {
    var trainName = snapshot.val().name;
    var destination = snapshot.val().dest;
    var time = snapshot.val().time;
    var frequency = snapshot.val().freq;

    let newTrainInfo = {
        name: trainName,
        dest: destination,
        freq: frequency
    }
    
    var timePast = moment().diff(moment(time, "HH:mm"), "minutes");


    var num = Math.ceil(timePast/frequency); 

    var nextArrive = moment(time, "HH:mm").add(num * frequency, "minutes").format("hh:mm a");
    
    var minAway = Math.abs(moment().diff(moment(nextArrive, "hh:mm a"), "minutes"));
    console.log(minAway);

    newTrainInfo.next = nextArrive;
    newTrainInfo.away = minAway;

    var newRow = document.createElement("tr");
    for (let k of Object.values(newTrainInfo)) {
        let newTd = document.createElement("td");
        newTd.innerText = k;
        newRow.appendChild(newTd);
    }

    document.querySelector("#curr-train > tbody").appendChild(newRow);

  })


