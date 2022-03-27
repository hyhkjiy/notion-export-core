import { Client } from '@notionhq/client'


class NotionUtil {

    static initial(notionToken) {
        if (!NotionUtil.notion) {
            NotionUtil.notion = new Client({ auth: notionToken })
        }
    }

    static async listTopPages() {
        let results = []
        let start_cursor = undefined
        while (true) {
            const response = await NotionUtil.notion.search({
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