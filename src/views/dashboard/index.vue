<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
import adminDashboard from './admin'

export default {
  components: { adminDashboard },
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
}
</script>
