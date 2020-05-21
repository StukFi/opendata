<template>
    <button-date-time
        icon="caret-right"
        :disabled="isLastDateSelected"
        @click="incrementDate()"
    />
</template>

<script>
import ButtonDateTime from "@/components/header/ButtonDateTime"

export default {
    name: "ButtonIncrementDate",
    components: {
        ButtonDateTime
    },
    computed: {
        isLastDateSelected () {
            return this.$store.getters.isLastDateSelected
        }
    },
    methods: {
        incrementDate () {
            this.$store.dispatch("incrementDate")
        }
    }
}
</script>
