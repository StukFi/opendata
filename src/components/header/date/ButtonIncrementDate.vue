<template>
    <button-date-time
        icon="caret-right"
        :disabled="isNewestDateSelected"
        @click="incrementDate()"
    />
</template>

<script>
import ButtonDateTime from "@/components/header/ButtonDateTime.vue"

export default {
    name: "ButtonIncrementDate",
    components: {
        ButtonDateTime
    },
    computed: {
        isNewestDateSelected () {
            return this.$store.getters.isNewestDateSelected
        }
    },
    methods: {
        incrementDate () {
            this.$store.dispatch("incrementDate")
        }
    }
}
</script>

<style lang="scss" scoped>
button {
    background-color: $color-header-date;
}
</style>
