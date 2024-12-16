let message = "Hello, JavaScript!";
// looping array mainly deals with for loop and while loop
let oobject = {
    name: "anil",
    role: 'developer'
}
let arr = ['aa', 'apple', 'banana', 'orange', oobject]
for (let i = 0; i < arr.length; i++) {
    // console.log(arr[i])
}
let i = 0;
while (i < arr.length) {
    //  console.log(arr[i])
    i++
}
//inbuilt javascript which are more powerfull
const number = [1, 2, 3, 4, 5, 9, 5, 1, 2, 3, 4]
const ArroWMapFunctionBenifits = number.map((item, index, array) => {
    // return console.log(item+":(displayes item)",index+":(displayes index of item)",array+":(displayes actual array)")

})
const ArrowFilter = number.filter((item, index, selfarray) => {
    //condition that satisfies
    // return console.log(item,index,array)
    return (selfarray.indexOf(item) === index)

})
// console.log(ArrowFilter)
const ArrowReduce = number.reduce((prevValueitem, item, index, selfarray) => {
    //reduce takes array and it give output one value
    return (prevValueitem + item)

}, 0);
const ArraySome = number.some((item, index, selfArr) => {
    //return boolean,value of any inside array must satisfy the condition
    return item > 3;
})
const ArrayEvery = number.every((item, index, selfArr) => {
    //return boolean,value of every value inside array must satisfy the condition
    return item < 100;
})
const ArrayFind = number.find((item, index, selfArr) => {
    //return value, which satisfies first it not satifies return "undefined"
    return item > 4;
})
//spread and Rest operators
const nums = [1, 2, 3];
const numsSec = [4, 5, 6, 7];
const finalNums = [...nums, ...numsSec]

// console.log(finalNums)
//Rest operators(args)
function sumArrays(...Nums) {
    return Nums
}

// console.log(sumArrays(nums,numsSec,5,"",":wcf"))

//concat to add two or more array 
// console.log(nums.concat(numsSec,number));

//slice to priint first two elements from array it includes first index and it elemnets n-1 index value
// console.log(arr.slice(0,2))
// console.log(arr.slice(-2))


//splice it removes elemnts from array and if necessary it insertts new elements in their place returning deletd elements
// it takes three start position and delete count to remove , returned deleted elements
// arr.splice(1,2,"red","dat","go")
// console.log(arr)

//fill ia alsow a method in array removes item value and replace all with passed value within it.
number.fill(0, 2)
//above 2 is index  form there it will sart fill

//findIndex will give first elemnt in the array index which satisfies the condition or else returns -1
const up1 = [1, 2, 3, 2, 45, 7];
// console.log(up1.findIndex((item) => item%2 === 77))

//flat is used to combine infinity array to one array
const flatArray = [1, 3, [4, 5, 6, ["r", 6, [{ name: "anil", role: 'frontend developer' }, 0, , 3]]]];
// console.log(flatArray.flat(Infinity))

//reverse array
// console.log(arr.reverse())

//sort array sorting of array
const unSorted = [5, 6, 3, 5, 3, 2, 1];
const valArray = (unSorted) => {
    if (unSorted.length >= 2) {
        return unSorted.sort((a, b) => b - a)
    }
    return unSorted
}
//  set is used to remove duplicates from the array
const noDuplicates = [...new Set(valArray([1, 3, 4]))];
console.log(noDuplicates.length >= 2 ? noDuplicates[1] : noDuplicates.join()
)

//Array.from is used to convert object,string to array
const charts = "ddjww"
//  console.log(Array.from(charts))
const secondLarget = (arr) => {
    let val = 0
    let larg = Number.NEGATIVE_INFINITY;
    let seclarg = Number.NEGATIVE_INFINITY;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] > larg) {
            seclarg = larg
            larg = arr[i]
        }
        else if (arr[i] !== larg && seclarg < arr[i]) {
            seclarg = arr[i]
        }

    }
    return seclarg
}
let arrSEc = [1, 4, 5, 5, 5, 5, 2, 4]
const secArrow = (arrSEc) => {
    const updated = arrSEc.sort((a, b) => b - a)
    const Moredata = updated.filter((item, index, self) =>
        self.indexOf(item) === index
    )
    return Moredata[1]
}



// console.log(secArrow(arrSEc))

