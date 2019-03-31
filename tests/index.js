import mocha from 'mocha';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { initDb } from './tests/utils';

mocha.timeout(180000);
mocha.setup('bdd');

Enzyme.configure({
  adapter: new Adapter()
});

async function start() {
  await initDb();

  const test = await import('./tests/test');

  test.default();

  mocha.run();
}

start();

if (module.hot) {
  module.hot.accept();
}