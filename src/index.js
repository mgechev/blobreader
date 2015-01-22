(function (w) {
  'use strict';

  /**
   * Constructor function for the blob reader.
   *
   * @public
   * @constructor
   * @param {Blob} blob The blob object, which should be read
   */
  function BlobReader(blob) {
    if (!(this instanceof BlobReader)) {
      return new BlobReader(blob);
    }
    this.blob = blob;
    this.position = 0;
    this.queue = [];
    this._pendingTask = false;
  }

  BlobReader.ARRAY_BUFFER = 'ArrayBuffer';
  BlobReader.BINARY_STRING = 'BinaryString';
  BlobReader.TEXT = 'Text';
  BlobReader.DATA_URL = 'DataURL';

  BlobReader.prototype._invokeNext = function () {
    var current = this.queue.shift();
    if (!current) {
      return;
    }
    if (this.position + current.count > this.blob.size) {
      throw new Error('Limit reached. Trying to read ' +
          (this.position + current.count) + ' bytes out of ' +
          this.blob.size + '.');
    }
    var reader = new FileReader();
    this._pendingTask = true;
    reader.onload = function (e) {
      var data = e.target.result;
      this._pendingTask = false;
      this._invokeNext();
      current.cb(data);
    }.bind(this);
    reader.onerror = function () {
      throw new Error('Error while reading the blob');
    };
    if (current.type) {
      reader['readAs' + current.type]();
    } else {
      reader.readAsBinaryString();
    }
    this.position += current.count;
  };

  /**
   * Read definite amount of bytes by the blob
   *
   * @public
   * @param {Number} count The count of bytes, which should be read
   * @param {Function} cb The callback, which should be
   *  invoked once the bytes are read
   * @return {BlobReader} Returns `this`
   */
  BlobReader.prototype.read = function (count, type, cb) {
    if (typeof count === 'function') {
      cb = count;
      type = undefined;
      count = this.blob.size;
    }
    if (typeof type === 'function') {
      cb = type;
      type = undefined;
    }
    this.queue.push({
      count: count,
      cb: cb,
      type: type
    });
    if (!this._pendingTask) {
      this._invokeNext();
    }
    return this;
  };

  /**
   * Read defined amount of bytes as text
   *
   * @public
   * @param {Number} count Number of bytes to be read
   * @param {Function} cb Calback to be invoked
   * @return {BlobReader} Return the target object instance
   */
  BlobReader.prototype.readText = function (count, cb) {
    return this.read(count, BlobReader.TEXT, cb);
  };

  /**
   * Read defined amount of bytes as array buffer
   *
   * @public
   * @param {Number} count Number of bytes to be read
   * @param {Function} cb Calback to be invoked
   * @return {BlobReader} Return the target object instance
   */
  BlobReader.prototype.readArrayBuffer = function (count, cb) {
    return this.read(count, BlobReader.ARRAY_BUFFER, cb);
  };

  /**
   * Read defined amount of bytes as binary string
   *
   * @public
   * @param {Number} count Number of bytes to be read
   * @param {Function} cb Calback to be invoked
   * @return {BlobReader} Return the target object instance
   */
  BlobReader.prototype.readBinaryString = function (count, cb) {
    return this.read(count, BlobReader.BINARY_STRING, cb);
  };

  /**
   * Read defined amount of bytes as data url
   *
   * @public
   * @param {Number} count Number of bytes to be read
   * @param {Function} cb Calback to be invoked
   * @return {BlobReader} Return the target object instance
   */
  BlobReader.prototype.readDataURL = function (count, cb) {
    return this.read(count, BlobReader.DATA_URL, cb);
  };

  /**
   * Read defined amount of bytes as text
   *
   * @private
   * @param {Number} count Number of bytes to be read
   * @param {Function} cb Calback to be invoked
   * @param {Function} type Constructor function which indicates
   *  the type which should be used as wrapper of the returned data
   * @return {BlobReader} Return the target object instance
   */
  BlobReader.prototype._readWrapped = function (count, cb, type) {
    var callback = function (data) {
      data = new type(data);
      cb(data);
    };
    return this.readArrayBuffer(count, callback);
  };

  /**
   * Read defined amount of bytes as uint8 array
   *
   * @public
   * @param {Number} count Number of bytes to be read
   * @param {Function} cb Calback to be invoked
   * @return {BlobReader} Return the target object instance
   */
  BlobReader.prototype.readUint8 = function (count, cb) {
    return this._readWrapped(count, cb, Uint8Array);
  };

  /**
   * Read defined amount of bytes as uint16 array
   *
   * @public
   * @param {Number} count Number of bytes to be read
   * @param {Function} cb Calback to be invoked
   * @return {BlobReader} Return the target object instance
   */
  BlobReader.prototype.readUint16 = function (count, cb) {
    return this._readWrapped(count, cb, Uint16Array);
  };

  /**
   * Read defined amount of bytes as uint32 array
   *
   * @public
   * @param {Number} count Number of bytes to be read
   * @param {Function} cb Calback to be invoked
   * @return {BlobReader} Return the target object instance
   */
  BlobReader.prototype.readUint32 = function (count, cb) {
    return this._readWrapped(count, cb, Uint32Array);
  };

  w.BlobReader = BlobReader;

}(window));
