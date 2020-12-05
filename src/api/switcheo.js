import axios from 'axios/dist/axios'

import constants from '../constants'

export default {
    concatToBaseUrl(endpoint) {
        return constants.SWITCHEO_API_BASE_URL.concat(endpoint);
    },

    async getNativeTokenSupply() {
        const { data } = await axios.get(this.concatToBaseUrl(constants.SWITCHEO_API_NATIVE_TOKEN_SUPPLY_ENDPOINT));
        return data;
    }
}
