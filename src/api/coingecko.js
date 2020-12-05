import axios from 'axios/dist/axios'

import constants from '../constants'

export default {
    concatToBaseUrl(endpoint) {
        return constants.COINGECKO_API_BASE_URL.concat(endpoint);
    },

    async getSwitcheoPrice() {
        const { data } = await axios.get(this.concatToBaseUrl(constants.COINGECKO_API_SIMPLE_PRICE_ENDPOINT));
        return data;
    }
}
