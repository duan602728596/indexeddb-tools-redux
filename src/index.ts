import IndexedDB from 'indexeddb-tools';
import ObjectStore from 'indexeddb-tools/lib/objectStore';
import { IDBEvent, ActionArgument, Query, Data, CursorQuery, Cursor } from './types';

class IndexedDBRedux {
  name: string;
  version: number;

  /**
   * 初始化数据库信息，需要传入数据库名称和版本号
   * @param { string } name
   * @param { number } version
   */
  constructor(name: string, version: number) {
    this.name = name;
    this.version = version;
  }

  /**
   * 获取数据
   * @param { string } objectStoreName: ObjectStore名字
   * @param { Function } successAction: 获取数据成功的Action
   * @param { Function } failAction   : 获取数据失败的Action
   */
  getAction({ objectStoreName, successAction, failAction }: ActionArgument): Function {
    return (arg: Query): Function => {
      // arg.query作为查询条件
      const query: string | number = arg.query;

      return (dispatch: Function, getState: Function): Promise<object | void> => {
        return new Promise((resolve: Function, reject: Function): void => {
          IndexedDB(this.name, this.version, {
            success(idbEvent: IDBEvent): void {
              const _this: any = this;
              const store: ObjectStore = this.getObjectStore(objectStoreName);

              store.get(query, function(event: any): void {
                // 此处将result作为获取结果
                const res: object = {
                  ...arg,
                  result: event.target.result
                };

                successAction && dispatch(successAction(res)); // 会将传递的数据 + result作为结果继续传递下去
                resolve(res);
                _this.close();
              });
            }
          });
        }).catch((err: any): void => {
          console.error('getAction', err);
          failAction && dispatch(failAction(arg));
        });
      };
    };
  }

  /**
   * @param { string } objectStoreName: ObjectStore名字
   * @param { Function } successAction: 添加数据成功的Action
   * @param { Function } failAction   : 添加数据失败的Action
   */
  addAction({ objectStoreName, successAction, failAction }: ActionArgument): Function {
    return (arg: Data): Function => {
      // arg.data作为添加数据条件
      const data: Array<object> | object = arg.data;

      return (dispatch: Function, getState: Function): Promise<object | void> => {
        return new Promise((resolve: Function, reject: Function): void => {
          IndexedDB(this.name, this.version, {
            success(idbEvent: IDBEvent): void {
              const store: ObjectStore = this.getObjectStore(objectStoreName, true);

              store.add(data);
              successAction && dispatch(successAction(arg));
              resolve(arg);
              this.close();
            }
          });
        }).catch((err: any): void => {
          console.error('addAction', err);
          failAction && dispatch(failAction(arg));
        });
      };
    };
  }

  /**
   * 更新数据
   * @param { string } objectStoreName: ObjectStore名字
   * @param { Function } successAction: 更新数据成功的Action
   * @param { Function } failAction   : 更新数据失败的Action
   */
  putAction({ objectStoreName, successAction, failAction }: ActionArgument): Function {
    return (arg: Data): Function => {
      // arg.data作为更新数据条件
      const data: Array<object> | object = arg.data;

      return (dispatch: Function, getState: Function): Promise<object | void> => {
        return new Promise((resolve: Function, reject: Function): void => {
          IndexedDB(this.name, this.version, {
            success(idbEvent: IDBEvent): void {
              const store: ObjectStore = this.getObjectStore(objectStoreName, true);

              store.put(data);
              successAction && dispatch(successAction(arg));
              resolve(arg);
              this.close();
            }
          });
        }).catch((err: any): void => {
          console.error('putAction', err);
          failAction && dispatch(failAction(arg));
        });
      };
    };
  }

  /**
   * 删除数据
   * @param { string } objectStoreName: ObjectStore名字
   * @param { Function } successAction: 删除数据成功的Action
   * @param { Function } failAction   : 删除数据失败的Action
   */
  deleteAction({ objectStoreName, successAction, failAction }: ActionArgument): Function {
    return (arg: Query): Function => {
      // arg.query作为删除数据条件
      const query: string | number = arg.query;

      return (dispatch: Function, getState: Function): Promise<object | void> => {
        return new Promise((resolve: Function, reject: Function): void => {
          IndexedDB(this.name, this.version, {
            success(idbEvent: IDBEvent): void {
              const store: ObjectStore = this.getObjectStore(objectStoreName, true);

              store.delete(query);

              successAction && dispatch(successAction(arg));
              resolve(arg);
              this.close();
            }
          });
        }).catch((err: any): void => {
          console.error('deleteAction', err);
          failAction && dispatch(failAction(arg));
        });
      };
    };
  }

  /**
   * 清除数据
   * @param { string } objectStoreName: ObjectStore名字
   * @param { Function } successAction: 删除数据成功的Action
   * @param { Function } failAction   : 删除数据失败的Action
   */
  clearAction({ objectStoreName, successAction, failAction }: ActionArgument): Function {
    return (arg: any): Function => {
      return (dispatch: Function, getState: Function): Promise<any | void> => {
        return new Promise((resolve: Function, reject: Function): void => {
          IndexedDB(this.name, this.version, {
            success(idbEvent: IDBEvent): void {
              const store: ObjectStore = this.getObjectStore(objectStoreName, true);

              store.clear();
              successAction && dispatch(successAction(arg));
              resolve(arg);
              this.close();
            }
          });
        }).catch((err: any): void => {
          console.error('clearAction', err);
          failAction && dispatch(failAction(arg));
        });
      };
    };
  }

  /**
   * 根据游标查询数据
   * @param { string } objectStoreName: ObjectStore名字
   * @param { Function } successAction: 删除数据成功的Action
   * @param { Function } failAction   : 删除数据失败的Action
   */
  cursorAction({ objectStoreName, successAction, failAction }: ActionArgument): Function {
    return (arg: Cursor): Function => {
      /**
       * arg.query作为查询数据条件
       * arg.query.indexName: 要查询的索引
       * arg.query.range    : 游标范围
       */
      const { indexName, range }: CursorQuery = arg.query;

      return (dispatch: Function, getState: Function): Promise<object | void> => {
        return new Promise((resolve: Function, reject: Function): void => {
          IndexedDB(this.name, this.version, {
            success(idbEvent: IDBEvent): void {
              const _this: any = this;
              const store: ObjectStore = this.getObjectStore(objectStoreName);
              const arg: (string | number)[] = [indexName];

              if (range) arg.push(range);

              const resArr: Array<any> = [];

              store.cursor(...arg, function(event: any): void {
                const result: IDBCursor = event.target.result;

                if (result) {
                  resArr.push(result['value']);
                  result.continue();
                } else {
                  // 此处将result作为获取结果
                  const res: object = {
                    ...arg,
                    result: resArr
                  };

                  successAction && dispatch(successAction(res));
                  resolve(res);
                  _this.close();
                }
              });
            }
          });
        }).catch((err: any): void => {
          console.error('cursorAction', err);
          failAction && dispatch(failAction(arg));
        });
      };
    };
  }
}

export default IndexedDBRedux;