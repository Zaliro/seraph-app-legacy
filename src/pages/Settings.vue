<template>
    <Page @loaded="onLoaded">     
        <ActionBar>
            <NavigationButton @tap="$navigateBack" icon.decode="font://&#xf060;" class="fas fa-base text-primary"></NavigationButton>
            <GridLayout width="100%" columns="auto, *">
                <Label text="Settings" col="0" class="text-primary text-lg"/>
            </GridLayout>
        </ActionBar>

        <ScrollView orientation="vertical" class="bg-primary">

            <StackLayout class="mt-4 ml-4 mr-4 mb-4">
                <!-- Account -->
                <Label text="Account" class="text-base text-additional mb-2" />

                <Label text="Your address" class="text-xs text-secondary" />
                <GridLayout columns="*, 80">
                    <TextField col="0" v-model="address" hint="Enter your address..." class="ml-0 mr-1" />
                    <Button col="1" class="btn-primary ml-0 mb-0 mr-0" @tap="onPasteTap">
                        <FormattedString>
                            <Span text.decode="&#xf0ea; " class="fas" />
                            <Span text=" Paste" />
                        </FormattedString>
                    </Button>
                </GridLayout>
                

                <Button text="Update address" class="btn-primary ml-0 mr-0" @tap="onUpdateAddressTap" />

                <!-- Application -->
                <Label text="Application" class="text-base text-additional mt-6 mb-2" />

                <Label text="Launch Screen" class="text-xs text-secondary" />
                <GridLayout columns="auto, auto, *" rows="auto, auto">
                    <StackLayout v-for="(screen, i) in screens" :key="i" :row="i" col="1" orientation="horizontal" verticalAlignment="center">
                        <CheckBox :row="i" col="0" :checked="screen.checked"
                            @checkedChange="onLaunchScreenChange(i, $event.value)"
                                fillColor="#158bef" boxType="circle" />
                        <StackLayout verticalAlignment="center">
                            <Label :text="screen.name | capitalize" class="radio-label" @tap="onLaunchScreenChange(i, !screen.checked)" />
                        </StackLayout>
                    </StackLayout>
                </GridLayout>
                
                <Label text="Default Currency" class="text-xs text-secondary mt-4" />
                <GridLayout columns="auto, auto, *" rows="auto, auto, auto">
                    <StackLayout v-for="(currency, i) in currencies" :key="i" :row="i" col="1" orientation="horizontal" verticalAlignment="center">
                        <CheckBox :row="i" col="0" :checked="currency.checked"
                            @checkedChange="onCurrencyChange(i, $event.value)"
                                fillColor="#158bef" boxType="circle" />
                        <StackLayout verticalAlignment="center">
                            <Label :text="currency.name" class="radio-label" @tap="onCurrencyChange(i, !currency.checked)" />
                        </StackLayout>
                    </StackLayout>
                </GridLayout>

            </StackLayout>

        </ScrollView>

    </Page>
</template>

<script>
import { mapState } from 'vuex';
import { alert } from '@nativescript/core/ui';
import { firebase } from '@nativescript/firebase';
import { getTextSync } from 'nativescript-clipboard';

import constants from '../constants';
import { Screen } from '../enums/screens';
import { SAVE_ADDRESS, SAVE_LAUNCH_SCREEN } from '../store/actions';

export default {
    name: 'Settings',
    filters: {
        capitalize: function (value) {
            if (!value) return '';
            value = value.toString();
            return value.charAt(0).toUpperCase() + value.slice(1);
        }
    },
    data() {
        return {
            address: null,
            screens: [
                { name: Screen.DASHBOARD, checked: false },
                { name: Screen.STAKING, checked: false }
            ],
            currencies: [
                { name: 'USD', checked: true }
            ],
            pasteEnabled: false
        }
    },
    computed: {
        ...mapState([
            'appSettings',
        ]),
    },
    methods: {
        onLaunchScreenChange(screenIndex, checked) {
            if (checked) {
                this.screens.forEach(screen => {
                    screen.checked = false;
                });

                const screenName = this.screens[screenIndex].name;
                this.$store.dispatch(SAVE_LAUNCH_SCREEN, screenName);
                this.screens[screenIndex].checked = true;
            }
        },
        onCurrencyChange(currencyIndex, checked) {
            if (checked) {
                this.currencies.forEach(currency => {
                    currency.checked = false;
                });

                this.currencies[currencyIndex].checked = true;
            }
        },
        onPasteTap() {
            this.address = getTextSync()?.trim();
        },
        onUpdateAddressTap() {
            if (this.address && this.address.startsWith('swth') && this.address.length == 43) {
                this.$store.dispatch(SAVE_ADDRESS, this.address)
                    .then(() => {
                        alert({
                            title: 'Success',
                            message: constants.SUCCESS_ADDRESS_UPDATED,
                            okButtonText: 'Ok'
                        });
                    });

                firebase.analytics.logEvent({ key: constants.ANALYTICS_EVENT_SET_ADDRESS, parameters: [{ key: "address", value: this.address }] });
                firebase.analytics.setUserId({ userId: this.address });
            } else {
                alert({
                    title: 'Error',
                    message: constants.ERROR_INVALID_ADDRESS,
                    okButtonText: 'Retry'
                });
            }
        },
        onLoaded() {
            firebase.analytics.setScreenName({ screenName: Screen.SETTINGS });

            const screenIndex = this.screens.findIndex(screen => screen.name == this.appSettings.launchScreen);
            this.screens[screenIndex].checked = true;

            this.address = this.appSettings.address;
        }
    }
}
</script>
