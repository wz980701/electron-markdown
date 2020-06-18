const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const isDev = require('electron-is-dev')
const path = require('path')
const menuTemplate = require('./menuTemplate')
const AppWindow = require('./AppWindow')
const Store = require('electron-store')
const settingsStore = new Store({ name: 'Settings' })
const qiniuConfigArr = ['#bucketName', '#secretKey', '#accessKey', '#savedFileLocation']


let mainWindow, settingsWindow

app.on('ready', () => {
    const mainWindowConfig = {
        width: 1440,
        height: 768
    }
    const urlLocation = isDev ? 'http://localhost:3000' : 'dummy'
    mainWindow = new AppWindow(mainWindowConfig, urlLocation)
    mainWindow.on('closed', () => {
        mainWindow = null
    })

    ipcMain.on('open-settings-window', () => {
        const settingsWindowConfig = {
            width: 500,
            height: 400,
            parent: mainWindow
        }
        const settingsFileLocation = `file://${path.join(__dirname, './settings/settings.html')}`
        settingsWindow = new AppWindow(settingsWindowConfig, settingsFileLocation)
        settingsWindow.on('closed', () => {
            settingsWindow = null
        })
    })

    ipcMain.on('config-is-saved', () => {
        let qiniuMenu = process.platform === 'darwin' ? menu.items[3] : menu.items[2]
        const switchItems = (toggle) => {
            [1, 2, 3].forEach(number => {
                qiniuMenu.submenu.items[number].enabled = toggle
            })
        }
        const qiniuConfiged = ['accessKey','secretKey','bucket'].every(i=>!!settingsStore.get(i))
        if (qiniuConfiged) {
            switchItems(true)
        } else {
            switchItems(false)
        }
    })

    let menu = Menu.buildFromTemplate(menuTemplate)
    Menu.setApplicationMenu(menu)
})