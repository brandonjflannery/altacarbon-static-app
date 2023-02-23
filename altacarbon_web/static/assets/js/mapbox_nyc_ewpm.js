/* */
/* Script for create a mapbox map, populating with layers (tilesets), and handling interactions on one page
/* */





///////////////////////////////////////////////////////////
// Functions 
///////////////////////////////////////////////////////////

// Filtering

function filterBy(map, layer, operator, field, value) {
		// map: mapbox object to set filter on
		// layer: Layer ID to filter on
		// operator: (example "==", ">", "<")
		// field: Map property to filter on 
		// value: Filter using this value
		const filters = [operator, field, value];
		map.setFilter(layer, filters);
}

function filterByMulitple(map, layer, operator_field_value_list) {
		// map: mapbox object to set filter on
		// layer: Layer ID to filter on
		// operator: (example "==", ">", "<")
		// field: Map property to filter on 
		// value: Filter using this value
		// operator_field_value_list: list of [operator,field,value] arrays
		const filters = ["all"].concat(operator_field_value_list);
		console.log(filters);
		map.setFilter(layer, filters);
}

function updateFilters() {
		// Remove all current filters
		map.setFilter('nyc-ewpm-layer', null);

		// Operator field value array
		var ofv_list = [];

		// Checkbox 
		var checkbox = document.querySelector("input[name=borough-mn-checkbox]");
		if (checkbox.checked) {
				ofv_list.push(["==", ["to-string", ["get", "Borough"]], 'MANHATTAN']);
		}

		// Slider EUI
		var slider_eui_min = document.querySelector("input[name=wn-eui-min-slider]");
		ofv_list.push([">=", ["to-number", ["get", "weather_normalized_source_eui_kbtu_ft2"]], slider_eui_min.valueAsNumber]);
		var slider_eui_max = document.querySelector("input[name=wn-eui-max-slider]");
		ofv_list.push(["<=", ["to-number", ["get", "weather_normalized_source_eui_kbtu_ft2"]], slider_eui_max.valueAsNumber]);

		// Slider Year built
		var slider_yb_min = document.querySelector("input[name=yb-min-slider]");
		ofv_list.push([">=", ["to-number", ["get", "year_built"]], slider_yb_min.valueAsNumber]);
		var slider_yb_max = document.querySelector("input[name=yb-max-slider]");
		ofv_list.push(["<=", ["to-number", ["get", "year_built"]], slider_yb_max.valueAsNumber]);

		// Select Borough
		var select_borough = document.querySelector("select[id=borough-select]");
		if (select_borough.value != '') {
			ofv_list.push(["==", ["to-string", ["get", "Borough"]], select_borough.value]);
		}
		filterByMulitple(map, 'nyc-ewpm-layer', ofv_list);
};

function updateLayerTable() {
	// Get currently filtered layer features, add to table
	var applied_filter = map.getFilter('nyc-ewpm-layer');
	var features = map.querySourceFeatures('nyc_ewpm_aoy2021_20230204', {
	  'sourceLayer': 'nyc_ewpm_aoy2021_20230204',
	  'filter': applied_filter
	});
	var feature_table_items = features.map(f => Object.assign({}, {"featureId": f.id}, f.properties));
	feature_table.fnClearTable();
  feature_table.fnAddData(feature_table_items);
};


function updateTargetDetails(properties) {
	// Update details of target property in sidebar
	// Set Get data from event features
	const bbl = Number(properties.BBL)
	const name = properties.property_name;
	const address = properties.address_1;
	const year_built = properties.year_built;
	const prop_type = properties.primary_property_type_self_selected;
	const net_emissions = Number(properties.net_emissions_metric_tons_co2e);
	const ghg_total = Number(properties.total_ghg_emissions_metric_tons_co2e);
	const ghg_direct = Number(properties.direct_ghg_emissions_metric_tons_co2e);
	const ghg_indirect = Number(properties.indirect_ghg_emissions_metric_tons_co2e);
	const wn_eui_kbtu_ft2 = Number(properties.weather_normalized_source_eui_kbtu_ft2);
	const energy_star_score = Number(properties.energy_star_score);
	const energy_star_eligible = properties.energy_star_certification_eligibility;
	const num_of_buildings = Number(properties.number_of_buildings);
	const site_eui_kbtu_ft2 = Number(properties.site_eui_kbtu_ft2);
	const source_eui_kbtu_ft2 = Number(properties.source_eui_kbtu_ft2);
	const total_eui_kbtu_ft2 = site_eui_kbtu_ft2 + source_eui_kbtu_ft2;



	// Display the feavture data in the sidebar
	name_display.textContent = name;
	address_display.textContent = address;
	year_built_display.textContent = year_built;
	prop_type_display.textContent = prop_type;
	net_emissions_display.textContent = net_emissions;
	ghg_total_display.textContent = ghg_total;
	ghg_direct_display.textContent = ghg_direct;
	ghg_indirect_display.textContent = ghg_indirect;
	wn_eui_kbtu_ft2_display.textContent = wn_eui_kbtu_ft2;
	energy_star_score_display.textContent = energy_star_score;
	energy_star_eligible_display.textContent = energy_star_eligible;
	num_of_buildings_display.textContent = num_of_buildings;
	site_eui_kbtu_ft2_display.textContent = site_eui_kbtu_ft2;
	source_eui_kbtu_ft2_display.textContent = source_eui_kbtu_ft2;
	total_eui_kbtu_ft2_display.textContent = total_eui_kbtu_ft2;
};

