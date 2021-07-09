import React from 'react';
import WelcomeScreen from '../WelcomeScreen/WelcomeScreen';

export default function DelayedLoginScreen(props) {
    
    const appConfig = props.route?.params?.appConfig || props.appConfig;
    const authManager = props.route?.params?.authManager || props.authManager;
    const appStyles = props.route?.params?.appStyles || props.appStyles;

    return(
        <WelcomeScreen 
            authManager={authManager}
            navigation={props.navigation}
            appStyles={appStyles}
            appConfig={appConfig}
            title={appConfig.onboardingConfig.delayedLoginTitle} 
            caption={appConfig.onboardingConfig.delayedLoginCaption}
            delayedMode={true} 
        />
    )
}