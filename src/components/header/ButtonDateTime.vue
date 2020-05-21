<template>
    <button
        :style="style"
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

<style scoped>
button {
    flex-basis: 25%;
    border: none;
    background-color: #1773B9;
    background-size: 1em;
    font-size: 16px;
    background-position: center;
    background-repeat: no-repeat;
    cursor: pointer;
    outline: none;
    z-index: 1;
}

button:focus {
    outline: none;
}

@media only screen and (max-width: 500px) {
    button {
        display: none;
    }
}
</style>
