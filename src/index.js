/* ДЗ 6.1 - Асинхронность и работа с сетью */

/**
 * Функция должна создавать Promise, который должен быть resolved через seconds секунду после создания
 *
 * @param {number} seconds - количество секунд, через которое Promise должен быть resolved
 * @return {Promise}
 */
function delayPromise(seconds) {
    var p = new Promise(function(resolve){
        setTimeout(function(){
            resolve();
        }, seconds * 1000);
    });

    return p;
}

/**
 * Функция должна вернуть Promise, который должен быть разрешен массивом городов, загруженным из
 * https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 * Элементы полученного массива должны быть отсортированы по имени города
 *
 * @return {Promise<Array<{name: String}>>}
 */
function loadAndSortTowns() {
    let p =  new Promise(function(resolve){
        let xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json');
        xhr.responseType = 'json';
        xhr.send();
        xhr.addEventListener('load', function(){
            resolve(xhr.response);
        });
    });
    p.then(function(response){
        var townArr = response;
            townArr.sort(function(a,b){
                if (a.name > b.name) return 1;
                if (a.name < b.name) return -1;
                if (a.name = b.name) return 0;
        });
    });

    return p;
}

export {
    delayPromise,
    loadAndSortTowns
};