const RotateArray = (nums, k) => {
    let size = nums.length;

    if (size > k) {
        k = k % size
        // console.log(k,"value of data")
    }
    const rotate = nums.splice(size - k, size);
    console.log(nums, 'intial')
    nums.unshift(...rotate)
    return nums
}
//
const ArrayUnshif = (nums, k) => {
    let size = nums.length - 1
    if (size < k) {
        k = k % size;
    }
    reverse(nums, 0, nums.length - 1); //0(n)
    //start to the end of left to right
    reverse(nums, 0, k - 1); //0(k)
    reverse(nums, k, nums.length - 1) //0(n - k) 
    return nums
}
//
const reverse = (nums, left, right) => {
    while (left < right) {
        const temp = nums[left];
        nums[left++] = nums[right];
        nums[right--] = temp

    }
}
// console.log(RotateArray([1,2,3,4,5,6],3),)
// console.log(ArrayUnshif([3,4,322,324,6],3))

const DuplicateRemove = (arr) => {
    // const Filter = arr.filter((item,index,self)=> 
    // self.indexOf(item) === index).sort((a,b) => a - b)
    // return Filter;
    // for(let i =0 ;i < arr.length -1; i++){
    //     if(arr[i] === arr[i + 1]){
    //         arr.splice(i+1,1)
    //         i--
    //     }
    // }
    // return arr;
    if (arr.length === 0) return 0;
    let i = 0;
    for (let j = 1; j < arr.length; j++) {
        if (arr[i] !== arr[j]) {
            i++;
            arr[i] = arr[j]
            // console.log(arr[i])
        }
    } return i + 1
}

// console.log(DuplicateRemove([0,0,4,4,4,4,3,3,3,2,0,0,1,4,5,4,34546,6,5467,343,673])) 

//CHECKING PALENDROME
//number or string we need to convert to string formate

const palendrome = (arr) => {
    let str = arr.toString()
    let left = 0;
    let right = str.length - 1
    // while(left < right){   
    //     if(str[left] !== str[right]){
    //         return false
    //     }
    //     left++;
    //     right--
    // }
    const upd = arr.toString().split('').reverse().join('');
    // return true ? `${str} is palendrome ` : "not"
    return arr === parseInt(upd)
    //+arr in the aboe used to define to convert to number broser application
}
// console.log(palendrome(10));
///recursion Fibonacci numbers
const fibz = (num) => {
    // let arr = [0,1]
    // for(let i = 2 ;i<= num ; i++){
    //     arr.push(arr[i - 1] + arr [i - 2])
    // }
    // return arr;
  return (num <= 1) ? num: (fibz(num - 1) +fibz(num-2)) 
}
// console.log(fibz(24))

//anagram is using same character forming another word by using same word
//important **

const Anagram = 
(s,t) => {
//   if(s.length !== t.length) return false 
//   obj1 ={};
//   obj2={};
//   for(let i =0 ; i<s.length ; i++){
//       obj1[s[i]] =    (obj1[s[i]] || 0)+ 1;
//       obj2[t[i]] =   ( obj2[t[i]] || 0) + 1;
//   }
//   for(const char in obj1){
//       if(obj1[char] !== obj2[char])
//       return false;
//   }
//   return  true
let gnval = s.split('').sort().join();
let dat = t.split("").sort().join()
return gnval === dat
}
// console.log(Anagram("anargam","nagaram"))
// console.log(Anagram("rat","cat"))

//brute force two sum

const BruteTwoSum = (arr,target) => {
    // for(i = 0 ; i < arr.length ; i++){
    //     for(j = i + 1 ; j < arr.length ; j++){
    //         if(arr[i] + arr[j] === target) return [i,j]
    //     }
    // } return console.log("struggle")
let obj = {}
    for(let i =0 ; i < arr.length ; i++){
        let n = arr[i];
        if(obj[target - n] >= 0){
            return [obj[target - n], i]
        }
        else{
            obj[n] = i
        }
    }
}
// console.log(BruteTwoSum([1,2,4,5,6],11))


//buy or sell stock DSA using Brute force methodology
//Greedy algorithm
const HighProfit = (prices) =>{
    let minPrice = prices[0] || 0;
    let profit = 0
    for(let  i =1;i<prices.length -1; i++){
        minPrice = prices[i];
        if(prices[i] < minPrice) minPrice = prices[i];
        // let currentProfit = profit + minPrice;
        profit = Math.max(profit,prices[i] - minPrice)
    }
    return profit
}
console.log(HighProfit([0,5,3,6,4,10]))

