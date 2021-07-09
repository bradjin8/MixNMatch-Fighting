// Uncomment these if you want to remove firebase and add your own custom backend:
// import storageAPI from './local/storage';
// import * as authAPI from './local/auth';
// import * as userAPIManager from './local/user';
// export { storageAPI, authAPI, userAPIManager };


// Remove these lines if you want to remove firebase and add your own custom backend:
import storageAPI from './firebase/storage';
import * as authAPI from './firebase/auth';
import * as userAPIManager from './firebase/user';
export { storageAPI, authAPI, userAPIManager };
