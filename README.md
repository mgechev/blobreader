![](https://travis-ci.org/mgechev/blobreader.svg?branch=master)

# BlobReader

Simple interface for reading blobs, sequentially

# Example

```javascript
// Blob definition
var uint8 = new Uint8Array([1, 2]);
var uint16 = new Uint16Array([3]);
var uint82 = new Uint8Array([4, 3]);
var uint32 = new Uint32Array([8]);
var blob = new Blob([uint8, uint16, uint82, uint32]);

// Reading the blob
BlobReader(blob)
.readUint8('uint8', 2)
.readUint16('uint16')
.readUint8('uint82')
.skip()
.readUint32('uint32')
.commit(function (data) {
  expect(data.uint8[0]).toBe(1);
  expect(data.uint8[1]).toBe(2);
  expect(data.uint16).toBe(3);
  expect(typeof data.uint82).toBe('number');
  expect(data.uint82).toBe(4);
  expect(data.uint32).toBe(8);
});
```

# License

MIT
