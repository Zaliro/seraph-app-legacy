<template>
  <GridLayout columns="*" rows="*, *, *, *, *">
    <!-- Address -->
    <StackLayout row="0" class="text-center mt-4 px-2">
      <Label text.decode="Your address" class="text-xs text-additional"></Label>
      <Label :text="address" class="text-xs text-secondary"></Label>
    </StackLayout>

    <!-- Wallet -->
    <CardView
      row="1"
      :elevation="cards.elevation"
      :radius="cards.radius"
      class="mt-4 ml-4 mr-4 card-bg"
    >
      <StackLayout>
        <Label class="text-secondary text-base mx-4 mt-2">
          <FormattedString>
            <Span text.decode="&#xf555;" class="fas"></Span>
            <Span text=" Wallet"></Span>
          </FormattedString>
        </Label>

        <RadListView ref="walletListView" for="token in wallet" class="pb-2">
          <v-template name="header">
            <GridLayout columns="55, 1.5*, *, *" rows="*" class="px-2">
              <Label
                text="Token"
                col="0"
                class="text-left text-additional"
              ></Label>
              <Label
                text="Total"
                col="1"
                class="text-right text-additional"
              ></Label>
              <Label
                text="Available"
                col="2"
                class="text-right text-additional"
              ></Label>
              <Label
                text="Staked"
                col="5"
                class="text-right text-additional"
              ></Label>
            </GridLayout>
          </v-template>

          <v-template>
            <GridLayout columns="55, 1.5*, *, *" rows="*" class="px-2 pb-2">
              <Label
                :text="token.denom.toUpperCase()"
                col="0"
                class="text-left"
              ></Label>
              <Label
                :text="
                  token.available.plus(token.staked).toFormat(token.decimals)
                "
                col="1"
                class="text-right bg-green-700 rounded-l"
              ></Label>
              <Label
                :text="token.available.toFormat(token.decimals)"
                col="2"
                class="text-right bg-green-500"
              ></Label>
              <Label
                :text="token.staked.toFormat(token.decimals)"
                col="5"
                class="text-right bg-gray-700 rounded-r"
              ></Label>
            </GridLayout>
          </v-template>
        </RadListView>
      </StackLayout>
    </CardView>

    <!-- Delegations -->
    <CardView
      row="2"
      :elevation="cards.elevation"
      :radius="cards.radius"
      class="mt-4 ml-4 mr-4 card-bg"
    >
      <StackLayout>
        <Label class="text-secondary text-base mx-4 mt-2">
          <FormattedString>
            <Span text.decode="&#xf4c4;" class="fas"></Span>
            <Span text=" Delegations"></Span>
          </FormattedString>
        </Label>

        <RadListView
          ref="delegationsListView"
          for="delegation in stakings"
          class="pb-2"
        >
          <v-template name="header">
            <GridLayout columns="2.2*, *, 55" rows="*" class="px-2">
              <Label
                text="Validator"
                col="0"
                class="text-left text-additional"
              ></Label>
              <Label
                text="Amount"
                col="1"
                class="text-right text-additional"
              ></Label>
              <Label
                text="Token"
                col="2"
                class="text-right text-additional"
              ></Label>
            </GridLayout>
          </v-template>

          <v-template>
            <GridLayout columns="2.2*, *, 55" rows="*" class="px-2 pb-2">
              <Label
                :text="delegation.validator"
                col="0"
                class="text-left"
              ></Label>
              <Label
                :text="delegation.staked.toFormat(delegation.decimals)"
                col="1"
                class="text-right bg-gray-700 rounded"
              ></Label>
              <Label
                :text="delegation.denom.toUpperCase()"
                col="2"
                class="text-right"
              ></Label>
            </GridLayout>
          </v-template>
        </RadListView>
      </StackLayout>
    </CardView>

    <!-- Rewards -->
    <CardView
      row="3"
      :elevation="cards.elevation"
      :radius="cards.radius"
      class="mt-4 ml-4 mr-4 card-bg"
    >
      <StackLayout>
        <Label class="text-secondary text-base mx-4 mt-2">
          <FormattedString>
            <Span text.decode="&#xf51e;" class="fas"></Span>
            <Span text=" Rewards"></Span>
          </FormattedString>
        </Label>

        <RadListView
          ref="rewardsListView"
          for="reward in stakingRewards"
          class="pb-2"
        >
          <v-template name="header">
            <GridLayout columns="2.2*, *, 55" rows="*" class="px-2">
              <Label
                text="Validator"
                col="0"
                class="text-left text-additional"
              ></Label>
              <Label
                text="Amount"
                col="1"
                class="text-right text-additional"
              ></Label>
              <Label
                text="Token"
                col="2"
                class="text-right text-additional"
              ></Label>
            </GridLayout>
          </v-template>

          <v-template>
            <GridLayout columns="2.2*, *, 55" rows="*" class="px-2 pb-2">
              <Label :text="reward.validator" col="0" class="text-left"></Label>
              <Label
                :text="reward.amount.toFormat(reward.decimals)"
                col="1"
                class="text-right rounded" :class="{ 'bg-pink-700':(reward.validator === ''), 'bg-pink-500':(reward.validator !== '') }"
              ></Label>
              <Label
                :text="reward.denom.toUpperCase()"
                col="2"
                class="text-right"
              ></Label>
            </GridLayout>
          </v-template>
        </RadListView>
      </StackLayout>
    </CardView>

    <!-- Forecasts -->
    <!--
    <CardView
      row="4"
      :elevation="cards.elevation"
      :radius="cards.radius"
      class="mt-4 mb-4 ml-4 mr-4 mr-2 card-bg"
    >
      <StackLayout>
        <Label class="text-secondary text-base mx-4 mt-2">
          <FormattedString>
            <Span text.decode="&#xf201;" class="fas"></Span>
            <Span text=" Forecasts"></Span>
          </FormattedString>
        </Label>

        <Label
          text="Not available yet"
          class="text-additional text-center mb-4"
        />
      </StackLayout>
    </CardView>
    -->
  </GridLayout>