function highlightFeature(feature) {
	if (typeof map.getLayer('highlightPolygon') !== "undefined" ){         
        map.removeLayer('highlightPolygon')
        map.removeSource('highlightPolygon');   
    }
  map.addSource('highlightPolygon', {
      "type":"geojson",
      "data": feature.toJSON()
  });
  map.addLayer({
      "id": "highlightPolygon",
      "type": "line",
      "source": "highlightPolygon",
      "layout": {
          "line-join": "round",
          "line-cap": "round"
      },
      "paint": {
          "line-color": "yellow",
          "line-width": 4
      }
  });
};



// Sidebar Navigation

function openNav0() {
	  document.getElementById("mySidebar").style.width = "500px";
	  document.getElementById("main").style.marginLeft = "500px";
	  document.getElementById("openbtn").style.display = "none";

}

function closeNav0() {
  document.getElementById("mySidebar").style.width = "0";
  document.getElementById("main").style.marginLeft= "0";
  document.getElementById("openbtn").style.display = "block";
}

function openChartDiv(div_id) {
  document.getElementById(div_id).style.display = "block";
}

function closeChartDiv(div_id) {
  document.getElementById(div_id).style.display = "none";
}




///////////////////////////////////////////////////////////
// Scripting 
///////////////////////////////////////////////////////////

mapboxgl.accessToken = 'pk.eyJ1IjoiYnJhbmRvbi1mbGFubmVyeS1hbHRhY2FyYm9uIiwiYSI6ImNsZGM3d2drYTA0cTIzd3FobzNvMWd3OWkifQ.nnbxgTCzpRCPG0_VQcpn3A';

const nameDisplay = document.getElementById('nameDisplay');
const addressDisplay = document.getElementById('addressDisplay');
const yearbuiltDisplay = document.getElementById('yearbuiltDisplay');
const proptypeDisplay = document.getElementById('proptypeDisplay');

const map = new mapboxgl.Map({
						container: 'map', // container ID
						// Choose from Mapbox's core styles, or make your own style with Mapbox Studio
						style: 'mapbox://styles/mapbox/dark-v11', // style URL
						center: [-74, 40.73], // starting position [lng, lat]
						zoom: 13 // starting zoom
});
let currentFeatureId = null;
var popup = new mapboxgl.Popup({closeButton: false, closeOnClick: false});  // not loaded yet

var feature_table = $('#layer-table-1').dataTable({
  	'deferRender':    true,
    'scrollY':        200,
    'scrollCollapse': true,
    'scroller':       true,
    'select':         true,
    "data": null,
    "columns": [
    	{"title": "Address", "data": "address_1"},
    	{"title": "Owner", "data": "OwnerName"},
    	{'title': 'GHG Intensity Allowance (kgCO2/sqft)', "data": 'ghg_intensity_allowance_2024'},
    	{'title': 'GHG Intensity Benefit ($)', "data": 'ghg_intensity_benefit_2024'}
    ]
	});


// Add Source and layer on load
map.on('load', () => {
	// Use Mapbox Python CLI to upload geojson dataset before adding source here

	// Note: Use any Mapbox-hosted tileset using its tileset id.
	// Learn more about where to find a tileset id:
	// https://docs.mapbox.com/help/glossary/tileset-id/

	map.addSource('nyc_ewpm_aoy2021_20230204', 
								{'type': 'vector', 'url': 'mapbox://brandon-flannery-altacarbon.nyc_ewpm_aoy2021_20230204'}
								);

	map.addLayer(
				{
					'id': 'nyc-ewpm-layer',
					'type': 'fill',
					'source': 'nyc_ewpm_aoy2021_20230204',
					'source-layer': 'nyc_ewpm_aoy2021_20230204',
					'paint': {
			      'fill-color': [
			        'interpolate', ['linear'],
			        ['number', ['get', 'ghg_rank_all']],
			        0.0, '#2DC4B2',
			        0.25, '#3BB3C3', 
			        0.50,'#669EC4', 
			        0.75, '#A2719B', 
			        1.0, '#AA5E79'
			      ],
			      'fill-opacity': 0.8
			    },
			  }
				);
});
 

