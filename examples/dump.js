import dotenv from 'dotenv'
import Dumper from '../src/dumper.js'
import NotionUtil from '../src/utils/notion.js'
import Storage from '../src/utils/storage.js'
import path from 'path'

dotenv.config()
const folder = process.env.EXPORT_FOLDER

const repositoryName = 'notion_export'
const repositoryPath = path.join(folder, repositoryName)


NotionUtil.initialze(process.env.NOTION_TOKEN) // notion option object

Storage.initialze(repositoryPath)
const dumper = new Dumper(repositoryPath)
const results = await NotionUtil.listTopPages()

for (let page of results) {
    await dumper.dumpBlock(page)
}

