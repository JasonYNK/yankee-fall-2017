var friendsList = document.querySelector('.list-friends');
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
 		return api('friends.get' , { v: 5.68, fields: 'nickname' });
 	}) 
 	.then(function(data){
 		for (let i = 0; i < data.items.length; i++) {
 			var firstN = data.items[i].first_name;
 			var lastN = data.items[i].last_name;
 			var newLi = document.createElement('li');
 			newLi.style = 'display: block';
 			newLi.innerHTML = `<p> ${firstN} ${lastN} </p>`
 			friendsList.appendChild(newLi);
 			 console.log(data.items[0].first_name);
 		}
 		
 		
 	})