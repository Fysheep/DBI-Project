<script lang="ts">
import axios from 'axios';
import { ChevronDown, ChevronRight, Check, RefreshCcw, Loader, Trash } from 'lucide-vue-next';



axios.defaults.baseURL = "http://localhost:8001"

export default {
  components: {
    ChevronDown, ChevronRight, Check, RefreshCcw, Loader, Trash
  },
  data() {
    return {
      test_data: [] as any[],
      visible_tests: [] as boolean[],

      is_loading: false,
      dropdownActive: false,
      basic_prompt: false,
      basic_size: 10,
    }
  },
  async mounted() {
    document.addEventListener("click", this.hideTestOptions)

    await this.getData()
  },
  methods: {
    async getData() {
      const res = await axios.get(`/test`)
      this.test_data = res.data
    },
    async clearTests() {
      await axios.get(`/test/clear`)
      this.getData()
    },
    displayTestOptions() {
      this.dropdownActive = !this.dropdownActive;
    },
    hideTestOptions(me: MouseEvent) {
      const target = me.target as HTMLElement;
      if (!target.parentElement) return;

      if (!target.classList.contains("dropdown-rel") && !target.parentElement.classList.contains("dropdown-rel")) {
        this.dropdownActive = false
        this.basic_prompt = false;
      }

    },
    basicTestPrompt() {
      this.basic_prompt = !this.basic_prompt;
      this.$nextTick(() => { document.getElementById("basic-size")!.focus() })
    },
    async test(type: "basic" | "advanced" | "eternity") {
      this.dropdownActive = false;
      this.basic_prompt = false;

      this.is_loading = true

      switch (type) {
        case "basic":
          if (isNaN(this.basic_size)) break;
          await axios.get(`/test/basic?size=${this.basic_size}`)
          break;
        case 'advanced':
          await axios.get(`/test/advanced`)
          break;
        case 'eternity':
          await axios.get(`/test/eternity`)
          break;
      }

      this.is_loading = false

      this.getData()
    },
    objectAsArray(obj: any) {
      return Object.keys(obj).map(m => obj[m])
    },
    toDateTime(datestring: string) {
      return `${new Date(datestring).toLocaleTimeString().slice(0, 5)}/${new Date(datestring).toLocaleDateString()} `
    },
    keys(obj: object) {
      return Object.keys(obj)
    },
    getFirst(obj: any) {
      return obj[this.keys(obj)[0]]
    },
    toArr(obj: any) {
      return this.keys(obj).map(m => obj[m])
    },
    getColspan(test: any) {
      return this.keys(this.getFirst(test.data).times).length
    },
    getSystems(test_obj: any) {
      const test = test_obj.data;

      const result = this.toArr(test).map(m => this.keys(m.times)).reduce((a, b) => a.concat(b))
      return result
    },
    getArtifacts(test: any) {
      return [...this.keys(this.getFirst(this.getFirst(test.data).times)), "sum"] as any
    },
    flatten(test_obj: any, artifact_name: any) {
      const test = test_obj.data;

      if (artifact_name == "sum") {
        return this.keys(test)
          .map(m => this.toArr(test[m].times)
            .map(
              (m2: any) => this.toArr(m2)
                .reduce((r1, r2) => r1 + r2))
          )
          .reduce((a, b) => a.concat(b))
      }

      const result = this.keys(test)
        .map(m => this.toArr(test[m].times)
          .map((m2: any) => m2[artifact_name]))
        .reduce((a, b) => a.concat(b))

      return result
    },
    to_artifact_field(field: string) {
      let result = field.replace(/_/g, " ")

      result = result.split(" ").map(m => m.slice(0, 1).toUpperCase() + m.slice(1)).join(" ")

      return result
    },
    convert(time_orig: number) {
      const time = { time: time_orig, type: "μs" }

      if (time.time > 60_000_000) {
        time.time = time.time / 60_000_000
        time.type = "min"
      } else if (time.time > 1_000_000) {
        time.time = time.time / 1_000_000
        time.type = "s"
      } else if (time.time > 1_000) {
        time.time = time.time / 1_000
        time.type = "ms"
      }

      if (isNaN(time.time)) {
        return "no Value"
      }

      return `${Math.ceil(time.time * 10) / 10} ${time.type}`
    },
    getColor(time: number) {

      if (time > 60_000_000) return "red"
      if (time > 1_000_000) return "orange"
      if (time > 1_000) return "yellow"
      if (!isNaN(time)) return "green"
    },
    toggle(index: number) {
      this.visible_tests[index] = !this.visible_tests[index]
    }
  }
}
</script>

