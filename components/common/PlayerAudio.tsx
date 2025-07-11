import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { useAudioPlayerStore } from '@/lib/store/useAudioPlayerStore';
// import 'react-h5-audio-player/lib/styles.less' Use LESS
// import 'react-h5-audio-player/src/styles.scss' Use SASS

export const PlayerAudio = () => {
  const {
    audioSrc,
    setPlaying,
    currentAudioInfo,
    handleAudioEnded,
    isSequentialPlaying,
    playlist,
    currentPlaylistIndex,
  } = useAudioPlayerStore();

  // 构建播放进度信息
  const getPlaybackInfo = () => {
    if (isSequentialPlaying && playlist.length > 0) {
      return `${currentPlaylistIndex + 1}/${playlist.length}`;
    }
    return '';
  };

  // 构建标题信息
  const getTitle = () => {
    const baseTitle = currentAudioInfo?.title ? `正在播放: ${currentAudioInfo.title}` : '';
    const progressInfo = getPlaybackInfo();
    return progressInfo ? `${baseTitle} (${progressInfo})` : baseTitle;
  };

  return (
    <AudioPlayer
      autoPlay
      src={audioSrc}
      onPlay={(e) => {
        console.log('onPlay');
        setPlaying(true);
      }}
      onPause={(e) => {
        console.log('onPause');
        setPlaying(false);
      }}
      onEnded={(e) => {
        console.log('onEnded');
        // 使用 store 的 handleAudioEnded 来处理播放完成
        handleAudioEnded();
      }}
      onError={(e) => {
        console.log('onError', e);
        setPlaying(false);
      }}
      // 显示当前播放的音频信息和进度
      header={getTitle()}
      // other props here
    />
  );
};
