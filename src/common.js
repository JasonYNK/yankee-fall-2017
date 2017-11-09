let map;
let nikolaev = {lat: 47.005, lng: 32.055};
let popUp = document.querySelector('.pop-up');
let popUpSwitch = 0; // pop-up closed, 1 - open
var dragObject = {};

let markers = [
	{lat: 40.005, lng: 32.055},   // Example
];

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 49.135, lng: 30.915},
		zoom: 6
	});


	addMarker();

	map.addListener('click', (event) => {
		let xAxis = event.pixel.x;
		let yAxis = event.pixel.y;

		if (popUpSwitch === 1) {
			popUpSwitch = 0;
			popUp.style.display = 'none';
			return;
		}

		popUp.style.display = 'block';
		popUpSwitch = 1;
		popUp.style.top = yAxis + 'px';
		popUp.style.left = xAxis + 'px';

		let lat = event.latLng.lat();
		let lng = event.latLng.lng();
		markers.push({lat: lat, lng: lng});
		addMarker();
	});
}

function addMarker() {
	for (let i = 0; i < markers.length; i++) {
		let marker = new google.maps.Marker({
   	 		position: markers[i],
    		map: map
		});
		
	}
}

document.addEventListener('click', (event) => {
	let target = event.target;
	//console.log(target);
	let checkClosePopUp = target.classList.contains('pop-up-close');
	if (checkClosePopUp) {
		popUp.style.display = 'none';
		popUpSwitch = 0;
	}
});


// DRAG 'n' DROP
document.addEventListener('mousedown', (event) => {
	if (event.which != 1) { // 
    	return; 
  	}
  	console.log('down');
	let target = event.target;
	
	let checkTargetAdress1 = target.parentElement.classList.contains('pop-up-address');
	let checkTargetAdress2 = target.classList.contains('pop-up-address');
	
	if (checkTargetAdress1 || checkTargetAdress2) {
		console.log(popUp);
		dragObject.popUp = popUp;
		dragObject.width = popUp.clientWidth;
		dragObject.downX = event.pageX;
		dragObject.downY = event.pageY;
		//console.log(dragObject.downX);
		//console.log(dragObject.downY);
	}

});

document.addEventListener('mousemove' , (event) => {
	if (!dragObject.popUp) {
		return;
	}
	console.log('move');
	let coords = getCoords(popUp);

	dragObject.shiftX = dragObject.downX - coords.left;
	dragObject.shiftY = dragObject.downY - coords.top;
	console.log(event.pageX - dragObject.shiftX); // Если не добавлять эти рассчеты в pop-up, то увидишь, что они адекватные по мере движения мышкой по экрану, но если внизу (две закомментированные строчки рядом) я присваиваю в стили, то они начинают себя вести неадекватно, посмотри.
	console.log(event.pageY - dragObject.shiftY); // Если не добавлять эти рассчеты в pop-up, то увидишь, что они адекватные по мере движения мышкой по экрану, но если внизу (две закомментированные строчки рядом) я присваиваю в стили, то они начинают себя вести неадекватно, посмотри.
	console.log(popUp.style.left);
	
	//popUp.style.left = event.pageX - dragObject.shiftX +'px'; // Загадочные вещи происходят тут
  	//popUp.style.top = event.pageY - dragObject.shiftY +'px'; //  Загадочные вещи происходят тут





  	//popUp.style.width = dragObject.width + 'px'; 
});

document.addEventListener('mouseup', (event) => {
	console.log('up');
	dragObject.popUp = null;

});


function getCoords(target) {   
	var box = target.getBoundingClientRect();

	return {
   		top: box.top + pageYOffset,
   		left: box.left + pageXOffset
	};
}