import dotenv from 'dotenv'
import Storage from '../src/utils/storage.js'
import path from 'path'

dotenv.config()
const folder = process.env.EXPORT_FOLDER

const repositoryName = 'notion_export'
const repositoryPath = path.join(folder, repositoryName)


Storage.initialze(repositoryPath)

const pages = await Storage.list('p/')

async function loadBlock(blockId) {
    let block = await Storage.get('b/' + blockId)
    block = block.value

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
            break
        case 'video':
            break
        case 'file':
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
    console.info(block)

    if (block.childrens) {
        block.childBlocks = []
        for (let childId of block.childrens) {
            const child = await loadBlock(childId)
            block.childBlocks.push(child)
        }
    }

    return block

}

let pageContents = []

for (let page of pages) {
    let pageInfo = page.value

    if (pageInfo.childrens) {
        pageInfo.childBlocks = []
        for (let blockId of pageInfo.childrens) {
            const block = await loadBlock(blockId)
            pageInfo.childBlocks.push(block)
        }
    }
    pageContents.push(pageInfo)
}


console.info('Done')