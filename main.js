import dotenv from 'dotenv'
import Dumper from './src/dumper.js'
import NotionUtil from './src/utils/notion.js'
import Storage from './src/utils/storage.js'
import fs from 'fs'

dotenv.config()
const folder = process.env.EXPORT_FOLDER

if(!fs.existsSync(folder)) 
    fs.mkdirSync(folder)

NotionUtil.initialze(process.env.NOTION_TOKEN) // notion option object
Storage.initialze()

let dumper = new Dumper(folder)


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