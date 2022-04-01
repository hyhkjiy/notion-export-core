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
    }

    async clone(url) {
        const options = {
            env: {
                GIT_HTTP_USER_AGENT: 'dugite/2.12.0'
            }
        }
        let dirName = this.path.split('/').pop()
        const result = await GitProcess.exec(
            ['clone', url, dirName, '--progress'],
            this.path,
            options
        )
        if (result.exitCode !== 0) {
            console.log(`Unable to clone, exit code ${result.exitCode}`)
            console.log(result.stderr)
        } else {
            console.log('Clone completed')
        }
    }

    async pull() {
        const result = await GitProcess.exec(
            ['pull'],
            this.path
        )
        if (result.exitCode !== 0) {
            console.log(`Unable to pull, exit code ${result.exitCode}`)
            console.log(result.stderr)
        } else {
            console.log('Pull completed')
        }
    }

    async addAll() {
        const result = await GitProcess.exec(
            ['add', '--all'],
            this.path
        )
        if (result.exitCode !== 0) {
            console.log(`Unable to add, exit code ${result.exitCode}`)
            console.log(result.stderr)
        } else {
            console.log('Add completed')
        }
    }

    async commit(message) {
        const result = await GitProcess.exec(
            ['commit', '-m', message],
            this.path
        )
        if (result.exitCode !== 0) {
            console.log(`Unable to commit, exit code ${result.exitCode}`)
            console.log(result.stderr)
        } else {
            console.log('Commit completed')
        }
    }

    async push() {
        const result = await GitProcess.exec(
            ['push'],
            this.path
        )
        if (result.exitCode !== 0) {
            console.log(`Unable to push, exit code ${result.exitCode}`)
            console.log(result.stderr)
        } else {
            console.log('Push completed')
        }
    }
}

export default GitUtils