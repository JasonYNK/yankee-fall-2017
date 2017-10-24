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

function saveStorage() {
 	localStorage.friendsList = JSON.stringify(friendsArr);
 	localStorage.friendsChosenList = JSON.stringify(friendsChosenArr); 
 	alert('SAVED');
}

function renderFriendsInfo(arr, chosenArr) {
	friendsList.textContent = '';
	friendsChosenList.textContent = '';

	for (let i = 0; i < arr.length; i++) {
		let newLi = document.createElement('li');
		newLi.dataset.id = arr[i].id; 

		let photo = arr[i].photo_100,
			firstName = arr[i].first_name,
			lastName = arr[i].last_name;

 		newLi.innerHTML = `<img class="face" src="${photo}" alt=""><p> ${firstName} ${lastName} </p> <img class="icon" src="img/add.png"></img>`;
 		friendsList.appendChild(newLi);
	}

	for (let i = 0; i < chosenArr.length; i++) {
		let newLi = document.createElement('li');
		newLi.dataset.id = chosenArr[i].id; 

		let photo = chosenArr[i].photo_100,
			firstName = chosenArr[i].first_name,
			lastName = chosenArr[i].last_name;

 		newLi.innerHTML = `<img class="face" src="${photo}" alt=""><p> ${firstName} ${lastName} </p> <img class="icon" src="img/delete.png"></img>`;
 		friendsChosenList.appendChild(newLi);
	}
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
		if(data.session) {
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
 			let friendsStorageArr = JSON.parse(localStorage.friendsList),
 				friendsChosenStorageArr = JSON.parse(localStorage.friendsChosenList);
 				
 				for (let i = 0; i < friendsStorageArr.length; i++) {
 					friendsArr.push(friendsStorageArr[i]);
 				}

 				for (let i = 0; i < friendsChosenStorageArr.length; i++) {
 					friendsChosenArr.push(friendsChosenStorageArr[i]);
 				}

 				renderFriendsInfo(friendsArr, friendsChosenArr);

 		} else {
 			for (let i = 0; i < data.items.length; i++) {
 				friendsArr.push(data.items[i]);
 			}
 			renderFriendsInfo(friendsArr, friendsChosenArr);	
 		}
 	});

friendsList.addEventListener('click', function(event) {
	// function moveTo(arr, moveToArr) {
    // 
	// }
	let target = event.target;

	if (target.classList.contains('icon')) {
		for (let i = 0; i < friendsArr.length; i++) {
			 if (friendsArr[i].id === +target.parentElement.dataset.id) {
			 	friendsChosenArr.push(friendsArr[i]);
			 	friendsArr.splice(i, 1);
			 }
		}
		renderFriendsInfo(friendsArr, friendsChosenArr);
	}
});

friendsChosenList.addEventListener('click', function(event){
	let target = event.target;

	if(target.classList.contains('icon')) {
		for(let i = 0; i < friendsChosenArr.length; i++) {
			 if (friendsChosenArr[i].id === +target.parentElement.dataset.id) {
			 	friendsArr.push(friendsChosenArr[i]);
			 	friendsChosenArr.splice(i, 1);
			 }
		}
		renderFriendsInfo(friendsArr, friendsChosenArr);
	}
});

saveBtn.addEventListener('click', saveStorage);
filterInput.addEventListener('input', (e) => {
		filteredArr = [];
		for(let i = 0; i < friendsArr.length; i++) {
			if(isMatching(friendsArr[i].first_name, filterInput.value) || isMatching(friendsArr[i].last_name, filterInput.value)) {
				filteredArr.push(friendsArr[i]);
			}
		}
	 if(filterChosenInput.value) {
	 	renderFriendsInfo(filteredArr, filteredChosenArr);
	 } else {
	 	renderFriendsInfo(filteredArr, friendsChosenArr);
	 }
});

filterChosenInput.addEventListener('input', (e) => {
		filteredChosenArr = [];
		for(let i = 0; i < friendsChosenArr.length; i++) {
			if(isMatching(friendsChosenArr[i].first_name, filterChosenInput.value) || isMatching(friendsChosenArr[i].last_name, filterChosenInput.value)) {
				filteredChosenArr.push(friendsChosenArr[i]);
			}
		}
		
		if (filterInput.value) {
			 renderFriendsInfo(filteredArr, filteredChosenArr);
		} else {
			renderFriendsInfo(friendsArr, filteredChosenArr);
		}	
});