map.on('click', 'nyc-ewpm-layer', (e) => {

	// Fly to feature coordinates of click
	map.flyTo({
		center: e.lngLat
	});

	// Create popup and populate w/ data
	var selected_feature = e.features[0]

	// Highlight
	highlightFeature(selected_feature);


	// Update target details (sdebar update)
	updateTargetDetails(selected_feature.properties);

	// Add to bokeh
	console.log(selected_feature);
	updateBuildingTypePie(selected_feature);
	updateEmissionsProfileBar(selected_feature);
	updateEuiProfileBar(selected_feature);
	updateEiBenefitProfileBar(selected_feature);
	updateEnergySourcePie(selected_feature);

});


// Change the cursor to a pointer when
// the mouse is over the states layer.
map.on('mouseenter', 'nyc-ewpm-layer', (e) => {

	  map.getCanvas().style.cursor = 'pointer';
	  // Check whether features exist
	  if (e.features.length === 0) return;
	  // Set constants equal to the current feature's magnitude, location, and time
	  const name = e.features[0].properties.property_name;
		const address = e.features[0].properties.address_1;
		const yearbuilt = e.features[0].properties.year_built;
		const proptype = e.features[0].properties.primary_property_type_self_selected;

	  // If currentLayerId for the hovered feature is not null,
	  // use removeFeatureState to reset to the default behavior
	  if (currentFeatureId) {
	    map.removeFeatureState({
	      source: 'nyc_ewpm_aoy2021_20230204',
	      sourceLayer: 'nyc_ewpm_aoy2021_20230204',
	      id: currentFeatureId
	    });
	  }

	  currentFeatureId = e.features[0].id;

	  // When the mouse moves over the sample-layer layer, update the
	  // feature state for the feature under the mouse
	  map.setFeatureState(
	    {
	      source: 'nyc_ewpm_aoy2021_20230204',
	      sourceLayer: 'nyc_ewpm_aoy2021_20230204',
	      id: currentFeatureId
	    },
	    {
	      hover: true
	    }
	  );
	
	popup.setLngLat(e.lngLat); // set location of popup
	popup.setHTML('<br><b>Name:</b> ' + name + '<br><b>Address:</b> ' + address 
							+ '<br><b>Year Built:</b> ' + yearbuilt + '<br><b>Property Type:</b> ' + proptype 
							+ '</p>'); // set content of popup
	popup.addTo(map); // add popup to map

});
 
