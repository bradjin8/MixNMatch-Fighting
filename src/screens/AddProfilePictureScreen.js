import React, { useState } from 'react';
import {
  AsyncStorage,
  Platform,
  Text,
  View,
  Image,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import Button from 'react-native-button';
import ActivityModal from '../components/ActivityModal';
import Icon from 'react-native-vector-icons/Ionicons';
import { firebase } from '../Core/api/firebase/config';
import ImagePicker from 'react-native-image-crop-picker';
import AppStyles from '../AppStyles';
import { connect } from 'react-redux';
import DatingConfig from '../DatingConfig';
import DynamicAppStyles from '../DynamicAppStyles';
import { IMLocalized } from '../Core/localization/IMLocalization';

const AddProfilePictureScreen = (props) => {
  const [url, setUrl] = useState('');
  const [photo, setPhoto] = useState('');
  const [loading, setLoading] = useState(false);
  const userRef = firebase.firestore().collection('users').doc(props.user.id);

  const uploadPromise = (source) => {
    const uri = source;

    return new Promise((resolve) => {
      let filename = uri.substring(uri.lastIndexOf('/') + 1);
      const uploadUri =
        Platform.OS === 'ios' ? uri.replace('file://', '') : uri;

      firebase
        .storage()
        .ref(filename)
        .putFile(uploadUri)
        .then((snapshot) => {
          resolve(snapshot.downloadURL);
        })
        .catch((error) => {
          setLoading(false);
          setTimeout(() => {
            alert(IMLocalized('An has error occurred, please try again.'));
          }, 1000);
        });
    });
  };

  const addPhoto = () => {
    ImagePicker.openPicker({
      cropping: false,
    })
      .then((image) => {
        const source = image.path;

        setPhoto(source);
        setLoading(true);

        uploadPromise(source).then((url) => {
          setUrl(url);
          setLoading(false);

          let data = {
            profilePictureURL: url,
            photos: [url],
          };

          updateUserInfo(data);
          props.navigation.dispatch({ type: 'Login' });
        });
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        setTimeout(() => {
          alert(IMLocalized('An error has occurred, please try again.'));
        }, 1000);
      });
  };

  const updateUserInfo = (data) => {
    userRef
      .update(data)
      .then(() => {
        userRef
          .get()
          .then((doc) => {
            return doc.data();
          })
          .then((user) => {
            props.navigation.dispatch({ type: 'UPDATE_USER_DATA', user });
          });
      })
      .catch((error) => {
        const { message } = error;

        setLoading(false);
        setTimeout(() => {
          alert(IMLocalized('An error has occurred, please try again.'));
        }, 1000);

        console.log(message);
      });
  };

  const next = () => {
    props.navigation.navigate('AccountDetails', {
      lastScreen: 'AccountDetails',
      appStyles: DynamicAppStyles,
      form: DatingConfig.editProfileFields,
      screenTitle: IMLocalized('Edit Profile'),
    });
  };

  return (
    <View style={styles.container}>
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
      <View style={styles.logo}>
        <Text style={styles.title}>{IMLocalized('Choose Profile Photo')}</Text>
        {photo && url ? (
          <View style={styles.imageView}>
            <Image source={{ uri: photo }} style={styles.image_photo} />
          </View>
        ) : (
          <Icon
            name="md-camera"
            size={100}
            color="#eb5a6d"
            style={styles.icon_camera}
          />
        )}
      </View>
      {url ? (
        <Button
          containerStyle={styles.button}
          style={styles.text}
          onPress={() => next()}>
          {IMLocalized('Next')}
        </Button>
      ) : (
        <Button
          containerStyle={styles.button}
          style={styles.text}
          onPress={() => addPhoto()}>
          {IMLocalized('Add Profile Photo')}
        </Button>
      )}
    </View>
  );
};

AddProfilePictureScreen.propTypes = {
  user: PropTypes.object,
  navigation: PropTypes.object,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  title: {
    marginVertical: 20,
    fontSize: 20,
  },
  imageView: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    overflow: 'hidden',
    marginTop: 20,
  },
  image_photo: {
    width: '150%',
    height: '150%',
    resizeMode: 'contain',
  },
  icon_camera: {
    marginTop: 20,
  },
  button: {
    width: '85%',
    backgroundColor: AppStyles.colorSet.mainThemeForegroundColor,
    borderRadius: 12,
    padding: 15,
    marginBottom: 50,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: AppStyles.colorSet.mainThemeBackgroundColor,
  },
});

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(AddProfilePictureScreen);
