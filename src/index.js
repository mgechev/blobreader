/*jshint bitwise: false*/

(function (w) {
  'use strict';

  function getEndianness() {
    var a = new ArrayBuffer(4);
    var b = new Uint8Array(a);
    var c = new Uint32Array(a);
    b[0] = 0xa1;
    b[1] = 0xb2;
    b[2] = 0xc3;
    b[3] = 0xd4;
    if (c[0] === 0xd4c3b2a1) {
      return BlobReader.ENDIANNESS.LITTLE_ENDIAN;
    }
    if (c[0] === 0xa1b2c3d4) {
      return BlobReader.ENDIANNESS.BIG_ENDIAN;
    } else {
      throw new Error('Unrecognized endianness');
    }
  }
  /**
   * Constructor function for the blob reader.
   *
   * @public
   * @constructor
   * @param {Blob} blob The blob object, which should be read
   * @param {BlobReader.ENDIANNESS} dataEndianness Endianness of the
   *  expected data
   * @param {BlobReader.ENDIANNESS} endianness System endianness
   */
  function BlobReader(blob, dataEndianness, endianness) {
    if (!(this instanceof BlobReader)) {
      return new BlobReader(blob, dataEndianness, endianness);
    }
    this._blob = blob;
    this._position = 0;
    this._queue = [];
    this._currentEndianness = endianness || getEndianness();
    this._dataEndianness = dataEndianness || this._currentEndianness;
    this._pendingTask = false;
    this._currentResult = {};
  }

  BlobReader.ARRAY_BUFFER = 'ArrayBuffer';
  BlobReader.BINARY_STRING = 'BinaryString';
  BlobReader.TEXT = 'Text';
  BlobReader.DATA_URL = 'DataURL';
  BlobReader.BLOB = 'Blob';

  BlobReader.ENDIANNESS = {
    BIG_ENDIAN: 'BIG_ENDIAN',
    LITTLE_ENDIAN: 'LITTLE_ENDIAN'
  };

  BlobReader.prototype.setDataEndianness = function (endianness) {
    this._dataEndianness = endianness;
  };

  /* jshint validthis: true */
  function invokeNext() {

    function done(data) {
      current.cb(data);
      this._pendingTask = false;
      this._position += current.count;
      invokeNext.call(this);
    }

    var current = this._queue.shift();
    if (!current) {
      return;
    }
    if (current.count === undefined) {
      current.count = this._blob.size - this._position;
    }
    if (this._position + current.count > this._blob.size) {
      throw new Error('Limit reached. Trying to read ' +
          (this._position + current.count) + ' bytes out of ' +
          this._blob.size + '.');
    }
    if (!current.type) {
      current.type = BlobReader.BINARY_STRING;
    }
    var slice = this._blob
      .slice(this._position, this._position + current.count);
    if (current.type === BlobReader.BLOB) {
      done.call(this, slice);
    } else {
      var reader = new FileReader();
      this._pendingTask = true;
      reader.onload = function (e) {
        done.call(this, e.target.result);
      }.bind(this);
      reader.onerror = function () {
        throw new Error('Error while reading the blob');
      };
      reader['readAs' + current.type](slice);
    }
  }

  /**
   * Read definite amount of bytes by the blob
   *
   * @public
   * @param {Number} count The count of bytes, which should be read
   * @param {Function} cb The callback, which should be
   *  invoked once the bytes are read
   * @return {BlobReader} `this`
   */
  BlobReader.prototype.read = function (count, type, cb) {
    if (typeof count === 'string') {
      cb = type;
      count = undefined;
      type = count;
    }
    if (typeof count === 'function') {
      cb = count;
      count = undefined;
    }
    if (typeof type === 'function') {
      cb = type;
      type = undefined;
    }
    this._queue.push({
      count: count,
      cb: cb,
      type: type
    });
    if (!this._pendingTask) {
      invokeNext.call(this);
    }
    return this;
  };

  /**
   * Read defined amount of bytes as text
   *
   * @public
   * @param {Number} count Number of bytes to be read
   * @param {Function} cb Callback to be invoked
   * @return {BlobReader} The target object
   */
  BlobReader.prototype.readText = function (count, cb) {
    return this.read(count, BlobReader.TEXT, cb);
  };

  /**
   * Read defined amount of bytes as array buffer
   *
   * @public
   * @param {Number} count Number of bytes to be read
   * @param {Function} cb Callback to be invoked
   * @return {BlobReader} The target object
   */
  BlobReader.prototype.readArrayBuffer = function (count, cb) {
    return this.read(count, BlobReader.ARRAY_BUFFER, cb);
  };

  /**
   * Read defined amount of bytes as binary string
   *
   * @public
   * @param {Number} count Number of bytes to be read
   * @param {Function} cb Callback to be invoked
   * @return {BlobReader} The target object
   */
  BlobReader.prototype.readBinaryString = function (count, cb) {
    return this.read(count, BlobReader.BINARY_STRING, cb);
  };

  /**
   * Read defined amount of bytes as data URL
   *
   * @public
   * @param {Number} count Number of bytes to be read
   * @param {Function} cb Callback to be invoked
   * @return {BlobReader} The target object
   */
  BlobReader.prototype.readDataURL = function (count, cb) {
    return this.read(count, BlobReader.DATA_URL, cb);
  };

  function swap(arr, cb) {
    for (var i = 0; i < arr.length; i += 1) {
      arr[i] = cb(arr[i]);
    }
    return arr;
  }

  var byteFormatter = {
    swap8: function (arr) {
      return swap(arr, function (val) {
        return val;
      });
    },
    swap16: function (arr) {
      return swap(arr, function (val) {
        return ((val & 0xFF) << 8) |
               ((val >> 8) & 0xFF);
      });
    },
    swap32: function (arr) {
      return swap(arr, function (val) {
        return ((val & 0xFF) << 24) |
               ((val & 0xFF00) << 8) |
               ((val >> 8) & 0xFF00) |
               ((val >> 24) & 0xFF);
      });
    }
  };

  /* jshint validthis: true */
  function uintReader(name, count, octets, endianness) {
    count = (count || 1) * octets;
    var callback = function (data) {
      var bitsNum = 8 * octets;
      var type = window['Uint' + bitsNum + 'Array'];
      data = new type(data);
      if (this._currentEndianness !== endianness) {
        data = byteFormatter['swap' + bitsNum](data);
      }
      if (count === octets) {
        data = data[0];
      }
      this._currentResult[name] = data;
    }.bind(this);
    return this.readArrayBuffer(count, callback);
  }

  /**
   * Read defined amount of bytes as uint8 array
   *
   * @public
   * @param {String} name Property name
   * @param {Number} count Number of 8 bit numbers to be read
   * @param {BlobReader.ENDIANNESS} endianness Endianness of the
   *  bytes which should be read. If differ from the system's endianness
   *  the values will be converted
   * @return {BlobReader} The target object
   */
  BlobReader.prototype.readUint8 = function (name, count, endianness) {
    return uintReader.call(this, name, count, 1,
           endianness || this._dataEndianness);
  };

  /**
   * Read defined amount of bytes as uint16 array
   *
   * @public
   * @param {String} name Property name
   * @param {Number} count Number of 16 bit numbers to be read
   * @param {BlobReader.ENDIANNESS} endianness Endianness of the
   *  bytes which should be read. If differ from the system's endianness
   *  the values will be converted
   * @return {BlobReader} The target object
   */
  BlobReader.prototype.readUint16 = function (name, count, endianness) {
    return uintReader.call(this, name, count, 2,
           endianness || this._dataEndianness);
  };

  /**
   * Read defined amount of bytes as uint32 array
   *
   * @public
   * @param {String} name Property name
   * @param {Number} count Number of 32 bit numbers to be read
   * @param {BlobReader.ENDIANNESS} endianness Endianness of the
   *  bytes which should be read. If differ from the system's endianness
   *  the values will be converted
   * @return {BlobReader} The target object
   */
  BlobReader.prototype.readUint32 = function (name, count, endianness) {
    return uintReader.call(this, name, count, 4,
           endianness || this._dataEndianness);
  };

  /**
   * Read a blob and push it to the result object
   *
   * @public
   * @param {String} name Property name
   * @param {Number} count Number of bytes to be sliced from the Blob
   * @return {BlobReader} The target object
   */
  BlobReader.prototype.readBlob = function (name, count) {
    this._queue.push({
      count: count,
      type: BlobReader.BLOB,
      cb: function (result) {
        this._currentResult[name] = result;
      }.bind(this)
    });
    return this;
  };

  /**
   * Skips defined amount of bytes, usually used for padding
   *
   * @public
   * @param {Number} count Number of bytes to be skipped
   * @return {BlobReader} The target object
   */
  BlobReader.prototype.skip = function (count) {
    count = count || 1;
    this._queue.push({
      count: count,
      type: BlobReader.BLOB,
      cb: function () {}
    });
    return this;
  };

  /**
   * Gets the result object
   *
   * @public
   * @return {Object} The object resulted from the calls of readUint
   */
  BlobReader.prototype.commit = function (cb) {
    var task = {
      count: 0,
      type: BlobReader.BLOB,
      cb: function () {
        var res = this._currentResult;
        this._currentResult = {};
        cb(res);
      }.bind(this)
    };
    this._queue.push(task);
    return this;
  };

  w.BlobReader = BlobReader;

}(window));
