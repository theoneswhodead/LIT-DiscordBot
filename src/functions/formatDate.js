module.exports = (date) => {
    return new Intl.DateTimeFormat('pl-PL').format(date);
}