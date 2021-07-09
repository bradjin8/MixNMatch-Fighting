import { Platform } from 'react-native';
import { IMLocalized, setI18nConfig } from './Core/localization/IMLocalization';

setI18nConfig();

const regexForNames = /^[a-zA-Z]{2,25}$/;
const regexForPhoneNumber = /\d{9}$/;
const regexForAge = /[0-9]/g;

const DatingConfig = {
  isSMSAuthEnabled: true,
  appIdentifier: 'rn-dating-android',
  onboardingConfig: {
    welcomeTitle: IMLocalized('Find Your Next Challenge!'),
    welcomeCaption: IMLocalized(
      'Fight Your Way Up The Ladder',
    ),
    walkthroughScreens: [
      {
        icon: require('../assets/images/fire-icon.png'),
        title: 'Get a Date',
        description: IMLocalized(
          'Swipe right to get a match with people you like from your area.',
        ),
      },
      {
        icon: require('../assets/images/chat.png'),
        title: 'Private Messages',
        description: IMLocalized('Chat privately with people you match.'),
      },
      {
        icon: require('../assets/images/instagram.png'),
        title: 'Send Photos & Videos',
        description: IMLocalized(
          'Have fun with your matches by sending photos and videos to each other.',
        ),
      },
      {
        icon: require('../assets/images/notification.png'),
        title: 'Get Notified',
        description: IMLocalized(
          'Receive notifications when you get new messages and matches.',
        ),
      },
    ],
  },
  tosLink: 'https://www.instamobile.io/eula-instachatty/',
  isUsernameFieldEnabled: false,
  smsSignupFields: [
    {
      displayName: IMLocalized('First Name'),
      type: 'text',
      editable: true,
      regex: regexForNames,
      key: 'firstName',
      placeholder: 'First Name',
    },
    {
      displayName: IMLocalized('Last Name'),
      type: 'text',
      editable: true,
      regex: regexForNames,
      key: 'lastName',
      placeholder: 'Last Name',
    },
    {
      displayName: IMLocalized('Username'),
      type: 'text',
      editable: true,
      regex: regexForNames,
      key: 'username',
      placeholder: 'Username',
    },
  ],
  signupFields: [
    {
      displayName: IMLocalized('First Name'),
      type: 'text',
      editable: true,
      regex: regexForNames,
      key: 'firstName',
      placeholder: 'First Name',
    },
    {
      displayName: IMLocalized('Last Name'),
      type: 'text',
      editable: true,
      regex: regexForNames,
      key: 'lastName',
      placeholder: 'Last Name',
    },
    {
      displayName: IMLocalized('Username'),
      type: 'text',
      editable: true,
      regex: regexForNames,
      key: 'username',
      placeholder: 'Username',
    },
    {
      displayName: IMLocalized('E-mail Address'),
      type: 'text',
      editable: true,
      regex: regexForNames,
      key: 'email',
      placeholder: 'E-mail Address',
      autoCapitalize: 'none',
    },
    {
      displayName: IMLocalized('Password'),
      type: 'text',
      secureTextEntry: true,
      editable: true,
      regex: regexForNames,
      key: 'password',
      placeholder: 'Password',
      autoCapitalize: 'none',
    },
  ],
  privacyPolicyLink: 'https://www.instamobile.io/privacy-policy/',
  editProfileFields: {
    sections: [
      {
        title: IMLocalized('PUBLIC PROFILE'),
        fields: [
          {
            displayName: IMLocalized('First Name'),
            type: 'text',
            editable: true,
            regex: regexForNames,
            key: 'firstName',
            placeholder: 'Your first name',
          },
          {
            displayName: IMLocalized('Last Name'),
            type: 'text',
            editable: true,
            regex: regexForNames,
            key: 'lastName',
            placeholder: 'Your last name',
          },
          {
            displayName: IMLocalized('Age'),
            type: 'text',
            editable: true,
            regex: regexForAge,
            key: 'age',
            placeholder: 'Your age',
          },
          {
            displayName: IMLocalized('Bio'),
            type: 'text',
            editable: true,
            key: 'bio',
            placeholder: 'Your bio',
          },
          {
            displayName: IMLocalized('School'),
            type: 'text',
            editable: true,
            key: 'school',
            placeholder: 'Your bio',
          },
        ],
      },
      {
        title: IMLocalized('PRIVATE DETAILS'),
        fields: [
          {
            displayName: IMLocalized('E-mail Address'),
            type: 'text',
            editable: false,
            key: 'email',
            placeholder: 'Your email address',
          },
          {
            displayName: IMLocalized('Phone Number'),
            type: 'text',
            editable: true,
            regex: regexForPhoneNumber,
            key: 'phone',
            placeholder: 'Your phone number',
          },
        ],
      },
    ],
  },
  userSettingsFields: {
    sections: [
      {
        title: IMLocalized('DISCOVERY'),
        fields: [
          {
            displayName: IMLocalized('Show Me on Instadating'),
            type: 'switch',
            editable: true,
            key: 'show_me',
            value: true,
          },
          {
            displayName: IMLocalized('Distance Radius'),
            type: 'select',
            options: ['5', '10', '15', '25', '50', '100', 'unlimited'],
            displayOptions: [
              '5 miles',
              '10 miles',
              '15 miles',
              '25 miles',
              '50 miles',
              '100 miles',
              'Unlimited',
            ],
            editable: true,
            key: 'distance_radius',
            value: 'Unlimited',
          },
          {
            displayName: IMLocalized('Gender'),
            type: 'select',
            options: ['female', 'male', 'none'],
            displayOptions: ['Female', 'Male', 'None'],
            editable: true,
            key: 'gender',
            value: 'None',
          },
          {
            displayName: IMLocalized('Gender Preference'),
            type: 'select',
            options: ['female', 'male', 'all'],
            displayOptions: ['Female', 'Male', 'All'],
            editable: true,
            key: 'gender_preference',
            value: 'All',
          },
        ],
      },
      {
        title: IMLocalized('PUSH NOTIFICATIONS'),
        fields: [
          {
            displayName: IMLocalized('New matches'),
            type: 'switch',
            editable: true,
            key: 'push_new_matches_enabled',
            value: true,
          },
          {
            displayName: IMLocalized('Messages'),
            type: 'switch',
            editable: true,
            key: 'push_new_messages_enabled',
            value: true,
          },
          {
            displayName: IMLocalized('Super Likes'),
            type: 'switch',
            editable: true,
            key: 'push_super_likes_enabled',
            value: true,
          },
          {
            displayName: IMLocalized('Top Picks'),
            type: 'switch',
            editable: true,
            key: 'push_top_picks_enabled',
            value: true,
          },
        ],
      },
      {
        title: '',
        fields: [
          {
            displayName: IMLocalized('Save'),
            type: 'button',
            key: 'savebutton',
          },
        ],
      },
    ],
  },
  contactUsFields: {
    sections: [
      {
        title: IMLocalized('CONTACT'),
        fields: [
          {
            displayName: IMLocalized('Address'),
            type: 'text',
            editable: false,
            key: 'push_notifications_enabled',
            value: '142 Steiner Street, San Francisco, CA, 94115',
          },
          {
            displayName: IMLocalized('E-mail us'),
            value: 'florian@instamobile.io',
            type: 'text',
            editable: false,
            key: 'email',
            placeholder: 'Your email address',
          },
        ],
      },
      {
        title: '',
        fields: [
          {
            displayName: IMLocalized('Call Us'),
            type: 'button',
            key: 'savebutton',
          },
        ],
      },
    ],
  },
  dailySwipeLimit: 10,
  subscriptionSlideContents: [
    {
      title: IMLocalized('Go VIP'),
      description: IMLocalized(
        'When you subscribe, you get unlimited daily swipes, undo actions, VIP badge and more.',
      ),
      src: require('../assets/images/fencing.png'),
    },
    {
      title: IMLocalized('Undo Actions'),
      description: IMLocalized('Get undo swipe actions when you subscribe.'),
      src: require('../assets/images/vip_1.png'),
    },
    {
      title: IMLocalized('Vip Badge'),
      description: IMLocalized(
        'Stand out with vip badge amongst other swipes when you subscribe',
      ),
      src: require('../assets/images/vip_2.png'),
    },
    {
      title: IMLocalized('Enjoy Unlimited Access'),
      description: IMLocalized(
        'Get unlimited app access and more features to come.',
      ),
      src: require('../assets/images/vip-pass.png'),
    },
  ],
  contactUsPhoneNumber: '+16504859694',
  IAP_SHARED_SECRET: '699db7fcf10c4922bf148caf334c89c6',
  IAP_SKUS: Platform.select({
    ios: [
      'com.instaswipey.FreeTrial.InstaswipeyAutoRenewableSubscriptionByMonth',
      'com.instaswipey.FreeTrial.InstaswipeyAutoRenewableSubscriptionByYear',
    ],
    android: ['annual_vip_subscription', 'monthly_vip_subscription'],
  }),
  facebookIdentifier: '285315185217069',
};

export default DatingConfig;
