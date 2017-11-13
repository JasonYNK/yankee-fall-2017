let map;
let marker;
let nikolaev = {lat: 47.005, lng: 32.055};
let popUp = document.querySelector('.pop-up');
let addReviewBtn = document.querySelector('.pop-up-addbtn');
let popUpReview = document.querySelector('.pop-up-review');
let myReview = document.querySelector('.pop-up-myreview');
let noReviews = document.querySelector('.pop-up-review-noreviews');
let popUpLocation = document.querySelector('.pop-up-location');
let myReviewForm = document.querySelector('.pop-up-myreview-form');
let nameReview = document.querySelector('#nameReview');
let placeReview = document.querySelector('#placeReview');
let descReview = document.querySelector('#descReview');
let popUpSwitch = 0; // pop-up closed, 1 - open
let dragObject = {};
let reviews = [];
let markers = [];
let review = {};
let lat;
let lng;
let geocoder;

function showPopUp(x,y) {
	popUp.style.display = 'block';
	popUpSwitch = 1;
	popUp.style.top = y + 'px';
	popUp.style.left = x + 'px';
}

function hidePopUp() {
	popUp.style.display = 'none';
	popUpSwitch = 0;
}

function fillReviewObj(obj) {
	let copiedObj = {};

	for (let key in obj) {
		copiedObj[key] = obj[key];
	}
	reviews.push(copiedObj); 
}

function formatDate(date) {
    var dd = date.getDate();

    if (dd < 10) dd = '0' + dd;

    var mm = date.getMonth() + 1;

    if (mm < 10) mm = '0' + mm;

    var yy = date.getFullYear();
    var hh = date.getHours();
    var mi = date.getMinutes();
    var ss = date.getSeconds();
    
    return dd + '.' + mm + '.' + yy + ' ' + hh + ':' + mi + ':' + ss;
}

function addMarker() {
	markers = [];
	for (let i = 0; i < reviews.length; i++) {
		let lat = +reviews[i].lat.toFixed(3);
		let lng = +reviews[i].lng.toFixed(3);
		marker = new google.maps.Marker({
   	 		position: {lat: lat, lng: lng},
    		map: map
		});

		markers.push(marker);
	}
}

function createCluster() {
	let markerCluster = new MarkerClusterer(
		map,
	 	markers,
        {	
        	zoomOnClick: false,
        	imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
        }
    );
}



if ('reviews' in localStorage) {
	reviews = JSON.parse(localStorage.reviews);
}

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 49.135, lng: 30.915},
		zoom: 6
	});
	geocoder = new google.maps.Geocoder;

	addMarker();
	
	createCluster();
	map.addListener('click', (event) => {
		let xAxis = event.pixel.x;
		let yAxis = event.pixel.y;
		let latlng = event.latLng;
		if (popUpSwitch === 1) {
			hidePopUp();
			return;
		}

		lat = event.latLng.lat();
		lng = event.latLng.lng();
		geocoder.geocode({'location': latlng}, function(results, status){
			if (status === 'OK') {
				if (results[0]) {
					review.location = results[0].formatted_address;
					popUpLocation.textContent = review.location;
					showPopUp(xAxis, yAxis);
					popUpReview.innerHTML = '<p class="pop-up-review-noreviews">Отзывов пока нету!</p>';
				}
	
			} else {
				alert('Error ' + status);
			}
		});	
	});  
}



document.addEventListener('click', (event) => {
	let target = event.target;
	let checkClosePopUp = target.classList.contains('pop-up-close');
	if (checkClosePopUp) {
		hidePopUp();
	}
});

addReviewBtn.addEventListener('click', (event) => {

	let time = new Date();
	time = formatDate(time);
	review.inputData = {
		name: nameReview.value,
		place: placeReview.value,
		desc: descReview.value
	}

	review.date = time;
	review.lat = lat;
	review.lng = lng;
	console.log(review);
	
	for (let i = 0; i < myReviewForm.children.length; i++) {
			myReviewForm.children[i].value = '';
		}

	if (!review.inputData.name || !review.inputData.place || !review.inputData.desc) {
		alert('Заполните поля!');
	} else {

		if (noReviews !== '') {
			popUpReview.textContent = '';
		}
		
		fillReviewObj(review);

		addMarker();
		createCluster();

		let reviewComment = document.createElement('div');
		reviewComment.innerHTML = `<p class="pop-up-review-name">${review.inputData.name}</p><p class="pop-up-review-place">${review.inputData.place}<span>${review.date}</span></p><p class="pop-up-review-text">${review.inputData.desc}!</p>`;
		popUpReview.appendChild(reviewComment);

		
		review = {};
		localStorage.reviews = JSON.stringify(reviews);
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
		dragObject.downX = event.pageX;
		dragObject.downY = event.pageY;
		
	}
	console.log(dragObject);
});

document.addEventListener('mousemove' , (event) => {
	event.preventDefault();

	if (!dragObject.popUp) {
		return;
	}
	console.log('move');
	let coords = getCoords(dragObject.popUp);

	dragObject.shiftX = dragObject.downX - coords.left;
	dragObject.shiftY = dragObject.downY - coords.top;

	let test1 = event.pageX - dragObject.shiftX + 'px';
	let test2 = event.pageY - dragObject.shiftY + 'px';
	console.log(test1, test2);
	
	
	popUp.style.left = test1; // Загадочные вещи происходят тут
   	popUp.style.top = test2; //  Загадочные вещи происходят тут

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
}// //