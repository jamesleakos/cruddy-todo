const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, dataString)=> {
    if (err) {
      console.log('erroring here in server.js - line 11');
      callback(err);
    } else {
      fs.writeFile(path.join(exports.dataDir, `${dataString}.txt`), text, (err) => {
        if (err) {
          console.log(err);
          callback(err);
        } else {
          callback(null, {id: dataString, text: text});
        }
      });
    }
  });
  // callback(null, { id, text });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      console.log('index.readAll error: ' + err);
      callback(err);
    } else {
      const data = files.map((file) => {
        console.log(file);
        const id = path.parse(file).name;
        return {id: id, text: id};
      });
      callback(null, data);
    }
  });
};

exports.readOne = (id, callback) => {
  fs.readFile(path.join(exports.dataDir, id + '.txt'), 'utf8', (err, fileData) => {
    if (err) {
      callback(err);
    } else {
      console.log('filedata is: ' + fileData);
      callback(null, {id: id, text: fileData});
    }
  });
};

exports.update = (id, text, callback) => {
  fs.readFile(path.join(exports.dataDir, id + '.txt'), 'utf8', (err, fileData) => {
    if (err) {
      callback(err);
    } else {
      fs.writeFile(path.join(exports.dataDir, id + '.txt'), text, (err) => {
        if (err) {
          callback(err);
        } else {
          callback(null, {id: id, text: text});
        }
      });
    }
  });
};


exports.delete = (id, callback) => {
  fs.unlink(path.join(exports.dataDir, id + '.txt'), (err) => {
    if (err) {
      callback(err);
    } else {
      callback();
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
