import { app, BrowserWindow, ipcMain, shell, Menu } from 'electron';
import { config } from '@/main/Config/config';
// import isDev from 'electron-is-dev'; // New Import
const log = require('electron-log');


const path = require("path");
const isDev = !app.isPackaged;

import { menu } from './menu';

const { update, query, checkOrMakeTables, run, deleteAllData, upsert } = require('@/main/Database/database');

let win;



const createWindow = (): void => {
  win = new BrowserWindow({
    width: 1500,
    height: 1000,
    title: "Bot Portfolio Manager",
    // icon: path.join(__dirname, '../assets/icons/icon.png'),
    webPreferences: {
      nodeIntegration: false, // is default value after Electron v5
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote
      worldSafeExecuteJavaScript: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    // icon: appIcon

  });

  Menu.setApplicationMenu(menu)

  let loadURL = `file://${__dirname}/index.html`
  if (isDev) {
    win.webContents.openDevTools();
    loadURL = 'http://localhost:9000';
  }
  win.loadURL(loadURL);
}

app.on('ready', createWindow);
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})


app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.

  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

ipcMain.handle('open-external-link', (event, link) => {
  shell.openExternal(link)
});

ipcMain.handle('allConfig', (event, value:string ) => {
  if (value  != 'all') return config.get(value)
  return config.store
});

ipcMain.handle('setStoreValue', (event, key:string, value:any) => config.set(key, value));
ipcMain.handle('setBulkValues', (event, values) => config.set(values) );

ipcMain.handle('config-clear', () => {
  return config.clear()
});



/**
 * 
 *      Database Functions
 * 
 */



ipcMain.handle('query-database', (event, queryString) => {
  return query(queryString)
});

ipcMain.handle('update-database', (event, table, updateData): void => update(table, updateData));

ipcMain.handle('upsert-database', (event, table: string, data: any[], id: string, updateColumn: string): void => upsert(table, data, id, updateColumn));

ipcMain.handle('run-database', (event, queryString): void => run(queryString));

ipcMain.handle('database-deleteAll', async (event, profileID?: string): Promise<void> => await deleteAllData(profileID));

ipcMain.handle('database-checkOrMakeTables', () => {
  log.log('attempting to check if tables exist yet.')
  checkOrMakeTables()
});


/**
 * 
 *      3C API functions
 * 
 */

import { updateAPI, getAndStoreBotData, getAccountSummary, getDealOrders, updateDeal } from '@/main/3Commas/index';
import { UpdateDealRequest } from "@/main/3Commas/types/Deals";
import { Type_Profile } from '@/types/config'

ipcMain.handle('api-updateData', async (event, type, options, profileData: Type_Profile): Promise<ReturnType<typeof updateAPI>> => {
  return await updateAPI(type, options, profileData)
});

ipcMain.handle('api-getBots', async (event, profileData: Type_Profile): Promise<void> => {
  await getAndStoreBotData(profileData)
});

ipcMain.handle('api-getAccountData', async (event, profileData: Type_Profile, key?: string, secret?: string, mode?: string) => {
  return await getAccountSummary(profileData, key, secret, mode)
});

ipcMain.handle('api-getDealOrders', async (event, profileData: Type_Profile, deal_id: number) => {
  return await getDealOrders(profileData, deal_id)
});




ipcMain.handle('api-deals-update', async (event, profileData: Type_Profile, deal: UpdateDealRequest) => {
  return await updateDeal(profileData, deal)
});

/************************************************************************
 * 
*
*                     Binance API
 * 
*
*************************************************************************/

import { fetchCoinPricesBinance } from '@/app/Features/CoinPriceHeader/BinanceApi';

ipcMain.handle('binance-getCoins', async (event) => {
  return await fetchCoinPricesBinance()
});

import { fetchVersions } from '../app/Features/UpdateBanner/UpdateApiFetch';

ipcMain.handle('pm-versions', async (event) => {
  return await fetchVersions()
});

export { win }