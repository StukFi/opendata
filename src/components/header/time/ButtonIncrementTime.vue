<template>
    <button-date-time
        icon="caret-right"
        :disabled="isNewestTimeSelected"
        @click="incrementTime()"
    />
</template>

<script>
import ButtonDateTime from "@/components/header/ButtonDateTime"

export default {
    name: "ButtonIncrementTime",
    components: {
        ButtonDateTime
    },
    computed: {
        isNewestTimeSelected () {
            return this.$store.getters.isNewestTimeSelected
        }
    },
    methods: {
        incrementTime () {
            this.$store.dispatch("incrementTime")
        },
    }
}
</script>
<style lang="scss" scoped>
button {
    background-color: $color-header-time;
}
</style>
