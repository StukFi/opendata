var utils = {
    methods: {
        getDatesBetween(startDate, endDate) {
            var dates = [];
            var currentDate = new Date(startDate);
            while (currentDate <= endDate) {
                dates.push(new Date(currentDate));
                currentDate.setDate(currentDate.getDate() + 1);
            }
            return dates;
        }
    }
};
