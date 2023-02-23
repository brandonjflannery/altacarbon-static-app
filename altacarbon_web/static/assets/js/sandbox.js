/* Set the width of the side navigation to 250px */
function openNav() {
	document.getElementById("sidebar-content").style.display = 'block';
	document.getElementById("open-sidebar").style.display = 'none';
    document.getElementById("sandbox").style.marginLeft = "200px";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
	document.getElementById("sidebar-content").style.display = 'none';
	document.getElementById("open-sidebar").style.display = 'block';
 	document.getElementById("sandbox").style.marginLeft = "50px";
}

/* When user submits query, hide last page, show loading bar */
function sandboxLoading() {
	$("#sandbox-plot").hide();
	$("#sandbox-loading").show();
}

document.getElementById("open-sidebar-button").addEventListener("click", openNav);
document.getElementById("close-sidebar-button").addEventListener("click", closeNav); 
document.getElementById("sandbox-query-button").addEventListener("click", sandboxLoading); 