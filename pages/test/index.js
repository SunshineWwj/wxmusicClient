// >>> <<< 位移运算符

let num = 25;
// 将目标数据先转换成二进制，然后移动指定的位数
console.log(num >>> 2); // 6
console.log(num >>> 1); // 12

//11001
//00110 01  //110  =>转为十进制 为 6   =>即 0*2^0 +1*2^1 + 1*2^2 =6
//01100  1  //1100                12      0*2^0 +1*2^1 + 1*2^2 + 1*2^3 =12

// 右移零位会将非number数据强制转换成number
