import dotenv from 'dotenv'
import Storage from '../src/utils/storage.js'
import Exporter from '../src/exporter.js'
import path from 'path'
import fs from 'fs'

dotenv.config()
const folder = process.env.EXPORT_FOLDER

const repositoryName = 'notion_export'
const repositoryPath = path.join(folder, repositoryName)


Storage.initialze(repositoryPath)

const pages = await Storage.list('p/')

const htmlPath = path.join(repositoryPath, 'html')
if (!fs.existsSync(htmlPath)) {
    fs.mkdirSync(htmlPath)
}

for (let page of pages) {
    let pageInfo = page.value
    pageInfo.html = ''
    if (pageInfo.childrens) {
        for (let blockId of pageInfo.childrens) {
            const block = await Exporter.loadBlock(blockId)
            pageInfo.html = pageInfo.html + block.html
        }
    }

    console.info(pageInfo)

    fs.writeFileSync(path.join(repositoryPath, 'html', pageInfo.id + '.html'), pageInfo.html)
}

console.info('Done')