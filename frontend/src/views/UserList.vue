<script lang="ts">
import axios from 'axios';
import { Pencil, Trash, Eye, PlusCircle, Search, Filter as FilterIcon } from 'lucide-vue-next';
import type { user } from '@/model/schema';

axios.defaults.baseURL = "http://localhost:8001"


export default {
  components: {
    Pencil, Trash, Eye, PlusCircle, Search, FilterIcon
  },
  data() {
    return {
      users: [] as user[],
      search_term: "",
      lastupdated: 0
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    async getData() {

      const res = await axios.get(`/nosql/users/search?s=${this.search_term}`)

      this.users = res.data
    },
    async call(endpoint: string) {
      await axios.get(`${endpoint}`)

      this.getData()
    },
    async deleteUser(id: string) {
      await axios.get(`/nosql/users/delete?id=${id}`)

      this.getData()
    },
    async editUser(user: user) {
      await axios.post(`/nosql/users/edit`, user)

      this.getData()
    },
    openEdit(id: string) {
      /* TODO */
    },
    openDelete(id: string) {
      /* TODO */
    },
    openView(id: string) {
      /* TODO */
    },
    openCreate() {
      /* TODO */
    }
  }
}
</script>

<template>
  <main class="dp-flex fd-c gap-3">
    <h1 consoleheadline class="ta-center">User List</h1>
    <div class="dp-flex jc-sb">
      <div class="dp-flex gap-2 ai-c">
        <button @click="call('/reset')" clickable>Reset</button>
        <button @click="call('/base')" clickable>Base Data</button>
        <button @click="openCreate()" clickable id="insertButton" class="dp-flex jc-c ai-c">
          <PlusCircle :size="24" color="green" />
        </button>
      </div>
      <div class="dp-flex gap-1">
        <input type=" text" name="" id="search" class="p-1" placeholder="Search..." v-model="search_term"
          @keydown.enter="getData">
        <span class="dp-flex jc-c ai-c input h100 p-1" id="filterbutton" clickable>
          <FilterIcon id="searchicon" color="black" stroke-width="2.5px" :size="20" />
        </span>
        <span class="dp-flex jc-c ai-c input h100 p-1" id="searchbutton">
          <Search id="searchicon" color="black" stroke-width="2.5px" :size="20" clickable />
        </span>
      </div>
    </div>
    <table>
      <tbody>
        <tr v-for="(user) in users" :key="user._id" class="user">
          <td width="20" class="ta-center">
            <span class="dp-flex ai-c jc-c">
              <Eye :size="20" color="white" @click="openView(user._id)" clickable />
            </span>
          </td>
          <td width="200">{{ user.username }}</td>
          <td width="200">{{ user.country }}</td>
          <td width="200">{{ user.comp_points }}</td>

          <td width="20" class="ta-center">
            <span class="dp-flex ai-c jc-c">
              <Pencil :size="20" color="white" @click="openEdit(user._id)" clickable />
            </span>
          </td>
          <td width="20" class="ta-center">
            <span class="dp-flex ai-c jc-c">
              <Trash :size="20" color="red" @click="openDelete(user._id)" clickable />
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </main>
</template>

<style scoped>
#insertButton {
  height: 100%;
  padding: .2rem
}

input#search {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

#searchbutton {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  width: 2rem
}

#filterbutton {
  border-radius: 0;
  width: 2rem
}
</style>