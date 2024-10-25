<script lang="ts">
import axios from 'axios';
import { Pencil, Trash, Eye, PlusCircle, Search, Filter as FilterIcon, XCircle, RefreshCcw, LoaderIcon } from 'lucide-vue-next';
import type { user } from '@/model/schema';
import PopUp from '@/components/PopUp.vue';
import { toRaw } from 'vue';

axios.defaults.baseURL = "http://localhost:8001"


export default {
  components: {
    Pencil, Trash, Eye, PlusCircle, Search, FilterIcon, XCircle, RefreshCcw, LoaderIcon, PopUp
  },
  data() {
    return {
      hasData: false,
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
      this.hasData = false
      this.users = [] as user[];
      const res = await axios.get(`/users/search?s=${this.search_term}`)

      this.users = res.data
      this.hasData = true;
    },
    async call(endpoint: string) {
      await axios.get(`${endpoint}`)

      this.getData()
    },
    async deleteUser() {
      this.hidePopups()
      await axios.get(`/users/delete?id=${this.currentUser._id}`)

      this.getData()
    },
    async editUser() {
      this.hidePopups()
      await axios.post(`/users/edit`, this.currentUser)

      this.getData()
    },
    async createUser() {
      this.hidePopups()
      await axios.post(`/users/create`, this.currentUser)

      this.getData()
    },
    openEdit(user: user) {
      this.hidePopups()
      this.currentUser = structuredClone(toRaw(user));
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
      this.currentUser = { skins: [] as any[] } as user
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
        <button @click="getData" clickable class="dp-flex jc-c ai-c iconButton">
          <RefreshCcw :size="24" color="black" />
        </button>
        <button @click="call('/reset')" clickable>Reset</button>
        <button @click="call('/base')" clickable>Base Data</button>
        <button @click="openCreate()" clickable class="dp-flex jc-c ai-c iconButton">
          <PlusCircle :size="24" color="green" />
        </button>
      </div>
      <div class="dp-flex gap-custom">
        <span class="dp-flex jc-c ai-c input h100 p-1" id="clearbutton" clickable @click="search_term = ''; getData()">
          <XCircle color="black" id="clearicon" stroke-width="2.5px" :size="20" />
        </span>
        <input type="text" name="" id="search" class="p-1 shadow" placeholder="Search..." v-model="search_term"
          @keydown.enter="getData">
        <span class="dp-flex jc-c ai-c input h100 p-1" id="filterbutton" clickable v-if="false">
          <FilterIcon id="searchicon" color="black" stroke-width="2.5px" :size="20" />
        </span>
        <span class="dp-flex jc-c ai-c input h100 p-1" id="searchbutton">
          <Search id="searchicon" color="black" stroke-width="2.5px" :size="20" clickable />
        </span>
      </div>
    </div>
    <table v-if="hasData">
      <tbody>
        <tr v-for="(user, index) in users" :key="index" class="user">
          <td width="20" class="ta-center">
            <span class="dp-flex ai-c jc-c">
              <Eye :size="20" color="white" @click="openView(user)" clickable />
            </span>
          </td>
          <td width="20" class="ta-right">{{ index + 1 }}.</td>
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
    <div v-else>
      <LoaderIcon color="purple" />
    </div>
  </main>
  <PopUp v-if="popups.create_active" @close="popups.create_active = false">
    <div class="dp-flex fd-c gap-2 popup">
      <h1 class="ta-center">Create User</h1>
      <span class="dp-flex jc-sb gap-4">
        User: <input type="text" v-model="currentUser.username" placeholder="...">
      </span>
      <span class="dp-flex jc-sb gap-4">
        Country: <input type="text" v-model="currentUser.country" placeholder="...">
      </span>
      <span class="dp-flex jc-sb gap-4">
        Competitive Points: <input type="number" v-model="currentUser.comp_points" placeholder="...">
      </span>
      <span class="dp-flex gap-4 jc-sb">
        Skins:
        <div class="dp-flex fd-c gap-2">
          <table>
            <tbody>
              <tr>
                <td>Name</td>
                <td>Code</td>
              </tr>
              <tr v-for="(skin, index) in currentUser.skins" :key="index">
                <td> <input type="text" v-model="skin.name"></td>
                <td><input type="text" v-model="skin.code" class="skincode-input ta-center"
                    placeholder="XXXXXX-XXXXXX-XXXXXX-XXXXXX"></td>
              </tr>
              <tr>
                <td colspan="2">
                  <span class="dp-flex ai-c jc-sb" clickable @click="currentUser.skins.push({ code: '', name: '' })">
                    Add Skin
                    <PlusCircle color="lightgreen" />
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </span>
      <span class="dp-flex jc-e">
        <button @click="createUser" clickable>Save & Exit</button>
      </span>
    </div>
  </PopUp>
  <PopUp v-if="popups.edit_active" @close="popups.edit_active = false">
    <div class="dp-flex fd-c gap-2 popup">
      <h1 class="ta-center">Edit User</h1>
      <span class="dp-flex jc-sb gap-4">
        User: <input type="text" v-model="currentUser.username" placeholder="...">
      </span>
      <span class="dp-flex jc-sb gap-4">
        Country: <input type="text" v-model="currentUser.country" placeholder="...">
      </span>
      <span class="dp-flex jc-sb gap-4">
        Competitive Points: <input type="number" v-model="currentUser.comp_points" placeholder="...">
      </span>
      <span class="dp-flex jc-sb gap-4">
        Registered since: <span>{{ new Date(currentUser.createdAt).toLocaleDateString() }}</span>
      </span>
      <span class="dp-flex gap-4 jc-sb">
        Skins:
        <div class="dp-flex fd-c gap-2">
          <table>
            <tbody>
              <tr>
                <td>Name</td>
                <td>Code</td>
              </tr>
              <tr v-for="(skin, index) in currentUser.skins" :key="index">
                <td> <input type="text" v-model="skin.name"></td>
                <td><input type="text" v-model="skin.code" class="skincode-input ta-center"
                    placeholder="XXXXXX-XXXXXX-XXXXXX-XXXXXX"></td>
              </tr>
              <tr>
                <td colspan="2">
                  <span class="dp-flex ai-c jc-sb" clickable @click="currentUser.skins.push({ code: '', name: '' })">
                    Add Skin
                    <PlusCircle color="lightgreen" />
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </span>
      <span class="dp-flex jc-e">
        <button @click="editUser" clickable>Save & Exit</button>
      </span>
    </div>
  </PopUp>
  <PopUp v-if="popups.remove_active" @close="popups.remove_active = false">
    <div class="dp-flex fd-c gap-2 popup">
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
    <div class="dp-flex fd-c gap-2 popup">
      <h1 class="ta-center">View User</h1>
      <span class="dp-flex jc-sb gap-4">
        User: <span>{{ currentUser.username }}</span>
      </span>
      <span class="dp-flex jc-sb gap-4">
        Country: <span>{{ currentUser.country }}</span>
      </span>
      <span class="dp-flex jc-sb gap-4">
        Competitive Points: <span>{{ currentUser.comp_points }}</span>
      </span>
      <span class="dp-flex jc-sb gap-4">
        Registered since: <span> {{ new Date(currentUser.createdAt).toLocaleDateString() }}</span>
      </span>
      <span class="dp-flex gap-4 jc-sb">
        Skins:
        <div class="dp-flex fd-c gap-2">
          <table>
            <tbody>
              <tr>
                <td>Name</td>
                <td>Code</td>
              </tr>
              <tr v-for="(skin, index) in currentUser.skins" :key="index">
                <td>{{ skin.name }}</td>
                <td>{{ skin.code }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </span>
    </div>
  </PopUp>
</template>

<style scoped>
.popup input {
  border-radius: 0;
  margin: 0;
  padding-left: .2rem !important;
}

.popup td:has(input) {
  padding: 2px;
}

.skincode-input {
  min-width: 220px
}

.skin-object {
  padding: .5rem;
  border-radius: 1rem;
  box-shadow: inset 0 0 10px red;
}

.skin-object span {
  color: black !important;
}

.gap-custom {
  gap: 3px
}

.iconButton {
  height: 100%;
  padding: .2rem
}

input#search {
  border-radius: 0;
}

#clearbutton {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  width: 2rem
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