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

  it('should be able to read parts of the blob as text', function (done) {
    var str = 'test blob';
    var blob = new Blob([str]);
    BlobReader(blob)
    .readText(2, function (text) {
      expect(text).toBe('te');
    })
    .readText(function (text) {
      expect(text).toBe('st blob');
      done();
    });
  });

  it('should be able to read parts of blob as array', function (done) {
    var uint = new Uint16Array([1, 2, 3, 4]);
    var blob = new Blob([uint]);
    BlobReader(blob)
    .readArrayBuffer(2, function (arr) {
      expect(new Uint16Array(arr)[0]).toBe(1);
    })
    .readArrayBuffer(function (arr) {
      arr = new Uint16Array(arr);
      for (var i = 0; i < arr.length; i += 1) {
        expect(arr[i]).toBe(uint[i + 1]);
      }
      done();
    });
  });

  it('should be able to read a chain of words', function (done) {
    var uint8 = new Uint8Array([1, 2]);
    var uint16 = new Uint16Array([3]);
    var uint82 = new Uint8Array([4, 3]);
    var uint32 = new Uint32Array([8]);
    var blob = new Blob([uint8, uint16, uint82, uint32]);
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
      done();
    });
  });

  it('should work with different endianness', function (done) {
    var buffer = new ArrayBuffer(2);
    var uint16 = new Uint16Array(buffer);
    var uint8 = new Uint8Array(buffer);
    uint8[0] = 1;
    uint8[1] = 2;
    var blob = new Blob([uint16]);
    BlobReader(blob, BlobReader.ENDIANNESS.BIG_ENDIAN)
    .readUint16('data')
    .commit(function (data) {
      expect(data.data).toBe(258);
      done();
    });
  });

  it('should work with different endianness for specific word',
    function (done) {
      var buffer = new ArrayBuffer(2);
      var uint16 = new Uint16Array(buffer);
      var uint162 = new Uint16Array(buffer);
      var uint8 = new Uint8Array(buffer);
      uint8[0] = 1;
      uint8[1] = 2;
      var blob = new Blob([uint16, uint162]);
      BlobReader(blob)
      .readUint16('u16')
      .readUint16('u162', 1, BlobReader.ENDIANNESS.BIG_ENDIAN)
      .commit(function (data) {
        expect(data.u16).toBe(513);
        expect(data.u162).toBe(258);
        done();
      });
    });

});
