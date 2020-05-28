<template>
    <button
        :style="style"
        :disabled="disabled"
        @click="$emit('click')"
    >
        {{ text }}
    </button>
</template>

<script>
export default {
    name: "MediaControllerButton",
    props: {
        icon: {
            type: String,
            default: ""
        },
        text: {
            type: String,
            default: ""
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        style () {
            if (!this.icon) {
                return {}
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
    width: 32%;
    height: 100%;
    margin: auto;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 1em;
    color: white;
    font-weight: 700;
    background-color: rgba(0, 60, 136, 0.5);
    border: none;
    cursor: pointer;
}

button:focus {
    outline: none;
}

button:hover {
    background-color: rgba(0, 60, 136, 0.7);
}

button:disabled {
    background-color: rgba(0, 0, 0, 0.5);
    cursor: auto;
}
</style>
