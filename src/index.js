import IndexedDB from 'indexeddb-tools';

type arg = {
  objectStoreName: string,
  successAction: Function,
  failAction: Function
};

class IndexedDBRedux{
  name: string;
  version: number;

  /**
   * 初始化数据库信息，需要传入数据库名称和版本号
   * @param name
   * @param version
   */
  constructor(name: string, version: number): void{
    this.name = name;
    this.version = version;
  }

  /**
   * 获取数据
   * @param { string } objectStoreName: ObjectStore名字
   * @param { Function } successAction: 获取数据成功的Action
   * @param { Function } failAction   : 获取数据失败的Action
   */
  getAction({ objectStoreName, successAction, failAction }: arg): Function{
    return (arg: Object): Function=>{
      // arg.query作为查询条件
      const query: string | number = arg.query;

      return (dispatch: Function, getState: Function): Promise=>{
        return new Promise((resolve: Function, reject: Function): void=>{
          IndexedDB(this.name, this.version, {
            success(event: Object): void{
              const _this: any = this;
              const store: any = this.getObjectStore(objectStoreName);
              store.get(query, function(event: Event): void{
                // 此处将result作为获取结果
                const res: Object = {
                  ...arg,
                  result: event.target.result
                };
                if(successAction){
                  dispatch(successAction(res)); // 会将传递的数据 + result作为结果继续传递下去
                }
                resolve(res);
                _this.close();
              });
            }
          });
        }).catch((err: any): void=>{
          console.error('getAction', err);
          if(failAction){
            dispatch(failAction(arg));
          }
        });
      };
    };
  }

  /**
   * @param { string } objectStoreName: ObjectStore名字
   * @param { Function } successAction: 添加数据成功的Action
   * @param { Function } failAction   : 添加数据失败的Action
   */
  addAction({ objectStoreName, successAction, failAction }: arg): Function{
    return (arg: Object): Function=>{
      // arg.data作为添加数据条件
      const data: string | number = arg.data;

      return (dispatch: Function, getState: Function): Promise=>{
        return new Promise((resolve: Function, reject: Function): void=>{
          IndexedDB(this.name, this.version, {
            success(event: Event): void{
              const store: any = this.getObjectStore(objectStoreName, true);
              store.add(data);
              if(successAction){
                dispatch(successAction(arg));
              }
              resolve(arg);
              this.close();
            }
          });
        }).catch((err: any): void=>{
          console.error(err);
          if(failAction){
            dispatch(failAction(arg));
          }
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
  putAction({ objectStoreName, successAction, failAction }: arg): Function{
    return (arg: Object): Function=>{
      // arg.data作为更新数据条件
      const data: string | number = arg.data;

      return (dispatch: Function, getState: Function): Promise=>{
        return new Promise((resolve: Function, reject: Function): void=>{
          IndexedDB(this.name, this.version, {
            success(event: Event): void{
              const store: any = this.getObjectStore(objectStoreName, true);
              store.put(data);
              if(successAction){
                dispatch(successAction(arg));
              }
              resolve(arg);
              this.close();
            }
          });
        }).catch((err: any): void=>{
          console.error(err);
          if(failAction){
            dispatch(failAction(arg));
          }
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
  deleteAction({ objectStoreName, successAction, failAction }: arg): Function{
    return (arg: Object): Function=>{
      // arg.query作为删除数据条件
      const query: Object = arg.query;

      return (dispatch: Function, getState: Function): Promise=>{
        return new Promise((resolve: Function, reject: Function): void=>{
          IndexedDB(this.name, this.version, {
            success(event: Event): void{
              const store: Object = this.getObjectStore(objectStoreName, true);
              store.delete(query);
              if(successAction){
                dispatch(successAction(arg));
              }
              resolve(arg);
              this.close();
            }
          });
        }).catch((err: any): void=>{
          console.error(err);
          if(failAction){
            dispatch(failAction(arg));
          }
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
  clearAction({ objectStoreName, successAction, failAction }: arg): Function{
    return (arg: ?Object): Function=>{

      return (dispatch: Function, getState: Function): Promise=>{
        return new Promise((resolve: Function, reject: Function): void=>{
          IndexedDB(this.name, this.version, {
            success(event: Event): void{
              const store: any = this.getObjectStore(objectStoreName, true);
              store.clear();
              if(successAction){
                dispatch(successAction(arg));
              }
              resolve(arg);
              this.close();
            }
          });
        }).catch((err: any): void=>{
          console.error(err);
          if(failAction){
            dispatch(failAction(arg));
          }
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
  cursorAction({ objectStoreName, successAction, failAction }: arg): Function{
    return (arg: Object): Function=>{
      /**
       * arg.query作为查询数据条件
       * arg.query.indexName: 要查询的索引
       * arg.query.range    : 游标范围
       */
      const { indexName, range }: {
        indexName: string,
        range: ?(string | number)
      } = arg.query;

      return (dispatch: Function, getState: Function): Promise=>{
        return new Promise((resolve: Function, reject: Function): void=>{
          IndexedDB(this.name, this.version, {
            success(event: Event): void{
              const _this: this = this;
              const store: Object = this.getObjectStore(objectStoreName);
              const arg: [string, ?(string | number)] = [indexName];
              if(range) arg.push(range);

              const resArr: Array = [];
              store.cursor(...arg, function(event: Object): void{
                const result: Object = event.target.result;
                if(result){
                  resArr.push(result.value);
                  result.continue();
                }else{
                  // 此处将result作为获取结果
                  const res: Object = {
                    ...arg,
                    result: resArr
                  };
                  if(successAction){
                    dispatch(successAction(res));
                  }
                  resolve(res);
                  _this.close();
                }
              });
            }
          });
        }).catch((err: any): void=>{
          console.error(err);
          if(failAction){
            dispatch(failAction(arg));
          }
        });
      };
    };
  }
}

export default IndexedDBRedux;