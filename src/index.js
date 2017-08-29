/* ДЗ 1 - Функции */

/*
 Задание 1:

 Функция должна принимать один аргумент и возвращать его
 */
function returnFirstArgument(arg) {
	 return arg;
}
console.log(returnFirstArgument(5));
/*
 Задание 2:

 Функция должна принимать два аргумента и возвращать сумму переданных значений
 Значение по умолчанию второго аргумента должно быть 100
 */
function defaultParameterValue(a, b) {
	var b = 100;
	return a + b;
}
console.log(defaultParameterValue(3));
/*
 Задание 3:

 Функция должна возвращать все переданные в нее аргументы в виде массива
 Количество переданных аргументов заранее неизвестно
 */
function returnArgumentsArray() {
	return arguments;
}
console.log(returnArgumentsArray(5,3,5,3,5,6));
/*
 Задание 4:

 Функция должна принимать другую функцию и возвращать результат вызова переданной функции
 */
function returnFnResult(fn) {
	return fn(3,5);
}
console.log(returnFnResult(function(a,b){
	return a * b;
}));

/*
 Задание 5:

 Функция должна принимать число (значение по умолчанию - 0) и возвращать функцию (F)
 При вызове F, переданное число должно быть увеличено на единицу и возвращено из F
 */
function returnCounter(number) {
		var F = function(){
			return number + 1;
	}
	return F();
}
console.log(returnCounter(4));
/*
 Задание 6 *:

 Функция должна принимать другую функцию (F) и некоторое количество дополнительных аргументов
 Функция должна привязать переданные аргументы к функции F и вернуть получившуюся функцию
 */
function bindFunction(fn, a, b) {
	var fn2 = bind(fn, this);
	return fn2();
}
function F(){
	 return a + b;
}
console.log(bindFunction(F, 2, 3));


function bind(func, context) {
  return function() { 
    return func.apply(context, arguments);
  };
}
 export {
    returnFirstArgument,
    defaultParameterValue,
    returnArgumentsArray,
    returnFnResult,
    returnCounter,
    bindFunction
} 
