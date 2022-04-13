import Storage from '../src/utils/storage.js'
import fs from 'fs'


export default class Exporter {
    static exportText(text) {
        // text.annotations

        let html = text.plain_text || ''
        switch (text.type) {
            case 'text':
                break
            case 'equation':
                console.warn('equation not supported')
                break
            case 'mention':
                console.warn('Mention not supported')
                break
            default:
                console.warn('Unsupported text type', text.type)
        }

        if (text.href) {
            html = `<a href="${text.href}">${html}</a>`
        }

        if (text.annotations.bold) {
            html = `<b>${html}</b>`
        }

        if (text.annotations.italic) {
            html = `<i>${html}</i>`
        }

        if (text.annotations.underline) {
            html = `<u>${html}</u>`
        }

        if (text.annotations.strikethrough) {
            html = `<s>${html}</s>`
        }

        if (text.annotations.code) {
            html = `<code>${html}</code>`
        }

        if (text.annotations.color) {
            html = `<span style="color:${text.annotations.color}">${html}</span>`
        }


        return html
    }

    static exportParagraph(block) {
        let html = ''
        for (let text of block[block.type].rich_text) {
            html = html + Exporter.exportText(text)
        }
        return `<div id="${block.id}">${html}</div>`
    }

    static exportHeading(block, level) {
        let html = ''
        for (let text of block[block.type].rich_text) {
            html = html + Exporter.exportText(text)
        }
        return `<${level} id="${block.id}">${html}</${level}>`
    }

    static async loadBlock(blockId) {
        let block = await Storage.get('b/' + blockId)
        block = block.value

        block.html = ''

        let childsHtml = ''
        if (block.childrens) {
            for (let childId of block.childrens) {
                const child = await Exporter.loadBlock(childId)
                childsHtml = childsHtml + child.html

            }
        }

        if (block.object == 'page') {
            block.html = ''
        }

        switch (block.type) {
            case 'paragraph':
                block.html = Exporter.exportParagraph(block)
                break
            case 'heading_1':
                block.html = Exporter.exportHeading(block, 'h1')
                break
                case 'heading_2':
                block.html = Exporter.exportHeading(block, 'h2')
                break
            case 'heading_3':
                block.html = Exporter.exportHeading(block, 'h3')
                break
            case 'bulleted_list_item':
                break
            case 'numbered_list_item':
                break
            case 'to_do':
                // block.html = `<div id="${block.id}">${childsHtml}</div>`
                break
            case 'toggle':
                break
            case 'child_page':
                let html = childsHtml
                const filePath = '/Users/xhkj/Desktop/notion_export/html/' + block.id + '.html'
                fs.writeFileSync(filePath, html)
                block.html = `<div id="${block.id}"><a href="${block.id}.html">${block.child_page.title}</a></div>`
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

        return block

    }
}