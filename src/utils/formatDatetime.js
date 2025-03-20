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

export const formatTimestamp = (date) => {
    const now = new Date();
    if (
        now.getDate() === date.getDate() &&
        now.getMonth() === date.getMonth() &&
        now.getFullYear() === date.getFullYear()
    ) {
        // Nếu trong ngày thì chỉ hiển thị giờ
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else {
        // Nếu khác ngày thì hiển thị ngày và giờ
        return (
            date.toLocaleDateString() +
            " " +
            date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        );
    }
};