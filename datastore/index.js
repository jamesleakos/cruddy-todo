const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');

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
  new Promise((resolve, reject) => {
    fs.readdir(exports.dataDir, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  })
    .then((files) => {
      return Promise.all(
        files.map((file) => {
          return new Promise((resolve, reject) => {
            fs.readFile(path.join(exports.dataDir, file), 'utf8', (err, fileData) => {
              if (err) {
                reject(err);
              } else {
                resolve({id: path.parse(file).name, text: fileData});
              }
            });
          });
        })
      );
    })
    .then((allData) => {
      //wait it passed
      console.log(allData);
      callback(null, allData);
    }).catch((err) => {
      callback(err);
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
