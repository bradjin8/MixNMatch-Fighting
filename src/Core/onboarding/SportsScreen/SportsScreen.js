import React, {useState} from 'react';
import {
  Alert,
  Image, ImageBackground,
  Keyboard,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Button from 'react-native-button';

import dynamicStyles from './styles';
import {useColorScheme} from 'react-native-appearance';
import TNActivityIndicator from '../../truly-native/TNActivityIndicator';
import {IMLocalized} from '../../localization/IMLocalization';
import {setUserData} from '../redux/auth';
import {connect} from 'react-redux';
import {localizedErrorMessage} from '../utils/ErrorCode';

import ImgBoxing from '../../../../assets/images/sports-boxing.png';
import ImgMMA from '../../../../assets/images/sports-mma.png';
import ImgJiu from '../../../../assets/images/sports-jiu.png';
import ImgKickboxing from '../../../../assets/images/sports-kickboxing.png';

const Sports = [
  [
    {
      name: 'Boxing',
      image: ImgBoxing,
    },
    {
      name: 'MMA',
      image: ImgMMA,
    }
  ],
  [
    {
      name: 'Brazilian Jiu Jitsu',
      image: ImgJiu
    },
    {
      name: 'Kickboxing',
      image: ImgKickboxing
    }
  ]
];

const SportsScreen = (props) => {
    // const appConfig = props.route.params.appConfig;
    const appStyles = props.route.params.appStyles;
    // const authManager = props.route.params.authManager;

    const colorScheme = useColorScheme();
    const styles = dynamicStyles(appStyles, colorScheme);

    const [loading, setLoading] = useState(false);
    const [sport, setSport] = useState('');

    const onContinue = async () => {

      let user = props.user;
      if (user) {
        props.setUserData({
          user: user,
        });
        Keyboard.dismiss();
        props.navigation.reset({
          index: 0,
          routes: [{name: 'MainStack', params: {user: user}}],
        });
      } else {
        setLoading(false);
        Alert.alert(
          '',
          localizedErrorMessage('invalid user'),
          [{text: IMLocalized('OK')}],
          {
            cancelable: false,
          },
        );
      }
    };

    const onPressSport = (sport) => {
      setSport(sport)
    };

    const _renderSports = () => {
      return <View style={styles.sportsContainer}>
        {
          Sports.map((row, row_id) => {
            return <View style={styles.sportsRow}>
              {row.map((it, id) =>
                <TouchableOpacity onPress={() => onPressSport(it.name)}>
                  <ImageBackground
                    resizeMode={'stretch'}
                    style={sport === it.name ? {...styles.sportsImage, ...styles.sportsImageActive} : styles.sportsImage}
                    source={it.image}
                  >
                    <Text style={styles.sportsName}>{it.name}</Text>
                  </ImageBackground>
                </TouchableOpacity>
              )}
            </View>
          })
        }
      </View>
    };

    return (
      <View style={styles.container}>
        {_renderSports()}
        <Text style={styles.chooseText}>Choose your sport</Text>
        <Button
          containerStyle={styles.continueContainer}
          style={styles.continueText}
          onPress={() => onContinue()}>
          {IMLocalized('Continue')}
        </Button>
        {loading && <TNActivityIndicator appStyles={appStyles}/>}
      </View>
    );
  }
;

const mapStateToProps = (state) => (
  {
    user: state.auth.user,
  }
);

export default connect(mapStateToProps,
  {
    setUserData,
  }
)(SportsScreen);
