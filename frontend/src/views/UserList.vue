<script lang="ts">
import axios from 'axios';
import { Pencil, Trash } from 'lucide-vue-next';


export default {
  components: {
    Pencil, Trash
  },
  data() {
    return {
      users: []
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    async getData() {
      const res = await axios.get("http://localhost:8001/sql/users")

      this.users = res.data
    },
    async call(endpoint: string) {
      await axios.get(`http://localhost:8001${endpoint}`)

      this.getData()
    }
  }
}
</script>

<template>
  <main class="dp-flex fd-c gap-3">
    <h1 consoleheadline class="ta-center">User List</h1>
    <div class="dp-flex gap-2">
      <button @click="call('/reset')">Reset</button>
      <button @click="call('/base')">Base Data</button>
      <!-- <button @click="call('/test/advanced')">Run Tests</button> -->
    </div>
    <table>
      <tbody>
        <tr v-for="(user) in users" :key="user" class="user">
          <td width="200">{{ (user as any).username }}</td>
          <td width="200">{{ (user as any).country }}</td>
          <td width="200">{{ (user as any).comp_points }}</td>
          <td width="20" clickable>
            <Pencil :size="16" color="white" />
          </td>
          <td width="20" clickable>
            <Trash :size="16" color="red" />
          </td>
        </tr>
        <tr>
          <td colspan="5">Insert</td>
        </tr>
      </tbody>
    </table>
  </main>
</template>

<style scoped></style>