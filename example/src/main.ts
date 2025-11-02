
import useDanych from "../../src/index"

interface Todo {
  id: number
  text: string
}
const db = useDanych.db<Todo>("app-data")
//db.set({ id: 12, text: "some data" })

const datas = db.get()
console.log(datas)

//db.update({ id: 64, text: "PIG_WAR" }, 0)
//db.remove(0)

console.log(db)