function reducers(state = {}, action){
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

export default reducers;