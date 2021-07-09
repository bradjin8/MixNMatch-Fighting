import React, { useLayoutEffect, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useColorScheme } from 'react-native-appearance';
import IMBlockedUsersComponent from '../components/IMBlockedUsersComponent/IMBlockedUsersComponent';
import { reportingManager } from '../../../user-reporting/index';
import { IMLocalized } from '../../../localization/IMLocalization';

const IMBlockedUsersScreen = (props) => {
  const navigation = props.navigation;
  const appConfig = props.route.params.appConfig;
  const appStyles = props.route.params.appStyles;
  const colorScheme = useColorScheme();
  const currentTheme = appStyles.navThemeConstants[colorScheme];

  const [ blockedUsers, setBlockedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const currentUser = useSelector((state) => state.auth.user);

  useEffect(() => {
    const unsubscribe = reportingManager.hydrateAllReportedUsers(currentUser.id, (response) => {
      response
        .then((values) => {
          setBlockedUsers(values);
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
        });
    });
    return () => {
      unsubscribe();
    };
  }, [currentUser?.id]);

  const onUserUnblock = (userID) => {
    setIsLoading(true);
    reportingManager.unblockUser(currentUser.id, userID, (response) => {
        if (response) {
          setIsLoading(response);
        };
      },
      (error) => {
        console.error(error);
      }
    );
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: IMLocalized('Blocked Users'),
      headerStyle: {
        backgroundColor: currentTheme.backgroundColor,
        borderBottomColor: currentTheme.hairlineColor,
      },
      headerTintColor: currentTheme.fontColor,
    });
  }, []);

  return (
    <IMBlockedUsersComponent
      appStyles={appStyles}
      appConfig={appConfig}
       blockedUsers={ blockedUsers}
      onUserUnblock={onUserUnblock}
      isLoading={isLoading}
    />
  );
};

export default IMBlockedUsersScreen;
