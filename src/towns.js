/**
 * ДЗ 6.2 - Создать страницу с текстовым полем для фильтрации городов
 *
 * Страница должна предварительно загрузить список городов из
 * https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 * и отсортировать в алфавитном порядке.
 *
 * При вводе в текстовое поле, под ним должен появляться список тех городов,
 * в названии которых, хотя бы частично, есть введенное значение.
 * Регистр символов учитываться не должен, то есть "Moscow" и "moscow" - одинаковые названия.
 *
 * Во время загрузки городов, на странице должна быть надпись "Загрузка..."
 * После окончания загрузки городов, надпись исчезает и появляется текстовое поле.
 *
 * Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 *
 * *** Часть со звездочкой ***
 * Если загрузка городов не удалась (например, отключился интернет или сервер вернул ошибку),
 * то необходимо показать надпись "Не удалось загрузить города" и кнопку "Повторить".
 * При клике на кнопку, процесс загруки повторяется заново
 */

/**
 * homeworkContainer - это контейнер для всех ваших домашних заданий
 * Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер
 *
 * @example
 * homeworkContainer.appendChild(...);
 */
let homeworkContainer = document.querySelector('#homework-container');
var townsArr = [];

/**
 * Функция должна загружать список городов из https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 * И возвращать Promise, которой должен разрешиться массивом загруженных городов
 *
 * @return {Promise<Array<{name: string}>>}
 */
function loadTowns() {
    let p =  new Promise(function(resolve, reject){
        let xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json');
        xhr.responseType = 'json';
        xhr.send();
        xhr.addEventListener('load', function(){
            filterInput.style.display = 'block';
            loadingBlock.style.display = 'none';
            if (xhr.status !== 200) {
                reject();
            } else {
                resolve(xhr.response);
            }
        });
    });
    p.then(function(response){
        var townArr = response;
            townArr.sort(function(a,b){
                if (a.name > b.name) return 1;
                if (a.name < b.name) return -1;
                if (a.name = b.name) return 0;
        });

        for (let i = 0; i < townArr.length; i++) {
            townsArr.push(townArr[i].name);
        }
    })
    .catch(function(){
        loadRejected.style = 'display: block';
             retryBtn.style= 'display: block';
             retryBtn.addEventListener('click', function(){
                 loadTowns();
             });
     });
     

    return p;
}
loadTowns();

     




/**
 * Функция должна проверять встречается ли подстрока chunk в строке full
 * Проверка должна происходить без учета регистра символов
 *
 * @example
 * isMatching('Moscow', 'moscow') // true
 * isMatching('Moscow', 'mosc') // true
 * isMatching('Moscow', 'cow') // true
 * isMatching('Moscow', 'SCO') // true
 * isMatching('Moscow', 'Moscov') // false
 *
 * @return {boolean}
 */
function isMatching(full, chunk) {
    return (full.toLowerCase().indexOf(chunk.toLowerCase()) !== -1);
}

let loadingBlock = homeworkContainer.querySelector('#loading-block');
let filterBlock = homeworkContainer.querySelector('#filter-block');
let filterInput = homeworkContainer.querySelector('#filter-input');
let filterResult = homeworkContainer.querySelector('#filter-result');
let loadRejected = homeworkContainer.querySelector('#rejected');
let retryBtn = homeworkContainer.querySelector('#retry-btn');

let townsPromise;

filterInput.addEventListener('keyup', function(e) {
    filterResult.innerHTML = '';
     if (filterInput.value !== '') {
         for (let i = 0; i < townsArr.length; i++) {
            if(isMatching(townsArr[i], filterInput.value)) {
                var p = document.createElement('p');
                p.textContent = townsArr[i];
                filterResult.appendChild(p);
            }
        }
    }
    
});
 export {
     loadTowns,
     isMatching
 };

