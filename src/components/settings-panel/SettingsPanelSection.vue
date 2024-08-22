<template>
    <div class="section">
        <p class="title">
            {{ title }}
        </p>
        <slot class="content" />
    </div>
</template>

<script>
export default {
    name: "SettingsPanelSection",
    props: {
        title: {
            type: String,
            required: true
        }
    },
}
</script>

<style lang="scss" scoped>
.title {
    margin-top: 0;
}
</style>
