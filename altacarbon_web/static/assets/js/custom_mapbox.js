/* */
/* Script for create a mapbox map, populating with layers (tilesets), and handling interactions on one page
/* */


mapboxgl.accessToken = 'pk.eyJ1IjoiYnJhbmRvbi1mbGFubmVyeS1hbHRhY2FyYm9uIiwiYSI6ImNsZGM3d2drYTA0cTIzd3FobzNvMWd3OWkifQ.nnbxgTCzpRCPG0_VQcpn3A';


// mapboxgl.accessToken = 'sk.eyJ1IjoiYnJhbmRvbi1mbGFubmVyeS1hbHRhY2FyYm9uIiwiYSI6ImNsZGNjOGgwYjA1emUzcHFoOGR0a2E0Z24ifQ.5jaXWiU5nGsyfLpunBhjfA';



const nameDisplay = document.getElementById('nameDisplay');
const abbrevDisplay = document.getElementById('abbrevDisplay');
const lastcensusDisplay = document.getElementById('lastcensusDisplay');
const popestDisplay = document.getElementById('popestDisplay');

const map = new mapboxgl.Map({
						container: 'map', // container ID
						// Choose from Mapbox's core styles, or make your own style with Mapbox Studio
						style: 'mapbox://styles/mapbox/streets-v12', // style URL
						center: [-74.5, 40], // starting position [lng, lat]
						zoom: 3 // starting zoom
});
let currentFeatureId = null;
var popup = new mapboxgl.Popup({closeButton: false, closeOnClick: false});  // not loaded yet



// Add Source and layer on load
map.on('load', () => {
	// Use Mapbox Python CLI to upload geojson dataset before adding source here

	// Note: Use any Mapbox-hosted tileset using its tileset id.
	// Learn more about where to find a tileset id:
	// https://docs.mapbox.com/help/glossary/tileset-id/

	map.addSource('data', {'type': 'vector', 'url': 'mapbox://brandon-flannery-altacarbon.data'});

	map.addLayer(
					{
					'id': 'sample-layer',
					'type': 'fill',
					'source': 'data',
					'source-layer': 'data',
					},
				);

});

map.on('click', 'sample-layer', (e) => {
	// Create popup and populate w/ data
	
	// Set Get data from event features
	const name = e.features[0].properties.name;
	const abbrev = e.features[0].properties.abbrev;
	const lastcensus = new Date(e.features[0].properties.lastcensus);
	const popest = e.features[0].properties.pop_est;

	// Display the feature data in the sidebar
	nameDisplay.textContent = name;
	abbrevDisplay.textContent = abbrev;
	lastcensusDisplay.textContent = lastcensus;
	popestDisplay.textContent = popest;
	console.log(nameDisplay.textContent)

	// Fly to feature coordinates of click
	map.flyTo({
		center: e.lngLat
	});
});


// Change the cursor to a pointer when
// the mouse is over the states layer.
map.on('mouseenter', 'sample-layer', (e) => {

	  map.getCanvas().style.cursor = 'pointer';
	  // Check whether features exist
	  if (e.features.length === 0) return;
	  // Set constants equal to the current feature's magnitude, location, and time
	  const name = e.features[0].properties.name;
	  const abbrev = e.features[0].properties.abbrev;
	  const lastcensus = new Date(e.features[0].properties.lastcensus);
	  const popest = e.features[0].properties.pop_est;

	  // If currentLayerId for the hovered feature is not null,
	  // use removeFeatureState to reset to the default behavior
	  if (currentFeatureId) {
	    map.removeFeatureState({
	      source: 'data',
	      sourceLayer: 'data',
	      id: currentFeatureId
	    });
	  }

	  currentFeatureId = e.features[0].id;

	  // When the mouse moves over the sample-layer layer, update the
	  // feature state for the feature under the mouse
	  map.setFeatureState(
	    {
	      source: 'data',
	      sourceLayer: 'data',
	      id: currentFeatureId
	    },
	    {
	      hover: true
	    }
	  );
	
	popup.setLngLat(e.lngLat); // set location of popup
	popup.setHTML('<br>' + name + '<br>' + abbrev + '<br>' + lastcensus + '<br>' + popest + '</p>'); // set content of popup
	popup.addTo(map); // add popup to map

});
 
map.on('mouseleave', 'sample-layer', (e) => {
	if (currentFeatureId) {
		map.setFeatureState(
			{
				source: 'data',
				sourceLayer: 'data',
				id: currentFeatureId
			},
			{
				hover: false
			}
		);
	popup.remove();

  }

  // Remove the information from the previously hovered feature from the sidebar
  //nameDisplay.textContent = "";
  //abbrevDisplay.textContent = "";
  //lastcensusDisplay.textContent = "";
  //popestDisplay.textContent = "";
  // Reset the cursor style
  map.getCanvas().style.cursor = '';
});




// Sidebar Navigation

function openNav0() {
	  document.getElementById("mySidebar").style.width = "250px";
	  document.getElementById("main").style.marginLeft = "250px";
	  document.getElementById("openbtn").style.display = "none";
}

function closeNav0() {
  document.getElementById("mySidebar").style.width = "0";
  document.getElementById("main").style.marginLeft= "0";
  document.getElementById("openbtn").style.display = "block";
}

document.getElementById("openbtn").addEventListener("click", openNav0);
document.getElementById("closebtn").addEventListener("click", closeNav0); 
