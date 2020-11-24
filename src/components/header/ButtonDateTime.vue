<template>
    <button
        :style="style"
        :disabled="disabled"
        @click="$emit('click')"
    />
</template>

<script>
export default {
    name: "ButtonDateTime",
    props: {
        icon: {
            type: String,
            required: true
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        style () {
            if (this.disabled) {
                return {
                    backgroundImage: "none"
                }
            }
            else {
                return {
                    backgroundImage: "url(" + require("@/assets/icons/" + this.icon + ".svg") + ")"
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
button {
    flex-basis: 25%;
    border: none;
    background-color: #1773B9;
    background-size: 1em;
    font-size: $font-md;
    background-position: center;
    background-repeat: no-repeat;
    cursor: pointer;
    z-index: $z-index-button-datetime;
    outline: none;
}

button:focus {
    outline: none;
}

button:disabled {
    cursor: auto;
}
</style>
