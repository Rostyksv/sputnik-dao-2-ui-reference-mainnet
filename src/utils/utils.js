import 'regenerator-runtime/runtime';
import { connect, Contract, keyStores, WalletConnection } from 'near-api-js';
import { useGlobalState, useGlobalMutation } from './container';
import getConfig from '../config';
import * as nearApi from 'near-api-js';
import Decimal from 'decimal.js';
import { yoktoNear } from './funcs';

export const nearConfig = getConfig(process.env.NODE_ENV || 'development');
export const provider = new nearApi.providers.JsonRpcProvider(nearConfig.nodeUrl);
export const connection = new nearApi.Connection(nearConfig.nodeUrl, provider, {});

export async function accountExists(accountId) {
  try {
    await new nearApi.Account(connection, accountId).state();
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function getDaoState(dao) {
  try {
    const state = await new nearApi.Account(connection, dao).state();
    const amountYokto = new Decimal(state.amount);
    return amountYokto.div(yoktoNear).toFixed(2);
  } catch (error) {
    console.log(error);
    return 0;
  }
}
