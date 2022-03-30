import { Client } from '@notionhq/client'


class NotionUtil {

    static initialze(notionToken) {
        if (!NotionUtil.notion) {
            NotionUtil.notion = new Client({ auth: notionToken })

            NotionUtil.blocks = {
                children: {
                    list: async (...args) => {
                        return await NotionUtil.retry.call(NotionUtil.notion, NotionUtil.notion.blocks.children.list, ...args)
                        // return await NotionUtil.retry(() => NotionUtil.notion.blocks.children.list(...args))
                    }
                }
            }
        }
    }

    static async retry(fn, ...params) {
        const time = 500
        const number = 5
        for (let i = 0; i < number; i++) {
            try {
                return await fn.call(this, ...params) // 'this' can be passed in through retry.call and passed to fn
            }
            catch (error) {
                if (i == number - 1) {
                    console.info(`The ${fn.name} function fails ${number} times, stop trying!`)
                    throw error
                }

                console.info(`The ${fn.name} function fails ${i + 1} times, try again after ${time}ms`)
                await new Promise(r => setTimeout(r, time))
            }

        }
    }

    static async search(...args) {
        return await NotionUtil.retry.call(NotionUtil.notion, NotionUtil.notion.search, ...args)
        // return await NotionUtil.retry(() => NotionUtil.notion.search(...args))
    }

    static async listTopPages() {
        let results = []
        let start_cursor = undefined
        while (true) {
            const response = await NotionUtil.search({
                start_cursor,
                query: '',
                sort: {
                    direction: 'ascending',
                    timestamp: 'last_edited_time',
                },
                filter: {
                    value: 'page',
                    property: 'object'
                }
            })

            for (const page of response.results) {
                if (page.parent.type == 'workspace') {
                    results.push(page)
                }
            }

            if (!response.has_more)
                break

            start_cursor = response.next_cursor
        }
        // console.info('top page list: ', results)
        return results
    }

}

export default NotionUtil