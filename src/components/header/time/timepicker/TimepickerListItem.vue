<template>
    <li
        :class="{'selected': time == selectedTime}"
        @click="setTime"
    >
        {{ formattedTime }}
    </li>
</template>

<script>
import dateUtils from "@/utils/date"

export default {
    name: "TimepickerListItem",
    props: {
        time: {
            type: String,
            default: ""
        }
    },
    computed: {
        selectedTime () {
            return this.$store.state.datetime.selectedTime
        },
        formattedTime () {
            let time = this.time.slice(0, 2) + ":" + this.time.slice(2, 4)

            switch (this.$store.state.settings.settings.timeFormat) {
            case "12h":
                return dateUtils.convertTimeTo12HourClock(time)

            case "24h":
            default:
                return time
            }
        }
    },
    methods: {
        setTime () {
            this.$store.commit("setTime", this.time)
            this.$emit("click")
        }
    }
}
</script>

<style lang="scss">
li {
    height: 3em;
    line-height: 3em;
    font-size: $font-md;
    color: black;
    list-style-type: none;
    border-radius: $border-radius-sm;
}

li:hover {
    cursor: pointer;
}

li.selected {
    background-color: #1773B9;
    color: white;
}
</style>
