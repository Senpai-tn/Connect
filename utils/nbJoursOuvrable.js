const calcBusinessDays = (dDate1, dDate2, nbJour) => {
  var iWeeks,
    iDateDiff,
    iAdjust = 0
  if (dDate2 < dDate1) return -1
  var iWeekday1 = dDate1.getDay()
  var iWeekday2 = dDate2.getDay()
  iWeekday1 = iWeekday1 == 0 ? 7 : iWeekday1
  iWeekday2 = iWeekday2 == 0 ? 7 : iWeekday2
  if (iWeekday1 > nbJour && iWeekday2 > nbJour) iAdjust = 1
  iWeekday1 = iWeekday1 > nbJour ? nbJour : iWeekday1
  iWeekday2 = iWeekday2 > nbJour ? nbJour : iWeekday2

  // calculate differnece in weeks (1000mS * 60sec * 60min * 24hrs * 7 days = 604800000)
  iWeeks = Math.floor((dDate2.getTime() - dDate1.getTime()) / 604800000)

  if (iWeekday1 < iWeekday2) {
    iDateDiff = iWeeks * nbJour + (iWeekday2 - iWeekday1)
  } else {
    iDateDiff = (iWeeks + 1) * nbJour - (iWeekday1 - iWeekday2)
  }
  iDateDiff -= iAdjust
  return iDateDiff + 1
}

module.exports = { calcBusinessDays }
