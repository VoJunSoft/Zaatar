//Time format
export const handleDate = (dataD) => {
    let data= new Date(dataD*1000)
    let month = data.getMonth() + 1
    let day = data.getDate()
    let year = data.getFullYear()
    if(day<=9)
      day = '0' + day
    if(month<10)
      month = '0' + month
    const postDate = year + '-' + month + '-' + day
    return postDate
  }

  //Date format
  export const handleTime = (dataD) => {
    let data= new Date(dataD)
    let hrs = data.getHours()
    let mins = data.getMinutes()
    if(hrs<=9)
       hrs = '0' + hrs
    if(mins<10)
      mins = '0' + mins
    const postTime= hrs + ':' + mins
    return postTime
  }