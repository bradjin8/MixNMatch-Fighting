import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import { useColorScheme } from 'react-native-appearance';
import FacePileCircleItem from './FacePileCircleItem';
import dynamicStyles from './styles';

export function renderFacePile(faces = [], numFaces) {
  const entities = [...faces.reverse()];
  if (!entities.length)
    return {
      facesToRender: [],
      overflow: 0,
    };

  const facesWithImageUrls = entities.filter((e) => e.profilePictureURL);
  if (!facesWithImageUrls.length)
    return {
      facesToRender: [],
      overflow: 0,
    };

  const facesToRender = facesWithImageUrls.slice(0, numFaces);
  const overflow = entities.length - facesToRender.length;

  return {
    facesToRender,
    overflow,
  };
}

export default function FacePile(props) {
  const {
    render,
    faces,
    numFaces,
    hideOverflow,
    containerStyle,
    appStyles,
  } = props;

  const colorScheme = useColorScheme();
  const styles = dynamicStyles(appStyles, colorScheme);

  const renderOverflowCircle = (overflow) => {
    const {
      circleStyle,
      overflowStyle,
      overflowLabelStyle,
      circleSize,
      offset,
    } = props;

    const innerCircleSize = circleSize * 1.8;
    const marginLeft = circleSize * offset - circleSize / 1.6;

    return (
      <View style={[circleStyle]}>
        <View
          style={[
            styles.facePileOverflow,
            {
              width: innerCircleSize,
              height: innerCircleSize,
              borderRadius: circleSize,
              marginLeft: marginLeft,
            },
            overflowStyle,
          ]}>
          <Text
            style={[
              styles.facePileOverflowLabel,
              {
                fontSize: circleSize * 0.7,
              },
              overflowLabelStyle,
            ]}>
            +{overflow}
          </Text>
        </View>
      </View>
    );
  };

  const renderFace = (face, index) => {
    const { circleStyle, imageStyle, circleSize, offset } = props;
    if (face && !face.profilePictureURL) return null;

    return (
      <FacePileCircleItem
        dynamicStyle={styles}
        key={face.participantId || index}
        face={face}
        circleStyle={circleStyle}
        imageStyle={imageStyle}
        circleSize={circleSize}
        offset={offset}
      />
    );
  };

  const { facesToRender, overflow } = renderFacePile(faces, numFaces);

  return (
    <View style={[styles.facePileContainer, containerStyle]}>
      {overflow > 0 && !hideOverflow && renderOverflowCircle(overflow)}
      {Array.isArray(facesToRender) && facesToRender.map(renderFace)}
    </View>
  );
}

FacePile.defaultProps = {
  circleSize: 12,
  numFaces: 4,
  offset: 1,
  hideOverflow: false,
};
