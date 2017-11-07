import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createStore, compose, applyMiddleware, combineReducers, bindActionCreators } from 'redux';
import { connect, Provider } from 'react-redux';
import thunk from 'redux-thunk';
import IndexedDB from 'indexeddb-tools';
import IndexedDBRedux from '../lib/index';
import reducers from './reducers';
import { data1, data2, data3 } from './data';

function quickSort(rawArray, key){
  const len = rawArray.length;
  if(len <= 1) return rawArray;

  const basic = rawArray[0];
  const value = key ? basic[key] : basic;

  let left = [];
  let right = [];

  for(let i = 1; i < len; i++){
    const item = rawArray[i];
    const v = key ? item[key] : item;

    if(v < value){
      left.push(item);
    }else{
      right.push(item);
    }
  }

  if(left.length > 1) left = quickSort(left, key);
  if(right.length > 1) right = quickSort(right, key);

  return left.concat(basic, right);
}

/* 初始化数据库 */
const dbName = 'Test';
const version = 1;
const idx = [
  {
    name: 'username',
    index: 'username'
  },
  {
    name: 'age',
    index: 'age'
  },
  {
    name: 'sex',
    index: 'sex'
  }
];

IndexedDB(dbName, version, {
  success: function(event){
    this.close();
  },
  upgradeneeded: function(event){
    this.createObjectStore('table_1', 'id', idx);
    this.createObjectStore('table_2', 'id', idx);
    this.createObjectStore('table_3', 'id', idx);
    this.createObjectStore('table_4', 'id', idx);
  }
});

/* redux */
const initialState = {};
const middlewares = applyMiddleware(thunk);
const reducer = combineReducers({
  test: reducers
});
const store = createStore(reducer, initialState, compose(middlewares));
const db = new IndexedDBRedux(dbName, version);

/* dispatch */
const test_1 = function(arg){
  return store.dispatch({
    type: 'TEST_1',
    payload: arg
  });
};
const action_1 = db.addAction({
  objectStoreName: 'table_1',
  successAction: test_1
});

const test_1_GET = function(arg){
  return store.dispatch({
    type: 'TEST_1_GET',
    payload: arg
  });
};
const action_1_GET = db.getAction({
  objectStoreName: 'table_1',
  successAction: test_1_GET
});

const action_2 = db.addAction({
  objectStoreName: 'table_2'
});
const test_2_GET = function(arg){
  return store.dispatch({
    type: 'TEST_2_GET',
    payload: arg
  });
};
const action_2_DEL = db.deleteAction({
  objectStoreName: 'table_2'
});
const action_2_GET = db.getAction({
  objectStoreName: 'table_2',
  successAction: test_2_GET
});

const action_3 = db.addAction({
  objectStoreName: 'table_3'
});
const test_3_GET = function(arg){
  return store.dispatch({
    type: 'TEST_3_GET',
    payload: arg
  });
};
const action_3_cursor = db.cursorAction({
  objectStoreName: 'table_3',
  successAction: test_3_GET
});
const action_3_put = db.putAction({
  objectStoreName: 'table_3'
});
const action_3_clear = db.clearAction({
  objectStoreName: 'table_3'
});

/* 测试 */
const expect = chai.expect;

const state = (state)=>{
  return state.test;
};

const dispatch = (dispatch)=>({
  action: bindActionCreators({
    action_1,
    action_1_GET,
    action_2,
    action_2_GET,
    action_2_DEL,
    action_3,
    action_3_cursor,
    action_3_put,
    action_3_clear
  }, dispatch)
});

@connect(state, dispatch)
class Test extends Component{
  componentWillMount(){
    const _this = this;
    describe('componentWillMount', function(){

      it('TEST_1', async function(){
        const r1_d = {
          data: data1,
          name: 'TEST_1'
        };
        const r1 = await _this.props.action.action_1(r1_d);
        expect(r1).to.eql(r1_d);
        expect(r1.data).to.eql(data1);

      });

      it('TEST_2', async function(){
        const r1_d = {
          data: data2
        };
        const r1 = await _this.props.action.action_2(r1_d);
        const r2 = await _this.props.action.action_2_DEL({
          query: 2
        });
      });

      it('TEST_3', async function(){
        const r1 = await _this.props.action.action_3({
          data: data3
        });
        const r2 = await _this.props.action.action_3_cursor({
          query: {
            indexName: 'username'
          }
        });
        expect(quickSort(_this.props.TEST_3, 'id')).to.eql(data3);

        const r3 = await _this.props.action.action_3_cursor({
          query: {
            indexName: 'age',
            range: '[18, 32]'
          }
        });
        expect(quickSort(_this.props.TEST_3, 'id')).to.eql([
          {
            id: 2,
            username: '小红',
            age: 18,
            sex: '女'
          },
          {
            id: 3,
            username: '小丽',
            age: 22,
            sex: '女'
          },
          {
            id: 5,
            username: '舒克',
            age: 32,
            sex: '男'
          },
          {
            id: 6,
            username: '葫芦娃',
            age: 20,
            sex: '女'
          }
        ]);

        const r4 = await _this.props.action.action_3_put({
          data: [
            {
              id: 2,
              username: 'Ass we can',
              age: 18,
              sex: '？'
            },
            {
              id: 5,
              username: '贝塔',
              age: 32,
              sex: '男'
            },
          ]
        });
        const r5 = await _this.props.action.action_3_cursor({
          query: {
            indexName: 'username'
          }
        });
        expect(quickSort(_this.props.TEST_3, 'id')).to.eql([
          {
            id: 1,
            username: '小明',
            age: 12,
            sex: '男'
          },
          {
            id: 2,
            username: 'Ass we can',
            age: 18,
            sex: '？'
          },
          {
            id: 3,
            username: '小丽',
            age: 22,
            sex: '女'
          },
          {
            id: 4,
            username: '王羲之',
            age: 106,
            sex: '男'
          },
          {
            id: 5,
            username: '贝塔',
            age: 32,
            sex: '男'
          },
          {
            id: 6,
            username: '葫芦娃',
            age: 20,
            sex: '女'
          }
        ]);

      });

    });
  }
  componentDidMount(){
    const _this = this;
    describe('componentDidMount', function(){

      it('TEST_1', async function(){
        const r1 = await _this.props.action.action_1_GET({
          query: 1
        });
        expect(_this.props.list).to.eql(data1[0]);
        const r2 = await _this.props.action.action_1_GET({
          query: 2
        });
        expect(_this.props.list).to.eql(data1[1]);
        const r3 = await _this.props.action.action_1_GET({
          query: 3
        });
        expect(_this.props.list).to.eql(data1[2]);
        expect(r3).to.eql({
          query: 3,
          result: data1[2]
        });
      });

      it('TEST_2', async function(){
        const r3 = await _this.props.action.action_2_GET({
          query: 2
        });
        expect(_this.props.TEST_2).to.be.undefined;
      });

      it('TEST_3', async function(){
        const r1 = await _this.props.action.action_3_clear();
        const r2 = await _this.props.action.action_3_cursor({
          query: {
            indexName: 'username'
          }
        });
        expect(_this.props.TEST_3).to.eql([]);
      });

    });
  }
  render(){
    return (
      <div />
    );
  }
}

ReactDOM.render(
  <Provider store={ store }>
    <Test />
  </Provider>,
  document.getElementById('react-app')
);