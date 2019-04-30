$(document).ready(function(){
 var config = {
    apiKey: "AIzaSyBvlsZf0znYTULj6Pd0_noxLNI09E1edME",
    authDomain: "train-scheduler-c88f4.firebaseapp.com",
    databaseURL: "https://train-scheduler-c88f4.firebaseio.com",
    projectId: "train-scheduler-c88f4",
    storageBucket: "train-scheduler-c88f4.appspot.com",
    messagingSenderId: "179492217409"
  };
  firebase.initializeApp(config);

 // // Create a variable to reference the database.
 var database = firebase.database();





 // Global Variables
 var trainName;
 var destination;
 var firstTrain;
 var frequency = 0;

//  //Function numbersOnly for Frequency Input
  var input = document.getElementById("frequency-input");
  input.onkeydown = function (e) {
     var k = e.which;
     /* numeric inputs can come from the keypad or the numeric row at the top */
      if ( (k < 48 || k > 57) && (k < 96 || k > 105)) {
      e.preventDefault();
      return false;
      } //if ( (k < 48 || k > 57) && (k < 96 || k > 105)) 


  } //input.onkeydown = function (e)

  

 //Current Time
 var currentTime = moment();
 console.log("current time: " + moment(currentTime).format ("hh:mm a"));
 $("#timer").text(currentTime.format("hh:mm a"));



 // Capture Button Click
  $(document).on("click", "#submit", function (event) {
     event.preventDefault();


   // Grabs values from text boxes
     var trainName = $("#train-name-input").val().trim();
     var destination = $("#destination-input").val().trim();
     var frequency = $("#frequency-input").val().trim();
     var firstTrain =$("#first-train-input").val().trim();


    console.log(trainName)
    console.log(destination)
    console.log(frequency + "minutes")
    

    
   //Push to Firebase Database
   database.ref().push({
  
    trainName: trainName,
    destination: destination,
    frequency: frequency,
    firstTrain: firstTrain,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  
    }); //database.ref().push
  
    $("form")[0].reset();


 });//$(document).on("click", "#submit", function (event) {
    
    
 
   

    


 // Create Firebase event for adding Train to the database and a row in the html when a user adds an entry
 database.ref().on("child_added", function(childSnapshot) { 
       console.log(childSnapshot.val());





   
   

   
   var minAway;
   // Change year so first train comes before now
   var firstTrainNew = moment(childSnapshot.val().firstTrain, "hh:mm").subtract(1, "years");
   // Difference between the current and firstTrain
   var diffTime = moment().diff(moment(firstTrainNew), "minutes");
   var remainder = diffTime % childSnapshot.val().frequency;
   // Minutes until next train
   var minAway = childSnapshot.val().frequency - remainder;
   // Next train time
   var nextTrain = moment().add(minAway, "minutes");
   nextTrain = moment(nextTrain).format("hh:mm");
   
   console.log("minutes away"+remainder);
   console.log("next train" + nextTrain);

     var trainName = childSnapshot.val().trainName;
     var destination = childSnapshot.val().destination;
     var frequency = childSnapshot.val().frequency;
     


  



      // Create the new row
      var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(destination),
        $("<td>").text(frequency),
        $("<td>").text(nextTrain),
        $("<td>").text(minAway),
     );


  // Append the new row to the table
  $("#train-schedule-table > tbody").append(newRow);
   


 });//database.ref().on("child_added", function(childSnapshot)


}); //(document).ready(function()

