let friendsList = document.querySelector('.list-friends');
let friendsChosenList = document.querySelector('.list-chosen-friends');
let saveBtn = document.querySelector('.footer-save');
let filterForm = document.querySelector('.filter-form');
let filterInput = document.querySelector('#filter-input-1');
let filterChosenInput = document.querySelector('#filter-input-2');

let friendsArr = [],
	friendsChosenArr = [],
	filteredArr = null,
	filteredChosenArr = null;



function saveStorage() {
 	localStorage.friendsList = JSON.stringify(friendsArr);
 	localStorage.friendsChosenList = JSON.stringify(friendsChosenArr); 
 	alert('SAVED');
}

function renderFriendsInfo(arr, list) {
	list.textContent = '';

	for (let i = 0; i < arr.length; i++) {
		let newLi = document.createElement('li');
		newLi.dataset.id = arr[i].id; 
		newLi.setAttribute('class', 'draggable');

		let photo = arr[i].photo_100,
			firstName = arr[i].first_name,
			lastName = arr[i].last_name;

 		newLi.innerHTML = `<img class="face" src="${photo}" alt=""><p> ${firstName} ${lastName} </p>`;
 		list.appendChild(newLi);
 		let newImg = document.createElement('img');
 		newImg.setAttribute('class', 'icon');
 		newLi.appendChild(newImg);

 		if (list === friendsList) {
 			newImg.setAttribute('src', 'img/add.png');
 		}

 		if (list === friendsChosenList) {
 			newImg.setAttribute('src', 'img/delete.png');
 		}	
	}
}

function moveTo(arrFrom, arrTo, firstInput, secondInput, target) {
	for (let i = 0; i < arrFrom.length; i++) {
	 	if (arrFrom[i].id === +target.parentElement.dataset.id) {
	 		arrTo.push(arrFrom[i]);
	 		arrFrom.splice(i, 1);
	 	}
	}
	filteredArr = fillFilteredArr (arrFrom, firstInput);
	filteredChosenArr = fillFilteredArr (arrTo, secondInput);
}

function fillFilteredArr (arr, input) {
	let filteredArr = [];

	for (let i = 0; i < arr.length; i++) {
		if (isMatching(arr[i].first_name, input.value) || isMatching(arr[i].last_name, input.value)) {
			filteredArr.push(arr[i]);
		}
	}
	return filteredArr;
}

function isMatching(full, chunk) {
    return (full.toLowerCase().indexOf(chunk.toLowerCase()) !== -1);
}

function api(method, params) {
	return new Promise(function(resolve, reject){
		VK.api(method, params, function(data){
			if (data.error) {
				reject(new Error(data.error.error_msg))
			} else {
				resolve(data.response);
			}
		});
	});
}

const p = new Promise(function(resolve, reject){
	VK.init({
		apiId: 6200315
	});

	VK.Auth.login(function(data){
		if (data.session) {
			resolve(data);
		} else {
			reject(new Error('Не удалось авторизироваться!'));
		}
	}, 8)
});

p
	.then(function(){
 		return api('friends.get' , { v: 5.68, fields: 'nickname, photo_100' });
 	}) 
 	.then(function(data){
 		if('friendsList' in localStorage && 'friendsChosenList' in localStorage) {
 			friendsArr = JSON.parse(localStorage.friendsList);
 			friendsChosenArr = JSON.parse(localStorage.friendsChosenList);

 			renderFriendsInfo(friendsArr, friendsList);
 			renderFriendsInfo(friendsChosenArr, friendsChosenList);
 		} else {
 			for (let i = 0; i < data.items.length; i++) {
 				friendsArr.push(data.items[i]);
 			}
 			renderFriendsInfo(friendsArr, friendsList);
 			renderFriendsInfo(friendsChosenArr, friendsChosenList);
 		}
 	});

friendsList.addEventListener('click', function(event) {
	let target = event.target;

	if (target.classList.contains('icon')) {
		moveTo(friendsArr, friendsChosenArr, filterInput, filterChosenInput, target);
		renderFriendsInfo(filteredArr, friendsList);
		renderFriendsInfo(filteredChosenArr, friendsChosenList);
	}
});

