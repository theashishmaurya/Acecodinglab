const fs = require('fs');
const { join } = require('path');

const preProcessSlug = slug => {
  return slug.toLowerCase().replace(/ /g, '');
};
const ReadFolder = path => {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (err, files) => {
      if (err) reject(err);
      resolve(files);
    });
  });
};

const ReadFile = path => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};
const DIR = join(process.cwd(), 'que');

ReadFolder(DIR).then(files => {
  console.log(files);
  files.forEach(file => {
    ReadFile(join(DIR, file))
      .then(data => {
        console.log(data);
      })
      .catch(err => {
        // console.log(err);
      });
  });
});
