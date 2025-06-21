import { IMAGES_URL } from './config'

function renderProfilePhoto(url, quality = null, isMobile = false) {
  let profilePhoto;
  let urlPath = `${IMAGES_URL}/`;
  if (isMobile) {
    quality = 'low';
  }
  if (quality === 'low' || quality === 'med' || quality === 'high') {
    urlPath = urlPath.concat('optimized/');
  } else {
    urlPath = urlPath.concat('uploads/');
  }
  if (!url) {
    profilePhoto = `${IMAGES_URL}/uploads/default.jpg`;

  } else if (url.startsWith('http')) {
    profilePhoto = url;
  } else {
    if (quality === 'low' || quality === 'med' || quality === 'high') {
      profilePhoto = `${urlPath}${url}_${quality}`;
    } else {
      profilePhoto = `${urlPath}${url}`;
    }
  }

  return profilePhoto;
}

export { renderProfilePhoto }
