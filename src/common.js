
// ?!? HTML & CSS почему иконки не принимают размеры если задаешь им а наследуют 0 значения от родителя(awesome.font)
// ?!? время от времени клик по кластеру не проходит


let map,
	marker,
	geocoder,
	markerCluster;

let lat,
	lng;

let reviews = [],
	markers = [],
	review = {};

let dragObject = {};

let popUp = document.querySelector('.pop-up');
let addReviewBtn = document.querySelector('.pop-up-addbtn');
let popUpReview = document.querySelector('.pop-up-review');
let noReviews = document.querySelector('.pop-up-review-noreviews');
let popUpLocation = document.querySelector('.pop-up-location');
let myReviewForm = document.querySelector('.pop-up-myreview-form');
let nameReview = document.querySelector('#nameReview');
let placeReview = document.querySelector('#placeReview');
let descReview = document.querySelector('#descReview');

let slider = document.querySelector('.slider');
let sliderWrap = slider.querySelector('.slider-wrap');
let sliderClose = slider.querySelector('.slider-close');


let reviewComment = null;
let popUpSwitch = 0; // pop-up closed, 1 - open
let sliderSwitch = 0; // 0 - closed, 1 - open

let counter = 0;
let slides = sliderWrap.children.length;
let sliderPagination = slider.querySelector('.slider-pagination');


function showPopUp(event) {
	let xAxis,
		yAxis;

	popUp.style.display = 'block';
	popUpSwitch = 1;

	if (event.pixel) {
		xAxis = event.pixel.x;
		yAxis = event.pixel.y;
	} else {
		xAxis = event.pageX;
		yAxis = event.pageY;
	}

	popUp.style.top = yAxis + 'px';
	popUp.style.left = xAxis + 'px';

	if (popUp.clientHeight + popUp.getBoundingClientRect().top > document.documentElement.clientHeight) {
		let visibleChunk = document.documentElement.clientHeight - popUp.getBoundingClientRect().top;
		let hiddenChunk = popUp.clientHeight - visibleChunk;
		popUp.style.top = (yAxis - hiddenChunk) + 'px';
	}

	if (popUp.clientWidth + popUp.getBoundingClientRect().left > document.documentElement.clientWidth) {
		let visibleChunk = document.documentElement.clientWidth - popUp.getBoundingClientRect().left;
		let hiddenChunk = popUp.clientWidth - visibleChunk;
		popUp.style.left = (xAxis - hiddenChunk) + 'px';
	}
}

function showSlider(event) {
	slider.style.display = 'block';
	sliderSwitch = 1;
	slider.style.top = event.screenY +'px';
	slider.style.left = event.screenX + 'px';

	if (slider.clientHeight + slider.getBoundingClientRect().top > document.documentElement.clientHeight) {
		let visibleChunk = document.documentElement.clientHeight - slider.getBoundingClientRect().top;
		let hiddenChunk = slider.clientHeight - visibleChunk;
		slider.style.top = (event.screenY - hiddenChunk) + 'px';
	} 
		
	if (slider.clientWidth + slider.getBoundingClientRect().left > document.documentElement.clientWidth) {
		let visibleChunk = document.documentElement.clientWidth - slider.getBoundingClientRect().left;
		let hiddenChunk = slider.clientWidth - visibleChunk;
		slider.style.left = (event.screenX - hiddenChunk) + 'px';
	} 
}

function hideSlider() {
	slider.style.display = 'none';
	sliderSwitch = 0;
	sliderWrap.textContent = '';
	sliderPagination.textContent = '';
}

function hidePopUp() {
	if (confirmToClose()) {
		for (let i = 0; i < myReviewForm.children.length; i++) {
			myReviewForm.children[i].value = '';
		}

		popUp.style.display = 'none';
		popUpSwitch = 0;
	} else {
		return;
	}
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
	for (let i = 0; i < reviews.length; i++) {
		
		let lat = +reviews[i].lat;
		let lng = +reviews[i].lng;
		marker = new google.maps.Marker({
   	 		position: {lat: lat, lng: lng},
    		map: map
		});

		markers.push(marker);
	}
}

