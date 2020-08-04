export function shortStringFormat(dateInput) {
    const date = new Date(dateInput);

    const timeDiff = date.getTimezoneOffset() * 60000;
    const adjustedDate = new Date(date.valueOf() + timeDiff);

    const month = adjustedDate.toLocaleDateString(["en-US"], {month: "short"});

    return `${date.getUTCDate()} ${month.charAt(0).toUpperCase() + month.slice(1)} ${date.getUTCFullYear()}`;
}