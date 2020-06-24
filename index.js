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

  let _title = title ? title + '.json' : 'one.json'
  fs.writeFile('./json/'+_title, JSON.stringify(fixArr, null, 2), 'utf8', (err) => {
    if (err) {
      console.log('写入失败')
    } else {
      console.log(fileUrl, '抽取完毕')
    }
  })
}



function getJsonInfo(docDir){
  fs.readdir(docDir, (err, files) => {
    if (err) {
      console.log(err);
    } else {
      fs.writeFile('./json/menu.json', JSON.stringify(files), 'utf8',(err)=>{
        if (err) {

        }else{
          console.log('菜单数据生成,启动服务器');
        }
      })
    }
  })
}

;(()=>{
  if (argv.s) {
    getJsonInfo('./json')
  }else{
    console.log('正在分析中.... 请稍后....')
    analyzeDir('./doc')
  }
})()