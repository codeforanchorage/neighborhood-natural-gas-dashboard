var mainGoogleMap;

function myMap() {

    // let centerLatLong = new google.maps.LatLng(61.1181, -149.756667); // Defualt center hardcoded to Mitchell House
    let centerLatLong = new google.maps.LatLng(61.166492, -149.872976)

    let mapProp= {
        center:centerLatLong,
        zoom:10,
    };

    let map=new google.maps.Map(document.getElementById("googleMap"),mapProp);

    mainGoogleMap = map;

    // let myCity = new google.maps.Circle({
    //     center:centerLatLong,
    //     radius:2000,
    //     strokeColor:"#0000FF",
    //     strokeOpacity:0.8,
    //     strokeWeight:2,
    //     fillColor:"#0000FF",
    //     fillOpacity:0.4
    // });
    // myCity.setMap(map);

    PlotSensorData();

}

function BuildingEnergyMapPoint (buildingId, gMapMarker, buildingData) {
    this.buildingId = buildingId;
    this.gMapMarker = gMapMarker; // google.maps.Marker
    this.buildingData = buildingData;
}

let allMapPoints; // array of BuildingEnergyMapPoint

async function PlotSensorData() {

    console.log("Testing parsing data...");

    allMapPoints = new Array();

    try {
        let data = await getAllSensors()

        // filter for just gas meters
        data = data.filter(sensor => /.+_\d\d\d\d\d\d\d\d$/.test(sensor.sensor_id))

        let map = this.mainGoogleMap;

        for (let dataCount = 0; dataCount < data.length; dataCount++) {
            // console.log("Data is: " + data[dataCount].buildings[0].name);

            let sensorData = data[dataCount];

            let buildingsData = sensorData.buildings;

            for (let buildingCount = 0; buildingCount < buildingsData.length; buildingsData++) {
                let building = buildingsData[buildingCount];

                let buildingId = building.bldg_id;

                let newMapPointObj = null;

                for (let i = 0; i < allMapPoints.length; i++) {
                    if (allMapPoints[i].buildingId == buildingId) {
                        newMapPointObj = allMapPoints[i];
                    }
                }

                if (newMapPointObj == null) {
                    let buildingPos = new google.maps.LatLng(building.latitude, building.longitude);

                    // console.log("Data is: " + building.name + " id: " + building.bldg_id + " lat: " + building.latitude + " long: " + building.longitude);

                    let sensorRadiusCircle = new google.maps.Circle({
                        center:buildingPos,
                        radius:500,
                        strokeColor:"#0000FF",
                        strokeOpacity:0.5,
                        strokeWeight:2,
                        fillColor:"#0000FF",
                        fillOpacity:0.2,
                        map:map
                    });
                    sensorRadiusCircle.setMap(map);

                    let marker = new google.maps.Marker(
                        {
                            position: buildingPos
                            // ,animation:google.maps.Animation.BOUNCE
                        }
                    );

                    marker.setMap(mainGoogleMap);

                    newMapPointObj = new BuildingEnergyMapPoint(buildingId, marker, building);
                    allMapPoints.push(newMapPointObj);

                    google.maps.event.addListener(marker, 'click', function() {
                        console.log("Did click building id: " + newMapPointObj.buildingData.bldg_id);

                        let infowindow = new google.maps.InfoWindow({
                            // content:("<b>" + newMapPointObj.buildingData.name + "</b><br><h2><i>Hi!</i></h2><div style=\"width:400px;height:100px;\"></div>")
                            content:("<b>" + newMapPointObj.buildingData.name + "</b><br>Sensors: " + newMapPointObj.sensors.length)
                        });

                        infowindow.open(map,marker);

                        // ZoomMapInOnBuildingId(building.bldg_id);
                    });
                }

                if (newMapPointObj.sensors == null) {
                    newMapPointObj.sensors = new Array();
                }

                newMapPointObj.sensors.push(sensorData);

            }
        }
    }
    catch (err) {
        console.log(err)
    }
}

function ZoomMapInOnBuildingId(buildingId) {
    let buildingMapPoint = null;

    for (let i = 0; i < allMapPoints.length; i++) {
        if (allMapPoints[i].buildingId == buildingId) {
            // newMapPointObj = allMapPoints[i];
            buildingMapPoint = allMapPoints[i];
        }
    }

    if (buildingMapPoint != null) {
        let map = this.mainGoogleMap;

        let marker = buildingMapPoint.marker;

        var pos = new google.maps.LatLng(buildingMapPoint.buildingData.latitude, buildingMapPoint.buildingData.longitude);
        map.setZoom(13);
        map.setCenter(pos);
        // window.setTimeout(function() {map.setZoom(pos);},3000);
    }
    else {
        console.log("Didn't find a building with id: " + buildingId);
    }
}
