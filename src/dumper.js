import fs from 'fs'
import path from 'path'
import request from 'request'
import NotionUtil from './utils/notion.js'
import Storage from './utils/storage.js'


const subdirs = [
    'files'
]


class Dumper {
    constructor(folder) {
        this.folder = folder
        subdirs.forEach(dir => {
            dir = path.join(folder, dir)
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir)
            }
        })
    }

    dumpFile(url) {
        let reg = new RegExp(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i)
        let fileId = url.match(reg)[0]
        if (!fileId) {
            console.error('Invalid file url', url)
            return null
        }

        let fileNameWithoutQuery = url.split('?')[0]
        let fileName = fileNameWithoutQuery.split('/').pop()

        let fileFolderPath = path.join(this.folder, 'files', fileId)
        let filePath = path.join(fileFolderPath, fileName)

        if (fs.existsSync(filePath))
            fs.unlinkSync(filePath)

        if (!fs.existsSync(fileFolderPath))
            fs.mkdirSync(fileFolderPath)


        request.get(url).pipe(fs.createWriteStream(filePath))

        return path.join('files', fileId, fileName)
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
        let block_key = (block.object == 'page' ? 'p/' : 'b/') + block.id

        let historyBlock = await Storage.get(block_key)
        if (historyBlock && historyBlock.value.last_edited_time == block.last_edited_time)
            return

        if (block.has_children || block.object == 'page') {
            let results = await this.dumpBlocks(block, parent)
            block.childrens = results.map(b => {
                return b.id
            })
        }

        switch (block.type) {
            case 'paragraph':
                break
            case 'heading_1':
                break
            case 'heading_2':
                break
            case 'heading_3':
                break
            case 'bulleted_list_item':
                break
            case 'numbered_list_item':
                break
            case 'to_do':
                break
            case 'toggle':
                break
            case 'child_page':
                break
            case 'child_database':
                break
            case 'embed':
                break
            case 'image':
                block.image.file.path = this.dumpFile(block.image.file.url)
                break
            case 'video':
                block.video.file.path = this.dumpFile(block.video.file.url)
                break
            case 'file':
                block.file.file.path = this.dumpFile(block.file.file.url)
                break
            case 'pdf':
                break
            case 'bookmark':
                break
            case 'callout':
                break
            case 'quote':
                break
            case 'equation':
                break
            case 'divider':
                break
            case 'table_of_contents':
                break
            case 'column':
                break
            case 'column_list':
                break
            case 'link_preview':
                break
            case 'synced_block':
                break
            case 'template':
                break
            case 'link_to_page':
                break
            case 'table':
                break
            case 'table_row':
                break
            case 'code':
                break
            case 'unsupported':
            default:
                if (block.object != 'page') {
                    console.error('Unsupported block type', block.type)
                }
                break

        }

        Storage.put(block_key, block).catch(err => {
            console.error(err)
            throw err
        })

    }

}

export default Dumper