const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

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
  //var getID = path.parse(pathfile)
  //var ID = thisID.name

  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw ('fill later')
    } else {
      let data = files.map((file) => {
        let getID = path.parse(file).name;
        return { id: getID, text: getID }
      })
      callback(null, data)
    }
  });
  // console.log(filePaths);
  // return filePaths
  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
};

exports.readOne = (id, callback) => {
  fs.readFile(exports.dataDir + '/' + id + '.txt', 'utf8', (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, { id: id, text: data })
    }
  })
  // fs.readdir(exports.dataDir, (err, files) => {
  //   if (err) {
  //     throw ('also fill later')
  //   } else {
  //     let data = files.filter((file) => {
  //       let getID = path.parse(file).name;
  //       return getID === id
  //     })
  //     data = data.map((file) => {
  //       let getID = path.parse(file).name;
  //       return { id: getID, text: getID }
  //     })
  //     callback(null, data);
  //   }
  // })
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
