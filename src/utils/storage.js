import path from 'path'
import hypertrie from 'hypertrie'

const storageDirName = 'db'

class Storage {

    static initialze(repositoryPath) {
        Storage.filePath = path.join(repositoryPath, storageDirName)
        Storage.db = hypertrie(Storage.filePath, {
            valueEncoding: 'json'
        })
    }

    // will overwrite duplicate ids
    static put(id, value) {
        return new Promise((resolve, reject) => {
            Storage.db.put(id, value, err => {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        })
    }


    static get(id) {
        return new Promise((resolve, reject) => {
            Storage.db.get(id, (err, value) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(value)
                }
            })
        })
    }

    static del(id) {
        return new Promise((resolve, reject) => {
            Storage.db.del(id, err => {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        })
    }

    static list(prefix, option) {
        return new Promise((resolve, reject) => {
            Storage.db.list(prefix, option, (err, value) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(value)
                }
            })
        })
    }

}

export default Storage