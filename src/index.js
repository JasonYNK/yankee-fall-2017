/* ДЗ 3 - работа с массивами и объеектами */

/*
 Задача 1:
 Напишите аналог встроенного метода forEach для работы с массивами
 */
function forEach(array, fn) {
	var arr = [];

	for (var i = 0; i < array.length; i++) {
		arr[i] = fn(array[i], i, array);
	}

	return arr;
}

/*
 Задача 2:
 Напишите аналог встроенного метода map для работы с массивами
 */
function map(array, fn) {
	var arr = [];
	var arrClone = [];
	for(var i = 0; i < array.length; i++){
		arr[i] = array[i];
		arrClone[i] = fn(arr[i], i, array);
	}
	return arrClone;
}

/*
 Задача 3:
 Напишите аналог встроенного метода reduce для работы с массивами
 */
function reduce(array, fn, initial) {
	var i = 0;
	if(initial === undefined){
		initial = array[0];
		i++;
	}

	for( ; i < array.length; i++){
		initial = fn(initial, array[i], i, array);
	}
	return initial;
}
/*
 Задача 4:
 Функция принимает объект и имя свойства, которое необходиом удалить из объекта
 Функция должна удалить указанное свойство из указанного объекта
 */
function deleteProperty(obj, prop) {
	for(var key in obj){
		if(key === prop){
			delete obj[key];
		}
	}
	return obj;
}

/*
 Задача 5:
 Функция принимает объект и имя свойства и возвращает true или false
 Функция должна проверить существует ли укзаанное свойство в указанном объекте
 */
function hasProperty(obj, prop) {
	if(prop in obj){
		return true;
	}else {
		return false;
	}
}

/*
 Задача 6:
 Функция должна получить все перечисляемые свойства объекта и вернуть их в виде массива
 */
function getEnumProps(obj) {
	//return Object.keys(obj);
	var arr = [];
	for(var key in obj){

		 if(Object.getOwnPropertyDescriptor(obj, key).enumerable === true){
			arr.push(key); 
		} 
	}
	 return arr;
}

/*
 Задача 7:
 Функция должна перебрать все свойства объекта, преобразовать их имена в верхний регистра и вернуть в виде массива
 */
function upperProps(obj) {
//	var arr = Object.keys(obj);
//	return arr.join().toUpperCase().split(',');
var arr = [];
for(var key in obj){
	if(obj.hasOwnProperty(key)){
		arr.push(key.toUpperCase());
	}
}
return arr;
}

/*
 Задача 8 *:
 Напишите аналог встроенного метода slice для работы с массивами
 */
function slice(array, from = 0, to = array.length) {
	var copiedArr = [];
	var arrLength = array.length;
	if (from < 0 && from >= -arrLength) {
		from = arrLength + from;
	}

	if(from < -arrLength){
		from = 0;
	}

	if(to > arrLength){
		to = arrLength;
	}

	if(to < 0){
		to = arrLength + to;
	}
	
	for(; from < to; from++){
		copiedArr.push(array[from]);
	}

	return copiedArr;
}
// [1,2,3,4,5,6] slice(2,-1)
/*
 Задача 9 *:
 Функция принимает объект и должна вернуть Proxy для этого объекта
 Proxy должен перехватывать все попытки записи значений свойств и возводить это значение в квадрат
 */
function createProxy(obj) {
	var proxy = new Proxy(obj, {
		set: function(obj, prop, value){
			obj[prop] = value * value;
			return true;
		}
	});
	return proxy;
}

export {
    forEach,
    map,
    reduce,
    deleteProperty,
    hasProperty,
    getEnumProps,
    upperProps,
    slice,
    createProxy
};

