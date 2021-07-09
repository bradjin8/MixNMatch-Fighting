// Uncomment these if you want to remove firebase and add your own custom backend:
// import * as channelManager from './local/channel';
// import ChannelsTracker from './local/channelsTracker';
// export { channelManager, ChannelsTracker };


// Remove these lines if you want to remove firebase and add your own custom backend:
import * as channelManager from './firebase/channel';
import ChannelsTracker from './firebase/channelsTracker';
export { channelManager, ChannelsTracker };
