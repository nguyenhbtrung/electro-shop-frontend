export const convertToCustomMonthDate = (inputDate, locales, monthOption) => {
    var inputDateObj = new Date(inputDate);
    var options = { year: 'numeric', month: monthOption, day: 'numeric' };
    return inputDateObj.toLocaleDateString(locales, options);
};