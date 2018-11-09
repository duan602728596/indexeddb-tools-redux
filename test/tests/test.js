import { expect } from 'chai';
import Enzyme from 'enzyme';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect, Provider } from 'react-redux';
import {
  store, action_1, action_1_GET, action_2, action_2_GET, action_2_DEL, action_3,
  action_3_cursor, action_3_put, action_3_clear
} from './reducers';
import { data1, data2, data3 } from './data';
import { quickSort } from './utils';

const state: Function = (state: Object): Object => state.test;
const dispatch: Function = (dispatch: Function): Object=>({
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
  componentDidMount(): void{
    const _this: this = this;

    describe('componentDidMount', function(): void{
      it('TEST_1', async function(): Promise<void>{
        const data: Object = { data: data1, name: 'TEST_1' };
        const result: Object = await _this.props.action.action_1(data);

        expect(result).to.eql(data);
        expect(result.data).to.eql(data1);
      });

      it('TEST_2', async function(): Promise<void>{
        const data: Object = { data: data2 };
        const result1: Object = await _this.props.action.action_2(data);
        const result2: Object = await _this.props.action.action_2_DEL({ query: 2 });

        expect(result1).to.eql(data);
        expect(result2).to.eql({ query: 2 });
      });

      it('TEST_3', async function(): Promise<void>{
        const result1: Object = await _this.props.action.action_3({ data: data3 });
        const result2: Array = await _this.props.action.action_3_cursor({ query: { indexName: 'username' } });

        expect(quickSort(_this.props.TEST_3, 'id')).to.eql(data3);

        const result3: Array = await _this.props.action.action_3_cursor({
          query: {
            indexName: 'age',
            range: '[18, 32]'
          }
        });

        expect(quickSort(_this.props.TEST_3, 'id')).to.eql([
          { id: 2, username: '小红', age: 18, sex: '女' },
          { id: 3, username: '小丽', age: 22, sex: '女' },
          { id: 5, username: '舒克', age: 32, sex: '男' },
          { id: 6, username: '葫芦娃', age: 20, sex: '女' }
        ]);

        const result4: Array = await _this.props.action.action_3_put({
          data: [
            { id: 2, username: 'Ass we can', age: 18, sex: '?' },
            { id: 5, username: '贝塔', age: 32, sex: '男' }
          ]
        });
        const result5: Array = await _this.props.action.action_3_cursor({ query: { indexName: 'username' } });

        expect(quickSort(_this.props.TEST_3, 'id')).to.eql([
          { id: 1, username: '小明', age: 12, sex: '男' },
          { id: 2, username: 'Ass we can', age: 18, sex: '?' },
          { id: 3, username: '小丽', age: 22, sex: '女' },
          { id: 4, username: '王羲之', age: 106, sex: '男' },
          { id: 5, username: '贝塔', age: 32, sex: '男' },
          { id: 6, username: '葫芦娃', age: 20, sex: '女' }
        ]);
      });

      it('TEST_4', async function(): Promise<void>{
        const result1: Object = await _this.props.action.action_1_GET({ query: 1 });

        expect(_this.props.list).to.eql(data1[0]);

        const result2: Object = await _this.props.action.action_1_GET({ query: 2 });

        expect(_this.props.list).to.eql(data1[1]);

        const result3: Object = await _this.props.action.action_1_GET({ query: 3 });

        expect(_this.props.list).to.eql(data1[2]);

        expect(result3).to.eql({
          query: 3,
          result: data1[2]
        });
      });

      it('TEST_5', async function(): Promise<void>{
        const result3: undefined = await _this.props.action.action_2_GET({ query: 2 });

        expect(_this.props.TEST_2).to.be.undefined;
      });

      it('TEST_6', async function(): Promise<void>{
        const result1: undefined = await _this.props.action.action_3_clear();
        const result2: Array = await _this.props.action.action_3_cursor({
          query: { indexName: 'username' }
        });

        expect(_this.props.TEST_3).to.eql([]);
      });
    });
  }
  render(): React.Element{
    return <div />;
  }
}

function test(): void{
  Enzyme.mount(
    <Provider store={ store }>
      <Test />
    </Provider>
  );
}

export default test;