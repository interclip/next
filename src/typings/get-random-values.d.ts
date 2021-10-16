declare module 'get-random-values' {
    type TypedArray =
      | Int8Array
      | Uint8Array
      | Int16Array
      | Uint16Array
      | Int32Array
      | Uint32Array;
  
    export default function getRandomValues(array: TypedArray): any;
  }
  