map.on('mouseleave', 'nyc-ewpm-layer', (e) => {
	if (currentFeatureId) {
		map.setFeatureState(
			{
				source: 'nyc_ewpm_aoy2021_20230204',
				sourceLayer: 'nyc_ewpm_aoy2021_20230204',
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

map.on("dragend", 'nyc-ewpm-layer', updateLayerTable);
map.on("zoomend", 'nyc-ewpm-layer', updateLayerTable);


// Add event listeners

document.getElementById("openbtn").addEventListener("click", openNav0);
document.getElementById("openbtn").addEventListener("click", updateLayerTable);
document.getElementById("closebtn").addEventListener("click", closeNav0);
document.getElementById("building-type-pie-open").addEventListener("click", e => openChartDiv('building-type-pie-plot')); 
document.getElementById("building-type-pie-close").addEventListener("click", e => closeChartDiv('building-type-pie-plot')); 
document.getElementById("emissions-profile-bar-open").addEventListener("click", e => openChartDiv('emissions-profile-bar-plot')); 
document.getElementById("emissions-profile-bar-close").addEventListener("click", e => closeChartDiv('emissions-profile-bar-plot')); 
document.getElementById("eui-profile-bar-open").addEventListener("click", e => openChartDiv('eui-profile-bar-plot')); 
document.getElementById("eui-profile-bar-close").addEventListener("click", e => closeChartDiv('eui-profile-bar-plot')); 
document.getElementById("ei-benefit-profile-bar-open").addEventListener("click", e => openChartDiv('ei-benefit-profile-bar-plot')); 
document.getElementById("ei-benefit-profile-bar-close").addEventListener("click", e => closeChartDiv('ei-benefit-profile-bar-plot')); 
document.getElementById("energy-source-pie-open").addEventListener("click", e => openChartDiv('energy-source-pie-plot')); 
document.getElementById("energy-source-pie-close").addEventListener("click", e => closeChartDiv('energy-source-pie-plot')); 

var filter_elements = document.querySelectorAll(".mapbox-filter-input");
console.log(filter_elements);
filter_elements.forEach(fe => fe.addEventListener('change', updateFilters));
filter_elements.forEach(fe => fe.addEventListener('change', updateLayerTable));


$('#layer-table-1 tbody').on('click', 'tr', function () {
    if ($(this).hasClass('selected')) {
        $(this).removeClass('selected');
    } else {
    		// Remove last selection, add current
        feature_table.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
        // Get properties, show, and flyto
        var curr_properties = $('#layer-table-1').DataTable().row( this ).data();
        var feature_results = map.querySourceFeatures('nyc_ewpm_aoy2021_20230204', {
				  'sourceLayer': 'nyc_ewpm_aoy2021_20230204',
				  'filter': ['==', ["to-string", ["get", "bbl"]], curr_properties.bbl]
				}); // find feature using borough block lot
				updateTargetDetails(curr_properties);
				map.flyTo({
					center: [curr_properties.Longitude, curr_properties.Latitude]
			  });
			  highlightFeature(feature_results[0]);
		}
});

 
$('#button').click(function () {
    feature_table.row('.selected').remove().draw(false);
});


//Redirect window alerts to console
$.fn.dataTable.ext.errMode = 'none';



///////////////////////////////////////////////////////////
// Chart JS 
///////////////////////////////////////////////////////////


///////////////
/* Pie Chart */
///////////////


const prop_type_color_map = {'multifamily_housing_gross_floor_area_ft2': '#2A758E', 'office_gross_floor_area_ft2': '#1E998A', 'retail_store_gross_floor_area_ft2': '#DAE218', 'parking_gross_floor_area_ft2': '#32B57A', 
'k_12_school_gross_floor_area_ft2': '#45085B', 'other_gross_floor_area_ft2': '#C7E01F', 'medical_office_gross_floor_area_ft2': '#39B976', 'college_university_gross_floor_area_ft2': '#29788E', 'non_refrigerated_warehouse_gross_floor_area_ft2': '#24848D', 
'residence_hall_dormitory_gross_floor_area_ft2': '#472777', 'hotel_gross_floor_area_ft2': '#414286', 'restaurant_gross_floor_area_ft2': '#440154', 'supermarket_grocery_gross_floor_area_ft2': '#365A8C', 'self_storage_facility_gross_floor_area_ft2': '#2F698D', 
'manufacturing_industrial_plant_gross_floor_area_ft2': '#23888D', 'worship_facility_gross_floor_area_ft2': '#218D8C', 'financial_office_gross_floor_area_ft2': '#7ED24E', 'pre_school_daycare_gross_floor_area_ft2': '#481E70', 'bank_branch_gross_floor_area_ft2': '#481D6F', 'distribution_center_gross_floor_area_ft2': '#1F928C', 
'urgent_care_clinic_other_outpatient_gross_floor_area_ft2': '#23A982', 'hospital_general_medical_surgical_gross_floor_area_ft2': '#44BE70', 'data_center_gross_floor_area_ft2': '#9DD93A', 'fitness_center_health_club_gym_gross_floor_area_ft2': '#53C567', 
'performing_arts_gross_floor_area_ft2': '#EEE51B', 'food_sales_gross_floor_area_ft2': '#31668D', 'food_service_gross_floor_area_ft2': '#5EC961', 'refrigerated_warehouse_gross_floor_area_ft2': '#70CE56', 'movie_theater_gross_floor_area_ft2': '#1F948B', 
'outpatient_rehabilitation_physical_therapy_gross_floor_area_ft2': '#9AD83C', 'museum_gross_floor_area_ft2': '#CAE01E', 'courthouse_gross_floor_area_ft2': '#77D052', 'laboratory_gross_floor_area_ft2': '#37598C', 'automobile_dealership_gross_floor_area_ft2': '#AFDC2E', 
'enclosed_mall_gross_floor_area_ft2': '#3A528B', 'mailing_center_post_office_gross_floor_area_ft2': '#482374', 'wholesale_club_supercenter_gross_floor_area_ft2': '#FAE622', 'ambulatory_surgical_center_gross_floor_area_ft2': '#26AC81', 'energy_power_station_gross_floor_area_ft2': '#3E4888', 
'convention_center_gross_floor_area_ft2': '#2D6F8E', 'hotel_gym_fitness_center_floor_area_ft2': '#481C6E', 'adult_education_gross_floor_area_ft2': '#79D151', 'senior_care_community_gross_floor_area_ft2': '#472878', 
'wastewater_treatment_plant_gross_floor_area_ft2': '#1E9A89', 'barracks_gross_floor_area_ft2': '#433A83', 'repair_services_vehicle_shoe_locksmith_etc._gross_floor_area_ft2': '#39548B', 'convenience_store_with_gas_station_gross_floor_area_ft2': '#25838D', 'library_gross_floor_area_ft2': '#E4E318', 
'fast_food_restaurant_gross_floor_area_ft2': '#1E978A', 'senior_living_community_gross_floor_area_ft2': '#20908C', 'race_track_gross_floor_area_ft2': '#3D4B89', 'strip_mall_gross_floor_area_ft2': '#88D547', 
'personal_services_health_beauty_dry_cleaning_etc._gross_floor_area_ft2': '#92D741', 'convenience_store_without_gas_station_gross_floor_area_ft2': '#1FA187', 'transportation_terminal_station_gross_floor_area_ft2': '#2C728E', 'veterinary_office_gross_floor_area_ft2': '#482071', 
'vocational_school_gross_floor_area_ft2': '#DFE318', 'bar_nightclub_gross_floor_area_ft2': '#450558', 'zoo_gross_floor_area_ft2': '#62CA5F', 'indoor_arena_gross_floor_area_ft2': '#60C960', 'roller_rink_gross_floor_area_ft2': '#4BC26C', 'aquarium_gross_floor_area_ft2': '#45347F', 
'bowling_alley_gross_floor_area_ft2': '#38568B', 'ice_curling_rink_gross_floor_area_ft2': '#E7E419', 'lifestyle_center_gross_floor_area_ft2': '#ECE41A'}

const prop_type_label_map = {'multifamily_housing_gross_floor_area_ft2': 'Multifamily Housing', 'office_gross_floor_area_ft2': 'Office', 
'retail_store_gross_floor_area_ft2': 'Retail Store', 'parking_gross_floor_area_ft2': 'Parking', 'k_12_school_gross_floor_area_ft2': 'K 12 School', 
'other_gross_floor_area_ft2': 'Other', 'medical_office_gross_floor_area_ft2': 'Medical Office', 'college_university_gross_floor_area_ft2': 'College University', 
'non_refrigerated_warehouse_gross_floor_area_ft2': 'Non Refrigerated Warehouse', 'residence_hall_dormitory_gross_floor_area_ft2': 'Residence Hall Dormitory', 
'hotel_gross_floor_area_ft2': 'Hotel', 'restaurant_gross_floor_area_ft2': 'Restaurant', 'supermarket_grocery_gross_floor_area_ft2': 'Supermarket Grocery', 
'self_storage_facility_gross_floor_area_ft2': 'Self Storage Facility', 'manufacturing_industrial_plant_gross_floor_area_ft2': 'Manufacturing Industrial Plant', 
'worship_facility_gross_floor_area_ft2': 'Worship Facility', 'financial_office_gross_floor_area_ft2': 'Financial Office', 
'pre_school_daycare_gross_floor_area_ft2': 'Pre School Daycare', 'bank_branch_gross_floor_area_ft2': 'Bank Branch', 'distribution_center_gross_floor_area_ft2': 'Distribution Center', 
'urgent_care_clinic_other_outpatient_gross_floor_area_ft2': 'Urgent Care Clinic Other Outpatient', 'hospital_general_medical_surgical_gross_floor_area_ft2': 'Hospital General Medical Surgical', 
'data_center_gross_floor_area_ft2': 'Data Center', 'fitness_center_health_club_gym_gross_floor_area_ft2': 'Fitness Center Health Club Gym', 
'performing_arts_gross_floor_area_ft2': 'Performing Arts', 'food_sales_gross_floor_area_ft2': 'Food Sales', 'food_service_gross_floor_area_ft2': 'Food Service', 
'refrigerated_warehouse_gross_floor_area_ft2': 'Refrigerated Warehouse', 'movie_theater_gross_floor_area_ft2': 'Movie Theater', 'outpatient_rehabilitation_physical_therapy_gross_floor_area_ft2': 'Outpatient Rehabilitation Physical Therapy', 
'museum_gross_floor_area_ft2': 'Museum', 'courthouse_gross_floor_area_ft2': 'Courthouse', 'laboratory_gross_floor_area_ft2': 'Laboratory', 
'automobile_dealership_gross_floor_area_ft2': 'Automobile Dealership', 'enclosed_mall_gross_floor_area_ft2': 'Enclosed Mall', 'mailing_center_post_office_gross_floor_area_ft2': 'Mailing Center Post Office', 
'wholesale_club_supercenter_gross_floor_area_ft2': 'Wholesale Club Supercenter', 'ambulatory_surgical_center_gross_floor_area_ft2': 'Ambulatory Surgical Center', 
'energy_power_station_gross_floor_area_ft2': 'Energy Power Station', 'convention_center_gross_floor_area_ft2': 'Convention Center', 'hotel_gym_fitness_center_floor_area_ft2': 'Hotel Gym Fitness Center', 
'adult_education_gross_floor_area_ft2': 'Adult Education', 'senior_care_community_gross_floor_area_ft2': 'Senior Care Community', 'wastewater_treatment_plant_gross_floor_area_ft2': 'Wastewater Treatment Plant', 
'barracks_gross_floor_area_ft2': 'Barracks', 'repair_services_vehicle_shoe_locksmith_etc._gross_floor_area_ft2': 'Repair Services Vehicle Shoe Locksmith Etc.', 
'convenience_store_with_gas_station_gross_floor_area_ft2': 'Convenience Store With Gas Station', 'library_gross_floor_area_ft2': 'Library', 'fast_food_restaurant_gross_floor_area_ft2': 'Fast Food Restaurant', 
'senior_living_community_gross_floor_area_ft2': 'Senior Living Community', 'race_track_gross_floor_area_ft2': 'Race Track', 'strip_mall_gross_floor_area_ft2': 'Strip Mall', 
'personal_services_health_beauty_dry_cleaning_etc._gross_floor_area_ft2': 'Personal Services Health Beauty Dry Cleaning Etc.', 'convenience_store_without_gas_station_gross_floor_area_ft2': 'Convenience Store Without Gas Station', 
'transportation_terminal_station_gross_floor_area_ft2': 'Transportation Terminal Station', 'veterinary_office_gross_floor_area_ft2': 'Veterinary Office', 'vocational_school_gross_floor_area_ft2': 'Vocational School', 
'bar_nightclub_gross_floor_area_ft2': 'Bar Nightclub', 'zoo_gross_floor_area_ft2': 'Zoo', 'indoor_arena_gross_floor_area_ft2': 'Indoor Arena', 'roller_rink_gross_floor_area_ft2': 'Roller Rink', 
'aquarium_gross_floor_area_ft2': 'Aquarium', 'bowling_alley_gross_floor_area_ft2': 'Bowling Alley', 'ice_curling_rink_gross_floor_area_ft2': 'Ice Curling Rink', 
'lifestyle_center_gross_floor_area_ft2': 'Lifestyle Center'};


const ctx_1 = document.getElementById('building-type-pie-1');

const config_1 = {
		type: 'pie',
		data: {
		  labels: ['Red', 'Blue', 'Yellow'],
		  datasets: [{
		    label: 'Building Types',
		    data: [300, 50, 100],
		    borderWidth: (a, b, c) => (a.dataset.data[a.dataIndex] === 0 ? 0 : 1),
		    hoverOffset: 4
		  }]
		},
		options: {
				legend: {
            position: "right",
            align: "middle"
        },
        tooltips: {
			    callbacks: {
			      title: function(tooltipItem, data) {
			        return data['labels'][tooltipItem[0]['index']];
			      },
			      label: function(tooltipItem, data) {
			        var sqft = Math.round(Number(data['datasets'][0]['data'][tooltipItem['index']]));
			        return sqft.toLocaleString() + " sqft"
			      },
			      afterLabel: function(tooltipItem, data) {
			        var dataset = data['datasets'][0];
			        var percent = Math.round((dataset['data'][tooltipItem['index']] / dataset["_meta"][0]['total']) * 100)
			        return '(' + percent + '%)';
			      }
			    },
			    backgroundColor: '#FFF',
			    titleFontSize: 14,
			    titleFontColor: '#000',
			    bodyFontColor: '#000',
			    bodyFontSize: 13,
			    displayColors: false
			  }
			}
};

pie_chart = new Chart(ctx_1, config_1);

function updateBuildingTypePie(feature) {
	var prop_type_dict = JSON.parse(feature.properties['property_type_dict']);
	var labels = Object.entries(prop_type_dict).map(([k,v]) => prop_type_label_map[k]);
	var values = Object.entries(prop_type_dict).map(([k,v]) => v);
	var colors = Object.entries(prop_type_dict).map(([k,v]) => prop_type_color_map[k]);
	console.log(labels);
	console.log(values);
	console.log(colors);
  pie_chart.data.labels = labels;
  pie_chart.data.datasets[0].data = values;
  pie_chart.data.datasets[0].backgroundColor = colors;
  pie_chart.update();
}

/////////////////////
/* Bar Chart, Emissions Intensity */
/////////////////////

const ctx_2 = document.getElementById("emissions-profile-bar-1").getContext('2d');;
const labels_2 = ['Selected', 'Peers (Avg)', 'All (Avg)', 'Target (2024)', 'Target (2030)']
const data_2 = {
  labels: labels_2,
  datasets: [{
    label: 'Emissions Intensity (kgCO2/sqft) ',
    data: [0, 0, 0],
    backgroundColor: [
      'rgba(255, 99, 132, 0.2)',
      'rgba(255, 159, 64, 0.2)',
      'rgba(255, 205, 86, 0.2)',
      'rgba(75, 192, 192, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(153, 102, 255, 0.2)',
      'rgba(201, 203, 207, 0.2)'
    ].slice(0, 5),
    borderColor: [
      'rgb(255, 99, 132)',
      'rgb(255, 159, 64)',
      'rgb(255, 205, 86)',
      'rgb(75, 192, 192)',
      'rgb(54, 162, 235)',
      'rgb(153, 102, 255)',
      'rgb(201, 203, 207)'
    ].slice(0, 5),
    borderWidth: 1
  }]
};
const config_2 = {
  type: 'bar',
  data: data_2,
  options: {
  	indexAxis: 'y',
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true
            }
        }]
    },
    tooltips: {
	    callbacks: {
	      title: function(tooltipItem, data) {
	        return data['labels'][tooltipItem[0]['index']];
	      },
	      label: function(tooltipItem, data) {
	        var sqft = Math.round(Number(data['datasets'][0]['data'][tooltipItem['index']]));
	        return "Emissions Intensity: " + sqft.toLocaleString() + " kgCO2/sqft"
	      },
	    },
	    backgroundColor: '#FFF',
	    titleFontSize: 14,
	    titleFontColor: '#000',
	    bodyFontColor: '#000',
	    bodyFontSize: 13,
	    displayColors: false
	  }
  },
};

bar_chart_2 = new Chart(ctx_2, config_2);


function updateEmissionsProfileBar(feature) {

	// Get targets
	var ei_selected = feature.properties['ghg_intensity_kgco2_ft2'];
	var ei_prop = feature.properties['ghg_avg_prop_type'];
	var ei_all = feature.properties['ghg_avg_all'];
	var ei_limit_2024 = feature.properties['emissions_intensity_limit_2024'] * 1000;
	var ei_limit_2030 = feature.properties['emissions_intensity_limit_2030'] * 1000;
	console.log([ei_selected, ei_limit_2024, ei_limit_2030]);
	console.log(feature.properties);
	// Chart data
  bar_chart_2.data.datasets[0].data = [
  		ei_selected,
  		ei_prop,
  		ei_all,
  		ei_limit_2024,
  		ei_limit_2030
  ].map(v => Math.round(v*1000*100) / 100);
  console.log(bar_chart_2.data);
  bar_chart_2.update();


}


/////////////////////
/* Bar Chart, Energy Use Intensity */
/////////////////////

const ctx_4 = document.getElementById("eui-profile-bar-1").getContext('2d');;
const labels_4 = ['Selected', 'Peers (Avg)', 'All (Avg)']
const data_4 = {
  labels: labels_4,
  datasets: [{
    label: 'Energy Use Intensity (kbtu/sqft) ',
    data: [0, 0, 0],
    backgroundColor: [
      'rgba(255, 99, 132, 0.2)',
      'rgba(255, 159, 64, 0.2)',
      'rgba(255, 205, 86, 0.2)',
      'rgba(75, 192, 192, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(153, 102, 255, 0.2)',
      'rgba(201, 203, 207, 0.2)'
    ].slice(0, 3),
    borderColor: [
      'rgb(255, 99, 132)',
      'rgb(255, 159, 64)',
      'rgb(255, 205, 86)',
      'rgb(75, 192, 192)',
      'rgb(54, 162, 235)',
      'rgb(153, 102, 255)',
      'rgb(201, 203, 207)'
    ].slice(0, 3),
    borderWidth: 1
  }]
};
const config_4 = {
  type: 'bar',
  data: data_4,
  options: {
  	indexAxis: 'y',
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true
            }
        }]
    },
    tooltips: {
	    callbacks: {
	      title: function(tooltipItem, data) {
	        return data['labels'][tooltipItem[0]['index']];
	      },
	      label: function(tooltipItem, data) {
	        var sqft = Math.round(Number(data['datasets'][0]['data'][tooltipItem['index']]));
	        return "Energy Use Intensity: " + sqft.toLocaleString() + " kbtu/sqft"
	      },
	    },
	    backgroundColor: '#FFF',
	    titleFontSize: 14,
	    titleFontColor: '#000',
	    bodyFontColor: '#000',
	    bodyFontSize: 13,
	    displayColors: false
	  }
  },
};