//type cercion is automatic conversion of values from one data type to another during certain operations or comparisions
let string = "42"
let numb = 42
let boolean = true
let nullValue = null
console.log(string + numb) //4242*
console.log(boolean + numb)//43
console.log(string == numb)//true*
console.log(string === numb)//false strick equality
console.log(boolean == 1)//true

console.log(boolean + nullValue)//1


// let slicearray = ["s","f","r","r","w"] why it is not working need to check
console.log(slicearray.slice(1,3))
console.log(slicearray.splice(1,3))


let arr4 = ['aa', 'apple', 'banana', 'orange']
arr4.splice(1,2,"red","dat","go")
console.log(arr4)

let slicearray = ['w','f','r','r','w']
slicearray.splice(1,3,'g','d')
console.log(slicearray) 
//hoisting 
functionCalled();
 function functionCalled(){
     console.log('hoisting')
     
 }
const scopeUnderstanding = () => {
     data = "hi var" ;
        console.log(data,"1");
        var data;
    if(data){
        let letData = "hi let"
        const constD = 'hi const';
           console.log(letData,"1")
           console.log(data,"2")
            console.log(constD,"1")
    }
    // console.log(letData,"2") //error
           console.log(data,"3")
            // console.log(constD,"2") //error
}
scopeUnderstanding();
let arr3 = [1,2,3,4]
const mapArr = (arr) => {
 const mapArray =    arr.map((e) => e * 2)
return console.log(mapArray);
    
}
// mapArr(arr3)
const forEachModify = (arr) => {
   arr.forEach((e) => {
         console.log((e * 2),"val")
       return (e * 2)
 
   })
return console.log(arr);
}
forEachModify(arr3);
// anargam == nagaram
const AnagramOwn = (s,t) => {
    obj1 = {};
    obj2 = {};
    if(s.length !== t.length) return false
   else if(s.length === t.length){
         for(let  i = 0 ; i < s.length ; i++){
        obj1[s[i]] = (obj1[s[i]] || 0) + 1;
        obj2[t[i]] = (obj2[t[i]] || 0) + 1;
    }
    for(let char in obj1){
        if(obj1[char] === obj2[char]) return [true,obj2,obj1]
    } 
    }
  
    return  true;
    
}
console.log(AnagramOwn("anagram","nagaram"))
// arrayLikeobjects
const str = "hell arrayLikeobjects"
const argumentlike = [1,2,4]

function arrayLikeobjects()  {
   console.log(arguments);
    console.log(arguments.length);
    console.log(arguments[0]);
}
const obje = () => {
    console.log(arguments);
    console.log(arguments.length);
    console.log(arguments[0]);
}
arrayLikeobjects(5,2,3)
// obje(1,4,5) //not correct output same logic 
const loopScope = () => {
    let str = "hi"
    let a = 'a'
    // for(let i =0;i< 5;i++){
    // a =   console.log(i ,"for loop");
    
    // }
    while("a" == a){
        console.log('happy coding with while')
        break;
    }
    return a
}
console.log(loopScope())

const Palendrom = (input) => {
    
 let  str = typeof input === "number" ? input.toString() : input
    let temp = ''
   let right = str.length-1;
  
   for(let i = 0 ; i < str.length ; i++){
       if(str[i] === str[right]){
           temp += str[right]
       }
       right--;
   }
   return [str === temp , temp]
    
}
console.log(Palendrom(1231321),"palendrom String using number")
const duplicationRemove = (arr) => {
    let up =[]
    // let newArr = [...new Set(arr)]
    let newArr = arr.filter((item,index,self) => {
        return self.indexOf(item) === index
    })
    obj = {}
    for(let i = 0 ; i < arr.length ; i++){
        //   console.log(i)
        obj[arr[i]] = (obj[arr[i]] || 0) + 1 
    }
    for(let char in obj){
        up.push(obj[char]) //return value of obj
    }
    return Object.keys(obj).map(Number) //return keys from the object
}
console.log(duplicationRemove([1,2,3,2,1,3]))

const parentEvent = document.getElementById("myList");
parentEvent.addEventListener("click",handleEvent);
const handleEvent = (e) => {
 console.log(e.type)   
 const target = e.target
 console.log('clicked:',target.textContent)
}
