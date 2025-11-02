//vanillaDB re-imagined
export interface DanychConfig {
    key: string
    type: "s" | "l" | "local" | "session" | "localStorage" | "sessionStorage"
}

interface DanychData { size: number, datas: [] }

const dConfig: DanychConfig = {
    key: "my-app-data",
    type: "local",
}

/**@class DanychMachine. */
class DanychStore {
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

    /**@method db Starts Danych with localStorage with Db Key @param key string. */
    db<T>(key: string) { 
        const config:DanychConfig = {type: "local", key }
        return new Danych<T>(config)
    }

    /**@method state Starts Danych with sessionStorage with Db Key @param key string. */
    state<T>(key: string) {
        const config:DanychConfig = {type: "session", key }
        return new Danych<T>(config)
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

//main Danych
/**@class Danych is a 1kb lightweight database in the browser built on top of localStorage and sessionStorage. @param config.  @example const db = new Danych<DbType>({config}) and use the return db to get db.get(), db.get(0), set db.set(data), db.set(data, id), update db.update(newdata), db.update(newdata, id), and remove db.remove(id).. */
class Danych<T> {
    private config: DanychConfig
    datas: T[]
    constructor(config: DanychConfig) {
        this.config = config
        this.datas = this.#init()?.datas === undefined ? [] : this.#init()?.datas
    }

    /**@method set add new data. @param data @param id add new data at specified id. @example db.set(data) or db.set(data, id) */
    set(data: T, id?: number) {
        if (id === undefined) {
            this.datas.push(data)
            this.#sync()
        } else {
            this.datas.splice(id, 0, data)
            this.#sync()
        }
    }

    /**@method get return all datas or the data with id. @param id data id. @example db.get(0) or db.get().*/
    get(id?: number) {
        const datas = id === undefined ? this.datas : this.datas[id]
        return datas
    }

    /**@method update data with id. @param data new data. @param id data id. @example db.update(newdata) or db.update(newdata, 0). */
    update(data: T, id: number) {
        if (this.datas[id] !== undefined) {
            this.datas = this.datas.filter((_, i) => i !== id)
            this.set(data, id)
        }
    }

    /**@method remove data with id. @param id data id. @example db.remove(0), db.remove().  */
    remove(id?: number) {
        if (this.datas[id] !== undefined) {
            const others = this.datas.filter((_, i) => i !== id)
            this.datas = others
            this.#sync()
        } else {
            this.datas.pop()
            this.#sync()
        }
    }

    #init():DanychData {
        const data:DanychData = { size: 0, datas: [] }
        const nd = JSON.stringify(data)
        const type = this.config.type
        const key = this.config.key

        if (DanychStore.isLocal(type)) {
            const exist = localStorage.getItem(key)
            if (exist === null) {
                localStorage.setItem(key, nd)
                return data
            } else {
                return JSON.parse(exist)
            }
        } else if (DanychStore.isSession(type)) {
            const exist = sessionStorage.getItem(key)
            if (exist === null) {
                sessionStorage.setItem(key, nd)
                return data
            } else {
                return JSON.parse(exist)
            }
        }
    }

    #sync() {
        const d = { datas: this.datas, size: this.datas.length }
        const data = JSON.stringify(d)
        const key = this.config.key

        if (DanychStore.isSession(this.config.type)) {
            sessionStorage.setItem(key, data)
        } else if (DanychStore.isLocal(this.config.type)) {
            localStorage.setItem(key, data)
        }
    }
}

/**@danych useDanych Danych lightweight browser storage. @example call useDanych.init(), const db = useDanych.init<YourDBType>(config object or dbkey), call useDanych.start<DbType>(db-key) to start a sessionStorage Db, call useDanych.db<DbType>(db-key) to start a localStorage Db and use the return db to get db.get(), db.get(0), set db.set(data), db.set(data, id), update db.update(newdata), db.update(newdata, id), and remove db.remove(id). */
const useDanych = new DanychStore()
export default useDanych