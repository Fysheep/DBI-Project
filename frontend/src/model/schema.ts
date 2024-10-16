type skin = {
  code: string
  name: string
}

type user = {
  _id: string
  username: string
  country: string
  comp_points: number
  skins: skin[]
  createdAt: Date
  updatedAt: Date
}

export type { user, skin }
