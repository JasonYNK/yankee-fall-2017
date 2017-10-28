let friendsList = document.querySelector('.list-friends');
let friendsChosenList = document.querySelector('.list-chosen-friends');
let saveBtn = document.querySelector('.footer-save');
let filterForm = document.querySelector('.filter-form');
let filterInput = document.querySelector('#filter-input-1');
let filterChosenInput = document.querySelector('#filter-input-2');

let friendsArr = [],
	friendsChosenArr = [],
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
//	friendsChosenList.textContent = '';

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
// 
//	for (let i = 0; i < chosenArr.length; i++) {
//		let newLi = document.createElement('li');
//		newLi.setAttribute('class', 'draggable');
//		newLi.dataset.id = chosenArr[i].id; 
//
//		let photo = chosenArr[i].photo_100,
//			firstName = chosenArr[i].first_name,
//			lastName = chosenArr[i].last_name;

 	//	newLi.innerHTML = `<img class="face" src="${photo}" alt=""><p> ${firstName} ${lastName} </p> <img class="icon" src="img/delete.png"></img>`;
 	//	friendsChosenList.appendChild(newLi);
	
}

function moveTo(arrFrom, arrTo, firstInput, secondInput, target) {
	for (let i = 0; i < arrFrom.length; i++) {
	 	if (arrFrom[i].id === +target.parentElement.dataset.id) {
	 		arrTo.push(arrFrom[i]);
	 		arrFrom.splice(i, 1);
	 	}
	}
	console.log(arrFrom, arrTo);
	fillFilteredArr(arrFrom, arrTo, firstInput, secondInput);
}

function fillFilteredArr (friendsArr, friendsChosenArr, firstInput, secondInput) {
	filteredArr = [];
	filteredChosenArr = [];

	for (let i = 0; i < friendsArr.length; i++) {
		if (isMatching(friendsArr[i].first_name, firstInput.value) || isMatching(friendsArr[i].last_name, firstInput.value)) {
			filteredArr.push(friendsArr[i]);
		}
	}

	for (let i = 0; i < friendsChosenArr.length; i++) {
		if (isMatching(friendsChosenArr[i].first_name, secondInput.value) || isMatching(friendsChosenArr[i].last_name, secondInput.value)) {
			filteredChosenArr.push(friendsChosenArr[i]);
		}
	}
	console.log(1);
	
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
 				
 		//		for (let i = 0; i < friendsStorageArr.length; i++) {
 		//			friendsArr.push(friendsStorageArr[i]);
 		//		}
//
 		//		for (let i = 0; i < friendsChosenStorageArr.length; i++) {
 		//			friendsChosenArr.push(friendsChosenStorageArr[i]);
 		//		}

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
	fillFilteredArr (friendsArr, friendsChosenArr, filterInput, filterChosenInput);
	renderFriendsInfo(filteredArr, friendsList);

});

filterChosenInput.addEventListener('input', (e) => {
	fillFilteredArr(friendsArr, friendsChosenArr, filterInput, filterChosenInput);
	renderFriendsInfo(filteredChosenArr, friendsChosenList);
});



// document.addEventListener('mousedown', (e) => {
// 	if (e.which != 1) { 
//     	 return; 
//   	}
// 
//   	let elem = e.target.closest('.draggable');
//   	if (!elem) return;
// 
//   	dragObject.elem = elem;
// 
//  
//   	dragObject.downX = e.pageX;
//   	dragObject.downY = e.pageY;
//   	console.log(dragObject);
// 
// });
// 
// document.addEventListener('mousemove', (e) => {
// 	if (!dragObject.elem) return; 
// 
//   if ( !dragObject.avatar ) { // если перенос не начат...
// 
//     // посчитать дистанцию, на которую переместился курсор мыши
//     var moveX = e.pageX - dragObject.downX;
//     var moveY = e.pageY - dragObject.downY;
//     if ( Math.abs(moveX) < 3 && Math.abs(moveY) < 3 ) {
//       return; // ничего не делать, мышь не передвинулась достаточно далеко
//     }
// 
//     dragObject.avatar = createAvatar(e); // захватить элемент
//     if (!dragObject.avatar) {
//       dragObject = {}; // аватар создать не удалось, отмена переноса
//       return; // возможно, нельзя захватить за эту часть элемента
//     }
// 
//     // аватар создан успешно
//     // создать вспомогательные свойства shiftX/shiftY
//     var coords = getCoords(dragObject.avatar);
//     dragObject.shiftX = dragObject.downX - coords.left;
//     dragObject.shiftY = dragObject.downY - coords.top;
// 
//     startDrag(e); // отобразить начало переноса
//   }
// 
//   // отобразить перенос объекта при каждом движении мыши
//   dragObject.avatar.style.left = e.pageX - dragObject.shiftX + 'px';
//   dragObject.avatar.style.top = e.pageY - dragObject.shiftY + 'px';
// 
//   return false;
// 
// 
// 
// }); 
//   
// 
//  
// function createAvatar(e) {
// 
//   // запомнить старые свойства, чтобы вернуться к ним при отмене переноса
//   var avatar = dragObject.elem;
//   var old = {
//     parent: avatar.parentNode,
//     nextSibling: avatar.nextSibling,
//     position: avatar.position || '',
//     left: avatar.left || '',
//     top: avatar.top || '',
//     zIndex: avatar.zIndex || ''
//   };
// 
//   // функция для отмены переноса
//   avatar.rollback = function() {
//     old.parent.insertBefore(avatar, old.nextSibling);
//     avatar.style.position = old.position;
//     avatar.style.left = old.left;
//     avatar.style.top = old.top;
//     avatar.style.zIndex = old.zIndex
//   };
// 
//   return avatar;
// }
// 
// function startDrag(e) {
//   var avatar = dragObject.avatar;
// 
//   document.body.appendChild(avatar);
//   avatar.style.zIndex = 9999;
//   avatar.style.position = 'absolute';
// }
// 
// 
// function getCoords(elem) {   
// 	var box = elem.getBoundingClientRect();
// 	return {
// 		top: box.top + pageYOffset,
// 		left: box.left + pageXOffset
// 	};
// }