import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import IndexedDBRedux from '../../src';
import { dbName, version } from './utils';

const initialState: Object = {};
const middlewares: Function = applyMiddleware(thunk);

function reducers(state: Object = {}, action: Object): Object{
  switch(action.type){
    case 'TEST_1':
      return {
        ...state,
        TEST_1: action.payload.data
      };
    case 'TEST_1_GET':
      return {
        ...state,
        list: action.payload.result
      };
    case 'TEST_2_GET':
      return {
        ...state,
        TEST_2: action.payload.result
      };
    case 'TEST_3_GET':
      return {
        ...state,
        TEST_3: action.payload.result
      };
    default:
      return state;
  }
}

const reducer: Function = combineReducers({ test: reducers });
export const store: Object = createStore(reducer, initialState, compose(middlewares));

const db: Object = new IndexedDBRedux(dbName, version);

/* dispatch */
export const test_1: Function = function(arg: any): Object{
  return store.dispatch({
    type: 'TEST_1',
    payload: arg
  });
};
export const action_1: Function = db.addAction({
  objectStoreName: 'table_1',
  successAction: test_1
});

export const test_1_GET: Function = function(arg: any): Object{
  return store.dispatch({
    type: 'TEST_1_GET',
    payload: arg
  });
};
export const action_1_GET: Function = db.getAction({
  objectStoreName: 'table_1',
  successAction: test_1_GET
});

export const action_2: Function = db.addAction({
  objectStoreName: 'table_2'
});
export const test_2_GET: Function = function(arg: any): Object{
  return store.dispatch({
    type: 'TEST_2_GET',
    payload: arg
  });
};
export const action_2_DEL: Function = db.deleteAction({
  objectStoreName: 'table_2'
});
export const action_2_GET: Function = db.getAction({
  objectStoreName: 'table_2',
  successAction: test_2_GET
});

export const action_3: Function = db.addAction({
  objectStoreName: 'table_3'
});
export const test_3_GET: Function = function(arg: any): Object{
  return store.dispatch({
    type: 'TEST_3_GET',
    payload: arg
  });
};
export const action_3_cursor: Function = db.cursorAction({
  objectStoreName: 'table_3',
  successAction: test_3_GET
});
export const action_3_put: Function = db.putAction({
  objectStoreName: 'table_3'
});
export const action_3_clear: Function = db.clearAction({
  objectStoreName: 'table_3'
});