let message = "Hello, JavaScript!";
// looping array mainly deals with for loop and while loop
let oobject = {
    name:"anil",
    role:'developer'
}
let arr = ['aa','apple','banana','orange',oobject]
for (let i =0 ; i < arr.length ; i++ ){
    // console.log(arr[i])
}
let i = 0;
while(i<arr.length){
//  console.log(arr[i])
    i++
}
//inbuilt javascript which are more powerfull
const number = [1,2,3,4,5,9,5,1,2,3,4]
const ArroWMapFunctionBenifits = number.map((item,index,array) => {
    // return console.log(item+":(displayes item)",index+":(displayes index of item)",array+":(displayes actual array)")
   
})
const ArrowFilter  =number.filter((item,index,selfarray) => {
    //condition that satisfies
    // return console.log(item,index,array)
   return (selfarray.indexOf(item) === index)
   
})
// console.log(ArrowFilter)
 const ArrowReduce =  number.reduce((prevValueitem,item,index,selfarray) => {
    //reduce takes array and it give output one value
   return (prevValueitem + item)
   
},0 );
const ArraySome = number.some((item,index,selfArr)=>{
    //return boolean,value of any inside array moust satisfy the condition
    return  item > 3;
})
const ArrayEvery = number.every((item,index,selfArr)=>{
    //return boolean,value of every value inside array moust satisfy the condition
    return  item < 100;
})
const ArrayFind = number.find((item,index,selfArr)=>{
    //return value, which satisfies first it not satifies return "undefined"
    return  item > 4;
})
//spread and Rest operators
const nums = [1,2,3];
const numsSec= [4,5,6,7];
const finalNums = [...nums , ...numsSec]

// console.log(finalNums)
//Rest operators(args)
function sumArrays(...Nums){
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
number.fill(0,2)
//above 2 is index  form there it will sart fill

//findIndex will give first elemnt in the array index which satisfies the condition or else returns -1
const up1 = [1,2,3,2,45,7];
// console.log(up1.findIndex((item) => item%2 === 77))

//flat is used to combine infinity array to one array
const flatArray = [1,3,[4,5,6,["r",6,[{name:"anil",role:'frontend developer'},0,,3]]]];
// console.log(flatArray.flat(Infinity))

//reverse array
// console.log(arr.reverse())

//sort array sorting of array
const unSorted = [5,6,3,5,3,2,1];
const valArray = (unSorted) => { if(unSorted.length >= 2){
  return  unSorted.sort((a,b) => b - a)}
  return unSorted
}
//  set is used to remove duplicates from the array
const noDuplicates = [...new Set(valArray([1,3,4]))];
console.log(noDuplicates.length >=2 ? noDuplicates[1]: noDuplicates.join()
)

//Array.from is used to convert object,string to array
 const charts = "ddjww"
//  console.log(Array.from(charts))
const secondLarget = (arr) => {
    let val = 0 
    let larg = Number.NEGATIVE_INFINITY;
    let seclarg = Number.NEGATIVE_INFINITY;
    for(let i =0 ;i<arr.length  ; i++){
        if(arr[i] > larg){
           seclarg = larg
           larg = arr[i]
        }
        else if(arr[i] !== larg && seclarg < arr[i]){
            seclarg = arr[i]
        }
        
    }
    return seclarg
}
let arrSEc = [1,4,5,5,5,5,2,4]
const secArrow = (arrSEc) => {
  const updated =  arrSEc.sort((a,b) => b - a)
  const Moredata = updated.filter((item,index,self) => 
      self.indexOf(item) === index
  )
  return Moredata[1]
}
    
    

console.log(secArrow(arrSEc))
