//vanillaDB re-imagined
export interface DanychConfig {
    key: string
    type: "s"|"l"|"local"|"session"|"localStorage"|"sessionStorage"
}

type DefaultData = any[]
const dConfig: DanychConfig = {
    key: "my-app-data",
    type: "local",
}

/**@class DanychMech Danych Machine */
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
}

function isLocal(str: string) {
    if (str === "local" || str === "l" || str === "localStorage") {
        return true
    }

    return false
}

function isSession(str: string) {
    if (str === "session" || str === "s" || str === "sessionStorage") {
        return true
    }

    return false
}

/**@class Danych state machine. */
class Danych<T = DefaultData> {
    private config: DanychConfig
    items: T[]
    constructor(config: DanychConfig) {
        this.config = config
        this.items = this.#loadItems()?.items === undefined ? [] : this.#loadItems()?.items
        this.#init()
    }

    /**@method set add new data to the items */
    set(data: T, id?: number) {
        if (id === undefined) {
            this.items.push(data)
            this.#sync()
        } else {
            this.items.splice(id, 0, data)
            this.#sync()
        }
    }

    /**@method get return the last data in the items @param id return the item with the id */
    get(id?: number) {
        if (id === undefined) {
            return this.items[this.items.length - 1]
        } else {
            return this.items[id]
        }
    }

    /**@method update item in items with id @param id */
    update(data: T, id: number) {
        const selected = this.items[id]

        if (selected !== undefined) {
            const others = this.items.filter((_, itemId) => itemId !== id)
            this.items = others
            this.set(data, id)
        }
    }

    /**@method remove item in items with id @param id */
    remove(id: number) {
        const selected = this.items[id]

        if (selected !== undefined) {
            const others = this.items.filter((_, itemId) => itemId !== id)
            this.items = others
            this.#sync()
        }
    }

    #init() {
        if (isLocal(this.config.type)) {
            const exist = localStorage.getItem(this.config.key)
            if (exist === null) {
                const nd = {
                    key: this.config.key,
                    data: [],
                }
                localStorage.setItem(this.config.key, JSON.stringify(nd))
            }
        } else if (isSession(this.config.type)) {
            const exist = sessionStorage.getItem(this.config.key)
            if (exist === null) {
                const nd = {
                    key: this.config.key,
                    data: [],
                }
                sessionStorage.setItem(this.config.key, JSON.stringify(nd))
            }
        }
    }

    #sync() {
        const d = { ...this.config, items: this.items }
        const data = JSON.stringify(d)
        const key = this.config.key

        if (isSession(this.config.type)) {
            sessionStorage.setItem(key, data)
        } else if (isLocal(this.config.type)) {
            localStorage.setItem(key, data)
        }
    }

    #loadItems() {
        const key = this.config.key
        const session = sessionStorage.getItem(key)
        const local = localStorage.getItem(key)

        if (isSession(this.config.type)) {
            return JSON.parse(session)
        } else if (isLocal(this.config.type)) {
            return JSON.parse(local)
        }
    }
}

/**@instance useDanych is Danych Entry Point */
const useDanych = new DanychMachine()
export default useDanych