function createCluster() {
	markerCluster = new MarkerClusterer(
		map,
	 	markers,
        {	
        	zoomOnClick: false,
        	imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
        }
    );
}

function addMarkerListener() {
	for (let i = 0; i < markers.length; i++) {
		markers[i].addListener('click', (event) => {
			noReviews.textContent = '';
			if (event.latLng.lat() === markers[i].position.lat() && event.latLng.lng() === markers[i].position.lng()) { // Если нашли такой маркер с такими координатами на карте, то
				for (let j = 0; j < reviews.length; j++) {
					if ((+markers[i].position.lat() === +reviews[j].lat) && (+markers[i].position.lng() === +reviews[j].lng)) { // и если позиция маркера соотв. с елементом в массиве отзывов,значит что то делать с этим отзывом
						popUpLocation.textContent = reviews[j].location;
						
						if (sliderSwitch === 1) {
							hideSlider();
						}

						if (popUpSwitch === 1) {
							hidePopUp();
						}

						if (popUpSwitch === 0) {
							showPopUp(window.event);
							popUpSwitch = 1;
						}

						if (reviewComment !== null) {
							for (let i = popUpReview.children.length - 1; i > 0; i--) {
								if (popUpReview.children[i].tagName === 'DIV') {
									 popUpReview.removeChild(popUpReview.children[i]); 
								}
							}
							reviewComment = null;
						}

						reviewComment = document.createElement('div');
						reviewComment.innerHTML = `<p class="pop-up-review-name">${reviews[j].inputData.name}</p><p class="pop-up-review-place">${reviews[j].inputData.place}<span>${reviews[j].date}</span></p><p class="pop-up-review-text">${reviews[j].inputData.desc}!</p>`;
						popUpReview.appendChild(reviewComment);
					}
				}
			}
		});
	}
}

function createPagination() {
	for (let i = 0; i < slides; i++) {
		let span = document.createElement('span');
		span.textContent = i + 1;
		span.style.paddingTop = '10px';
		sliderPagination.appendChild(span);
	}

	sliderPagination.children[0].style.borderTop = '3px solid #000';

	let sliderPaginationChildren = slider.querySelectorAll('.slider-pagination span');

	for (let i = 0; i < sliderPaginationChildren.length; i++) {
		sliderPaginationChildren[i].style.width = (400 / slides) + 'px';
		sliderPaginationChildren[i].addEventListener('click', (event) => {

		let target = event.target;
		counter = (+target.textContent) - 1;

		for (let j = 0; j < sliderPaginationChildren.length; j++) {
			if (sliderPaginationChildren[j].style.borderTop === '3px solid #000' || sliderPaginationChildren[j].style.borderTop === '3px solid rgb(0, 0, 0)') {
				sliderPaginationChildren[j].style.borderTop = '0px solid #000';
			}
		}

		sliderPaginationChildren[counter].style.borderTop = '3px solid #000';
		
		sliderWrap.style.marginLeft = -(counter * 400) + 'px';
		});
	}
}

function getCoords(target) {   
	var box = target.getBoundingClientRect();

	return {
   		top: box.top + pageYOffset,
   		left: box.left + pageXOffset
	};
}

