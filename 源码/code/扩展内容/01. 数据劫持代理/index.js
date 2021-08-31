// Vue数据劫持代理

// 模拟Vue中data选项

let data = {
  username: 'curry',
  age: 33
}


// 模拟组件的实例
let _this = {

}

// 利用Object.defineProperty()
for(let item in data){
  // console.log(item, data[item]);
  Object.defineProperty(_this, item, {
    // get：用来获取扩展属性值的， 当获取该属性值的时候调用get方法
    get(){
      console.log('get()');
      return data[item]
    },
    // set： 监视扩展属性的， 只要已修改就调用
    set(newValue){
      console.log('set()', newValue);
      // _this.username = newValue; 千万不要在set方中修改修改当前扩展属性的值，会出现死循环
      data[item] = newValue;
    }
  })
}

console.log(_this);
// 通过Object.defineProperty的get方法添加的扩展属性不能直接对象.属性修改
_this.username = 'wade';
console.log(_this.username);
