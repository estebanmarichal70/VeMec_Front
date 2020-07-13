<template ref="content">

</template>

<script>
  // https://stackoverflow.com/questions/47668546/generate-pdf-with-jspdf-and-vue-js
  export default {
    name: "DiagnosticosPdf",
    props: ['ingreso'],
    watch: {
      ingreso(value) {
        console.log(value)
      }
    }
  }
</script>

<style scoped>

</style>
