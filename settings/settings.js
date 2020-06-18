const { remote } = require('electron')
const Store = require('electron-store')
const settingsStore = new Store({ name: 'Settings' })
const qiniuConfigArr = ['#bucketName', '#secretKey', '#accessKey', '#savedFileLocation']

const $ = (selector) => {
    const eles = document.querySelectorAll(selector)
    return eles.length > 1 ? eles : eles[0]
}

document.addEventListener('DOMContentLoaded', () => {
    let savedLocation = settingsStore.get('savedFileLocation')
    if (savedLocation) {
        $('#savedFileLocation').value = savedLocation
    }

    qiniuConfigArr.forEach(selector => {
        const savedValue = settingsStore.get(selector.substr(1))
        if (savedValue) {
            $(selector).value = savedValue
        }
    })

    $('#select-new-location').addEventListener('click', () => {
        remote.dialog.showOpenDialog({
            properties: ['openDirectory'],
            message: '选择文件的存储路径'
        }).then((path) => {
            const url = path.filePaths
            if (Array.isArray(url)) {
                $('#savedFileLocation').value = url[0]
                savedLocation = url[0]
            }
        })
    })
    $('#settings-form').addEventListener('submit', (e) => {
        e.preventDefault()
        qiniuConfigArr.forEach(selector => {
            if ($(selector)) {
                let { id, value } = $(selector)
                settingsStore.set(id, value ? value : '')
            }
        })
        remote.getCurrentWindow().close()
    })
    $('.nav-tabs').addEventListener('click', (e) => {
        e.preventDefault()
        $('.nav-link').forEach(element => {
            element.classList.remove('active')
        })
        e.target.classList.add('active')
        $('.config-area').forEach(element => {
            element.style.display = 'none'
        })
        $(e.target.dataset.tab).style.display = 'block'
    })
})