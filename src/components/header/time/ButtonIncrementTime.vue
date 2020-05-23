<template>
    <button-date-time
        icon="caret-right"
        :disabled="isLastTimeSelected"
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
        isLastTimeSelected () {
            return this.$store.getters.isLastTimeSelected
        }
    },
    methods: {
        incrementTime () {
            this.$store.dispatch("incrementTime")
        },
    }
}
</script>
<style scoped>
button {
    background-color: #0066b3;
}
</style>
