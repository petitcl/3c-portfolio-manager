const Store = require('electron-store');
const { run } = require('@/app/Features/Database/database')

import { defaultConfig} from '@/utils/defaultConfig';


const migrateCurrencyToArray = (store:any ) => {
    const currentCurrency = store.get('general.defaultCurrency');
    (currentCurrency.length > 0) ? store.set('general.defaultCurrency', [currentCurrency] ) : store.set('general.defaultCurrency', [] )
}


// establishing a config store.
const config = new Store({
    migrations: {
        '0.0.3': ( store: any )=>{
            console.info('migrating the config store to 0.0.2-RC1')
            store.set('statSettings.account_id', []);
            migrateCurrencyToArray(store)
            
        },
        '0.0.4': ( store: any )=>{
            console.info('migrating the config store to 0.0.4')
            console.log('adding a reserved funds array.')
            store.set('statSettings.reservedFunds', []);
        },
        '0.1.0': ( store: any )=>{
            console.info('migrating the config store to 0.1.0')
            run('drop table bots;')
            store.set('general.updated', true)
        },
        '0.1.1': ( store: any )=>{
            store.set('general.updated', true)
        },
        '0.2.0': ( ) => {

            // removing the bots that have been synced so they can be resynced and a new column added
            run('ALTER TABLE bots ADD COLUMN hide boolean;')
        },
        '0.3.1': ( ) => {

            // deleting all cancelled and failed deals from the database due to a bug in how they report from 3C
            run("delete from deals where status in ('failed', 'cancelled') ")
        }
        
    },
    defaults: defaultConfig
});



export {
    config
}