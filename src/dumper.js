import fs from 'fs'
import path from 'path'
import NotionUtil from './utils/notion.js'


const subdirs = [
    'blocks',
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
        // console.info(block.id)
        // console.info(block.last_edited_time)
        // console.info(block.has_children)
        // console.info(block.object)
        let parentPageDir = ''

        // If parent is a page, join dir of it to object path
        if (parent && (parent.type == 'child_page' || parent.object == 'page')) {
            let time = new Date(parent.last_edited_time).getTime()
            parentPageDir = `${parent.id}_${time}`
            let parentPagePath = path.join(this.folder, 'blocks', parentPageDir)
            if (!fs.existsSync(parentPagePath)) {
                fs.mkdirSync(parentPagePath)
            }
        }
        let time = new Date(block.last_edited_time).getTime()
        let blockFilePath = path.join(this.folder, 'blocks', parentPageDir, `${block.id}_${time}.json`)
        if (fs.existsSync(blockFilePath))
            return

        if (block.has_children || block.object == 'page') {
            let results = await this.dumpBlocks(block, parent)
            block.childrens = results.map(block => { return block.id })
        }

        // console.info(block.id, JSON.stringify(block))

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
        fs.writeFileSync(blockFilePath, JSON.stringify(block))

    }

}

export default JsonDumper