import React, { useState, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  TouchableHighlight,
} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import ImageView from 'react-native-image-view';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';

import dynamicStyles from './styles';
import { useColorScheme } from 'react-native-appearance';
import { IMLocalized } from '../../localization/IMLocalization';

import FastImage from 'react-native-fast-image';

const Image = FastImage;

const TNProfilePictureSelector = (props) => {
  const [profilePictureURL, setProfilePictureURL] = useState(
    props.profilePictureURL || '',
  );
  const originalProfilePictureURL = useRef(props.profilePictureURL || '');
  if (originalProfilePictureURL.current !== (props.profilePictureURL || '')) {
    originalProfilePictureURL.current = props.profilePictureURL || '';
    setProfilePictureURL(props.profilePictureURL || '');
  }

  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  const [isImageViewerVisible, setIsImageViewerVisible] = useState(false);
  const [tappedImage, setTappedImage] = useState([]);
  const actionSheet = useRef(null);
  const { appStyles } = props;
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(appStyles, colorScheme);

  const handleProfilePictureClick = (url) => {
    if (url) {
      const isAvatar = url.search('avatar');
      const image = [
        {
          source: {
            uri: url,
          },
        },
      ];
      if (isAvatar === -1) {
        setTappedImage(image);
        setIsImageViewerVisible(true);
      } else {
        showActionSheet();
      }
    } else {
      showActionSheet();
    }
  };

  const onImageError = () => {
    console.log('Error loading profile photo at url ' + profilePictureURL);
    const defaultProfilePhotoURL =
      'https://www.iosapptemplates.com/wp-content/uploads/2019/06/empty-avatar.jpg';
    setProfilePictureURL(defaultProfilePhotoURL);
  };

  const getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        Alert.alert(
          '',
          IMLocalized(
            'Sorry, we need camera roll permissions to make this work!',
          ),
          [{ text: IMLocalized('OK') }],
          {
            cancelable: false,
          },
        );
      }
    }
  };

  const onPressAddPhotoBtn = async () => {
    const options = {
      title: IMLocalized('Select photo'),
      cancelButtonTitle: IMLocalized('Cancel'),
      takePhotoButtonTitle: IMLocalized('Take Photo'),
      chooseFromLibraryButtonTitle: IMLocalized('Choose from Library'),
      maxWidth: 2000,
      maxHeight: 2000,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    await getPermissionAsync();

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      // allowsEditing: true,
      // aspect: [4, 3],
      // quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setProfilePictureURL(result.uri);
      props.setProfilePictureFile(result);
    }
  };

  const closeButton = () => (
    <TouchableOpacity
      style={styles.closeButton}
      onPress={() => setIsImageViewerVisible(false)}>
      <Image style={styles.closeIcon} source={appStyles.iconSet.close} />
    </TouchableOpacity>
  );

  const showActionSheet = (index) => {
    setSelectedPhotoIndex(index);
    actionSheet.current.show();
  };

  const onActionDone = (index) => {
    if (index == 0) {
      onPressAddPhotoBtn();
    }
    if (index == 2) {
      // Remove button
      if (profilePictureURL) {
        setProfilePictureURL(null);
        props.setProfilePictureFile(null);
      }
    }
  };

  return (
    <>
      <View style={styles.imageBlock}>
        <TouchableHighlight
          style={styles.imageContainer}
          onPress={() => handleProfilePictureClick(profilePictureURL)}>
          <Image
            style={[styles.image, { opacity: profilePictureURL ? 1 : 0.3 }]}
            source={
              profilePictureURL
                ? { uri: profilePictureURL }
                : appStyles.iconSet.userAvatar
            }
            resizeMode="cover"
            onError={onImageError}
          />
        </TouchableHighlight>

        <TouchableOpacity onPress={showActionSheet} style={styles.addButton}>
          <Icon name="camera" size={20} color="white" />
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ActionSheet
          ref={actionSheet}
          title={IMLocalized('Confirm action')}
          options={[
            IMLocalized('Change Profile Photo'),
            IMLocalized('Cancel'),
            IMLocalized('Remove Profile Photo'),
          ]}
          cancelButtonIndex={1}
          destructiveButtonIndex={2}
          onPress={(index) => {
            onActionDone(index);
          }}
        />
        <ImageView
          images={tappedImage}
          isVisible={isImageViewerVisible}
          onClose={() => setIsImageViewerVisible(false)}
          controls={{ close: closeButton }}
        />
      </ScrollView>
    </>
  );
};

export default TNProfilePictureSelector;
