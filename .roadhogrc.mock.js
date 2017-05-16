'use strict';

const FileSystem = require('fs');
const path = require('path');

const mock = {};
const mockDataPath = path.join(__dirname, '/mock');

FileSystem.readdirSync(mockDataPath)
  .forEach((file) => {
    Object.assign(mock, require('./mock/' + file));
  });

module.exports = mock;
