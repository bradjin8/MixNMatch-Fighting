import React, { useState, useEffect, useRef } from 'react';
import { View } from 'react-native';
import { Video } from 'expo-av';
import CircleSnail from 'react-native-progress/CircleSnail';
import AudioMediaThreadItem from './AudioMediaThreadItem';
import { loadCachedItem } from '../../helpers/cacheManager';
import { createImageProgress } from 'react-native-image-progress';
import FastImage from 'react-native-fast-image';

const Image = createImageProgress(FastImage);

const circleSnailProps = { thickness: 1, color: '#D0D0D0', size: 50 };

export default function ThreadMediaItem({
  dynamicStyles,
  appStyles,
  videoRef,
  item,
  outBound,
  updateItemImagePath,
}) {
  const isValidUrl = item.url.url && item.url.url.startsWith('http');
  const isValidLegacyUrl = !item.url.url && item.url.startsWith('http');
  const uri = isValidUrl || isValidLegacyUrl ? item.url.url || item.url : '';

  const [videoPaused, setVideoPaused] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);
  const [cachedImage, setCachedImage] = useState(uri);
  const [cachedVideo, setCachedVideo] = useState(null);

  const isImage =
    item.url && item.url.mime && item.url.mime.startsWith('image');
  const isAudio =
    item.url && item.url.mime && item.url.mime.startsWith('audio');
  const isVideo =
    item.url && item.url.mime && item.url.mime.startsWith('video');
  const noTypeStated = item.url && !item.url.mime;

  useEffect(() => {
    if (!videoLoading) {
      setVideoPaused(true);
    }
  }, [videoLoading]);

  useEffect(() => {
    const loadImage = async () => {
      if (noTypeStated && (isValidUrl || isValidLegacyUrl)) {
        const image = await loadCachedItem({ uri });
        setCachedImage(image);
        updateItemImagePath(image);
      }

      if (isImage && (isValidUrl || isValidLegacyUrl)) {
        const image = await loadCachedItem({ uri });
        setCachedImage(image);
        updateItemImagePath(image);
      }
      if (isVideo && (isValidUrl || isValidLegacyUrl)) {
        const video = await loadCachedItem({ uri });
        setCachedVideo(video);
      }
    };

    loadImage();
  }, []);

  const onVideoLoadStart = () => {
    setVideoLoading(true);
  };

  const onVideoLoad = (payload) => {
    setVideoLoading(false);
  };

  if (isImage) {
    return (
      <Image source={{ uri: cachedImage }} style={dynamicStyles.mediaMessage} />
    );
  } else if (isAudio) {
    return (
      <AudioMediaThreadItem
        outBound={outBound}
        item={item.url}
        appStyles={appStyles}
      />
    );
  } else if (isVideo) {
    return (
      <View>
        {videoLoading && (
          <View style={[dynamicStyles.mediaMessage, dynamicStyles.centerItem]}>
            <CircleSnail {...circleSnailProps} />
          </View>
        )}
        <Video
          ref={videoRef}
          source={{
            uri: cachedVideo,
          }}
          shouldPlay={false}
          onLoad={onVideoLoad}
          onLoadStart={onVideoLoadStart}
          resizeMode={'cover'}
          style={[
            dynamicStyles.mediaMessage,
            { display: videoLoading ? 'none' : 'flex' },
          ]}
        />
        {!videoLoading && (
          <Image
            source={appStyles.iconSet.playButton}
            style={dynamicStyles.playButton}
            resizeMode={'contain'}
          />
        )}
      </View>
    );
  } else {
    // To handle old format of an array of url stings. Before video feature
    return (
      <Image source={{ uri: cachedImage }} style={dynamicStyles.mediaMessage} />
    );
  }
}