function confirmToClose() {
	let confirmation;

	for (let i = 0; i < myReviewForm.children.length; i++) {
		if (myReviewForm.children[i].value !== '') {
			confirmation = confirm('Вы уверенны, что хотите закрыть окно с отзывом? При закрытии окна введенные Вами данные не сохранятся!');
			return confirmation;
		} else {
			return true;
		}
	}

	// if (confirm) {
	// 	return true;
	// } else {
	// 	return false;
	// }
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
		if (sliderSwitch === 1) {
			hideSlider();
		}

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
					showPopUp(event);
					noReviews.textContent = 'Отзывов пока нет ... ';

					if (reviewComment !== null) {
						for (let i = popUpReview.children.length - 1; i > 0; i--) {
							if (popUpReview.children[i].tagName === 'DIV') {
								 popUpReview.removeChild(popUpReview.children[i]); 
							}
						}

						reviewComment = null;
					}
				}
			} else {
				alert('Error ' + status);
			}
		});	
	});
	
	addMarkerListener();

	google.maps.event.addListener(markerCluster, "clusterclick", function (cluster, event) {
		event.stopPropagation();
		
		if (sliderSwitch === 1) {
			return;
		}

		let cloneReviews = [];

		for (let i = 0; i < reviews.length; i++) {
			cloneReviews[i] = reviews[i];
			cloneReviews[i].used = 0; // Почему надо присваивать?
		}
		
		for (let i = 0; i < cluster.markers_.length; i++) {
			for (let j = 0; j < reviews.length; j++) {
				if (cluster.markers_[i].position.lat() === reviews[j].lat && cluster.markers_[i].position.lng() === reviews[j].lng && cloneReviews[j].used !== 1) {
					cloneReviews[j].used = 1;
					hidePopUp();

					let newSliderPage = document.createElement('div');
					newSliderPage.style.verticalAlign = 'top';
					newSliderPage.setAttribute('class', 'slider-page');
					sliderWrap.appendChild(newSliderPage);
		
					slides = sliderWrap.children.length;
		
					let newSliderPlace = document.createElement('h2');
					newSliderPlace.textContent = reviews[j].inputData.place;
					newSliderPlace.setAttribute('class', 'slider-place');
					newSliderPage.appendChild(newSliderPlace);
		
					let newSliderAddress = document.createElement('a');
					newSliderAddress.setAttribute('class', 'slider-address');
					newSliderAddress.setAttribute('href', '#');
					newSliderAddress.textContent = reviews[j].location;
					newSliderPage.appendChild(newSliderAddress);
		
					let newSliderDesc = document.createElement('p');
					newSliderDesc.setAttribute('class', 'slider-desc');
					newSliderDesc.textContent = reviews[j].inputData.desc;
					newSliderPage.appendChild(newSliderDesc);
		
					let newSliderDate = document.createElement('p');
					newSliderDate.setAttribute('class', 'slider-date');
					newSliderDate.textContent = reviews[j].date;
					newSliderPage.appendChild(newSliderDate);
		
					let newSliderLine = document.createElement('div');
					newSliderLine.setAttribute('class', 'slider-line');
					newSliderPage.appendChild(newSliderLine);

					newSliderPage.addEventListener('click', (event) => {
						let target = event.target;

						if (target.classList[0] === 'slider-address') {
							if (reviewComment !== null) {
								for (let i = popUpReview.children.length - 1; i > 0; i--) {
									if (popUpReview.children[i].tagName === 'DIV') {
										popUpReview.removeChild(popUpReview.children[i]); 
									}
								}

							reviewComment = null;
							
							}

							reviewComment = document.createElement('div');
							reviewComment.innerHTML = `<p class="pop-up-review-name">${reviews[j].inputData.name}</p><p class="pop-up-review-place">${reviews[j].inputData.place}<span>${reviews[j].date}</span></p><p class="pop-up-review-text">${reviews[j].inputData.desc}!</p>`;
							popUpReview.appendChild(reviewComment);

							popUpLocation.textContent = reviews[j].location;
							noReviews.textContent = '';
							hideSlider();
							showPopUp(event);
						}
					});
				}
			}
		}

		createPagination();
		
		showSlider(event);
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
	review.lng = lng;
	review.lat = lat;

	for (let i = 0; i < reviews.length; i++) {
		if (popUpLocation.textContent === reviews[i].location) {
			review.location = reviews[i].location;
			review.lng = reviews[i].lng;
			review.lat = reviews[i].lat;
		}
	}
	
	for (let i = 0; i < myReviewForm.children.length; i++) {
			myReviewForm.children[i].value = '';
		}

	if (!review.inputData.name || !review.inputData.place || !review.inputData.desc) {
		alert('Заполните поля!');
	} else {	
		fillReviewObj(review);
		
		marker = new google.maps.Marker({
   	 		position: {lat: review.lat, lng: review.lng},
    		map: map
		});

		markers.push(marker);

		markerCluster.addMarker(marker, false);
		addMarkerListener();

		reviewComment = document.createElement('div');
		reviewComment.innerHTML = `<p class="pop-up-review-name">${review.inputData.name}</p><p class="pop-up-review-place">${review.inputData.place}<span>${review.date}</span></p><p class="pop-up-review-text">${review.inputData.desc}!</p>`;
		popUpReview.appendChild(reviewComment);
		
		noReviews.textContent = '';
		
		review = {};

		localStorage.reviews = JSON.stringify(reviews);
	}
}); 

