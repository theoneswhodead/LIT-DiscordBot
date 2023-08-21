const fs = require('fs')
const path = require('path')

module.exports = (dir, dirOnly = false ) => {
    let fileArr = [];
    const files = fs.readdirSync(dir, { withFileTypes: true })

    files.forEach((file) => {
        const filePath = path.join(dir, file.name)

        if(dirOnly) {
            if(file.isDirectory()) {
                fileArr.push(filePath)
            }
        } else {
            if(file.isFile()) {
                fileArr.push(filePath)
            }
        }
    })
    return fileArr
}