bar_chart_4 = new Chart(ctx_4, config_4);


function updateEuiProfileBar(feature) {

	// Get targets
	var eui_selected = feature.properties['source_eui_kbtu_ft2'];
	var eui_prop = feature.properties['eui_avg_prop_type'];
	var eui_all = feature.properties['eui_avg_all'];

	// Chart data
  bar_chart_4.data.datasets[0].data = [
  		eui_selected,
  		eui_prop,
  		eui_all,
  ].map(v => Math.round(v*1000*100) / 100);
  console.log(bar_chart_4.data);
  bar_chart_4.update();

}

/////////////////////
/* Bar Chart, Emission Intensity Benefit  */
/////////////////////

const ctx_5 = document.getElementById("ei-benefit-profile-bar-1").getContext('2d');;
const labels_5 = ['2024-2029', '2030-2034', '2035-2039', '2040-']
const data_5 = {
  labels: labels_5,
  datasets: [{
    label: 'Annual Emissions Intensity Benefit ($) ',
    data: [0, 0, 0],
    backgroundColor: [
      'rgba(255, 99, 132, 0.2)',
      'rgba(255, 159, 64, 0.2)',
      'rgba(255, 205, 86, 0.2)',
      'rgba(75, 192, 192, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(153, 102, 255, 0.2)',
      'rgba(201, 203, 207, 0.2)'
    ].slice(0, 4),
    borderColor: [
      'rgb(255, 99, 132)',
      'rgb(255, 159, 64)',
      'rgb(255, 205, 86)',
      'rgb(75, 192, 192)',
      'rgb(54, 162, 235)',
      'rgb(153, 102, 255)',
      'rgb(201, 203, 207)'
    ].slice(0, 4),
    borderWidth: 1
  }]
};
const config_5 = {
  type: 'bar',
  data: data_5,
  options: {
  	indexAxis: 'y',
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true
            }
        }]
    },
    tooltips: {
	    callbacks: {
	      title: function(tooltipItem, data) {
	        return data['labels'][tooltipItem[0]['index']];
	      },
	      label: function(tooltipItem, data) {
	        var sqft = Math.round(Number(data['datasets'][0]['data'][tooltipItem['index']]));
	        return "LL97 Benefit/Penalty: $" + sqft.toLocaleString() + "/year"
	      },
	    },
	    backgroundColor: '#FFF',
	    titleFontSize: 14,
	    titleFontColor: '#000',
	    bodyFontColor: '#000',
	    bodyFontSize: 13,
	    displayColors: false
	  }
  },
};

