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
    emits: ["click"],
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
    font-size: $font-lg;
    color: $color-font-dark;
    list-style-type: none;
    border-radius: $border-radius-sm;
    text-align: center;
}

li:hover {
    cursor: pointer;
    background-color: $color-header-time;
    color: white;
}

li.selected {
    background-color: $color-header-time;
    color: white;
}
</style>
