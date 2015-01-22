![](https://travis-ci.org/mgechev/blobreader.svg?branch=master)

# BlobReader

Simple interface for reading blobs, sequentially

# Example

```javascript
var blob = new Blob(/* a lot of data */);
BlobReader(blob, BlobReader.ENDIANNESS.BIG_ENDIAN);
.readUint16('prop1')
.readUint16('prop2', 2)
.readBlob('anotherBlob', 16)
.readUint32('prop3')
.commit(function (result) {
  var prop1 = result.prop1[0];
  var arr = [result.prop2[0], result.prop2[1]];
  var prop3 = result.prop3[0];
});
```

# License

MIT
