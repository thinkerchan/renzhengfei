const util = require('./util.js')
const fs = require('fs')
const path = require('path')
const argv = require('minimist')(process.argv.slice(2))

function analyzeDir(docDir){
  let self = arguments.callee;

  fs.readdir(docDir, (err, files) => {
    if (err) {
      console.log(err);
    } else {
      files.forEach((item, index) => {
        if (!(/^\./).test(item)) {
          let curFileUrl = path.join(docDir, item);
          fs.stat(curFileUrl, (err, stats) => {
            if (err) {
              console.warn(curFileUrl, err);
            } else {
              if (stats.isDirectory()) {
                self(curFileUrl);
              } else {
                output(curFileUrl,item)
              }
            }
          })
        }
      })
    }
  })
}

function output(fileUrl, title) {
  let fileContent = fs.readFileSync(fileUrl, 'utf8')
  let resultArr = util.getWords(fileContent, 100)

  let fixArr = [],
    sizeBase = 12,
    factor = 0.5;
  resultArr.map((item, index) => {
    let last = resultArr[resultArr.length - 1];
    fixArr.push([item.word, sizeBase + (item.count - last.count) * factor])
  })

  let targetDir = './json';
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir);
  }

  console.log('正在分析:',fileUrl);

  fs.writeFile(targetDir+'/' + title + '.json', JSON.stringify({
    list:fixArr,
    path: fileUrl
  }, null, 2), 'utf8', (err) => { // 单层路径
    if (err) {
      console.log('写入失败')
    }
  })
}

function getJsonInfo(docDir){
  fs.readdir(docDir, (err, files) => {
    if (err) {
      console.log(err);
    } else {
      fs.writeFile('./menu.json', JSON.stringify(files), 'utf8',(err)=>{
        if (err) {
          console.log('菜单数据写入失败')
        }
      })
    }
  })
}

;(()=>{
  if (argv.s) {
    getJsonInfo('./json')
  }else{
    analyzeDir('./doc')
  }
})()