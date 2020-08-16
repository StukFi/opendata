<template>
    <button-date-time
        icon="caret-left"
        :disabled="isOldestTimeSelected"
        @click="decrementTime()"
    />
</template>

<script>
import ButtonDateTime from "@/components/header/ButtonDateTime"

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

<style scoped>
button {
    background-color: #0066b3;
}
</style>
