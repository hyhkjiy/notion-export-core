import dotenv from 'dotenv'
import Dumper from '../src/dumper.js'
import NotionUtil from '../src/utils/notion.js'
import Storage from '../src/utils/storage.js'
import path from 'path'
import Git from '../src/utils/git.js'
import fs from 'fs'

dotenv.config()
const folder = process.env.EXPORT_FOLDER
const gitRepository = process.env.GIT_REPOSITORY

const repositoryName = 'notion-export'
const repositoryPath = path.join(folder, repositoryName)


NotionUtil.initialze(process.env.NOTION_TOKEN) // notion option object
Storage.initialze(repositoryPath)

const dumper = new Dumper(repositoryPath)
const git = new Git(repositoryPath)

if (!fs.existsSync(repositoryPath)) {
    await git.clone(gitRepository)
} else {
    await git.pull()
}

const results = await NotionUtil.listTopPages()

for (let page of results) {
    await dumper.dumpBlock(page)
}

const date = new Date().toLocaleString()

await git.addAll()
await git.commit(`Update from Notion at ${date}`)
await git.push()

console.info('Done')