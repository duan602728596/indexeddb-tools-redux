# IndexedDB的redux封装

对浏览器的**IndexedDB**插件进行的用于redux的封装。   
IndexedDB：[https://github.com/duan602728596/IndexedDB](https://github.com/duan602728596/IndexedDB)

## 引入方法
```javascript
window.IndexedDB_Redux;
// 或
import { getAction } from 'indexeddb-tools-redux';
```
在使用前，需要使用**redux-thunk**中间件。

## 创建action
```javascript
import { getAction } from 'indexeddb-tools-redux';

/**
 * @param { string } name           : 连接的数据库名
 * @param { number } version        : 数据库版本号
 * @param { string } objectStoreName: ObjectStore名字
 * @param { Function } successAction: 成功的Action
 * @param { Function } failAction   : 失败的Action
 */
export const action = getAction({
  ... // 参数
});
```

## 方法
* getAction: 查询数据
* addAction: 添加数据
* putAction: 更新数据
* deleteAction: 删除数据
* clearAction: 清除数据
* cursorAction: 根据索引查询  

传递参数{ Object }：
* { string } name: 连接的数据库名
* { number } version: 数据库版本号
* { string } objectStoreName: ObjectStore名字
* { Function } successAction: 成功的Action
* { Function } failAction: 失败的Action

## 调用dispatch
```javascript
import React, { Component } from 'react';
import { getAction, addAction, putAction, deleteAction, clearAction, cursorAction } from './render';

class Demo extends Component{
  componentWillMount(){
    getAction({
      data   // {String | Number} 查询的主键键值 
    });

    addAction({
      data   // {Object | Array} 添加的数据 
    });

    putAction({
      data   // {Object | Array} 更新的数据
    });

    deleteAction({
      data   // {String | Number | Array} 删除的数据
    });

    clearAction();  // 无需传参

    cursorAction({
      indexName,    // 索引
      range         // 游标范围
    })

  }
}


```