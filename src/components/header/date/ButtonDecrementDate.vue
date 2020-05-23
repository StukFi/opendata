<template>
    <button-date-time
        icon="caret-left"
        :disabled="isFirstDateSelected"
        @click="decrementDate()"
    />
</template>

<script>
import ButtonDateTime from "@/components/header/ButtonDateTime"

export default {
    name: "ButtonDecrementDate",
    components: {
        ButtonDateTime
    },
    computed: {
        isFirstDateSelected () {
            return this.$store.getters.isFirstDateSelected
        }
    },
    methods: {
        decrementDate () {
            this.$store.dispatch("decrementDate")
        },
    }
}
</script>
