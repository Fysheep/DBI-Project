import router from '@/router'

function go(route: string) {
  router.push(route)
}

function go_outwards(route: string) {
  window.open(route, '_blank')
}

function go_back(backuproute: string) {
  if (history.state.back) router.push(backuproute)
  else router.go(-1)
}

export { go, go_outwards, go_back }