<template>
  <main class="dp-flex fd-c gap-3">
    <h1 consoleheadline class="ta-center">Test Results</h1>
    <div class="dp-flex gap-1 ai-c" id="dropdown-container">
      <button @click="getData" clickable class="dp-flex jc-c ai-c iconButton">
        <RefreshCcw :size="24" color="black" />
      </button>
      <button @click="clearTests" clickable class="dp-flex jc-c ai-c iconButton">
        <Trash :size="24" color="red" />
      </button>
      <button clickable class="dp-flex ai-c jc-sb fw-bold dropdown-rel" @click="displayTestOptions()"
        v-if="!is_loading">
        New Test
        <ChevronDown color="black" class="dropdown-rel" />
      </button>
      <Loader color="green" class="rotating" v-if="is_loading" />
      <div v-if="dropdownActive" class="dp-flex fd-c gap-2" id="test-dropdown">
        <span clickable class="dp-flex ai-c jc-sb hov-u dropdown-rel" @click="basicTestPrompt()">
          Basic
          <ChevronRight color="black" class="dropdown-rel" />
        </span>
        <span clickable class="hov-u" @click="test('advanced')">Advanced</span>
        <span clickable class="hov-u" @click="test('eternity')">Eternity</span>
      </div>
      <div v-if="basic_prompt" class="dp-flex fd-c gap-2 dropdown-rel" id="basic-prompt-dropdown">
        <span class="dropdown-rel dp-flex ai-c gap-1">
          <input type="number" v-model="basic_size" @keydown.enter="test('basic')" id="basic-size">
          <Check color="black" clickable @click="test('basic')" />
        </span>
      </div>
    </div>
    <div id="test-container" class="dp-flex fd-c gap-2 ai-s">
      <div v-for="(test, index) in test_data" :key="index" class="dp-flex fd-c gap-1 mw-50">
        <span class="dp-flex ai-c jc-sb">
          <ChevronDown color="white" @click="toggle(index)" clickable />
          {{ toDateTime(test.createdAt) }}
        </span>
        <table class="all-center">
          <tbody>
            <tr>
              <td></td>
              <td :colspan="getColspan(test)" v-for="(key, index) in keys(test.data)" :key="index">{{ key }}</td>
            </tr>
            <tr v-if="visible_tests[index]">
              <td>System</td>
              <td v-for="(system, index) in getSystems(test)" :key="index">
                {{ system }}
              </td>
            </tr>
            <tr v-for="(test_artifact, index) in getArtifacts(test).filter(() => visible_tests[index])" :key="index">
              <td>
                <span class="dp-flex gap-3 jc-sb">
                  <span>{{ to_artifact_field(test_artifact) }}</span>
                  =>
                </span>
              </td>
              <td v-for="(test_artifact_answer, index) in flatten(test, test_artifact)" :key="index" class="px-3"
                :class="`color-${getColor(test_artifact_answer)}`">
                {{ convert(test_artifact_answer) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</template>

<style>
.color-red {
  color: orangered
}

.color-orange {
  color: orange
}

.color-yellow {
  color: yellow
}

.color-green {
  color: greenyellow
}
</style>

<style scoped>
.mw-50 {
  min-width: 50%;
}

table.all-center td {
  text-align: center;
}

@keyframes spin {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

.rotating {
  animation: spin 4s linear infinite;
}

#dropdown-container {
  position: relative;
}

#test-dropdown {
  position: absolute;
  translate: 5.8rem 5.4rem;
  background-color: white;
  filter: drop-shadow(0 0 3px white);
  border-radius: 1rem;
  padding: 1rem;

  span {
    color: black;
  }
}

#basic-prompt-dropdown {
  position: absolute;
  translate: 11.3rem 3.2rem;
  background-color: white;
  filter: drop-shadow(0 0 3px white);
  border-radius: 1rem;
  padding: .5rem .5rem .5rem 1.5rem;

  span {
    color: black;
  }

  input {
    width: 70px;
    outline: black 1px solid;
    background-color: rgb(248, 248, 248);
  }
}

.hov-u:hover {
  text-decoration: underline
}
</style>
