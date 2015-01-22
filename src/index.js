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

BlobReader.prototype._invokeNext = function () {
  var current = this.queue.shift();
  if (!current) {
    return;
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
  reader.readAsBinaryString();
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
BlobReader.prototype.read = function (count, cb) {
  this.queue.push({
    count: count,
    cb: cb
  });
  if (!this._pendingTask) {
    this._invokeNext();
  }
  return this;
};
