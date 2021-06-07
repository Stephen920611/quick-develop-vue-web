<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
// import {getSystemNameAsync} from '@/utils/sysName'

    export default {
        name: 'App',
        mounted() {
            console.log("mounted")
        }
    }
</script>
