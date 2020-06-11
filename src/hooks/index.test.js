import * as utils from '../utils';
import httpHook from './http';
import hooksIndex from './index';

jest.mock('./http');
describe('hooks index', () => {
  beforeEach(() => {
    httpHook.mockClear();
  });

  test('index -> simple flow', () => {
    hooksIndex();
    expect(httpHook).toHaveBeenCalled();
  });

  test('index -> switch off', () => {
    utils.setSwitchOff();
    hooksIndex();
    expect(httpHook).not.toHaveBeenCalled();
  });

  test('index -> wrapping only once', () => {
    hooksIndex();
    hooksIndex();
    expect(httpHook).toHaveBeenCalledTimes(1);
  });
});
