
var sensorUrl = "https://cors-anywhere.herokuapp.com/https://bmon.analysisnorth.com/api/v1/sensors";
var dustinUrl = "https://cors-anywhere.herokuapp.com/https://bmon.analysisnorth.com/api/v1/readings/dustinhouse_44599003"


fetch(dustinUrl).then((resp) => resp.json()).then(function(result) {
  console.dir(result);
  console.log(JSON.stringify("dustins readings"+result.data.readings[14]));
    })
  .catch(function(error) {
    // If there is any error you will catch them here
  });   


fetch(sensorUrl).then((resp) => resp.json()).then(function(result) {
  console.dir(result);
    })
  .catch(function(error) {
    // If there is any error you will catch them here
  });   
