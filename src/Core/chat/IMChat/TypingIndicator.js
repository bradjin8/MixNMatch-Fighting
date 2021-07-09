import React from 'react';
import { View } from 'react-native';
import IndicatorDot from './IndicatorDot';

export function TypingIndicator(props) {
  const { dotRadius, containerStyle } = props;

  return (
    <View style={containerStyle}>
      <IndicatorDot radius={dotRadius} startTime={0} />
      <IndicatorDot radius={dotRadius} startTime={500} />
      <IndicatorDot radius={dotRadius} startTime={1000} />
    </View>
  );
}

export default TypingIndicator;
