export const getMonthName = (monthNumber, type)=>{
    let month= "";
    switch(monthNumber){
        case 0:
            month = type === "full" ? "January": "Jan" ;
            break;
        case 1:
            month = type === "full" ? "February": "Feb";
            break;
        case 2:
            month = type === "full" ? "March": "Mar";
            break;
        case 3:
            month = type === "full" ? "April": "Apr";
            break;
        case 4:
            month = type === "full" ? "May": "May";
            break;
        case 5:
            month = type === "full" ? "June": "Jun";
            break;
        case 6:
            month = type === "full" ? "July": "Jul";
            break;
        case 7:
            month = type === "full" ? "August": "Aug";
            break;
        case 8:
            month = type === "full" ? "September": "Sep";
            break;
        case 9:
            month = type === "full" ? "October": "Oct";
            break;
        case 10:
            month = type === "full" ? "November": "Nov";
            break;
        case 11:
            month = type === "full" ? "December": "Dec";
            break;
        default:
            break;    
    }
    
    return month;
}


export const getDayName = (day)=>{
    let dayName = "";
    switch(day){
      case 0:
          dayName = "Sunday";
          break;
      case 1:
          dayName = "Monday";
          break;
      case 2:
          dayName = "Tuesday";
          break;
      case 3:
          dayName = "Wednesday";
          break;
      case 4:
          dayName = "Thursday";
          break;
      case 5:
          dayName = "Friday";
          break;
       case 6:
          dayName = "Saturday";
          break;
       default:
          break;
    }
    return dayName;
  }