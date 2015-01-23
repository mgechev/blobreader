/* global BlobReader, it, expect, describe */

describe('BlobReader', function () {
  'use strict';

  it('should export global function BlobReader', function () {
    expect(typeof BlobReader).toBe('function');
  });

  it('should define the specified public API', function () {
    var methods = [
      'read',
      'readText',
      'readDataURL',
      'readArrayBuffer',
      'readBinaryString',
      'readBlob',
      'readUint8',
      'readUint16',
      'readUint32'
    ];
    methods.forEach(function (method) {
      expect(typeof BlobReader.prototype[method]).toBe('function');
    });
  });

  it('should read the whole blob', function (done) {
    var str = 'test blob';
    // new Blob doesn't work in PhantomJS
    // https://github.com/ariya/phantomjs/issues/11013
    var blob = new Blob([str]);
    BlobReader(blob)
    .read(BlobReader.TEXT, function (text) {
      expect(text).toBe(str);
      done();
    });
  });

  it('should read slice of the blob if size specified', function (done) {
    var str = 'test blob';
    var blob = new Blob([str]);
    BlobReader(blob)
    .read(3, BlobReader.TEXT, function (text) {
      expect(text).toBe(str.substring(0, 3));
      done();
    });
  });

  it('should support chaining', function (done) {
    var str = 'test blob';
    var blob = new Blob([str]);
    BlobReader(blob)
    .read(3, BlobReader.TEXT, function (text) {
      expect(text).toBe(str.substring(0, 3));
    })
    .read(2, BlobReader.TEXT, function (text) {
      expect(text).toBe(str.substring(3, 5));
      done();
    });
  });
});
