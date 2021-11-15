import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Swiper from 'react-native-swiper';
import { connect } from 'react-redux';
import { firebase } from '../../Core/api/firebase/config';
import { storageAPI } from '../../Core/api';
import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-actionsheet';
import FastImage from 'react-native-fast-image';
import ActivityModal from '../../components/ActivityModal';
import DynamicAppStyles from '../../DynamicAppStyles';
import DatingConfig from '../../DatingConfig';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import { TNTouchableIcon } from '../../Core/truly-native';
import { authManager } from '../../Core/onboarding/utils/api';
import { logout } from '../../Core/onboarding/redux/auth';
import { setUserData } from '../../Core/onboarding/redux/auth';
import { TNProfilePictureSelector } from '../../Core/truly-native';
import dynamicStyles from './styles';
import { useColorScheme } from 'react-native-appearance';
import { useIap } from '../../Core/inAppPurchase/context';

const MyProfileScreen = (props) => {
  const [loading, setLoading] = useState(false);
  const [myphotos, setMyphotos] = useState([]);
  const { setSubscriptionVisible } = useIap();
  const photoDialogActionSheetRef = useRef(null);
  const photoUploadDialogActionSheetRef = useRef(null);
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(colorScheme);
  var selectedItemIndex = -1;

  const userRef = firebase.firestore().collection('users').doc(currentUser.id);

  const updatePhotos = (photos) => {
    let myUpdatePhotos = [];
    let pphotos = photos ? [...photos] : [];
    let temp = [];

    pphotos.push({ add: true });
    pphotos.map((item, index) => {
      temp.push(item);

      if (index % 6 == 5) {
        myUpdatePhotos.push(temp);
        temp = [];
      } else if (item && item.add) {
        myUpdatePhotos.push(temp);
        temp = [];
      }
    });

    setMyphotos(myUpdatePhotos);
    selectedItemIndex = -1;
  };

  useEffect(() => {
    if (currentUser) {
      updatePhotos(currentUser.photos);
    }

    StatusBar.setHidden(false);
  }, []);

  const detail = () => {
    props.navigation.navigate('AccountDetails', {
      appStyles: DynamicAppStyles,
      form: DatingConfig.editProfileFields,
      screenTitle: IMLocalized('Edit Profile'),
    });
  };

  const onUpgradeAccount = () => {
    setSubscriptionVisible(true);
  };

  const setting = () => {
    props.navigation.navigate('Settings', {
      userId: currentUser.id,
      appStyles: DynamicAppStyles,
      form: DatingConfig.userSettingsFields,
      screenTitle: IMLocalized('Settings'),
    });
  };

  const contact = () => {
    props.navigation.navigate('ContactUs', {
      appStyles: DynamicAppStyles,
      form: DatingConfig.contactUsFields,
      screenTitle: IMLocalized('Contact'),
    });
  };

  const blocked = () => {
    props.navigation.navigate('BlockedUsers', {
      appStyles: DynamicAppStyles,
    });
  };

  const onLogout = () => {
    authManager.logout(currentUser);
    //dispatch(logout());
    props.navigation.navigate('LoadScreen', {
      appStyles: DynamicAppStyles,
      appConfig: DatingConfig,
    });
  };

  const onSelectAddPhoto = () => {
    photoUploadDialogActionSheetRef.current.show();
  };

  const onPhotoUploadDialogDone = (index) => {
    if (index == 0) {
      onLaunchCamera();
    }

    if (index == 1) {
      onOpenPhotos();
    }
  };

  const updateUserPhotos = (uri) => {
    const { photos } = currentUser;
    let pphotos = photos ? photos : [];

    pphotos.push(uri);

    const data = {
      photos: pphotos,
    };

    updateUserInfo(data);
    updatePhotos(pphotos);
  };

  const onLaunchCamera = () => {
    ImagePicker.openCamera({
      cropping: false,
    }).then((image) => {
      startUpload(image, updateUserPhotos);
    });
  };

  const onOpenPhotos = () => {
    ImagePicker.openPicker({
      cropping: false,
    })
      .then((image) => {
        startUpload(image, updateUserPhotos);
      })
      .catch((error) => {
        console.log(error);
        setTimeout(() => {
          alert(
            IMLocalized(
              'An errord occurred while loading image. Please try again.',
            ),
          );
        }, 1000);
      });
  };

  const startUpload = (source, updateUserData) => {
    setLoading(true);

    if (!source) {
      updateUserData(null);
      return;
    }

    storageAPI
      .uploadFile(source)
      .then(({ downloadURL }) => {
        if (downloadURL) {
          updateUserData(downloadURL);
        } else {
          // an error occurred
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const updateUserInfo = (data) => {
    const tempUser = currentUser;
    // optimistically update the UI
    dispatch(setUserData({ user: { ...currentUser, ...data } }));
    userRef
      .update(data)
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        const { message } = error;
        setLoading(false);
        dispatch(setUserData({ user: { ...tempUser } }));
        console.log('upload error', error);
      });
  };

  const updateProfilePictureURL = (file) => {
    startUpload(file, () => updateUserInfo({ profilePictureURL: uri }));
  };

  const onSelectDelPhoto = (index) => {
    selectedItemIndex = index;
    photoDialogActionSheetRef.current.show();
  };

  const onPhotoDialogDone = (actionSheetActionIndex) => {
    const { photos } = currentUser;

    if (selectedItemIndex == -1 || selectedItemIndex >= photos.length) {
      return;
    }

    if (actionSheetActionIndex == 0) {
      if (photos) {
        photos.splice(selectedItemIndex, 1);
      }

      updateUserInfo({ photos });
      updatePhotos(photos);
    }

    if (actionSheetActionIndex == 2) {
      const photoToUpdate = photos[selectedItemIndex];
      updateUserInfo({ profilePictureURL: photoToUpdate });
    }
  };

  const { firstName, lastName, profilePictureURL } = currentUser;
  const userLastName = currentUser && lastName ? lastName : ' ';
  const userfirstName = currentUser && firstName ? firstName : ' ';

  return (
    <View style={styles.MainContainer}>
      <SafeAreaView style={styles.safeAreaContainer}>
        <View style={styles.MainContainer}>
          <ScrollView style={styles.body}>
            <View style={styles.profilePictureContainer}>
              <TNProfilePictureSelector
                setProfilePictureFile={updateProfilePictureURL}
                appStyles={DynamicAppStyles}
                profilePictureURL={profilePictureURL}
              />
            </View>
            <View style={styles.nameView}>
              <Text style={styles.name}>
                {userfirstName + ' ' + userLastName}
              </Text>
            </View>
            <View
              style={[
                styles.myphotosView,
                myphotos[0] && myphotos[0].length <= 3
                  ? { height: 158 }
                  : { height: 268 },
              ]}>
              <View style={styles.itemView}>
                <Text style={styles.photoTitleLabel}>
                  {IMLocalized('Gallery')}
                </Text>
              </View>
              <Swiper
                removeClippedSubviews={false}
                showsButtons={false}
                loop={false}
                paginationStyle={{ top: -230, left: null, right: 0 }}
                dot={<View style={styles.inactiveDot} />}
                activeDot={
                  <View
                    style={{
                      backgroundColor: '#db6470',
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      marginLeft: 3,
                      marginRight: 3,
                      marginTop: 3,
                      marginBottom: 3,
                    }}
                  />
                }>
                {myphotos.map((photos, i) => (
                  <View key={'photos' + i} style={styles.slide}>
                    <View style={styles.slideActivity}>
                      <FlatList
                        horizontal={false}
                        numColumns={3}
                        data={photos}
                        scrollEnabled={false}
                        renderItem={({ item, index }) =>
                          item.add ? (
                            <TouchableOpacity
                              key={'item' + index}
                              style={[
                                styles.myphotosItemView,
                                {
                                  backgroundColor:
                                    DynamicAppStyles.colorSet[colorScheme]
                                      .mainThemeForegroundColor,
                                },
                              ]}
                              onPress={onSelectAddPhoto}>
                              <Icon
                                style={styles.icon}
                                name="ios-camera"
                                size={40}
                                color={
                                  DynamicAppStyles.colorSet[colorScheme]
                                    .mainThemeBackgroundColor
                                }
                              />
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity
                              key={'item' + index}
                              style={styles.myphotosItemView}
                              onPress={() => onSelectDelPhoto(i * 6 + index)}>
                              <FastImage
                                style={{ width: '100%', height: '100%' }}
                                source={{ uri: item }}
                              />
                            </TouchableOpacity>
                          )
                        }
                      />
                    </View>
                  </View>
                ))}
              </Swiper>
            </View>
            <TouchableOpacity style={styles.optionView} onPress={detail}>
              <View style={styles.iconView}>
                <Image
                  style={{
                    width: 25,
                    height: 25,
                    tintColor: '#687cf0',
                    resizeMode: 'cover',
                  }}
                  source={DynamicAppStyles.iconSet.account}
                />
              </View>
              <View style={styles.textView}>
                <Text style={styles.textLabel}>
                  {IMLocalized('Account Details')}
                </Text>
              </View>
            </TouchableOpacity>
            {/*<TouchableOpacity
              style={styles.optionView}
              onPress={onUpgradeAccount}>
              <View style={styles.iconView}>
                <Image
                  style={{
                    width: 25,
                    height: 25,
                    resizeMode: 'cover',
                  }}
                  source={DynamicAppStyles.iconSet.vip}
                />
              </View>
              <View style={styles.textView}>
                <Text style={styles.textLabel}>
                  {IMLocalized('Upgrade Account')}
                </Text>
              </View>
            </TouchableOpacity>*/}
            <TouchableOpacity style={styles.optionView} onPress={setting}>
              <View style={styles.iconView}>
                <Image
                  style={{
                    width: 25,
                    height: 25,
                    tintColor: '#9a91c4',
                    resizeMode: 'cover',
                  }}
                  source={DynamicAppStyles.iconSet.setting}
                />
              </View>
              <View style={styles.textView}>
                <Text style={styles.textLabel}>{IMLocalized('Settings')}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionView} onPress={contact}>
              <View style={styles.iconView}>
                <Image
                  style={{
                    width: 25,
                    height: 25,
                    tintColor: '#88e398',
                    resizeMode: 'cover',
                  }}
                  source={DynamicAppStyles.iconSet.callIcon}
                />
              </View>
              <View style={styles.textView}>
                <Text style={styles.textLabel}>
                  {IMLocalized('Contact Us')}
                </Text>
              </View>
            </TouchableOpacity>
            {/*<TouchableOpacity style={styles.optionView} onPress={blocked}>
              <View style={styles.iconView}>
                <Image
                  style={{
                    width: 25,
                    height: 25,
                    tintColor: '#9a91c4',
                    resizeMode: 'cover',
                  }}
                  source={DynamicAppStyles.iconSet.blockedUser}
                />
              </View>
              <View style={styles.textView}>
                <Text style={styles.textLabel}>
                  {IMLocalized('Blocked Users')}
                </Text>
              </View>
            </TouchableOpacity>*/}
            <TouchableOpacity style={styles.logoutView} onPress={onLogout}>
              <Text style={styles.logoutBtn}>{IMLocalized('Logout')}</Text>
            </TouchableOpacity>
          </ScrollView>
          <ActionSheet
            ref={photoDialogActionSheetRef}
            title={IMLocalized('Photo Dialog')}
            options={[
              IMLocalized('Remove Photo'),
              IMLocalized('Cancel'),
              IMLocalized('Make Profile Picture'),
            ]}
            cancelButtonIndex={1}
            destructiveButtonIndex={0}
            onPress={onPhotoDialogDone}
          />
          <ActionSheet
            ref={photoUploadDialogActionSheetRef}
            title={IMLocalized('Photo Upload')}
            options={[
              IMLocalized('Import from Library'),
              IMLocalized('Take Photo'),
              IMLocalized('Cancel'),
            ]}
            cancelButtonIndex={2}
            onPress={onPhotoUploadDialogDone}
          />
          <ActivityModal
            loading={loading}
            title={IMLocalized('Please wait')}
            size={'large'}
            activityColor={'white'}
            titleColor={'white'}
            activityWrapperStyle={{
              backgroundColor: '#404040',
            }}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(MyProfileScreen);
