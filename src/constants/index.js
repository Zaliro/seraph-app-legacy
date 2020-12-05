import BigNumber from 'bignumber.js'

export default {
    // API
    COINGECKO_API_BASE_URL: "https://api.coingecko.com/api/v3",
    COINGECKO_API_SIMPLE_PRICE_ENDPOINT: "/simple/price?ids=switcheo&vs_currencies=usd",

    TRADESCAN_API_BASE_URL: "https://tradescan.switcheo.org",
    TRADESCAN_API_STAKING_POOL_ENDPOINT: "/staking/pool",
    TRADESCAN_API_INSURANCE_BALANCE_ENDPOINT: "/get_insurance_balance",
    TRADESCAN_API_BLOCKTIME_ENDPOINT: "/get_block_time",
    TRADESCAN_API_ALL_VALIDATORS_ENDPOINT: "/get_all_validators",
    TRADESCAN_API_BLOCKS: "/get_blocks",
    TRADESCAN_API_TOKENS: "/get_tokens",
    TRADESCAN_API_ACCOUNT_BALANCE : "/get_balance?account={account}",
    TRADESCAN_API_ACCOUNT_DELEGATIONS: "/staking/delegators/{account}/delegations",
    TRADESCAN_API_ACCOUNT_REWARDS: "/distribution/delegators/{account}/rewards",

    TENDERMINT_API_BASE_URL: "https://tradescan-tm.switcheo.org",
    TENDERMINT_API_BLOCK_RESULTS_ENDPOINT: "/block_results",

    SWITCHEO_API_BASE_URL: "https://api.switcheo.network/v2",
    SWITCHEO_API_NATIVE_TOKEN_SUPPLY_ENDPOINT: "/exchange/native_token_supply",

    // UI
    PRICE_PRECISION: 4,
    BLOCK_TIME_PRECISION: 2,

    CARDS_ELEVATION: 0,
    CARDS_RADIUS: 24,

    WALLET_PRECISION: 2,
    DELEGATIONS_PRECISION: 2,
    REWARDS_PRECISION: 2,

    // MISC
    SECONDS_IN_A_YEAR: new BigNumber(31536000),

    // URLS
    URL_WEBSITE: 'https://www.seraph.network/',
    URL_TELEGRAM: 'https://t.me/seraph_staking',
    URL_KEYBASE: 'https://keybase.io/seraph_staking',
    URL_DISCORD: 'https://discord.gg/SPh62Hf',
    URL_STAKING_SHORTCUT: 'https://stake.switcheo.org/stake',

    // DIALOGS
    ACTION_REQUIRED_SET_ADDRESS: 'You need to set your Switcheo Tradehub address to be able to follow your staking informations.',
    SUCCESS_ADDRESS_UPDATED: 'Your address has been successfully updated.',
    ERROR_INVALID_ADDRESS: 'Your Switcheo Tradehub address seems incorrect.\n\nPlease check your entry and try again.',

    // ANALYTICS
    ANALYTICS_EVENT_SET_ADDRESS: 'set_address'
}