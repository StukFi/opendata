<template>
    <div class="row justify-content-center mt-3 app-version">
        <span>{{ appVersion }}</span>
    </div>
</template>

<script>
export default {
    name: "AppVersion",
    computed: {
        appVersion () {
            let version = "v" + process.env.APP_VERSION
            if (process.env.NODE_ENV == "development") {
                version += " (dev)"
            }
            return version
        }
    }
}
</script>

<style>
.app-version {
    color: lightgray;
    text-align: center;
}
</style>
