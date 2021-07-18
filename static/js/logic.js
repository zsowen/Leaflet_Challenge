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

const baseMaps = {
    "Street Map": streets,
    "Outdoor Map": outdoors,
    "Satellite Map": satellite
};

const earthquake = new L.LayerGroup();
const tectonicplates = new L.LayerGroup();

const overlayMaps = {
    "Earthquake": earthquake,
    "Tectonic Plates": tectonicplates
};

const myMap = L.map("map", {
    center: [15.994, -28.6731],
    zoom: 3,
    layers: [satellite, earthquake, tectonicplates]
});

L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson").then(function (data) {
    
    function getRadius(magnitude) {
        return Math.sqrt(magnitude) * 6;
    }

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


    L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },

        style: getStyle,

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
    }).addTo(earthquake)
});