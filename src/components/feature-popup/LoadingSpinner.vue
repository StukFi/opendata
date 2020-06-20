<template>
    <div v-show="isEnabled" class="spinner-container">
        <div class="loader" />
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

<style>
.spinner-container {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    align-items: center;
    background-color: rgba(255, 255, 255, 1);
    transition: background-color 0s, background-color 0.5s linear;
}

.loader,
.loader:after {
    border-radius: 50%;
    width: 5em;
    height: 5em;
}

.loader {
    margin: 60px auto;
    font-size: 0.625rem;
    margin: 0 auto;
    z-index: 10;
    text-indent: -9999em;
    border-top: 0.5em solid rgba(23,115,185, 0.2);
    border-right: 0.5em solid rgba(23,115,185, 0.2);
    border-bottom: 0.5em solid rgba(23,115,185, 0.2);
    border-left: 0.5em solid #1773b9;
    -webkit-transform: translateZ(0);
    -ms-transform: translateZ(0);
    transform: translateZ(0);
    -webkit-animation: load8 1.1s infinite linear;
    animation: load8 1.1s infinite linear;
}

@-webkit-keyframes load8 {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
}

@keyframes load8 {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
}
</style>
