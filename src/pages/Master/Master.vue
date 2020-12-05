<template>
    <Page @loaded="onPageLoaded" @navigatedTo="onNavigatedTo">
        <ActionBar>
            <ActionItem @tap="goToSettingsPage" icon="res://baseline_settings_white_24" ios.position="right" android.position="actionBar"></ActionItem>
            <GridLayout width="100%" columns="auto, auto, *">
                <Image col="0" src="res://illu" class="action-image" loadMode="async"></Image>
                <Label col="1" text="Seraph Staking" class="text-primary text-lg pl-3"/>
            </GridLayout>
        </ActionBar>

        <BottomNavigation ref="bottomNavigation"
            :selectedIndex="selectedScreenIndex"
                @selectedIndexChanged="onSelectedScreenIndexChanged($event)">

            <TabStrip class="bg-primary" isIconSizeFixed="false">
                <TabStripItem class="text-primary">
                    <Label text="Dashboard"></Label>
                    <Image src.decode="font://&#xf015;" stretch="none" class="fas fa-sm" loadMode="async"/>
                </TabStripItem>

                <TabStripItem class="text-primary">
                    <Label text="Staking"></Label>
                    <Image src.decode="font://&#xf4d3;" stretch="none" class="fas fa-sm" loadMode="async"/>
                </TabStripItem>

                <TabStripItem class="text-primary">
                    <Label text="About"></Label>
                    <Image src.decode="font://&#xf530;" stretch="none" class="fas fa-sm" loadMode="async"/>
                </TabStripItem>
            </TabStrip>
            
            <TabContentItem class="bg-primary">

                <PullToRefresh @refresh="onDashboardRefresh" :refreshing="isDashboardLoading"
                    indicatorFillColor="white" indicatorColor="#20273a">
                    <ScrollView orientation="vertical">
                        <!-- Dashboard -->
                        <Dashboard />
                    </ScrollView>
                </PullToRefresh>

            </TabContentItem>

            <TabContentItem class="bg-primary">

                <PullToRefresh @refresh="onStakingRefresh" :refreshing="isStakingLoading"
                    indicatorFillColor="white" indicatorColor="#20273a">
                    <ScrollView orientation="vertical">
                        <!-- Staking -->
                        <Staking :isLoading="isStakingLoading" />
                    </ScrollView>
                </PullToRefresh>

            </TabContentItem>

            <TabContentItem>

                <ScrollView orientation="vertical">
                    <!-- About -->
                    <About />
                </ScrollView>

            </TabContentItem>

        </BottomNavigation>

    </Page>
</template>

<script>
import { mapState } from 'vuex';

import { firebase } from '@nativescript/firebase';

import { Screen } from '../../enums/screens';

import constants from '../../constants';
import { REFRESH_DASHBOARD, REFRESH_STAKING, REFRESH_VALIDATORS } from '../../store/actions';

import Settings from '../Settings';

import Dashboard from './tabs/Dashboard';
import Staking from './tabs/Staking';
import About from './tabs/About';

import coingecko from '../../api/coingecko';
import tradescan from '../../api/tradescan';

export default {
    name: 'Master',
    data() {
        return {
            selectedScreenIndex: -1,
            isDashboardLoading: true,
            isStakingLoading: true,
            isCheckingStakingTab: false,
        }
    },
    components: {
        Dashboard,
        Staking,
        About
    },
    computed: {
        ...mapState([ 'appSettings' ]),
        hasAddress() {
            return this.appSettings.address && this.appSettings.address.trim() != '';
        }
    },
    methods: {
        async onPageLoaded() {
            this.selectedScreenIndex = this.appSettings.launchScreen == Screen.DASHBOARD ? 0 : 1;
        
            await this.$store.dispatch(REFRESH_VALIDATORS);

            this.$store.dispatch(REFRESH_DASHBOARD)
                .then(() => this.isDashboardLoading = false);

            this.$store.dispatch(REFRESH_STAKING)
                .then(() => this.isStakingLoading = false);

            if (this.hasAddress)
                firebase.analytics.setUserId({ userId: this.address });
        },
        onNavigatedTo() {
            const selectedIndex = this.$refs.bottomNavigation.nativeView.selectedIndex;
            const selectedScreen = this.getScreenNameByIndex(selectedIndex);

            firebase.analytics.setScreenName({ screenName: selectedScreen });

            if (selectedScreen == Screen.STAKING && !this.isCheckingStakingTab)
                this.checkStakingTab();
        },
        onSelectedScreenIndexChanged(e) {
            const selectedIndex = e.object.selectedIndex;
            const selectedScreen = this.getScreenNameByIndex(selectedIndex);

            firebase.analytics.setScreenName({ screenName: selectedScreen });

            if (selectedScreen == Screen.STAKING && !this.isCheckingStakingTab)
                this.checkStakingTab();
        },
        goToSettingsPage() {
            this.$navigateTo(Settings, {
                transition: { name: 'slide' }
            });
        },
        goToDashboardTab() {
            this.$refs.bottomNavigation.nativeView.selectedIndex = 0;
        },
        checkStakingTab() {
            this.isCheckingStakingTab = true;

            if (!this.hasAddress) {
                confirm({
                    title: 'Action required',
                    message: constants.ACTION_REQUIRED_SET_ADDRESS,
                    okButtonText: 'Set my address',
                    cancelButtonText: 'Cancel'
                }).then(confirmed => {
                    if (confirmed)
                        this.goToSettingsPage();
                    else
                        this.goToDashboardTab();

                    this.isCheckingStakingTab = false;
                });
            }
        },
        async onDashboardRefresh(e) {
            this.isDashboardLoading = true;

            await this.$store.dispatch(REFRESH_VALIDATORS);
            await this.$store.dispatch(REFRESH_DASHBOARD);

            this.isDashboardLoading = false;
        },
        async onStakingRefresh() {
            this.isStakingLoading = true;
            
            await this.$store.dispatch(REFRESH_VALIDATORS);
            await this.$store.dispatch(REFRESH_STAKING);

            this.isStakingLoading = false;
        },
        getScreenNameByIndex(index) {
            switch (index) {
                case 0:
                    return Screen.DASHBOARD;
                case 1:
                    return Screen.STAKING;
                case 2:
                    return Screen.ABOUT;
            }
        }
    }
}
</script>

<style scoped>
    .action-image {
        width: 40;
        height: 40;
        vertical-align: center;
    }

    TabStrip {
        selected-item-color: #ed64a6;
        un-selected-item-color: white;
    }
</style>
