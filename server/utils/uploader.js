const uuid = require('uuid')
const {fs} = require('fs')

exports.saveFile = async(file) => {
    const ext = file.name.split('.')[1]
    const name = `${uuid.v4()}.${ext}`
    await file.mv(`./uploads/${name}`)
    if(fs.existsSync(`./uploads/${name}`)){
        console.log(`./uploads/${name}`)
        return `./uploads/${name}`
    }else {
        return false
    }
}