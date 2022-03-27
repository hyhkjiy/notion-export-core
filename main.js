import path from 'path'
import dotenv from 'dotenv'
import JsonDumper from './src/dumper.js'
import NotionUtil from './src/utils/notion.js'

dotenv.config()
const folder = path.join(process.env.EXPORT_FOLDER, 'notion_export')

NotionUtil.initial(process.env.NOTION_TOKEN) // notion option object

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


NotionUtil.listTopPages().then(results => {
    results.forEach(page => {
        console.info(page)
        dumper.dumpBlocks(page.id)

        // (async () => {
        //     const pageId = page.id
        //     const response = await notion.pages.retrieve({ page_id: pageId })
        //     console.log(response)
        // })();
    })
})
