//Crete different tile layers needed for this site
const streets = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
});

const outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/outdoors-v11",
  accessToken: API_KEY
});

const satellite = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/satellite-v9",
  accessToken: API_KEY
});

//Set your different base maps as a variable for use later
const baseMaps = {
    "Street Map": streets,
    "Outdoor Map": outdoors,
    "Satellite Map": satellite
};

//Create two new layergroups for earthquake data points and tectonic plates drawing
const earthquake = new L.LayerGroup();
const tectonicplates = new L.LayerGroup();

const overlayMaps = {
    "Earthquake": earthquake,
    "Tectonic Plates": tectonicplates
};

//Create the initial map object and give it initial layers to load
const myMap = L.map("map", {
    center: [15.994, -28.6731],
    zoom: 3,
    layers: [satellite, earthquake, tectonicplates]
});

//Add the layer control panel, and set it to collapsed:false so it is always visibile to the viewer
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);


//Write in the data from the website
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson").then(function (data) {
    
    //Create a function to calculate the Circle Marker radius using the magnitude data
    function getRadius(magnitude) {
        return Math.sqrt(magnitude) * 6;
    }

    //Create a function to define the colors of the individual circles by depth
    function getColor(depth) {
        switch (true) {
            case depth > 90:
                return "#253494";
            case depth > 70:
                return "#2c7fb8";
            case depth > 50:
                return "#41b6c4";
            case depth > 30:
                return "#7fcdbb";
            case depth > 10:
                return "#c7e9b4";
            default:
                return "#ffffcc";
        }
    }

    //Create a function to set the style of the Circle Markers including running the previous two functions to define color and radius
    function getStyle(features) {
        return {
            fillColor: getColor(features.geometry.coordinates[2]),
            color: "dark blue",
            radius: getRadius(features.properties.mag),
            weight: 0.5,
            stroke: true,
            opacity: 0.9,
            fillOpacity: 0.7
        };
    }

    //Create the Circle Marker Group
    L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },

        //Set the Group Style
        style: getStyle,

        //Set the Popups that will detail each earthquake's data
        onEachFeature: function (features, layer) {
            layer.bindPopup(
                "Location: "
                + features.properties.place
                + "<br> Time: "
                + Date(features.properties.time)
                + "<br> Magnitude: "
                + features.properties.mag
                + "<br> Depth: "
                + features.geometry.coordinates[2]
            );
        }
    //Add the Circle Markers to the earthquake layer group
    }).addTo(earthquake)
});

//Pull in the Tectonic Plate data and add it to the tectonic plate layer group
d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function (plateData) {
    L.geoJSON(plateData, {
        color: "purple",
        weight: 1.5
    }).addTo(tectonicplates);
});


var legend = L.control({position: 'bottomleft'});

legend.onAdd = function () {
    var div = L.DomUtil.create('div', 'info legend');
    var grades = [0, 10, 30, 50, 70, 90];
    var colors = [
        "#ffffcc",
        "#c7e9b4",
        "#7fcdbb",
        "#41b6c4",
        "#2c7fb8",
        "#253494"
        ];

    for (var i = 0; i <grades.length; i++) {
        div.innerHTML +=
            '<i style="background:'
            + colors[i]
            + '"></i> '
            + grades[i]
            + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
}

legend.addTo(myMap)