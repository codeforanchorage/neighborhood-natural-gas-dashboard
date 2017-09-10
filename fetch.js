/**
 * gas per ccf is about $0.96
 *
 *
 * nice to have:
 * map zooming when a house if found
 * loading progress indicator for neighborhood data
 */
var ALL_SENSORS_URL = 'https://cors-anywhere.herokuapp.com/https://bmon.analysisnorth.com/api/v1/sensors/'
var SENSOR_DATA_URL = 'https://cors-anywhere.herokuapp.com/https://bmon.analysisnorth.com/api/v1/readings/'
var AGE_LIMIT = 7 // record age in days


function buildSensorUrl(sensor_name, averaging) {
    let sd = new Date()
    sd.setDate(sd.getDate() - 7)
    let start_date_string = sd.toISOString().split('T')[0]

    return `${SENSOR_DATA_URL}${sensor_name}?averaging=${averaging}&start_ts=${start_date_string}`
}


// gets a list of all sensors
async function getAllSensors() {
    if (window.ALL_SENSORS_CACHE) {
        return Promise.resolve(ALL_SENSORS_CACHE.data.sensors)
    }

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
    let response = await fetch(buildSensorUrl(sensor_name, '1D'))
    let json = await response.json()
    return json.data
}


// takes the full name (like "joehouse_2345")
async function getDataForSensorName(sensor_name) {
    let response = await fetch(buildSensorUrl(sensor_name, '1D'))
    let json = await response.json()
    return json.data
}

// takes the full name (like "joehouse_2345")
async function getDailyDataForSensorId(sensor_id) {
    let sensor_name = await getSensorNameForId(sensor_id)


    let sd = new Date()
    sd.setDate(sd.getDate() - 2)
    let start_date_string = sd.toISOString().split('T')[0]

    let url = `${SENSOR_DATA_URL}${sensor_name}?&start_ts=${start_date_string}`

    let response = await fetch(url)
    let json = await response.json()
    return json.data
}


// takes the number from the gas meter, returns all data for the neighborhood
async function getDataForNeighborhood(sensor_id) {
    let all_sensors = await getAllSensors()
    let sensor_name = all_sensors
        .find(sensor => {
            return sensor.sensor_id && sensor.sensor_id.endsWith('_' + sensor_id)
        })
        .sensor_id

    let sensor_prefix = sensor_name.split('_' + sensor_id)[0]

    let regex = new RegExp(`${sensor_prefix}_\\d\\d\\d\\d\\d\\d\\d\\d$`)
    let neighborhood_sensors = all_sensors.filter(sensor => regex.test(sensor.sensor_id))

    let promise_array = neighborhood_sensors.map(sensor => getDataForSensorName(sensor.sensor_id))

    return Promise.all(promise_array)
}
