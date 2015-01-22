# BlobReader

Simple interface for reading blobs, sequentially

# Example

```javascript
var blob = new Blob(/* a lot of data */);
BlobReader(blob)
  .read(5, function (data) {
    console.log(data);
  })
  .read(2, function (data) {
    var arr = new Uint16Array(data);
    console.log('Bytes 6 and 7 are', arr);
  })
  //...
```

# License

MIT
