
var ALL_SENSORS_URL = 'https://cors-anywhere.herokuapp.com/https://bmon.analysisnorth.com/api/v1/sensors/'
var SENSOR_DATA_URL = 'https://cors-anywhere.herokuapp.com/https://bmon.analysisnorth.com/api/v1/readings/'
var AGE_LIMIT = 7 // record age in days
var start_date = new Date()
start_date.setDate(start_date.getDate() - 7)


async function getAllSensors() {
  let response = await fetch(ALL_SENSORS_URL)
  let json = await response.json()
  return json.data.sensors
}

// takes the number from the gas meter
async function getSensorNameForId(sensor_id) {
  let sensors = await getAllSensors()
  let sensor = sensors.find(sensor => {
    return sensor.sensor_id.endsWith('_' + sensor_id)
  })
  return sensor.sensor_id
}

// takes the numeric id
async function getDataForSensorId(sensor_id) {
  let sensor_name = await getSensorNameForId(sensor_id)
  let response = await fetch(SENSOR_DATA_URL + sensor_name)
  let json = await response.json()
  return json.data
}

// takes the full name (like "joehouse_2345")
async function getDataForSensorName(sensor_name) {
    let response = await fetch(SENSOR_DATA_URL + sensor_name)
    let json = await response.json()
    return json.data
  }

// takes the number from the gas meter, returns all data for the neighborhood
async function getDataForNeighborhood(sensor_id) {
  let sensor_name = await getSensorNameForId(sensor_id)
  let sensor_prefix = sensor_name.split('_' + sensor_id)[0]

  let all_sensors = await getAllSensors()

  let regex = new RegExp(`${sensor_prefix}_\\d\\d\\d\\d\\d\\d\\d\\d$`)
  let neighborhood_sensors = all_sensors.filter(sensor => regex.test(sensor.sensor_id))

  let promise_array = neighborhood_sensors.map(sensor => getDataForSensorName(sensor.sensor_id))

  return Promise.all(promise_array)
}
