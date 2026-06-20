export type YouTubeVideo = {
  videoId: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnail: string;
  channelTitle: string;
  url: string;
};

export type VideosApiResponse = {
  videos: YouTubeVideo[];
  count: number;
  fetchedAt: string;
  error?: string;
};
