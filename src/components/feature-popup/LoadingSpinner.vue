<template>
    <div
        v-show="isEnabled"
        class="spinner-container"
    >
        <div class="spinner" />
    </div>
</template>

<script>
export default {
    name: "LoadingSpinner",
    props: {
        isEnabled: {
            type: Boolean,
            default: false
        }
    }
}
</script>

<style lang="scss" scoped>
.spinner-container {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    align-items: center;
    background-color: rgba(255, 255, 255, 1);
}

.spinner,
.spinner:after {
    border-radius: 50%;
    width: 4em;
    height: 4em;
}

.spinner {
    margin: 4em auto;
    font-size: $font-xs;
    border-top: 0.5em solid rgba(23,115,185, 0.2);
    border-right: 0.5em solid rgba(23,115,185, 0.2);
    border-bottom: 0.5em solid rgba(23,115,185, 0.2);
    border-left: 0.5em solid #1773b9;
    animation: rotate 1s infinite linear;
}

@keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
}
</style>
