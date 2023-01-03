// Store API endpoint as url.
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


// create base map 
var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 4,
  });

// add tile layer 
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);

// create function for color conditionals
function chooseColor(coordinates) {

    if(coordinates > 90) return '#F91206'
    else if(coordinates > 70) return '#F95B06'
    else if(coordinates > 50) return '#F9A406'
    else if(coordinates > 30) return '#F9D106'
    else if(coordinates > 10) return '#D4F906'
    else if(coordinates > -10) return '#74F906'
    else return '#06F95B'
}

// create function for size conditionals 
function markerSize(mag) {
    return Math.sqrt(mag) * 10;
  };

// perfrom GET request to earthquake data 
d3.json(url).then(function(data) {

    L.geoJson(data, {

        // passing in mapStyle for styling
        pointToLayer: function (feature, latlng) {

            // style each feature based on conditionals above
            return L.circleMarker(latlng, {
            color: chooseColor(feature.geometry.coordinates[2]),
            fillColor: chooseColor(feature.geometry.coordinates[2]),
            fillOpacity:1,
            weight: 2,
            radius: markerSize(feature.properties.mag)
            })  
        },

// Give each feature a popup that describes the earthquake.
        onEachFeature: function(feature,layer) {
            // add popup for borough and neighborhood
            layer.bindPopup(`<h2>${feature.properties.place}</h2><hr>
            <h3>Magnitude: ${feature.properties.mag}, Depth: ${feature.geometry.coordinates[2]} </h3><hr>
            <p>${new Date(feature.properties.time)}</p>`).addTo(myMap)
        }
    })
});

// create legend
var legend = L.control({ 
    position: 'bottomright' 
  });

// function to add legend info
legend.onAdd = function () {

    var div = L.DomUtil.create('div', 'info legend');

    // create magnitude scale
    var scale = [-10, 10, 30, 50, 70, 90];

    // create corresponding color scale 
    var colors = ['#74F906', '#D4F906','#F9D106', '#F9A406', '#F95B06', '#F91206'];

    // for loop to match scale and colors 
    for (var i = 0; i < scale.length; i++) {

        div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
        + scale[i] + (scale[i + 1] ? "&ndash;" + scale[i + 1] + "<br>" : "+");
    }

    return div;
  };

//   add legend to map 
  legend.addTo(myMap);
