let friendsList = document.querySelector('.list-friends');
let friendsChosenList = document.querySelector('.list-chosen-friends');
let saveBtn = document.querySelector('.footer-save');
let filterForm = document.querySelector('.filter-form');
let filterInput = document.querySelector('#filter-input-1');
let filterChosenInput = document.querySelector('#filter-input-2');

let friendsArr = null,
	friendsChosenArr = null,
	filteredArr = [],
	filteredChosenArr = [];

let dragObject = {};

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

document.addEventListener('mousedown', (e) => {
 	if (e.which != 1) { 
     	 return; 
   	}
 
   	let elem = e.target.closest('.draggable');
   	if (!elem) return;
 
   	dragObject.elem = elem;
 
  
   	dragObject.downX = e.pageX;
   	dragObject.downY = e.pageY;
   	//console.log(dragObject);
 
 });
 
 document.addEventListener('mouseup', (event) => {
 	
 	if (dragObject.avatar) {
 		let draggedElement = document.querySelector('.dragged');
 		document.body.removeChild(draggedElement);
 		console.log('TRUEdsfsd');
 	}
 	let target = event.target;
 	console.log(target);
 	dragObject = {};

 	if(findDroppable(event)){
 		console.log(target);
 		moveTo(friendsArr, friendsChosenArr, filterInput, filterChosenInput, target.firstChildElement);
		renderFriendsInfo(filteredArr, friendsList);
		renderFriendsInfo(filteredChosenArr, friendsChosenList);
 		console.log('TRUE');
 	}
 	
 	
 });
document.addEventListener('mousemove', (e) => {

	if (!dragObject.elem) return;
	if (!dragObject.avatar) {
		startDrag();
	}
	
	dragObject.avatar.style.left = e.pageX + 'px';
  	dragObject.avatar.style.top = e.pageY + 'px';
	
});


function getCoords(elem) {   
  var box = elem.getBoundingClientRect();
  return {
    top: box.top + pageYOffset,
    left: box.left + pageXOffset
  };
}

function startDrag() {
	dragObject.avatar = dragObject.elem.cloneNode(true);
	dragObject.avatar.style = "position: absolute; z-index: 9999;";
	dragObject.avatar.setAttribute('class', 'dragged');
	document.body.appendChild(dragObject.avatar);
}

function findDroppable(event) {
	var elem = document.elementFromPoint(event.clientX, event.clientY);

	return elem.closest('.droppable');
}