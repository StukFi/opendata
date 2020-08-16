<template>
    <button-date-time
        icon="caret-right"
        :disabled="isNewestDateSelected"
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
