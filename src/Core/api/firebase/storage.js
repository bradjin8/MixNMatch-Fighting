import { ErrorCode } from '../../onboarding/utils/ErrorCode';
import { firebase } from './config';
import { compressVideo, resizeImage } from '../../helpers/cacheManager';

const getBlob = async (uri) => {
  return await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
      resolve(xhr.response);
    };
    xhr.onerror = (error) => console.log('error');
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);
    xhr.send(null);
  });
};

const uploadFileWithProgressTracking = async (
  file,
  callbackProgress,
  callbackSuccess,
  callbackError,
) => {
  processFile(file, async (processedUri) => {
    // Success handler with SUCCESS is called multiple times on Android. We need work around that to ensure we only call it once
    let finished = false;
    const filename = processedUri.substring(processedUri.lastIndexOf('/') + 1);
    const blob = await getBlob(processedUri);
    const storageRef = firebase.storage().ref();
    const fileRef = storageRef.child(filename);
    const uploadTask = fileRef.put(blob);

    uploadTask.on(
      firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        if (snapshot.state == firebase.storage.TaskState.SUCCESS) {
          if (finished == true) {
            return;
          }
          finished = true;
        }
        callbackProgress(snapshot);
      },
      callbackError,
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          console.log('File available at', downloadURL);
          callbackSuccess(downloadURL);
        });
      },
    );
  });
};

const uploadFile = (file) => {
  return new Promise((resolve, _reject) => {
    processFile(file, async (processedUri) => {
      console.log('processedUri ==', processedUri);

      const filename = processedUri.substring(
        processedUri.lastIndexOf('/') + 1,
      );
      const blob = await getBlob(processedUri);

      const storageRef = firebase.storage().ref();
      const fileRef = storageRef.child(filename);
      const uploadTask = fileRef.put(blob);
      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {},
        (error) => {
          console.log('upload error:', error);
          resolve({ error: ErrorCode.photoUploadFailed });
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            console.log('File available at', downloadURL);
            resolve({ downloadURL: downloadURL });
          });
        },
      );
    });
  });
};

const processFile = (file, callback) => {
  const { mime, type, uri, path } = file;
  const fileSource = uri || path;
  const includesVideo = mime?.includes('video') || type?.includes('video');
  const includesImage = mime?.includes('image') || type?.includes('image');
  if (includesVideo) {
    compressVideo(fileSource, (newSource) => {
      callback(newSource);
    });
    return;
  }
  if (includesImage) {
    resizeImage({ image: file }, (newSource) => {
      callback(newSource);
    });
    return;
  }
  callback(fileSource);
};

const firebaseStorage = {
  uploadFile,
  uploadFileWithProgressTracking,
};

export default firebaseStorage;
