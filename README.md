# BlobReader

Simple interface for reading blobs, sequentially

# Example

```javascript
var blob = new Blob(/* a lot of data */);
BlobReader(blob)
.readUint8(2, function (data) {
  // read two bytes [0, 2]
})
.readUint16(4, function (data) {
  // read 4 bytes, array with two elements
  // [2, 6]
})
.readText(10, function (data) {
  // some text in [6, 16]
});
.readUint32(function () {
  // read the rest as Uint32Array
});
```

# License

MIT
