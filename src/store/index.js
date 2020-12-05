import Vue from 'vue'
import Vuex from 'vuex'

import BigNumber from 'bignumber.js'

import { getString, setString } from '@nativescript/core/application-settings'

import constants from '../constants'

import { POOL_BLOCKS, REFRESH_BALANCE, REFRESH_BLOCK_TIME, REFRESH_DASHBOARD, REFRESH_DELEGATIONS, REFRESH_PRICES_AND_SUPPLY, REFRESH_REWARDS, REFRESH_STAKING, REFRESH_STAKING_POOL, REFRESH_TOKENS, REFRESH_VALIDATORS, SAVE_ADDRESS, SAVE_LAUNCH_SCREEN } from './actions'
import { UPDATE_ADDRESS, UPDATE_AVG_REWARD, UPDATE_BALANCE, UPDATE_BLOCKS, UPDATE_BLOCK_TIME, UPDATE_DELEGATIONS, UPDATE_LAUNCH_SCREEN, UPDATE_PRICE_AND_SUPPLY, UPDATE_REWARDS, UPDATE_STAKING_POOL, UPDATE_TOKENS, UPDATE_VALIDATORS } from './mutations'

import { StorageKey } from '../enums/storage-key'
import { Screen } from '../enums/screens'
import crypto from '../utils/crypto'

import coingecko from '../api/coingecko'
import tradescan from '../api/tradescan'
import tendermint from '../api/tendermint'
import switcheo from '../api/switcheo'

Vue.use(Vuex);

// setString('address', '');

const appSettings = {
  address: getString(StorageKey.ADDRESS, ''),
  launchScreen: getString(StorageKey.LAUNCH_SCREEN, Screen.DASHBOARD)
};

