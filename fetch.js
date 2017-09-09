
var ALL_SENSORS_URL = 'https://cors-anywhere.herokuapp.com/https://bmon.analysisnorth.com/api/v1/sensors/'
var SENSOR_DATA_URL = 'https://cors-anywhere.herokuapp.com/https://bmon.analysisnorth.com/api/v1/readings/'


async function getAllSensors() {
  let response = await fetch(ALL_SENSORS_URL)
  let json = await response.json()
  return json.data.sensors
}

async function getSensorNameForId(sensor_id) {
  let sensors = await getAllSensors()
  window.sensors = sensors
  let sensor = sensors.find(sensor => {
    return sensor.sensor_id.endsWith('_' + sensor_id)
  })
  return sensor.sensor_id
}

async function getDataForSensor(sensor_id) {
  let sensor_name = await getSensorNameForId(sensor_id)
  let response = await fetch(SENSOR_DATA_URL + sensor_name)
  let json = await response.json()
  return json.data
}
