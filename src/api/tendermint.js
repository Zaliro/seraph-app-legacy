import axios from 'axios/dist/axios'

import constants from '../constants'

export default {
    concatToBaseUrl(endpoint) {
        return constants.TENDERMINT_API_BASE_URL.concat(endpoint);
    },

    async getBlockResults(height) {
        const { data } = await axios.get(this.concatToBaseUrl(`${constants.TENDERMINT_API_BLOCK_RESULTS_ENDPOINT}?height=${height}`));
        return data;
    }
}