</template>

<script>
import BigNumber from "bignumber.js";
import { mapState } from "vuex";

import constants from "../../../constants";

export default {
  name: "Staking",
  data() {
    return {
      cards: {
        elevation: 0,
        radius: 24,
      },
    };
  },
  props: {
    isLoading: Boolean,
  },
  watch: {
    isLoading() {},
  },
  computed: {
    ...mapState([
      "appSettings",
      "tokens",
      "validators",
      "balances",
      "delegations",
      "rewards",
    ]),
    address() {
      if (this.appSettings.address && this.appSettings.address != "")
        return this.appSettings.address;
      else return "No address";
    },
    wallet() {
      let wallet = [];

      Object.keys(this.balances).forEach((denom) => {
        const balance = this.balances[denom];
        const available = new BigNumber(balance.available);

        const index = wallet.findIndex((x) => x.denom == denom);
        if (index == -1) {
          wallet.push({
            available: new BigNumber(available),
            staked: new BigNumber(0.0),
            denom,
            decimals: constants.WALLET_PRECISION, // If needed: token.decimals === '' ? 8 : parseInt(token.decimals)
          });
        } else {
          wallet[index].available = wallet[index].available.plus(available);
        }
      });

      this.delegations.forEach((delegation) => {
        const denom = delegation.balance.denom;
        let amount = new BigNumber(delegation.balance.amount);
        amount = this.getShiftedAmount(denom, amount);

        const index = wallet.findIndex((x) => x.denom == denom);
        if (index !== -1) {
          wallet[index].staked = wallet[index].staked.plus(amount);
        }
      });

      return wallet;
    },
    stakings() {
      let stakings = [];

      this.delegations.forEach((delegation) => {
        const validatorAddr = delegation.validator_address;
        const validator =
          this.validators.find((x) => x.OperatorAddress == validatorAddr)
            .Description.moniker ?? "Unknown";

        const denom = delegation.balance.denom;
        let amount = new BigNumber(delegation.balance.amount);
        if (denom == "swth") amount = amount.shiftedBy(-8);

        stakings.push({
          validator,
          staked: amount,
          denom,
          decimals: constants.DELEGATIONS_PRECISION, // If needed: token.decimals === '' ? 8 : parseInt(token.decimals)
        });
      });

      return stakings;
    },
    stakingRewards() {
      let stakingRewards = [];

      this.rewards.forEach((reward) => {
        const validatorAddr = reward.validator_address;
        const validator =
          this.validators.find((x) => x.OperatorAddress == validatorAddr)
            .Description.moniker ?? "Unknown";

        const validatorRewards = reward.reward;
        validatorRewards.forEach((validatorReward) => {
          const denom = validatorReward.denom;
          let amount = new BigNumber(validatorReward.amount);
          amount = this.getShiftedAmount(denom, amount);

          if (amount.toFormat(constants.REWARDS_PRECISION) <= 0)
            return;

          stakingRewards.push({
            validator,
            amount,
            denom,
            decimals: constants.REWARDS_PRECISION,
          });
        });
      });

      const rewardsDenoms = [...new Set(stakingRewards.map((x) => x.denom))];
      rewardsDenoms.forEach((denom) => {
        const denomRewards = stakingRewards.filter((x) => x.denom == denom);
        let totalDenomRewards = new BigNumber(0.0);
        denomRewards.forEach((reward) => {
            totalDenomRewards = totalDenomRewards.plus(reward.amount);
        });

        stakingRewards.push({
            validator: '',
            amount: totalDenomRewards,
            denom,
            decimals: constants.REWARDS_PRECISION
        });
      });

      return stakingRewards;
    },
  },
  methods: {
    getShiftedAmount(denom, amount) {
      if (!denom || !amount) return;

      switch (denom) {
        case "btc":
        case "swth":
        case "iusd":
          return amount.shiftedBy(-8);
          break;
        case "eth":
          return amount.shiftedBy(-18);
          break;
        case "eth1":
          return amount.shiftedBy(-18);
          break;
        case "usdc1":
          return amount.shiftedBy(-18);
          break;
        default:
          return amount.shiftedBy(-8);
      }
    },
  },
};
</script>