// SLIDER SLIDER SLIDER SLIDER SLIDER SLIDER SLIDER SLIDER SLIDER
sliderClose.addEventListener('click', (event) => {
	hideSlider();
});

slider.addEventListener('click', (event) => {
	let target = event.target;

	if (target.classList[0] === 'slider-rightarr') {
		counter++;

		if (counter > (slides - 1)) {
			counter = 0;
		}

		sliderPagination.children[counter].style.borderTop = '3px solid #000';

		if (counter !== 0) {
			sliderPagination.children[counter - 1].style.borderTop = '0px solid #000';
		} else {
			sliderPagination.children[slides - 1].style.borderTop = '0px solid #000';
		}

		sliderWrap.style.marginLeft = -(counter * 400) + 'px';
	}

	if (target.classList[0] === 'slider-leftarr') {
		counter--;

		if (counter < 0) {
			counter = slides - 1;
		}

		sliderPagination.children[counter].style.borderTop = '3px solid #000';

		if (counter !== (slides - 1)) {
			sliderPagination.children[counter + 1].style.borderTop = '0px solid #000';
		} else {
			sliderPagination.children[0].style.borderTop = '0px solid #000';
		}

		sliderWrap.style.marginLeft = -(counter * 400) + 'px';
	}
});

// DRAG 'n' DROP
 document.addEventListener('mousedown', (event) => {
	if (event.which != 1) { 
    	return; 
  	}

	let target = event.target;
	
	let checkTargetAdress1 = target.parentElement.classList.contains('pop-up-address');
	let checkTargetAdress2 = target.classList.contains('pop-up-address');
	
	let checkTargetSlider = target.classList.contains('slider-page');

	if (checkTargetSlider) {
		dragObject.slider = slider;
		dragObject.sliderDownX = event.pageX;
		dragObject.sliderDownY = event.pageY;

		let sliderCoords = getCoords(dragObject.slider);

		dragObject.sliderShiftX = dragObject.sliderDownX - sliderCoords.left;
		dragObject.sliderShiftY = dragObject.sliderDownY - sliderCoords.top;
	}

	if (checkTargetAdress1 || checkTargetAdress2) {
		dragObject.popUp = popUp;
		dragObject.downX = event.pageX;
		dragObject.downY = event.pageY;

		let coords = getCoords(dragObject.popUp);

		dragObject.shiftX = dragObject.downX - coords.left;
		dragObject.shiftY = dragObject.downY - coords.top;
	}
});

document.addEventListener('mousemove' , (event) => {
	event.preventDefault();

	if (dragObject.popUp) {
		popUp.style.left = event.pageX - dragObject.shiftX + 'px';
   		popUp.style.top = event.pageY - dragObject.shiftY + 'px'; 
	} else if (dragObject.slider) {
		slider.style.left = event.pageX - dragObject.sliderShiftX + 'px';
   		slider.style.top = event.pageY - dragObject.sliderShiftY + 'px'; 
	} else {
		return;
	}
});

document.addEventListener('mouseup', (event) => {
	dragObject.popUp = null;
	dragObject.slider = null;
});
