import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

import { RoutePaths } from '../general/RoutePaths';

export const Private = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);

  const goHome = () => {
    navigate(RoutePaths.HOME);
  };

  const listVideosFromChannel = () => {
    Meteor.call('youtube.listVideosFromChannel', { channelId: 'UCpEyIZJ6SAbsLwyfF9BTSiA' }, (err, res) => {
      setVideos(res);
      console.log(res)
    });
  }

  useEffect(() => {
    listVideosFromChannel();
  }, []);

  return (
    <div className="flex flex-grow flex-col items-center">
      <h2 className="mt-48 text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">
        <span className="block">You are in the private page</span>
        <div>
          <a
            onClick={goHome}
            className="mt-5 cursor-pointer text-base font-medium text-indigo-700 hover:text-indigo-600"
          >
            <span aria-hidden="true"> &larr;</span> Back to Home
          </a>
        </div>
      </h2>

      {videos.map((video) => (
        <div key={video.videoId} className="mt-5">
          <a
            href={video.link}
            target="_blank"
            rel="noreferrer"
            className="text-base font-medium text-indigo-700 hover:text-indigo-600"
          >
            {video.title}
          </a>
          <p>{video.description}</p>
          <img src={video.thumbnails.default.url} alt={video.title} />
          <p>{video.likeStatus.isLiked ? 'Liked' : video.likeStatus.isUnliked ? 'Unliked' : '-'}</p>
        </div>
      ))}
    </div>
  );
};