export default new Vuex.Store({
  state: {
    prices: {
      usd: new BigNumber(0.0000)
    },
    mktCap: new BigNumber(0),
    dayVolume: 0,
    insurance: 0,
    validators: [],
    totalSupply: new BigNumber(0),
    totalStaked: new BigNumber(0),
    totalBonded: new BigNumber(0),
    avgReward: new BigNumber(0),
    apr: new BigNumber(0.00),
    blockTime: new BigNumber(0.00),
    blocks: [],
    tokens: [],
    balances: [],
    delegations: [],
    rewards: [],
    appSettings: appSettings
  },
  actions: {
    [SAVE_ADDRESS]({ commit }, address) {
      setString(StorageKey.ADDRESS, address);
      commit(UPDATE_ADDRESS, address);
    },

    [SAVE_LAUNCH_SCREEN]({ commit }, screen) {
      setString(StorageKey.LAUNCH_SCREEN, screen);
      commit(UPDATE_LAUNCH_SCREEN, screen);
    },

    // RefreshStaking
    async [REFRESH_STAKING]({ dispatch }) {
      await dispatch(REFRESH_TOKENS); // refreshTokens order is mandatory
      await dispatch(REFRESH_REWARDS);
      await dispatch(REFRESH_BALANCE);
      await dispatch(REFRESH_DELEGATIONS);
    },

    async [REFRESH_REWARDS]({ commit, state }) {
      // loading rewards
      const data = await tradescan.getRewards(state.appSettings.address);
      commit(UPDATE_REWARDS, data);
    },

    async [REFRESH_DELEGATIONS]({ commit, state }) {
      // loading delegations
      const data = await tradescan.getDelegations(state.appSettings.address);
      commit(UPDATE_DELEGATIONS, data);
    },

    async [REFRESH_BALANCE]({ commit, state }) {
      // loading balance
      const balance = await tradescan.getBalance(state.appSettings.address);
      commit(UPDATE_BALANCE, balance);
    },

    async [REFRESH_TOKENS]({ commit }) {
      // loading tokens
      const tokens = await tradescan.getTokens();
      commit(UPDATE_TOKENS, tokens);
    },

    // RefreshDashboard
    async [REFRESH_DASHBOARD]({ dispatch }) {
      await dispatch(REFRESH_PRICES_AND_SUPPLY);
      await dispatch(REFRESH_STAKING_POOL); // refreshStakingPool order is mandatory
      await dispatch(POOL_BLOCKS); // pollBlocks order is mandatory
      await dispatch(REFRESH_BLOCK_TIME);
    },

    async [REFRESH_PRICES_AND_SUPPLY]({ commit }) {
      // loading price
      const prices = await coingecko.getSwitcheoPrice();
      // loading supply
      const totalSupply = await switcheo.getNativeTokenSupply();
      commit(UPDATE_PRICE_AND_SUPPLY, { price: prices.switcheo.usd, totalSupply });
    },

    async [REFRESH_STAKING_POOL]({ commit }) {
      // loading staking pool
      const data = await tradescan.getStakingPool();
      commit(UPDATE_STAKING_POOL, data.result);
    },

    async [REFRESH_VALIDATORS]({ commit }) {
      // loading validators
      const validators = await tradescan.getValidators();
      commit(UPDATE_VALIDATORS, validators);
    },

    async [POOL_BLOCKS]({ commit }) {
      // loading five last blocks
      const blocks = await tradescan.getBlocks(1, 5);
      commit(UPDATE_BLOCKS, blocks);

      if (!blocks || blocks.length == 0)
        return;

      const lastBlock = blocks[0];

      let blockCount = new BigNumber(0);
      let totalRewards = new BigNumber(0);

      // loading last block events
      const evts = await tendermint.getBlockResults(lastBlock.block_height);

      evts.result.begin_block_events.forEach((evt) => {
        if (evt.type === 'rewards') {
          evt.attributes.forEach((c) => {
            const key = crypto.decodeb64(c.key);
            if (key === 'amount') {
              const value = crypto.decodeb64(c.value);
              if (value.substr(value.length - 4) === 'swth') {
                totalRewards = totalRewards.plus(
                  new BigNumber(
                    value.substring(0, value.length - 4),
                  ).shiftedBy(-8),
                )
              }
            }
          });
        }
      });

      blockCount = blockCount.plus(1);
      const avgReward = totalRewards.div(blockCount);

      commit(UPDATE_AVG_REWARD, avgReward);
    },

    /**
     * Be sure to refreshStakingPool, refreshValidators and pollBlocks before
     */
    async [REFRESH_BLOCK_TIME]({ commit }) {
      // loading block time
      const blockTime = await tradescan.getBlockTime();
      commit(UPDATE_BLOCK_TIME, blockTime);
    }
  },
  mutations: {
    [UPDATE_ADDRESS](state, address) {
      state.appSettings.address = address;
    },

    [UPDATE_LAUNCH_SCREEN](state, screen) {
      state.appSettings.launchScreen = screen;
    },

    [UPDATE_REWARDS](state, payload) {
      if (payload.result.rewards) {
        state.rewards = payload.result.rewards;
      }
    },

    [UPDATE_DELEGATIONS](state, payload) {
      if (payload.result) {
        state.delegations = payload.result;
      }
    },

    [UPDATE_BALANCE](state, balance) {
      state.balances = balance;
    },

    [UPDATE_TOKENS](state, tokens) {
      state.tokens = tokens;  
    },

    [UPDATE_PRICE_AND_SUPPLY](state, payload) {
      if (payload.price) {
        state.prices.usd = new BigNumber(payload.price).toFormat(constants.PRICE_PRECISION);
        state.totalSupply = new BigNumber(payload.totalSupply);
        state.mktCap = new BigNumber(payload.price).times(payload.totalSupply);
      }
    },

    [UPDATE_STAKING_POOL](state, tokens) {
      if (tokens) {
        state.totalStaked = new BigNumber(tokens.bonded_tokens)
          .plus(new BigNumber(tokens.not_bonded_tokens))
            .shiftedBy(-8);
      }
    },

    [UPDATE_VALIDATORS](state, validators) {
      if (validators) {
        state.validators = validators;

        let totalBonded = new BigNumber(0);
        validators.forEach((val) => {
          if (val.BondStatus === 'bonded') {
            totalBonded = totalBonded.plus(new BigNumber(val.Tokens))
          }
        });

        state.totalBonded = totalBonded;
      }
    },

    [UPDATE_BLOCK_TIME](state, blockTime) {
      if (blockTime) {
        const timeArray = blockTime.split(':');
        const hours = new BigNumber(timeArray[0]).times(60 * 60);
        const minutes = new BigNumber(timeArray[1]).times(60);
        const seconds = new BigNumber(timeArray[2]);
        const blockTimeBN = hours.plus(minutes).plus(seconds);

        state.blockTime = blockTimeBN.toFormat(constants.BLOCK_TIME_PRECISION);

        const blocksInYear = constants.SECONDS_IN_A_YEAR.div(blockTimeBN);
        const rewardsInYear = blocksInYear.times(state.avgReward);
        const apr = rewardsInYear.div(state.totalBonded);

        state.apr = apr.times(100).toFormat(2);
      }
    },

    [UPDATE_BLOCKS](state, blocks) {
      state.blocks = blocks;
    },

    [UPDATE_AVG_REWARD](state, avgReward) {
      state.avgReward = avgReward;
    }
  }
});
