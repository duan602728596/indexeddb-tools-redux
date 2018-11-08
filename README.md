# IndexedDB的redux封装

对浏览器的**IndexedDB**插件进行的用于redux的封装。
IndexedDB：[https://github.com/duan602728596/IndexedDB](https://github.com/duan602728596/IndexedDB)

## 引入方法
```javascript
import IndexedDBRedux from 'indexeddb-tools-redux';
```
在使用前，需要注册**redux-thunk**中间件。

## 初始化
```javascript
import IndexedDB from 'indexeddb-tools';
import IndexedDBRedux from 'indexeddb-tools-redux';

IndexedDB(name, version, callbackObject = {
  success: fn1,         // 数据库连接成功的回调函数
  error: fn2,           // 数据库连接失败的回调函数
  upgradeneeded: fn3    // 数据库首次创建成功的回调函数
});

const db = new IndexedDBRedux(name, version);
```

## 创建action
```javascript
const db = new IndexedDBRedux(dbName, version);
/**
 * 参数
 * @param { string } objectStoreName: ObjectStore名字
 * @param { Function } successAction: 成功的Action
 * @param { Function } failAction   : 失败的Action
 */
export const getAction = db.getAction({
  // 参数
  objectStoreName,
  successAction,
  failAction
});
```

## 方法
* db.getAction: 查询数据
* db.addAction: 添加数据
* db.putAction: 更新数据
* db.deleteAction: 删除数据
* db.clearAction: 清除数据
* db.cursorAction: 根据索引查询

传递参数{ Object }：
* { string } objectStoreName: ObjectStore名字
* { Function } successAction: 成功的Action
* { Function } failAction: 失败的Action

## 调用dispatch
```javascript
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getAction, addAction, putAction, deleteAction, clearAction, cursorAction } from './render';

const state = (state)=>{
  return {};
};

const dispatch = (dispatch)=>({
  action: bindActionCreators({
    getAction,
    addAction,
    putAction,
    deleteAction,
    clearAction,
    cursorAction
  }, dispatch)
});

@connect(state, dispatch)
class Demo extends Component{
  componentWillMount(){

    this.props.action.getAction({
      query,   // { string | number } 查询的主键键值
      ...      // 其他你想要传递的数据
    });

    this.props.action.addAction({
      data,    // { Object | Array } 添加的数据
      ...      // 其他你想要传递的数据
    });

    this.props.action.putAction({
      data,    // { Object | Array } 更新的数据
      ...      // 其他你想要传递的数据
    });

    this.props.action.deleteAction({
      query,   // { string | number | Array } 删除的数据
      ...      // 其他你想要传递的数据
    });

    this.props.action.clearAction(
      ...      // 其他你想要传递的数据
    );

    this.props.action.cursorAction({
      query: {
        indexName,    // 索引
        range         // 游标范围
      },
      ...      // 其他你想要传递的数据
    });

  }
}
```
在reducer函数内可以获取
```javascript
function reducers(state = {}, action){
  const result = action.result;   // action.result为数据库获取数据成功后，获得到的数据
  // action.xxx                   // action内也包含你传递的其他数据

  switch(action.type){
    case 'TYPE_1':
      return {
        ...state,
        data_1: action.result
      };
    case 'TYPE_2':
      return {
        ...state,
        data_2: action.result
      };
    default:
      return state;
  }
}

export default reducers;
```

## 测试用例

运行`yarn test`或`npm run test`，在浏览器打开`http://127.0.0.1:5050`运行测试用例。