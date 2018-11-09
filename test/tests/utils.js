import IndexedDB from 'indexeddb-tools';

export const dbName: string = 'Test';
export const version: number = 1;
const objectStore: Array<Object> = [
  {
    name: 'username',
    index: 'username'
  },
  {
    name: 'age',
    index: 'age'
  },
  {
    name: 'sex',
    index: 'sex'
  }
];

/* 初始化数据库 */
export function initDb(): Promise{
  return new Promise((resolve: Function, reject: Function): void=>{
    IndexedDB(dbName, version, {
      success(event: Event): void{
        this.close();
        resolve(true);
      },
      upgradeneeded(event: Event): void{
        this.createObjectStore('table_1', 'id', objectStore);
        this.createObjectStore('table_2', 'id', objectStore);
        this.createObjectStore('table_3', 'id', objectStore);
        this.createObjectStore('table_4', 'id', objectStore);
        resolve(true);
      }
    });
  });
}

/* 排序 */
export function quickSort(rawArray: Array, key: string): Array{
  const len: number = rawArray.length;

  if(len <= 1) return rawArray;

  const basic: Object = rawArray[0];
  const value: any = key ? basic[key] : basic;

  let left: [] = [];
  let right: [] = [];

  for(let i: number = 1; i < len; i++){
    const item: Object = rawArray[i];
    const itemValue: any = key ? item[key] : item;

    if(itemValue < value){
      left.push(item);
    }else{
      right.push(item);
    }
  }

  if(left.length > 1) left = quickSort(left, key);
  if(right.length > 1) right = quickSort(right, key);

  return left.concat(basic, right);
}