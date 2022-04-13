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

const repositoryName = 'notion_export'
const repositoryPath = path.join(folder, repositoryName)


NotionUtil.initialze(process.env.NOTION_TOKEN) // notion option object

const git = new Git(repositoryPath)

let res = await git.exec(['status']);
if (!res.stdout.includes('nothing to commit')) {
    console.log(res.stdout)
    console.log('git status is not clean, please commit all changes')
    process.exit(1)
}

if (!fs.existsSync(repositoryPath)) {
    await git.clone(gitRepository)
} else {
    await git.pull()
}

Storage.initialze(repositoryPath)
const dumper = new Dumper(repositoryPath)
const results = await NotionUtil.listTopPages()

for (let page of results) {
    await dumper.dumpBlock(page)
}

res = await git.exec(['status']);
if (res.stdout.includes('nothing to commit')) {
    console.log('No changes')
    process.exit(0)
}

await git.addAll()

const date = new Date().toLocaleString()
await git.commit(`Update from Notion at ${date}`)
await git.push()

console.info('Done')