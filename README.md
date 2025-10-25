# Danych 
Danych is a lightweight database in the browser, Danych is built on top of localStorage and sessionStorage.

## Installation
```bash
  npm install --save danychb@latest
```

```typescript
import useDanych from "danych"

interface Todo {
  id: number
  text: string
}

//Start with full config
const db = useDanych.config<Todo>({
  key: "my-app-data",
  type: "session"
})

//OR, start with just the key
const db = useDanych.init("my-database-key")
```

## Usage
### Storing Data 

here is how to store data using Danych

```typescript
db.set({ id: 1, text: "some data" })
```

### Getting Data 

you can get the last stored data or get data with id
```typescript
//get the last store item
const datas = db.get()

//get item with id
const datas = db.get(1)
```

### Updating Data

```typescript
//update item with id
db.update({ id: 64, text: "new data value" })
```

### Removing Data

```typescript
//remove item with id
db.remove(0)
```

## More Features

- clear() - clear all keys and data
- items - return all store datas.


[![NPM](https://img.shields.io/npm/v/danych.svg)](https://www.npmjs.com/package/danych) 

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

[![Contact](https://img.shields.io/badge/contact-@zediculz-blue.svg?style=flat&logo=twitter)](https://twitter.com/zediculz)

## License
MIT ©