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
let popUpSwitch = 0; // pop-up closed, 1 - open
let dragObject = {};
let reviews = [];
let review = {};
let lat;
let lng;
let geocoder

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


let markers = [
	{lat: 40.005, lng: 32.055},   // Example
];

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 49.135, lng: 30.915},
		zoom: 6
	});
	geocoder = new google.maps.Geocoder;

	
	
	addMarker();

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
			}

		} else {
			alert('Error ' + status);
		}
	});

//	for (let i = 0; i < reviews.length; i++) {
//		if (event.latLng.lat() === reviews[i].lat) {
//			console.log('Hit the marker!!')
//		}
//	}

		
	});
}

function addMarker() {
	for (let i = 0; i < markers.length; i++) {
		marker = new google.maps.Marker({
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
		hidePopUp();
	}
});

popUp.addEventListener('input', (event) => {
	let target = event.target;
	//review.test = {
//
	//};

	if (target.dataset.review === 'name') {
		// review.name = target.value;
		review.inputDate = {
			name: target.value
		};
		console.log(review);
	};

	if (target.dataset.review === 'place') {
		review.place = target.value;
	};

	if (target.dataset.review === 'desc') {
		review.desc = target.value;
	};

	
});

addReviewBtn.addEventListener('click', (event) => {
	let test = new Date();
	//let h = test.getHours();
	//let m = 
	review.date = test;
	review.lat = lat;
	review.lng = lng;
	console.log(review);
	
	for (let i = 0; i < myReviewForm.children.length; i++) {
			myReviewForm.children[i].value = '';
		}

	if (!review.inputDate.name || !review.place || !review.desc) {
		alert('Заполните поля!');
	} else {
		markers.push({lat: lat, lng: lng});

		if (noReviews !== null) {
			popUpReview.removeChild(noReviews);
			noReviews = null;
		}
		
		addMarker();

		fillReviewObj(review);

		let reviewComment = document.createElement('div');
		reviewComment.innerHTML = `<p class="pop-up-review-name">${review.name}</p><p class="pop-up-review-place">${review.place}<span>${review.date}</span></p><p class="pop-up-review-text">${review.desc}!</p>`;
		popUpReview.appendChild(reviewComment);

		//console.log(myReviewForm.children);
		
		review = {};
		localStorage.reviews = JSON.stringify(reviews);
	}
	
});



 //DRAG 'n' DROP
// document.addEventListener('mousedown', (event) => {
// 	if (event.which != 1) { // 
//     	return; 
//   	}
//   	console.log('down');
// 	let target = event.target;
// 	
// 	let checkTargetAdress1 = target.parentElement.classList.contains('pop-up-address');
// 	let checkTargetAdress2 = target.classList.contains('pop-up-address');
// 	
// 	if (checkTargetAdress1 || checkTargetAdress2) {
// 		console.log(popUp);
// 		dragObject.popUp = popUp;
// 		dragObject.width = popUp.clientWidth;
// 		dragObject.downX = event.pageX;
// 		dragObject.downY = event.pageY;
// 		//console.log(dragObject.downX);
// 		//console.log(dragObject.downY);
// 	}
// 
// });
// 
// document.addEventListener('mousemove' , (event) => {
// 	if (!dragObject.popUp) {
// 		return;
// 	}
// 	console.log('move');
// 	let coords = getCoords(popUp);
// 
// 	dragObject.shiftX = dragObject.downX - coords.left;
// 	dragObject.shiftY = dragObject.downY - coords.top;
// 	let x = event.pageX - dragObject.shiftX;
// 	let y = event.pageY - dragObject.shiftY;
// 	console.log(x); // Если не добавлять эти рассчеты в pop-up, то увидишь, что они адекватные по мере движения мышкой по экрану, но если внизу (две закомментированные строчки рядом) я присваиваю в стили, то они начинают себя вести неадекватно, посмотри.
// 	console.log(y); // Если не добавлять эти рассчеты в pop-up, то увидишь, что они адекватные по мере движения мышкой по экрану, но если внизу (две закомментированные строчки рядом) я присваиваю в стили, то они начинают себя вести неадекватно, посмотри.
// 	//console.log(popUp.style.left);
// 	
// 	popUp.style.left = x +'px'; // Загадочные вещи происходят тут
//    popUp.style.top = y +'px'; //  Загадочные вещи происходят тут
// 
// 
// 
// 
// 
//   	//popUp.style.width = dragObject.width + 'px'; 
// });
// 
// document.addEventListener('mouseup', (event) => {
// 	console.log('up');
// 	dragObject.popUp = null;
// 
// });
// 
// 
// function getCoords(target) {   
// 	var box = target.getBoundingClientRect();
// 
// 	return {
//    		top: box.top + pageYOffset,
//    		left: box.left + pageXOffset
// 	};
// }// //