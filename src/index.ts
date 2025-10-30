//vanillaDB re-imagined
export interface DanychConfig {
    key: string
    type: "s" | "l" | "local" | "session" | "localStorage" | "sessionStorage"
}

const dConfig: DanychConfig = {
    key: "my-app-data",
    type: "local",
}

/**@class DanychMachine. */
class DanychMachine {
    /**@method init Danych Entry Point @param arg string @param arg DanychConfig */
    init<T>(arg: string | DanychConfig) {
        const type = typeof arg

        if (type === "string") {
            const key = arg as string
            const nCfg: DanychConfig = { ...dConfig, key }
            return new Danych<T>(nCfg)

        } else if (type === "object") {
            const config = arg as DanychConfig

            const cfg: DanychConfig = {
                key: config.key === undefined ? dConfig.key : config.key,
                type: config.type === undefined ? dConfig.type : config.type,
            }

            return new Danych<T>(cfg)
        }

        return new Danych<T>(dConfig)
    }

    static isLocal(str: string) {
        if (str === "local" || str === "l" || str === "localStorage") {
            return true
        }

        return false
    }

    static isSession(str: string) {
        if (str === "session" || str === "s" || str === "sessionStorage") {
            return true
        }

        return false
    }
}

/**@class Danych is a 1kb lightweight database in the browser built on top of localStorage and sessionStorage. @param config.  @example const db = new Danych<DbType>({config}) and use the return db to get db.get(), db.get(0), set db.set(data), db.set(data, id), update db.update(newdata), db.update(newdata, id), and remove db.remove(id).. */
export class Danych<T = any[]> {
    private config: DanychConfig
    items: T[]
    constructor(config: DanychConfig) {
        this.config = config
        this.items = this.#loadItems()?.items === undefined ? [] : this.#loadItems()?.items
        this.#init()
    }

    /**@method set add new data to the items. @param id add new data at specified id in the items colection.  @example db.set(data) or db.set(data, 0). */
    set(data: T, id?: number) {
        if (id === undefined) {
            this.items.push(data)
            this.#sync()
        } else {
            this.items.splice(id, 0, data)
            this.#sync()
        }
    }

    /**@method get returns all items or the item with the id. @param id item id. @example db.get() or db.get(0) which returns all datas collection as db.items.*/
    get(id?: number) {
        if (id === undefined) {
            return this.items
        } else {
            return this.items[id]
        }
    }

    /**@method update item with id. @param id item id. @example db.update(newdata) or db.update(newdata, 0). */
    update(data: T, id: number) {
        const selected = this.items[id]

        if (selected !== undefined) {
            const others = this.items.filter((_, itemId) => itemId !== id)
            this.items = others
            this.set(data, id)
        }
    }

    /**@method remove item with id. @param id item id. @example db.remove(0). */
    remove(id?: number) {
        const selected = this.items[id]

        if (selected !== undefined) {
            const others = this.items.filter((_, itemId) => itemId !== id)
            this.items = others
            this.#sync()
        } else {
            this.items.pop()
            this.#sync()
        }
    }

    #init() {
        const nd = JSON.stringify({ length: 0, items: [], })
        const type = this.config.type
        const key = this.config.key

        if (DanychMachine.isLocal(type)) {
            const exist = localStorage.getItem(key)
            if (exist === null) {
                localStorage.setItem(key, nd)
            }
        } else if (DanychMachine.isSession(type)) {
            const exist = sessionStorage.getItem(key)
            if (exist === null) {
                sessionStorage.setItem(key, nd)
            }
        }
    }

    #sync() {
        const d = { items: this.items, length: this.items.length }
        const data = JSON.stringify(d)
        const key = this.config.key

        if (DanychMachine.isSession(this.config.type)) {
            sessionStorage.setItem(key, data)
        } else if (DanychMachine.isLocal(this.config.type)) {
            localStorage.setItem(key, data)
        }
    }

    #loadItems() {
        const key = this.config.key
        const type = this.config.type
        const session = sessionStorage.getItem(key)
        const local = localStorage.getItem(key)

        if (DanychMachine.isSession(type)) {
            return JSON.parse(session)
        } else if (DanychMachine.isLocal(type)) {
            return JSON.parse(local)
        }
    }
}

/**@hook useDanych Danych is a 1kb lightweight database in the browser built on top of localStorage and sessionStorage. @example call useDanych.init(), const db = useDanych.init<YourDBType> and use the return db to get db.get(), db.get(0), set db.set(data), db.set(data, id), update db.update(newdata), db.update(newdata, id), and remove db.remove(id). */
const useDanych = new DanychMachine()
export default useDanych