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
  // read 8 bytes, array with two elements
  // [2, 10]
})
.readText(10, function (data) {
  // some text in [10, 20]
});
.readUint32(function () {
  // read the rest as Uint32Array
});
```

# License

MIT