bar_chart_5 = new Chart(ctx_5, config_5);


function updateEiBenefitProfileBar(feature) {

	// Get targets
	var eib_2024 = feature.properties['ghg_intensity_benefit_2024'];
	var eib_2030 = feature.properties['ghg_intensity_benefit_2030'];
	var eib_2035 = feature.properties['ghg_intensity_benefit_2035'];
	var eib_2040 = feature.properties['ghg_intensity_benefit_2040']

	// Chart data
  bar_chart_5.data.datasets[0].data = [
  		eib_2024,
  		eib_2030,
  		eib_2035,
  		eib_2040
  ].map(v => Math.round(v));
  console.log(bar_chart_5.data);
  bar_chart_5.update();

}



///////////////
/* Pie Chart (Energy Sources) */
///////////////

const energy_type_color_map = {'electricity_use_grid_purchase_kbtu': '#45BF6F', 'natural_gas_use_kbtu': '#31648D', 
'fuel_oil_2_use_kbtu': '#9FD938', 'fuel_oil_4_use_kbtu': '#EEE51B', 'diesel_2_use_kbtu': '#29788E', 
'fuel_oil_1_use_kbtu': '#440357', 'district_steam_use_kbtu': '#414286', 'fuel_oil_5_6_use_kbtu': '#42BE71', 
'propane_use_kbtu': '#33618D', 'kerosene_use_kbtu': '#48196B', 'liquid_propane_use_kbtu': '#74D054'}

