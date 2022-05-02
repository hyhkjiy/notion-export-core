import {
    GitProcess,
} from 'dugite'


class GitUtils {
    /**
     * 
     * @param {*} path Repository path including repository name
     */
    constructor(path) {
        this.path = path
        this.exec = (args, options) => {
            options = {
                ...{
                    env: {
                        GIT_AUTHOR_NAME: 'NotionExportRobot',
                        GIT_AUTHOR_EMAIL: 'notion-robot@gmail.com',
                        GIT_COMMITTER_NAME: 'NotionExportRobot',
                        GIT_COMMITTER_EMAIL: 'notion-robot@gmail.com',
                    }
                }, ...options
            }

            return GitProcess.exec(args, this.path, options)
        }
    }

    async clone(url) {
        const options = {
            env: {
                GIT_HTTP_USER_AGENT: 'dugite/2.12.0'
            }
        }
        let pathSplits = this.path.split('/')
        let dirName = pathSplits.pop()
        let clonePath = pathSplits.join('/')
        const result = await this(
            ['clone', url, dirName, '--progress'],
            clonePath,
            options
        )
        if (result.exitCode !== 0) {
            console.log(`Unable to clone, exit code ${result.exitCode}`)
            console.log(result.stderr)
            throw new Error(`Unable to clone, exit code ${result.exitCode}`)
        } else {
            console.log('Clone completed')
        }
    }

    async pull() {
        const result = await this.exec(
            ['pull']
        )
        if (result.exitCode !== 0) {
            console.log(`Unable to pull, exit code ${result.exitCode}`)
            console.log(result.stderr)
            throw new Error(`Unable to pull, exit code ${result.exitCode}`)
        } else {
            console.log('Pull completed')
        }
    }

    async addAll() {
        const result = await this.exec(
            ['add', '--all']
        )
        if (result.exitCode !== 0) {
            console.log(`Unable to add all, exit code ${result.exitCode}`)
            console.log(result.stderr)
            throw new Error(`Unable to add all, exit code ${result.exitCode}`)
        } else {
            console.log('Add completed')
        }
    }

    async commit(message) {
        const result = await this.exec(
            ['commit', '-m', message],
        )
        if (result.exitCode !== 0) {
            console.log(`Unable to commit, exit code ${result.exitCode}`)
            console.log(result.stderr)
            throw new Error(`Unable to commit, exit code ${result.exitCode}`)
        } else {
            console.log('Commit completed')
        }
    }

    async push() {
        const result = await this.exec(
            ['push']
        )
        if (result.exitCode !== 0) {
            console.log(`Unable to push, exit code ${result.exitCode}`)
            console.log(result.stderr)
            throw new Error(`Unable to push, exit code ${result.exitCode}`)
        } else {
            console.log('Push completed')
        }
    }
}

export default GitUtils