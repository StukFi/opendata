<template>
    <button
        :style="iconStyle"
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
    emits: ["click"],
    data() {
        return {
            iconStyle: {
                backgroundImage: "none"
            }
        }
    },
    watch: {
        icon: "updateStyle",
        disabled: "updateStyle"
    },
    mounted() {
        this.updateStyle()
    },
    methods: {
        async updateStyle() {
            if (this.disabled) {
                this.iconStyle = {
                    backgroundImage: "none"
                }
            } else {
                try {
                    const iconPath = `/icons/${this.icon}.svg`
                    // Check again if button became disabled while loading icon, ignoring icon update
                    if (!this.disabled) {
                        this.iconStyle = {
                            backgroundImage: `url(${iconPath})`
                        }
                    }
                } catch {
                    this.iconStyle = {
                        backgroundImage: "none"
                    }
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
