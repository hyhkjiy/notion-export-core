import fs from 'fs'
import path from 'path'
import NotionUtil from './utils/notion.js'
import Storage from './utils/storage.js'


const subdirs = [
    'files'
]


class JsonDumper {
    constructor(folder) {
        this.folder = folder
        subdirs.forEach(dir => {
            dir = path.join(folder, dir)
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir)
            }
        })
    }

    async dumpBlocks(block, parent) {
        const response = await NotionUtil.blocks.children.list({
            block_id: block.id,
            page_size: 0,
        })

        // Treat the first `page` or `child_page` of the upper layer as parent
        parent = block.type == 'child_page' || block.object == 'page' ? block : parent
        response.results.forEach(b => this.dumpBlock(b, parent))
        return response.results
    }

    async dumpBlock(block, parent) {
        let block_key = (block.object == 'page' ? 'p_' : 'b_') + block.id

        let historyBlock = await Storage.get(block_key)
        if (historyBlock && historyBlock.value.last_edited_time == block.last_edited_time)
            return

        if (block.has_children || block.object == 'page') {
            let results = await this.dumpBlocks(block, parent)
            block.childrens = results.map(b => { return b.id })
        }

        switch (block.type) {
            case "paragraph":
                break
            case "heading_1":
                break
            case "heading_2":
                break
            case "heading_3":
                break
            case "bulleted_list_item": // 无序列表项
                break
            case "numbered_list_item": // 有序列表项
                break
            case "to_do":  // to do列表
                break
            case "toggle":
                break
            case "child_page":
                break
            case "child_database":
                break
            case "embed":
                break
            case "image":
                break
            case "video":
                break
            case "file":
                // block.file.file.url // "https://s3.us-west-2.amazonaws.com/secure.notion-static.com/2d81b4f2-9b7c-4112-b52e-dc79144ef10b/README.md?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220329%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220329T143018Z&X-Amz-Expires=3600&X-Amz-Signature=ec38ac57b60be8d435fc976751b1b7bfcc03132a29cf87426d66659ef011e37b&X-Amz-SignedHeaders=host&x-id=GetObject"
                break
            case "pdf":
                break
            case "bookmark":
                break
            case "callout":
                break
            case "quote":
                break
            case "equation":
                break
            case "divider":
                break
            case "table_of_contents":
                break
            case "column":
                break
            case "column_list":
                break
            case "link_preview":
                break
            case "synced_block":
                break
            case "template":
                break
            case "link_to_page":
                break
            case "table":
                break
            case "table_row":
                break
            case "unsupported":
                break

        }

        Storage.put(block_key, block).catch(err => {
            console.error(err)
            throw err
        })

    }

}

export default JsonDumper