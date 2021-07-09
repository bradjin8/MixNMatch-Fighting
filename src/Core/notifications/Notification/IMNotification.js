import React from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { useColorScheme } from 'react-native-appearance';
import IMNotificationItem from './IMNotificationItem';
import dynamicStyles from './styles';
import { TNEmptyStateView } from '../../truly-native';

function IMNotification({
  notifications,
  onNotificationPress,
  appStyles,
  emptyStateConfig,
}) {
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(appStyles, colorScheme);

  const renderItem = ({ item }) => (
    <IMNotificationItem
      onNotificationPress={onNotificationPress}
      appStyles={appStyles}
      item={item}
    />
  );

  if (notifications == null) {
    return (
      <View style={styles.feedContainer}>
        <ActivityIndicator style={{ marginTop: 15 }} size="small" />
      </View>
    );
  }
  if (notifications.length == 0) {
    return (
      <TNEmptyStateView
        style={styles.emptyStateView}
        emptyStateConfig={emptyStateConfig}
        appStyles={appStyles}
      />
    );
  }
  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        removeClippedSubviews={true}
      />
    </View>
  );
}

IMNotification.propTypes = {};

export default IMNotification;
