import * as mocha from 'mocha';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { initDb } from './tests/utils';
import test from './tests/test';

Enzyme.configure({
  adapter: new Adapter()
});

initDb().then((): void=>{
  test();
  mocha.run();
});

if(module.hot){
  module.hot.accept();
}