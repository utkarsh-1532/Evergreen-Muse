export type JournalEntry = {
  id: string;
  title: string;
  text: string;
  imageUrl?: string;
  imageCaption?: string;
  songTitle?: string;
  songArtist?: string;
  timestamp: Date;
};
