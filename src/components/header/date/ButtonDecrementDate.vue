<template>
    <button-date-time
        icon="caret-left"
        :disabled="isOldestDateSelected"
        @click="decrementDate()"
    />
</template>

<script>
import ButtonDateTime from "@/components/header/ButtonDateTime.vue"

export default {
    name: "ButtonDecrementDate",
    components: {
        ButtonDateTime
    },
    computed: {
        isOldestDateSelected () {
            return this.$store.getters.isOldestDateSelected
        }
    },
    methods: {
        decrementDate () {
            this.$store.dispatch("decrementDate")
        },
    }
}
</script>

<style lang="scss" scoped>
button {
    background-color: $color-header-date;
}
</style>
