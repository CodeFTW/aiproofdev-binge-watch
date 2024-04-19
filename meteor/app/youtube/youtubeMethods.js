import { Meteor } from 'meteor/meteor';

const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

async function getGoogleAPI({ userId }) {
  const user = await Meteor.users.findOneAsync(userId);

  const oauth2Client = new OAuth2(
    Meteor.settings.google.clientId, // Replace with your own Client ID
    Meteor.settings.google.secret, // Replace with your own Client Secret
    'http://locahost:3000' // Replace with your own Redirect URL
  );
  const accessToken = user.services.google.accessToken;
  oauth2Client.setCredentials({
    access_token: accessToken,
  });
  return google.youtube({
    version: 'v3',
    auth: oauth2Client,
  });
}
const getLikeStatus = async ({ googleAPI, videoId }) => {
  try {
    const videoLikes = await googleAPI.videos.getRating({
      id: videoId,
      // onBehalfOfContentOwner: userId // Replace with user's ID
    });
    console.log(`videoLikes.data.itemsx`, videoLikes.data.items);
    const rating = videoLikes.data.items[0].rating;

    if (rating === 'none') {
      return {};
    }
    return { isLiked: rating === 'like', isUnliked: rating === 'dislike' };
  } catch (e) {
    console.error(`getLikeStatus error`, e);
    return null;
  }
};

const listVideosFromChannel = async function ({ channelId }) {
  const { userId } = this;
  if (!userId) {
    throw new Meteor.Error('not-authorized');
  }
  const googleAPI = await getGoogleAPI({ userId });
  const { data } = await googleAPI.search.list({
    part: 'snippet',
    channelId,
    maxResults: 10,
  });

  const videos = data.items
    .filter((item) => !!item.id.videoId)
    .map(
      ({ id: { videoId }, snippet: { title, description, thumbnails } }) => ({
        link: `https://www.youtube.com/watch?v=${videoId}`,
        videoId,
        title,
        description,
        thumbnails,
      })
    );
  return Promise.allSettled(
    videos.map(async (video) => {
      video.likeStatus = await getLikeStatus({
        googleAPI,
        videoId: video.videoId,
      });
      return video;
    })
  );
};
Meteor.methods({
  'youtube.listVideosFromChannel': listVideosFromChannel,
});
