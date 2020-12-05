import axios from 'axios/dist/axios'

import constants from '../constants'

export default {
    concatToBaseUrl(endpoint) {
        return constants.TRADESCAN_API_BASE_URL.concat(endpoint);
    },

    async getStakingPool() {
        const { data } = await axios.get(this.concatToBaseUrl(constants.TRADESCAN_API_STAKING_POOL_ENDPOINT));
        return data;
    },
    
    async getInsurance() {
        const { data } = await axios.get(this.concatToBaseUrl(constants.TRADESCAN_API_INSURANCE_BALANCE_ENDPOINT));
        return data;
    },

    async getBlockTime() {
        const { data } = await axios.get(this.concatToBaseUrl(constants.TRADESCAN_API_BLOCKTIME_ENDPOINT));
        return data;
    },

    async getBlocks(page, limit) {
        const { data } = await axios.get(this.concatToBaseUrl(`${constants.TRADESCAN_API_BLOCKS}?page=${page}&limit=${limit}`));
        return data;
    },

    async getValidators() {
        const { data } = await axios.get(this.concatToBaseUrl(constants.TRADESCAN_API_ALL_VALIDATORS_ENDPOINT));
        return data;
    },

    async getTokens() {
        const { data } = await axios.get(this.concatToBaseUrl(constants.TRADESCAN_API_TOKENS));
        return data;
    },

    async getBalance(account) {
        const endpoint = constants.TRADESCAN_API_ACCOUNT_BALANCE.replace('{account}', account);
        const { data } = await axios.get(this.concatToBaseUrl(endpoint));
        return data;
    },
    
    async getDelegations(account) {
        const endpoint = constants.TRADESCAN_API_ACCOUNT_DELEGATIONS.replace('{account}', account);
        const { data } = await axios.get(this.concatToBaseUrl(endpoint));
        return data;
    },

    async getRewards(account) {
        const endpoint = constants.TRADESCAN_API_ACCOUNT_REWARDS.replace('{account}', account);
        const { data } = await axios.get(this.concatToBaseUrl(endpoint));
        return data;
    }
}
