const fs = require('fs');  //Promise.pomisifyAll(require('fs))
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');
const fsa = Promise.promisifyAll(require('fs'));
// const these = Promise.promisifyAll(require('./index.js'))

// var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, fileName) => {
    // get path/filename
    // use fs.write(pathname, text, callback)
    let filePath = path.join(exports.dataDir, fileName + '.txt');
    fs.writeFile(filePath, text, (err) => {
      if (err) {
        throw ('write failed in .create')
      } else {
        callback(null, { id: fileName, text: text }); // REVISIT THIS!!!
      }
    })
  })
  // items[id] = text;
};

exports.readAll = (callback) => {
  fsa.readdirAsync(exports.dataDir).then((files) => {
    return files.map((file) => {
      let getID = path.parse(file).name
      return exports.readOneAsync(getID)
    })
  }).then((newFiles) => {
    return Promise.all(newFiles)
  }).then((toDos) => {
    callback(null, toDos)
  })

  // fs.readdir(exports.dataDir, (err, files) => {
  //   if (err) {
  //     throw ('fill later')
  //   } else {
  //    files = files.map( (file) => {
  //       let getID = path.parse(file).name
  //       return exports.readOneAsync(getID)
  //     })
  //     Promise.all(files).then((toDos) => {
  //       callback(null, toDos)
  //     })
  //   }
  // })

  //var getID = path.parse(pathfile)
  //var ID = thisID.name
  // fsa.readdirAsync(exports.dataDir, (err, files) => {
  //   if (err) {
  //     throw ('fill later')
  //   } else {
  //     let data = files.map((file) => {
  //       let getID = path.parse(file).name;
  //       return { id: getID, text: getID }
  //     })
  //     callback(null, data)
  //   }
  // });
  // console.log(filePaths);
  // return filePaths
  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });

  // callback(null, array of message objects)
};

exports.readOne = (id, callback) => {
  fs.readFile(exports.dataDir + '/' + id + '.txt', 'utf8', (err, data) => {
    if (err) {
      callback(err);
    } else {
      callback(null, { id: id, text: data })
    }
  })
};

exports.readOneAsync = Promise.promisify(exports.readOne);


exports.update = (id, text, callback) => {
  fs.readFile(exports.dataDir + '/' + id + '.txt', 'utf8', (err, data) => {
    if (err) {
      console.error('no file exists by that ID');
      callback(err, null);
    } else {
      fs.writeFile(exports.dataDir + '/' + id + '.txt', text, (err) => {
        if (err) {
          console.error('error updating file');
        } else {
          callback(null, { id: id, text: text });
        }
      })
    }
  })
};

exports.delete = (id, callback) => {
  fs.unlink(exports.dataDir + '/' + id + '.txt', (err) => {
    if (err) {
      callback(err)
    } else {
      callback()
    }
  })
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
