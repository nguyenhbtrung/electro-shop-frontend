export const convertToCustomMonthDate = (inputDate, locales, monthOption) => {
    var inputDateObj = new Date(inputDate);
    var options = { year: 'numeric', month: monthOption, day: 'numeric' };
    return inputDateObj.toLocaleDateString(locales, options);
};

export const convertToLocaleDateString = (date) => {
    const d = new Date(date);
    const formattedDate = d.toLocaleDateString('vi-VN');
    return formattedDate;
};