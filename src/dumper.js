import fs from 'fs'
import path from 'path'
import NotionUtil from './utils/notion.js'

const subdirs = [

]

class JsonDumper {
    constructor(folder) {
        subdirs.forEach(dir => {
            dir = path.join(folder, dir)
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir)
            }
        })
    }

    async dumpBlocks(id) {
        const response = await NotionUtil.notion.blocks.children.list({
            block_id: id,
            page_size: 0,
        })
        console.log(response)
        response.results.forEach(block => { this.dumpBlock(block) })
    }

    dumpBlock(block) {
        console.info(block.id)
        console.info(block.last_edited_time)
        console.info(block.has_children)
        console.info(block.object)
        switch (block.type) {
            case "paragraph":
                break
            case "bulleted_list_item":
                break
            case "numbered_list_item":
                break
            case "toggle":
                break
            case "to_do":
                break
            case "quote":
                break
            case "callout":
                break
            case "synced_block":
                break
            case "template":
                break
            case "column":
                break
            case "child_page":
                break
            case "child_database":
                break
            case "table":
                break
        }
    }

}

export default JsonDumper