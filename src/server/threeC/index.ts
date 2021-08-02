import { update } from '@/server/database';
const { bots, getAccountDetail, deals, getDealsBulk, getDealsUpdate } = require('./api');

import {  Type_Deals, Type_Query_Accounts, Type_API_bots } from '@/types/3Commas'

/**
 * 
 * TODO
 * - Inspect if the lastSyncTime is set. If it is, then need to run bulk. If it's not, need to run update. This might need to go into
 * the code for threeC
 */
async function updateAPI( limit:number ) {

  await deals(limit)
    .then(( data: Type_Deals[]) => {
      console.log('made it back here')
      update('deals', data)
    })

  await getAccountDetail()
    .then(( data: Type_Query_Accounts[] ) => {
      update('accountData', data)
    })
}

async function getAndStoreBotData(){
  await bots()
    .then( ( data: Type_API_bots[]) => {
      console.log('fetched bot Data')
      update('bots', data)
    })
}

export {
  bots,
  getAndStoreBotData,
  updateAPI,
  getAccountDetail, 
  deals, 
  getDealsBulk, 
  getDealsUpdate
}