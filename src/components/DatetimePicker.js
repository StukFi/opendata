Vue.component('datetime-picker', {
    template: `
    <div class="datetime-picker-container">
        <select class="datetime-picker" v-model="datetime" @change="onDatetimeChanged"><option :value="datetime" v-for="datetime in datetimes">{{datetime | formatDatetime}}</option></select>
    </div>
    `,
    data: function() {
        return {
            datetimes: [],
            datetime: ""
        };
    },
    mounted: function() {
        var that = this;
        $.get("data/dose_rates/metadata.json", function(response) {
            that.datetimes = response["files"];
            that.datetimes.sort();
            that.datetimes.reverse();
            that.datetime = that.datetimes[0];
            that.onDatetimeChanged();
        });
    },
    methods: {
        onDatetimeChanged: function() {
            this.$root.$emit('datetimeChanged', this.datetime.split(".")[0]);
        }
    },
    filters: {
        formatDatetime(datetime) {
            datetime = datetime.split(".")[0].split("T");
            var date = datetime[0];
            var time = datetime[1];
            time = time.slice(0, 2) + ":" + time.slice(2, 4);
            return date + " " + time;
        }
    }
});