friendsChosenList.addEventListener('click', function(event){
	let target = event.target;

	if (target.classList.contains('icon')) {
		moveTo(friendsChosenArr, friendsArr, filterChosenInput, filterInput, target);
		renderFriendsInfo(filteredChosenArr, friendsList);
		renderFriendsInfo(filteredArr, friendsChosenList);
	}
});

saveBtn.addEventListener('click', saveStorage);

filterInput.addEventListener('input', (e) => {
	filteredArr = fillFilteredArr (friendsArr, filterInput);
	renderFriendsInfo(filteredArr, friendsList);
});

filterChosenInput.addEventListener('input', (e) => {
	filteredChosenArr = fillFilteredArr (friendsChosenArr,filterChosenInput);
	renderFriendsInfo(filteredChosenArr, friendsChosenList);
});

// DRAG & DROP <====== !!!!!!!!

let dragObject = {};

document.addEventListener('mousedown', (event) => {
 	if (event.which != 1) { 
     	 return; 
   	}

   	let elem = event.target.closest('.draggable');
   
   	if (!elem) return;

 	dragObject.width = elem.clientWidth;
	dragObject.elem = elem;
	dragObject.downX = event.pageX;
	dragObject.downY = event.pageY;
	dragObject.pickedElement = event.target.closest('.draggable');
 });
 
 
document.addEventListener('mousemove', (event) => {
	event.preventDefault();

	if (!dragObject.elem) {
		return;
	} 

	if (!dragObject.avatar) {
		let moveX = event.pageX - dragObject.downX;
		let moveY = event.pageY - dragObject.downY;

		if ( Math.abs(moveX) < 10 && Math.abs(moveY) < 10 ) {
      		return; 
    	}

		dragObject.avatar = dragObject.elem.cloneNode(true);
		
		let coords = getCoords(dragObject.elem);
		
		dragObject.shiftX = dragObject.downX - coords.left;
		dragObject.shiftY = dragObject.downY - coords.top;

		startDrag();
	}
		
	dragObject.avatar.style.left = event.pageX - dragObject.shiftX +'px';
  	dragObject.avatar.style.top = event.pageY - dragObject.shiftY +'px';
});

document.addEventListener('mouseup', (event) => {
	let draggedElement = document.querySelector('.dragged');
	
	if (!dragObject.avatar) {
		dragObject.elem = null;
		return;
	} 
	
	let pickedElement = dragObject.pickedElement.firstElementChild;
	if (findDroppable(event) === 2){
		if (pickedElement.parentElement.parentElement.classList.contains('list-friends')) {
			moveTo(friendsArr, friendsChosenArr, filterInput, filterChosenInput, pickedElement);
			renderFriendsInfo(filteredArr, friendsList);
			renderFriendsInfo(filteredChosenArr, friendsChosenList);
		} 
 	}

 	if (findDroppable(event) === 1) {
 		moveTo(friendsChosenArr, friendsArr, filterChosenInput, filterInput, pickedElement);
		renderFriendsInfo(filteredChosenArr, friendsList);
		renderFriendsInfo(filteredArr, friendsChosenList);
 	} 

 	if (dragObject.avatar) {	
 		document.body.removeChild(draggedElement);
 	}

 	dragObject = {};
 });
function getCoords(target) {   
	var box = target.getBoundingClientRect();

	return {
   		top: box.top + pageYOffset,
   		left: box.left + pageXOffset
	};
}

function startDrag(e) {
	dragObject.avatar.style = "position: absolute; z-index: 9999;" + dragObject.width + 'px; background-color: #F0F0F0;';
	dragObject.avatar.setAttribute('class', 'dragged cloned-li');
	
	document.body.appendChild(dragObject.avatar);
}

function findDroppable(event) {
	dragObject.avatar.hidden = true;
	var elem = document.elementFromPoint(event.clientX, event.clientY);
	dragObject.avatar.hidden = false;

	if (elem.closest('.droppable-zone1')) {
		return 1;
	} 

	if (elem.closest('.droppable-zone2')) {
		return 2;
	}
}