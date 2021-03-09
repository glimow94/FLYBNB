/* converte una data in formato DATE in una stringa DD-MM-YYYY */
function monthNameToNum(monthname) {
  // da "Day Mon DayNumber Year" in "DD-MM-YYYY"
  var months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May',
      'Jun', 'Jul', 'Aug', 'Sep',
      'Oct', 'Nov', 'Dec'
  ]; //mesi dell'anno che mi servono per convertire il mese della data nel suo corrispondente numero MM
  var index = months.indexOf(monthname);
  
  //aggiungo lo 0 prima del numero del mese se questo è < 10, ovvero 1 diventa 01, 2 diventa 02, ecc.ecc.
  if(index+1 < 10 && index != -1){
    index = index +1;
    var month = '0'+index.toString()
    return month
  }
  else {
    return index!=-1 ? index+1 : undefined;
  }
}
export default function dateConverter(date){
    var date_mod = date.toString().replace("12:00:00 GMT+0200","").slice(4),
        month_num = monthNameToNum(date_mod.substr(0,3)),
        date_mod_format = date_mod.substr(4,2)+"/"+month_num+"/"+date_mod.substr(6,5), //data in formato DD/MonthName/AAAA
        final_date = date_mod_format.replace(/ /g, '');
        return final_date;
}

