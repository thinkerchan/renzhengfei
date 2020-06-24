const jieba = require('nodejieba')

jieba.load({
  userDict: './user.utf8',
});

module.exports = {
  getWords(fileContent,length){
    let rawArr = jieba.tag(fileContent)

    let noCleanArr = [],
      cleanArr = [];

    rawArr.forEach((item,index)=>{
      let rule = item.tag!=='x'
        && item.tag!=='p' // 介词
        && item.tag!=='c' // 连词
        && item.tag!=='uj'
        && item.tag!== 'f' // 方位名词
        && item.tag!== 'v' // 普通动词
        && item.tag!== 'm' // 两次
        && item.tag!== 'd' // 副词
        && item.tag!== 'r' // 指代
        && item.tag!== 'ul';

      if (rule) {
        cleanArr.push(item.word)
        noCleanArr.push(item)
      }
    })

    let ruleArr = [...new Set(cleanArr)] ,
      finallArr = [];

    ruleArr.forEach((itm,idx)=>{
      let i = 1;
      cleanArr.forEach( function(item, index) {
        if (item == ruleArr[idx]) {
          finallArr[idx] = {
            word:item,
            count:i++,
            tag:noCleanArr[index].tag
          }
        }
      });
    })

    let resultArr = finallArr.sort((prev,next)=>{
      return next.count - prev.count
    })

    return  resultArr.slice(0, length > resultArr.length? resultArr.length : length)
  },
}