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

  const 
    MM = month<10?'0'+month:month,
    DD = day<10?'0'+day:day,
    hh = hours<10?'0'+hours:hours,
    mm = minutes<10?'0'+minutes:minutes,
    ss = seconds<10?'0'+seconds:seconds
  ;
  return {
    'YYYY-MM-DD':`${year}-${MM}-${DD}`,
    'YYYY-MM-DD hh:mm':`${year}-${MM}-${DD} ${hh}:${mm}`,
    'YYYY-MM-DD hh:mm:ss':`${year}-${MM}-${DD} ${hh}:${mm}:${ss}`,
  };
}

export {
  timeFormatFn
}