<template>
    <div
        v-show="isVisible"
        class="spinner__container"
        :class="{'fade-in': isVisible, 'fade-out': !isVisible}"
        data-cy="spinner"
    >
        <spinner
            class="spinner"
            size="huge"
            :message="message"
            text-fg-color="white"
        />
    </div>
</template>

<script>
import Spinner from "vue-simple-spinner"

export default {
    name: "SpinnerFullscreen",
    components: {
        Spinner
    },
    data: function () {
        return {
            isVisible: false,
            message: ""
        }
    },
    mounted () {
        this.$root.$on("fullscreen-spinner-enable", this.show)
        this.$root.$on("fullscreen-spinner-disable", this.hide)
    },
    methods: {
        show (args) {
            this.isVisible = true

            if (args) {
                this.message = args.message
            }
        },
        hide () {
            this.isVisible = false
        }
    }
}
</script>

<style lang="scss" scoped>
.spinner__container {
    position: fixed;
    left: 0;
    top: 0;
    z-index: $z-index-full-screen-spinner;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.75);
    font-family: $font-medium;

}

.spinner {
    position: relative;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}

.fade-in {
    animation: fade-in 0.15s ease-out forwards;
}

.fade-out {
    animation: fade-out 0.1s ease-in forwards;
}

@keyframes fade-in {
    0% { opacity: 0; }
    100% { opacity: 1; visibility: visible; }
}

@keyframes fade-out {
    0% { opacity: 1; }
    100% { opacity: 0; visibility: hidden; }
}
</style>
