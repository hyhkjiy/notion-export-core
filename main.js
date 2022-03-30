import dotenv from 'dotenv'
import JsonDumper from './src/dumper.js'
import NotionUtil from './src/utils/notion.js'
import Storage from './src/utils/storage.js'

dotenv.config()
const folder = process.env.EXPORT_FOLDER

NotionUtil.initialze(process.env.NOTION_TOKEN) // notion option object
Storage.initialze()


// create dump object for selected type
let dumper = null
switch (process.env.DUMP_TYPE) {
    case 'json':
        dumper = new JsonDumper(folder)
        break
    default:
        console.error('Undefined dump type', process.env.DUMP_TYPE)
        break
}

// let info = await Storage.find('4f7bbe1d-fe4a-45cb-bdf4-f2e67fefdb84')
// console.info(info)

// Storage.put('p:4f7bbe1d-fe4a-45cb-bdf4-f2e67fefdb84', { 'test': 'aaa' })
//     .then(() => Storage.get('p:4f7bbe1d-fe4a-45cb-bdf4-f2e67fefdb84').then(res => console.info('success', res.value)))
//     .catch(err => { console.error('failed', err) })

// Storage.list('p').then(results => {
//     console.info(results)
//     results.forEach(node => {
//         console.info(node)
//     })
// })

// Storage.del('4f7bbe1d-fe4a-45cb-bdf4-f2e67fefdb84').then(res => console.info('success', res))


function main() {
    NotionUtil.listTopPages().then(results => {
        results.forEach(page => {
            console.info(page)
            dumper.dumpBlock(page)
        })
    })

    // Storage.list('p').then(results => {
    //     results.forEach(node => {
    //         console.info(node)
    //     })
    // })

}

main()