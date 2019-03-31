import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import IndexedDBRedux from '../../cjs';
import { dbName, version } from './utils';

const initialState = {};
const middlewares = applyMiddleware(thunk);

function reducers(state = {}, action) {
  switch (action.type) {
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

const reducer = combineReducers({
  test: reducers
});

export const store = createStore(reducer, initialState, compose(middlewares));

const db = new IndexedDBRedux(dbName, version);

/* dispatch */
export const test_1 = function(arg) {
  return store.dispatch({
    type: 'TEST_1',
    payload: arg
  });
};

export const action_1 = db.addAction({
  objectStoreName: 'table_1',
  successAction: test_1
});

export const test_1_GET = function(arg) {
  return store.dispatch({
    type: 'TEST_1_GET',
    payload: arg
  });
};

export const action_1_GET = db.getAction({
  objectStoreName: 'table_1',
  successAction: test_1_GET
});

export const action_2 = db.addAction({
  objectStoreName: 'table_2'
});

export const test_2_GET = function(arg) {
  return store.dispatch({
    type: 'TEST_2_GET',
    payload: arg
  });
};

export const action_2_DEL = db.deleteAction({
  objectStoreName: 'table_2'
});

export const action_2_GET = db.getAction({
  objectStoreName: 'table_2',
  successAction: test_2_GET
});

export const action_3 = db.addAction({
  objectStoreName: 'table_3'
});

export const test_3_GET = function(arg) {
  return store.dispatch({
    type: 'TEST_3_GET',
    payload: arg
  });
};

export const action_3_cursor = db.cursorAction({
  objectStoreName: 'table_3',
  successAction: test_3_GET
});

export const action_3_put = db.putAction({
  objectStoreName: 'table_3'
});

export const action_3_clear = db.clearAction({
  objectStoreName: 'table_3'
});