# Global





* * *

## Class: BlobReader
Constructor function for the blob reader.

### BlobReader.read(count, cb) 

Read definite amount of bytes by the blob

**Parameters**

**count**: `Number`, The count of bytes, which should be read

**cb**: `function`, The callback, which should be
 invoked once the bytes are read

**Returns**: `BlobReader`, `this`

### BlobReader.readText(count, cb) 

Read defined amount of bytes as text

**Parameters**

**count**: `Number`, Number of bytes to be read

**cb**: `function`, Callback to be invoked

**Returns**: `BlobReader`, The target object

### BlobReader.readArrayBuffer(count, cb) 

Read defined amount of bytes as array buffer

**Parameters**

**count**: `Number`, Number of bytes to be read

**cb**: `function`, Callback to be invoked

**Returns**: `BlobReader`, The target object

### BlobReader.readBinaryString(count, cb) 

Read defined amount of bytes as binary string

**Parameters**

**count**: `Number`, Number of bytes to be read

**cb**: `function`, Callback to be invoked

**Returns**: `BlobReader`, The target object

### BlobReader.readDataURL(count, cb) 

Read defined amount of bytes as data URL

**Parameters**

**count**: `Number`, Number of bytes to be read

**cb**: `function`, Callback to be invoked

**Returns**: `BlobReader`, The target object

### BlobReader.readUint8(name, count, endianness) 

Read defined amount of bytes as uint8 array

**Parameters**

**name**: `String`, Property name

**count**: `Number`, Number of 8 bit numbers to be read

**endianness**: `BlobReader.ENDIANNESS`, Endianness of the
 bytes which should be read. If differ from the system's endianness
 the values will be converted

**Returns**: `BlobReader`, The target object

### BlobReader.readUint16(name, count, endianness) 

Read defined amount of bytes as uint16 array

**Parameters**

**name**: `String`, Property name

**count**: `Number`, Number of 16 bit numbers to be read

**endianness**: `BlobReader.ENDIANNESS`, Endianness of the
 bytes which should be read. If differ from the system's endianness
 the values will be converted

**Returns**: `BlobReader`, The target object

### BlobReader.readUint32(name, count, endianness) 

Read defined amount of bytes as uint32 array

**Parameters**

**name**: `String`, Property name

**count**: `Number`, Number of 32 bit numbers to be read

**endianness**: `BlobReader.ENDIANNESS`, Endianness of the
 bytes which should be read. If differ from the system's endianness
 the values will be converted

**Returns**: `BlobReader`, The target object

### BlobReader.readBlob(name, count) 

Read a blob and push it to the result object

**Parameters**

**name**: `String`, Property name

**count**: `Number`, Number of bytes to be sliced from the Blob

**Returns**: `BlobReader`, The target object

### BlobReader.skip(count) 

Skips defined amount of bytes, usually used for padding

**Parameters**

**count**: `Number`, Number of bytes to be skipped

**Returns**: `BlobReader`, The target object

### BlobReader.commit() 

Gets the result object

**Returns**: `Object`, The object resulted from the calls of readUint



* * *










