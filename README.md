# Danych 
Danych is a 1kb lightweight database in the browser.
Danych is simply a Browser Storage built on top of localStorage and sessionStorage.

## Installation
```bash
  npm i danych
```

```typescript
import useDanych from "danych"

interface Todo {
  id: number
  text: string
}

//Starting with full config
const db = useDanych.init<Todo>({
  key: "my-app-data",
  type: "session"
})

//OR, start localStorage with just the key
const db = useDanych.db("my-database-key")

//OR, start sessionStorage with just the key
const db = useDanych.state("my-database-key")
```
### call init() to start Danych with either full config object.
### call db() to start Danych with localStorage with just Db Key.
### call state() to start Danych with sessionStorage with just Db Key.

#### Danych treats all the datas like a collection which makes the DefaultData an Array by Default.

## Usage
### Storing Data 

store new data using Danych.

```typescript
//set new data
db.set({ id: 1, text: "some data" })

//set data with id
db.set({ id: 1, text: "some data" }, 0)
```

### Getting Data

get all the datas or get data with id.
```typescript
//get all the store datas
const datas = db.get()

//get data with id
const datas = db.get(1)
```

### Updating Data

```typescript
//update data with id
db.update({ id: 64, text: "new data value" }, 1)
```

### Removing Data

```typescript
//remove data with id
db.remove(0)

//remove last stored data
db.remove()
```

## Properties
- datas - return all store datas.


[![NPM](https://img.shields.io/npm/v/danych.svg)](https://www.npmjs.com/package/danych) 

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

[![Contact](https://img.shields.io/badge/contact-@zediculz-blue.svg?style=flat&logo=twitter)](https://twitter.com/zediculz)

## License
MIT ©