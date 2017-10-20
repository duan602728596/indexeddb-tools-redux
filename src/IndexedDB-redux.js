((factory)=>{

  if(typeof module === "object" && typeof module.exports === 'object'){
    const IndexedDB = require('indexeddb-tools');
    module.exports = factory(IndexedDB);
  }else{
    const IndexedDB = window.IndexedDB;
    window.IndexedDB_Redux = factory(IndexedDB);
  }

})((IndexedDB)=>{

  /**
   * 获取数据
   * @param { string } name           : 连接的数据库名
   * @param { number } version        : 数据库版本号
   * @param { string } objectStoreName: ObjectStore名字
   * @param { Function } successAction: 获取数据成功的Action
   * @param { Function } failAction   : 获取数据失败的Action
   */
  function getAction({ name, version, objectStoreName, successAction, failAction }){
    return ({ data })=>{
      return (dispatch, getState)=>{
        return new Promise((resolve, reject)=>{
          IndexedDB(name, version, {
            success: function(eTarget, event){
              const _this = this;
              const store = this.getObjectStore(objectStoreName);
              store.get(data, function(result, event){
                if(successAction){
                  dispatch(successAction(result));
                }
                resolve(result);
                _this.close();
              });
            }
          });
        }).catch((err)=>{
          console.error(err);
          if(failAction){
            dispatch(failAction());
          }
        });
      };
    }
  }

  /**
   * 添加数据
   * @param { string } name           : 连接的数据库名
   * @param { number } version        : 数据库版本号
   * @param { string } objectStoreName: ObjectStore名字
   * @param { Function } successAction: 添加数据成功的Action
   * @param { Function } failAction   : 添加数据失败的Action
   */
  function addAction({ name, version, objectStoreName, successAction, failAction }){
    return (arg)=>{
      const data = arg.data;
      return (dispatch, getState)=>{
        return new Promise((resolve, reject)=>{
          IndexedDB(name, version, {
            success: function(eTarget, event){
              const store = this.getObjectStore(objectStoreName);
              store.add(data);
              if(successAction){
                dispatch(successAction(arg));
              }
              resolve(arg);
              this.close();
            }
          });
        }).catch((err)=>{
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
   * @param { string } name           : 连接的数据库名
   * @param { number } version        : 数据库版本号
   * @param { string } objectStoreName: ObjectStore名字
   * @param { Function } successAction: 更新数据成功的Action
   * @param { Function } failAction   : 更新数据失败的Action
   */
  function putAction({ name, version, objectStoreName, successAction, failAction }){
    return (arg)=>{
      const data = arg.data;
      return (dispatch, getState)=>{
        return new Promise((resolve, reject)=>{
          IndexedDB(name, version, {
            success: function(eTarget, event){
              const store = this.getObjectStore(objectStoreName);
              store.put(data);
              if(successAction){
                dispatch(successAction(arg));
              }
              resolve(arg);
              this.close();
            }
          });
        }).catch((err)=>{
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
   * @param { string } name           : 连接的数据库名
   * @param { number } version        : 数据库版本号
   * @param { string } objectStoreName: ObjectStore名字
   * @param { Function } successAction: 删除数据成功的Action
   * @param { Function } failAction   : 删除数据失败的Action
   */
  function deleteAction({ name, version, objectStoreName, successAction, failAction }){
    return (arg)=>{
      const data = arg.data;
      return (dispatch, getState)=>{
        return new Promise((resolve, reject)=>{
          IndexedDB(name, version, {
            success: function(eTarget, event){
              const store = this.getObjectStore(objectStoreName);
              store.delete(data);
              if(successAction){
                dispatch(successAction(arg));
              }
              resolve(arg);
              this.close();
            }
          });
        }).catch((err)=>{
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
   * @param { string } name           : 连接的数据库名
   * @param { number } version        : 数据库版本号
   * @param { string } objectStoreName: ObjectStore名字
   * @param { Function } successAction: 删除数据成功的Action
   * @param { Function } failAction   : 删除数据失败的Action
   */
  function clearAction({ name, version, objectStoreName, successAction, failAction }){
    return ()=>{
      return (dispatch, getState)=>{
        return new Promise((resolve, reject)=>{
          IndexedDB(name, version, {
            success: function(eTarget, event){
              const store = this.getObjectStore(objectStoreName);
              store.clear();
              if(successAction){
                dispatch(successAction());
              }
              resolve();
              this.close();
            }
          });
        }).catch((err)=>{
          console.error(err);
          if(failAction){
            dispatch(failAction());
          }
        });
      };
    };
  }

  /**
   * 根据游标查询数据
   * @param { string } name           : 连接的数据库名
   * @param { number } version        : 数据库版本号
   * @param { string } objectStoreName: ObjectStore名字
   * @param { Function } successAction: 删除数据成功的Action
   * @param { Function } failAction   : 删除数据失败的Action
   */
  function cursorAction({ name, version, objectStoreName, successAction, failAction }){
    return (arg)=>{
      /**
       * indexName: 要查询的索引
       * range    : 游标范围
       */
      const { indexName, range } = arg;
      return (dispatch, getState)=>{
        return new Promise((resolve, reject)=>{
          IndexedDB(name, version, {
            success: function(eTarget, event){
              const _this = this;
              const store = this.getObjectStore(objectStoreName);
              const arg = [indexName];
              if(range) arg.push(range);

              const resArr = [];
              store.cursor(...arg, function(result, event){
                if(result){
                  resArr.push(result.value);
                  result.continue();
                }else{
                  if(successAction){
                    dispatch(successAction(resArr));
                  }
                  resolve(resArr);
                  _this.close();
                }
              });
            }
          });
        }).catch((err)=>{
          console.error(err);
          if(failAction){
            dispatch(failAction());
          }
        });
      };
    };
  }

  return {
    getAction,
    addAction,
    putAction,
    deleteAction,
    clearAction,
    cursorAction
  };
});