<template>
    <div class="datetime-picker-container">
        <select class="datetime-picker" v-model="datetime" @change="onDatetimeChanged"><option :value="datetime" v-for="datetime in datetimes">{{datetime | formatDatetime}}</option></select>
    </div>
</template>

<script>
export default {
    name: "DatetimePicker",
    data: function() {
        return {
            datetimes: [],
            datetime: ""
        };
    },
    mounted: function() {
        var that = this;
        this.$http.get("data/dose_rates/metadata.json").then(function(response) {
            that.datetimes = response.body["files"];
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
}
</script>

<style>
.datetime-picker-container {
    width: 400px;
    height: 60px;
    line-height: 60px;
    position: absolute;
    left: 50%;
    top: 10px;
    transform: translateX(-50%);
    text-align: center;
    background-color: rgba(204, 229, 236, 1);
    z-index: 10000;
    border: 1px solid rgba(0, 0, 0, 0.4);
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);
}

.datetime-picker {
    font-size: 1.75em;
    border: none;
    outline: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-color: transparent;
}
</style>
