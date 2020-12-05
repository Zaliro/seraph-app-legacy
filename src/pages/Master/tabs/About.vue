<template>
    <StackLayout class="bg-primary text-center regular">
        <!-- Images -->
        <Image src="res://logo_white" decodeWidth="150" decodeHeight="50" width="150" height="50" stretch="aspectFit" verticalAlignment="center" class="mt-4" loadMode="async"/>
        <Image src="res://illu" decodeWidth="96" decodeHeight="96" width="96" height="96" verticalAlignment="center" class="mt-4" loadMode="async"/>
        
        <!-- Links -->
        <GridLayout columns="*, 65, 65, 65, 65, *" rows="*" orientation="horizontal" class="mt-4 mx-4">
            <Button col="1" @tap="openWebsite" text.decode="&#xf0c1;" class="btn-link fas text-lg text-primary card-bg-gradient rounded-full h-12 w-12 flex items-center justify-center" />
            <Button col="2" @tap="openTelegram" text.decode="&#xf3fe;" class="btn-link fa-brands text-lg text-primary card-bg-gradient rounded-full h-12 w-12 flex items-center justify-center" />
            <Button col="3" @tap="openKeybase" text.decode="&#xf4f5;" class="btn-link fa-brands text-lg text-primary card-bg-gradient rounded-full h-12 w-12 flex items-center justify-center" />
            <Button col="4" @tap="openDiscord" text.decode="&#xf392;" class="btn-link fa-brands text-lg text-primary card-bg-gradient rounded-full h-12 w-12 flex items-center justify-center" />
        </GridLayout>
        
        <!-- Hook -->
        
        <Label textWrap="true" text="Seraph is community-driven, fault-tolerant and low-priced." class="text-secondary text-lg leading-loose mt-2 mx-4"></Label>

        <!-- Description -->
        <StackLayout class="mx-4 my-4">
            <Label textWrap="true" class="text-secondary leading-loose">
                <FormattedString>
                    <Span text.decode="This application was developed and made available to the Switcheo community free of charge by&#xa;" />
                    <Span text="Seraph Staking " fontWeight="Bold" class="text-blue-500 hover:text-blue-800" />
                    <Span text.decode="&#xf35d;" fontWeight="Bold" class="fas text-blue-500 hover:text-blue-800" />
                    <Span text.decode=".&#xa;&#xa;" />

                    <Span text="App Version " />
                    <Span text="1.0.0" fontWeight="Bold" />
                </FormattedString>
            </Label>
        </StackLayout>

        <!-- SupportUs -->
        <StackLayout class="text-secondary bold leading-loose mb-4 mx-4">
            <Label textWrap="true" class="text-lg">
                <FormattedString>
                    <Span text="Want to support us" />
                    <Span text.decode=" &#xf4be; " class="fas" />
                    <Span text="?" />
                </FormattedString>
            </Label>

            <Label textWrap="true" text="The easiest way to support us is to dedicate a part of your stake to the Seraph Staking validator!" class="leading-loose"></Label>
            <Button @tap="openStakingShortcut" text="Stake 🤍" class="btn-primary rounded-full mt-4 py-4 px-8" />
        </StackLayout>
    
    </StackLayout>
</template>

<script>
import { openUrl } from '@nativescript/core/utils/utils';

import constants from '../../../constants';

export default {
    name: 'About',
    methods: {
        openWebsite() {
            openUrl(constants.URL_WEBSITE);
        },
        openTelegram() {
            openUrl(constants.URL_TELEGRAM);
        },
        openKeybase() {
            openUrl(constants.URL_KEYBASE);
        },
        openDiscord() {
            openUrl(constants.URL_DISCORD);
        },
        openStakingShortcut() {
            openUrl(constants.URL_STAKING_SHORTCUT);
        }
    }
}
</script>
