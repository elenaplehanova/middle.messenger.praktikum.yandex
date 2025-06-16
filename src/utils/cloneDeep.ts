type Indexed<T = any> = {
 [k in (string | symbol)]: T;
};
 
function cloneDeep<T extends Indexed>(obj: T) {
 return (function _cloneDeep(item: T): T | Date | Set<unknown> | Map<unknown, unknown> | object | T[] {
     // Handle:
     // * null
     // * undefined
     // * boolean
     // * number
     // * string
     // * symbol
     // * function
     if (item === null || typeof item !== "object") {
         return item;
     }
 
     // Handle:
     // * Date
     if (item instanceof Date) {
         return new Date((item as Date).valueOf());
     }
 
     // Handle:
     // * Array
     if (item instanceof Array) {
         let copy: ReturnType<typeof _cloneDeep>[] = [];
 
         item.forEach((_, i) => (copy[i] = _cloneDeep(item[i])));
 
         return copy;
     }
 
     // Handle:
     // * Set
     if (item instanceof Set) {
         let copy = new Set();
 
         item.forEach(v => copy.add(_cloneDeep(v)));
 
         return copy;
     }
 
     // Handle:
     // * Map
     if (item instanceof Map) {
         let copy = new Map();
 
         item.forEach((v, k) => copy.set(k, _cloneDeep(v)));
 
         return copy;
     }
 
     // Handle:
     // * Object
     if (item instanceof Object) {
         let copy: Indexed = {};
 
         // Handle:
         // * Object.symbol
         Object.getOwnPropertySymbols(item).forEach(s => (copy[s.toString()] = _cloneDeep(item[s.toString()])));
 
         // Handle:
         // * Object.name (other)
         Object.keys(item).forEach(k => (copy[k] = _cloneDeep(item[k])));
 
         return copy;
     }
 
     throw new Error(`Unable to copy object: ${item}`);
 })(obj);
}

export default cloneDeep;

// function cloneDeep<T extends Indexed>(obj: T): T {
//   return (function _cloneDeep(source: any): any {
//     // 1. Обработка примитивов и функций
//     if (source === null || typeof source !== "object") {
//       return source;
//     }

//     // 2. Клонирование Date
//     if (source instanceof Date) {
//       return new Date(source.valueOf());
//     }

//     // 3. Клонирование массивов
//     if (Array.isArray(source)) {
//       return source.map((element) => _cloneDeep(element));
//     }

//     // 4. Клонирование Set
//     if (source instanceof Set) {
//       const copy = new Set();
//       source.forEach(v => copy.add(_cloneDeep(v)));
//       return copy;
//     }

//     // 5. Клонирование Map
//     if (source instanceof Map) {
//       const copy = new Map();
//       source.forEach((v, k) => copy.set(_cloneDeep(k), _cloneDeep(v)));
//       return copy;
//     }

//     // 6. Клонирование Symbol (новый блок)
//     if (typeof source === 'symbol') {
//       return Symbol(source.description);
//     }

//     // 7. Клонирование обычных объектов
//     if (source instanceof Object) {
//       const copy: Indexed = {};

//       // Копируем строковые свойства
//       Object.keys(source).forEach(key => {
//         copy[key] = _cloneDeep(source[key]);
//       });

   
//       return copy;
//     }

//     throw new Error(`Не удалось скопировать объект: ${source}`);
//   })(obj);
// }

// export default cloneDeep;
