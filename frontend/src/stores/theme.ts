import { ref } from 'vue'
import { defineStore } from 'pinia'
import { default_theme, theme_array, type ThemeType } from '@/model/themes'

export const ThemeStore = defineStore('theme', () => {
  const data = ref<ThemeType>(localStorage.theme ?? default_theme)
  document.body.className = data.value

  function get() {
    return data.value
  }

  function set(value: ThemeType) {
    data.value = value

    document.body.classList.remove(localStorage.theme)
    document.body.classList.add(value)

    localStorage.theme = value
  }

  function cycle() {
    let index = theme_array.findIndex((f) => data.value == f)
    if (index >= theme_array.length - 1) index = 0
    else index++

    set(theme_array[index])
  }

  return {
    set,
    get,
    cycle
  }
})
