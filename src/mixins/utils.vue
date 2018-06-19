<script>
export default {
    methods: {
        getDatesBetween(startDate, endDate, includeStartDate, includeEndDate) {
            var dates = [];
            var currentDate = new Date(startDate);
            var endDate = new Date(endDate);

            if (!includeStartDate) {
                currentDate.setDate(currentDate.getDate() + 1);
            }

            if (!includeEndDate) {
                endDate.setDate(endDate.getDate() - 1);
            }

            while (currentDate <= endDate) {
                dates.push(new Date(currentDate));
                currentDate.setDate(currentDate.getDate() + 1);
            }
            return dates;
        }
    }
}
</script>
