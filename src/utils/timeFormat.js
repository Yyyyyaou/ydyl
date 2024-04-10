/**
 * ∵接口返回的是时间戳
 * ∴所以要对时间处理一下才能显示
 */
function timeFormatFn(timeP){
  const 
  dateO = new Date(timeP),
  year = dateO.getFullYear(),
  month = dateO.getMonth() + 1,
  day = dateO.getDate(),
  hours = dateO.getHours(),
  minutes = dateO.getMinutes(),
  seconds = dateO.getSeconds()
  ;
  //未使用变量，省得eslint老报错
  hours,minutes,seconds

  return {
    'YYYY-MM-DD':`${year}-${month}-${day}`
  };
}

export {
  timeFormatFn
}