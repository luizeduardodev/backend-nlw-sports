const convertMinutesToHourString = (minutesAmouunt: number) => {
    const hours = Math.floor(minutesAmouunt / 60);
    const minutes = minutesAmouunt % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

export default convertMinutesToHourString;
