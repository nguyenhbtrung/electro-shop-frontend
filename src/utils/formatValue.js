export const formatNumberValue = (value) => {
    if (typeof value === "number") {
        const absValue = Math.abs(value);

        if (absValue >= 1000000) {
            const numValue = value / 1000000;
            let formatted = numValue.toFixed(1);
            if (formatted.endsWith(".0")) {
                formatted = formatted.slice(0, -2);
            }
            return `${formatted}M`;
        }

        if (absValue >= 1000) {
            const numValue = value / 1000;
            let formatted = numValue.toFixed(1);
            if (formatted.endsWith(".0")) {
                formatted = formatted.slice(0, -2);
            }
            return `${formatted}K`;
        }
    }

    return value;
};

export const formatShortPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        notation: 'compact',
        compactDisplay: 'short'
    }).format(price);
};

export const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
};