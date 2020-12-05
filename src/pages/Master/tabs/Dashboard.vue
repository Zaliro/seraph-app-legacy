<template>

        <GridLayout columns="*, *" rows="*, *, *, *, *, *, *">
            <!-- Price -->
            <CardView row="0" col="0" :elevation="constants.CARDS_ELEVATION" :radius="constants.CARDS_RADIUS" class="mt-4 ml-4 mr-2 card-bg">
                <StackLayout>
                    <Label text="Price" class="text-secondary text-base mx-4 mt-2"></Label>
                    <Label :text="prices.usd" class="text-secondary text-lg text-center mx-4"></Label>
                    <Label text="dollars" class="text-additional text-center mx-4 mb-2"></Label>
                </StackLayout>
            </CardView>

            <!-- MarketCap -->
            <CardView row="0" col="1" :elevation="constants.CARDS_ELEVATION" :radius="constants.CARDS_RADIUS" class="mt-4 ml-2 mr-4 card-bg">
                <StackLayout>
                    <Label text="Market Cap" class="text-secondary text-base mx-4 mt-2"></Label>
                    <Label :text="mktCap.toFormat(0)" class="text-secondary text-lg text-center mx-4"></Label>
                    <Label text="dollars" class="text-additional text-center mx-4 mb-2"></Label>
                </StackLayout>
            </CardView>

            <!-- Volume24H -->
            <CardView row="1" col="0" :elevation="constants.CARDS_ELEVATION" :radius="constants.CARDS_RADIUS" class="mt-4 ml-4 mr-2 card-bg">
                <StackLayout>
                    <Label text="Volume 24H" class="text-secondary text-base mx-4 mt-2"></Label>
                    <Label text="0" class="text-secondary text-lg text-center mx-4"></Label>
                    <Label text="dollars" class="text-additional text-center mx-4 mb-2"></Label>
                </StackLayout>
            </CardView>

            <!-- Insurance -->
            <CardView row="1" col="1" :elevation="constants.CARDS_ELEVATION" :radius="constants.CARDS_RADIUS" class="mt-4 ml-2 mr-4 card-bg">
                <StackLayout>
                    <Label text="Insurance" class="text-secondary text-base mx-4 mt-2"></Label>
                    <Label text="0" class="text-secondary text-lg text-center mx-4"></Label>
                    <Label text="dollars" class="text-additional text-center mx-4 mb-2"></Label>
                </StackLayout>
            </CardView>

            <!-- BlockTime -->
            <CardView row="2" col="0" colSpan="2" :elevation="constants.CARDS_ELEVATION" :radius="constants.CARDS_RADIUS" class="mt-4 ml-4 mr-4 card-bg">
                <StackLayout>
                    <Label text="Block Time" class="text-secondary text-base mx-4 mt-2"></Label>
                    <Label :text="blockTime" class="text-secondary text-lg text-center mx-4"></Label>
                    <Label text="seconds" class="text-additional text-center mx-4 mb-2"></Label>
                </StackLayout>
            </CardView>

            <!-- Staking APR -->
            <CardView row="3" col="0" colSpan="2" :elevation="constants.CARDS_ELEVATION" :radius="constants.CARDS_RADIUS" class="mt-4 ml-4 mr-4 card-bg">
                <StackLayout>
                    <Label text="Staking APR" class="text-secondary text-base mx-4 mt-2"></Label>
                    <Label :text="`${apr}%`" class="text-secondary text-lg text-center mx-4"></Label>
                    <Label text="estimated" class="text-additional text-center mx-4 mb-2"></Label>
                </StackLayout>
            </CardView>

            <!-- Bonded -->
            <CardView row="4" col="0" colSpan="2" :elevation="constants.CARDS_ELEVATION" :radius="constants.CARDS_RADIUS" class="mt-4 ml-4 mr-4 card-bg">
                <StackLayout>
                    <Label text="Bonded" class="text-secondary text-base mx-4 mt-2"></Label>
                    <Label :text="`${bondedPercent.toFormat(2)}%`" class="text-secondary text-lg text-center mx-4"></Label>
                    <Label :text="`${totalStaked.toFormat(0)} SWTH`" class="text-additional text-center mx-4 mb-2"></Label>
                </StackLayout>
            </CardView>

            <!-- Validators -->
            <CardView row="5" col="0" colSpan="2" :elevation="constants.CARDS_ELEVATION" :radius="constants.CARDS_RADIUS" class="mt-4 mb-4 ml-4 mr-4 card-bg">
                <StackLayout>
                    <Label text="Active Validators" class="text-secondary text-base mx-4 mt-2"></Label>
                    <Label :text="activeValidators.length" class="text-secondary text-lg text-center mx-4"></Label>
                    <Label :text="`${activeValidators.length} / ${validators.length}`" class="text-additional text-center mx-4 mb-2"></Label>
                </StackLayout>
            </CardView>
        </GridLayout>

</template>

<script>
import { mapState } from 'vuex';
import BigNumber from 'bignumber.js';

import constants from '../../../constants';

export default {
    name: 'Dashboard',
    computed: {
        ...mapState([
            'prices',
            'mktCap',
            'blockTime',
            'apr',
            'validators',
            'totalStaked',
            'totalSupply'
        ]),
        constants() {
            return constants;
        },
        activeValidators() {
            return this.validators.filter(x => x.BondStatus == 'bonded');
        },
        bondedPercent() {
            return this.totalStaked.div(this.totalSupply).isFinite() ? 
                this.totalStaked.div(this.totalSupply).times(100) : new BigNumber(0);
        }
    },
    methods: {
        test() {}
    }
}
</script>
