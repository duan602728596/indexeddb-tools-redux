import IndexedDB from 'indexeddb-tools';

export const dbName = 'Test';
export const version = 1;
const objectStore = [
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
export function initDb() {
  return new Promise((resolve, reject) => {
    IndexedDB(dbName, version, {
      success(event) {
        this.close();
        resolve(true);
      },
      upgradeneeded(event) {
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
export function quickSort(rawArray, key) {
  const len = rawArray.length;

  if (len <= 1) return rawArray;

  const basic = rawArray[0];
  const value = key ? basic[key] : basic;

  let left = [];
  let right = [];

  for (let i = 1; i < len; i++) {
    const item = rawArray[i];
    const itemValue = key ? item[key] : item;

    if (itemValue < value) {
      left.push(item);
    } else {
      right.push(item);
    }
  }

  if (left.length > 1) left = quickSort(left, key);
  if (right.length > 1) right = quickSort(right, key);

  return left.concat(basic, right);
}