import * as wasm from './permutations_bg.wasm';

const lTextDecoder =
  typeof TextDecoder === 'undefined'
    ? (0, module.require)('util').TextDecoder
    : TextDecoder;

let cachedTextDecoder = new lTextDecoder('utf-8', {
  ignoreBOM: true,
  fatal: true,
});

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
  if (
    cachegetUint8Memory0 === null ||
    cachegetUint8Memory0.buffer !== wasm.memory.buffer
  ) {
    cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
  }
  return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
  return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

let heap_next = heap.length;

function addHeapObject(obj) {
  if (heap_next === heap.length) heap.push(heap.length + 1);
  const idx = heap_next;
  heap_next = heap[idx];

  heap[idx] = obj;
  return idx;
}

function getObject(idx) {
  return heap[idx];
}

let WASM_VECTOR_LEN = 0;

const lTextEncoder =
  typeof TextEncoder === 'undefined'
    ? (0, module.require)('util').TextEncoder
    : TextEncoder;

let cachedTextEncoder = new lTextEncoder('utf-8');

const encodeString =
  typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
        return cachedTextEncoder.encodeInto(arg, view);
      }
    : function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
          read: arg.length,
          written: buf.length,
        };
      };

function passStringToWasm0(arg, malloc, realloc) {
  if (realloc === undefined) {
    const buf = cachedTextEncoder.encode(arg);
    const ptr = malloc(buf.length);
    getUint8Memory0()
      .subarray(ptr, ptr + buf.length)
      .set(buf);
    WASM_VECTOR_LEN = buf.length;
    return ptr;
  }

  let len = arg.length;
  let ptr = malloc(len);

  const mem = getUint8Memory0();

  let offset = 0;

  for (; offset < len; offset++) {
    const code = arg.charCodeAt(offset);
    if (code > 0x7f) break;
    mem[ptr + offset] = code;
  }

  if (offset !== len) {
    if (offset !== 0) {
      arg = arg.slice(offset);
    }
    ptr = realloc(ptr, len, (len = offset + arg.length * 3));
    const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
    const ret = encodeString(arg, view);

    offset += ret.written;
  }

  WASM_VECTOR_LEN = offset;
  return ptr;
}

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
  if (
    cachegetInt32Memory0 === null ||
    cachegetInt32Memory0.buffer !== wasm.memory.buffer
  ) {
    cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
  }
  return cachegetInt32Memory0;
}

let stack_pointer = 32;

function addBorrowedObject(obj) {
  if (stack_pointer == 1) throw new Error('out of js stack');
  heap[--stack_pointer] = obj;
  return stack_pointer;
}

function dropObject(idx) {
  if (idx < 36) return;
  heap[idx] = heap_next;
  heap_next = idx;
}

function takeObject(idx) {
  const ret = getObject(idx);
  dropObject(idx);
  return ret;
}
/**
 * @param {any} array
 * @param {number} n
 * @returns {any}
 */
export function permute(array, n) {
  try {
    var ret = wasm.permute(addBorrowedObject(array), n);
    return takeObject(ret);
  } finally {
    heap[stack_pointer++] = undefined;
  }
}

export function __wbindgen_json_parse(arg0, arg1) {
  var ret = JSON.parse(getStringFromWasm0(arg0, arg1));
  return addHeapObject(ret);
}

export function __wbindgen_json_serialize(arg0, arg1) {
  const obj = getObject(arg1);
  var ret = JSON.stringify(obj === undefined ? null : obj);
  var ptr0 = passStringToWasm0(
    ret,
    wasm.__wbindgen_malloc,
    wasm.__wbindgen_realloc
  );
  var len0 = WASM_VECTOR_LEN;
  getInt32Memory0()[arg0 / 4 + 1] = len0;
  getInt32Memory0()[arg0 / 4 + 0] = ptr0;
}
