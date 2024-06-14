<template>
    <button-date-time
        icon="caret-left"
        :disabled="isOldestTimeSelected"
        @click="decrementTime()"
    />
</template>

<script>
import ButtonDateTime from "@/components/header/ButtonDateTime.vue"

export default {
    name: "ButtonDecrementTime",
    components: {
        ButtonDateTime
    },
    computed: {
        isOldestTimeSelected () {
            return this.$store.getters.isOldestTimeSelected
        }
    },
    methods: {
        decrementTime () {
            this.$store.dispatch("decrementTime")
        },
    }
}
</script>

<style lang="scss" scoped>
button {
    background-color: $color-header-time;
}
</style>
