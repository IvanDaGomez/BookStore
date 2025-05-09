function renderProfilePhoto(url, quality = null) {
  let profilePhoto;
  let urlPath = 'http://localhost:3030/';

  if (quality === 'low' || quality === 'med' || quality === 'high') {
    urlPath = urlPath.concat('optimized/');
  } else {
    urlPath = urlPath.concat('uploads/');
  }
  if (!url) {
    profilePhoto = 'http://localhost:3030/uploads/default.jpg';
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
