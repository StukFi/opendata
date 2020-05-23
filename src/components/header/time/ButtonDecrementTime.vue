<template>
    <button-date-time
        icon="caret-left"
        :disabled="isFirstTimeSelected"
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
        isFirstTimeSelected () {
            return this.$store.getters.isFirstTimeSelected
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
