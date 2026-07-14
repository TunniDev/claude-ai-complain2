<template>
    <div class="page-notfound">
        <div>
            <h2>Not Found</h2>
            <div class="mt-3">Oops, we couldn't find that page. Try going
                <router-link to="/">home</router-link>
            </div>
        </div>
    </div>
</template>

<script>
export default {
}
</script>

<style scoped>
    .page-notfound{
        background: #fdfdfd;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
