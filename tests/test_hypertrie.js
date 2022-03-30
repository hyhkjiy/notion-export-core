import hypertrie from 'hypertrie'
import dotenv from 'dotenv'
import path from 'path'


dotenv.config()

let dbPath = path.join(process.env.EXPORT_FOLDER, process.env.STORE_FILE)

let db = hypertrie(dbPath, { valueEncoding: 'json' })

let key = 'p:4f7bbe1d-fe4a-45cb-bdf4-f2e67fefdb84'

db.put(key, { 'test': 'aaa' }, err => {
    if (err) {
        console.error(err)
    } else {
        db.get(key, (err, value) => {
            if (err) {
                console.error(err)
            } else {
                console.info('get success', value)
            }
        })

        db.list('p', {}, (err, value) => {
            if (err) {
                console.error(err)
            } else {
                console.info('list p success', value)
            }
        })

        db.list((err, value) => {
            if (err) {
                console.error(err)
            } else {
                console.info('list success', value)
            }
        })
    }
})