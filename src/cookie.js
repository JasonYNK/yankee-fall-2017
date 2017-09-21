/**
 * ДЗ 7.2 - Создать редактор cookie с возможностью фильтрации
 *
 * На странице должна быть таблица со списком имеющихся cookie:
 * - имя
 * - значение
 * - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)
 *
 * На странице должна быть форма для добавления новой cookie:
 * - имя
 * - значение
 * - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)
 *
 * Если добавляется cookie с именем уже существующией cookie, то ее значение в браузере и таблице должно быть обновлено
 *
 * На странице должно быть текстовое поле для фильтрации cookie
 * В таблице должны быть только те cookie, в имени или значении которых есть введенное значение
 * Если в поле фильтра пусто, то должны выводиться все доступные cookie
 * Если дабавляемая cookie не соответсвуте фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 * Если добавляется cookie, с именем уже существующией cookie и ее новое значение не соответствует фильтру,
 * то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена
 *
 * Для более подробной информации можно изучить код тестов
 *
 * Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/**
 * homeworkContainer - это контейнер для всех ваших домашних заданий
 * Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер
 *
 * @example
 * homeworkContainer.appendChild(...);
 */
let homeworkContainer = document.querySelector('#homework-container');
let filterNameInput = homeworkContainer.querySelector('#filter-name-input');
let addNameInput = homeworkContainer.querySelector('#add-name-input');
let addValueInput = homeworkContainer.querySelector('#add-value-input');
let addButton = homeworkContainer.querySelector('#add-button');
let listTable = homeworkContainer.querySelector('#list-table tbody');


showCookie();
function showCookie() {
	listTable.innerHTML = '';
	if(document.cookie !== '') {
		var cookies = document.cookie;
		cookies = cookies.split(';');

		for (let i = 0; i < cookies.length; i++) {
			let item = cookies[i].split('=');
            
			var cookieName = item[0];
			
			var cookieValue = item[1];
			if (isMatching(cookieName, filterNameInput.value) || isMatching(cookieValue, filterNameInput.value)) {
				var newTR = document.createElement('tr');
				newTR.innerHTML = `<td> ${cookieName} </td> <td> ${cookieValue} </td>`;
				listTable.appendChild(newTR);
			//	createBtn(newTR, cookieName);
						var btn = document.createElement('button');
						btn.textContent = 'удалить';
						var element = document.createElement('td');
						newTR.appendChild(element);
						element.appendChild(btn);
						btn.addEventListener('click', function(){
								var date = new Date(0);
								document.cookie = cookieName + "=; path=/; expires=" + date.toUTCString();
								showCookie();
			});
			}
		}
	}
}

function addCookie() {
	var newTR = document.createElement('tr');
	var nameV = addNameInput.value;
	var valueV = addValueInput.value;
	// addNameInput.value = '';
	// addValueInput.value = '';
	var date = new Date(new Date().getTime() + 60 * 1000 *60);
	document.cookie = `${nameV}=${valueV}; path=/; expires="` + date.toUTCString();
	showCookie();
	
}





function isMatching(full, chunk) {
    return (full.toLowerCase().indexOf(chunk.toLowerCase()) !== -1);
}


filterNameInput.addEventListener('keyup', function() {
 	showCookie();
});


addButton.addEventListener('click', () => {
	addCookie();
	showCookie();
});

// window.addEventListener('load', function(){
// 	filterNameInput.value = '';
// 	addNameInput.value = '';
// 	addValueInput.value = '';
// });

