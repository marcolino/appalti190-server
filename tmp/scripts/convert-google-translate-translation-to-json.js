#!/usr/bin/env node
/**
 * Read am english json translations file, and the same file completely translated (automatically),
 * and write the english key and the translated value.
 */

const fs = require("fs");

let keys, values = null;

try {
  const data = fs.readFileSync("translation.json", "utf-8")
  keys = JSON.parse(data);
} catch (err) {
  if (err.code === 'ENOENT') {
    console.log('File not found!');
  } else {
    throw err;
  }
}

try {
  const data = fs.readFileSync("translation-it.json", "utf-8");
  values = JSON.parse(data);
} catch (err) {
  if (err.code === 'ENOENT') {
    console.log('File not found!');
  } else {
    throw err;
  }
}
// console.log(values);
// process.exit();


const keys2 = {};
const vk = Object.keys(values);
const vv = Object.values(values);
const res = {};
Object.keys(keys).forEach((key, index) => {
  //console.log(index, values[inde])
  res[key] = vv[index];
});

console.log(JSON.stringify(res));

// fs.writeFile("temp.txt", data, (err) => {
//   if (err) console.log(err);
//   console.log("Successfully Written to File.");
// });