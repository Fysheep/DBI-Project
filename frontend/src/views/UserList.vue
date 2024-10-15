<script lang="ts">
import axios from 'axios';
import { Pencil, Trash, Eye, PlusCircle, Search, Filter as FilterIcon } from 'lucide-vue-next';
import type { user } from '@/model/schema';
import PopUp from '@/components/PopUp.vue';

axios.defaults.baseURL = "http://localhost:8001"


export default {
  components: {
    Pencil, Trash, Eye, PlusCircle, Search, FilterIcon, PopUp
  },
  data() {
    return {
      users: [] as user[],
      search_term: "",
      lastupdated: 0,
      currentUser: {} as user,
      popAllOff: { edit_active: false, create_active: false, remove_active: false, view_active: false },
      popups: { edit_active: false, create_active: false, remove_active: false, view_active: false }
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    hidePopups() {
      this.popups = { ...this.popAllOff }
    },
    async getData() {

      const res = await axios.get(`/nosql/users/search?s=${this.search_term}`)

      this.users = res.data
    },
    async call(endpoint: string) {
      await axios.get(`${endpoint}`)

      this.getData()
    },
    async deleteUser() {
      this.hidePopups()
      await axios.get(`/nosql/users/delete?id=${this.currentUser._id}`)

      this.getData()
    },
    async editUser() {
      this.hidePopups()
      await axios.post(`/nosql/users/edit`, this.currentUser)

      this.getData()
    },
    openEdit(user: user) {
      this.hidePopups()
      this.currentUser = user;
      this.popups.edit_active = true
    },
    openDelete(id: string) {
      this.hidePopups()
      this.currentUser._id = id
      this.popups.remove_active = true
    },
    openView(user: user) {
      this.hidePopups()
      this.currentUser = user;
      this.popups.view_active = true
    },
    openCreate() {
      this.hidePopups()
      this.currentUser = {} as user
      this.popups.create_active = true
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
      <div class="dp-flex gap-custom">
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
              <Eye :size="20" color="white" @click="openView(user)" clickable />
            </span>
          </td>
          <td width="200">{{ user.username }}</td>
          <td width="200">{{ user.country }}</td>
          <td width="200">{{ user.comp_points }}</td>

          <td width="20" class="ta-center">
            <span class="dp-flex ai-c jc-c">
              <Pencil :size="20" color="white" @click="openEdit(user)" clickable />
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
  <PopUp v-if="popups.create_active" @close="popups.create_active = false">
    Create
  </PopUp>
  <PopUp v-if="popups.edit_active" @close="popups.edit_active = false">
    Edit
  </PopUp>
  <PopUp v-if="popups.remove_active" @close="popups.remove_active = false">
    <div class="dp-flex fd-c gap-2">
      <h2 class="ta-center">Are you Sure?</h2>
      <span>Pressing "Yes, Delete" will permanently
        <br> remove this user from the system</span>
      <div class="dp-flex gap-2">
        <button clickable class="fw-bold" @click="deleteUser()">Yes, Delete</button>
        <button clickable class="fw-bold" @click="popups.remove_active = false">No, Keep</button>
      </div>
    </div>
  </PopUp>
  <PopUp v-if="popups.view_active" @close="popups.view_active = false">
    View
  </PopUp>
</template>

<style scoped>
.gap-custom {
  gap: 3px
}

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