const energy_type_label_map = {'electricity_use_grid_purchase_kbtu': 'Electricity',
 'natural_gas_use_kbtu': 'Nautral Gas',
 'fuel_oil_2_use_kbtu': 'Fuel Oil #2',
 'fuel_oil_4_use_kbtu': 'Fuel Oil #4',
 'diesel_2_use_kbtu': 'Diesel',
 'fuel_oil_1_use_kbtu': 'Fuel Oil #1',
 'district_steam_use_kbtu': 'District Steam',
 'fuel_oil_5_6_use_kbtu': 'Fuel Oil #5/6',
 'propane_use_kbtu': 'Propane',
 'kerosene_use_kbtu': 'Kerosene',
 'liquid_propane_use_kbtu': 'Liquid Propane'};


const ctx_3 = document.getElementById('energy-source-pie-1');

const config_3 = {
		type: 'pie',
		data: {
		  labels: ['Red', 'Blue', 'Yellow'],
		  datasets: [{
		    label: 'Energy Sources',
		    data: [300, 50, 100],
		    borderWidth: (a, b, c) => (a.dataset.data[a.dataIndex] === 0 ? 0 : 1),
		    hoverOffset: 4
		  }]
		},
		options: {
				legend: {
            position: "right",
            align: "middle"
        },
        tooltips: {
			    callbacks: {
			      title: function(tooltipItem, data) {
			        return data['labels'][tooltipItem[0]['index']];
			      },
			      label: function(tooltipItem, data) {
			        var kbtu = Math.round(Number(data['datasets'][0]['data'][tooltipItem['index']]));
			        return kbtu.toLocaleString() + " kbtu"
			      },
			      afterLabel: function(tooltipItem, data) {
			        var dataset = data['datasets'][0];
			        var meta = dataset["_meta"];
			        var percent = Math.round((dataset['data'][tooltipItem['index']] / dataset["_meta"][4]['total']) * 100)
			        return '(' + percent + '%)';
			      }
			    },
			    backgroundColor: '#FFF',
			    titleFontSize: 14,
			    titleFontColor: '#000',
			    bodyFontColor: '#000',
			    bodyFontSize: 13,
			    displayColors: false
			  }
			}
};

pie_chart_3 = new Chart(ctx_3, config_3);

function updateEnergySourcePie(feature) {
  var prop_type_dict = JSON.parse(feature.properties['energy_type_dict']);
	var labels = Object.entries(prop_type_dict).map(([k,v]) => energy_type_label_map[k]);
	var values = Object.entries(prop_type_dict).map(([k,v]) => v);
	var colors = Object.entries(prop_type_dict).map(([k,v]) => energy_type_color_map[k]);
	console.log(labels);
	console.log(values);
	console.log(colors);
  pie_chart_3.data.labels = labels;
  pie_chart_3.data.datasets[0].data = values;
  pie_chart_3.data.datasets[0].backgroundColor = colors;
  pie_chart_3.update();
};


