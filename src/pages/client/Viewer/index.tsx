import React, { useEffect, useState, useRef } from 'react';
import { fetchRule34Images } from '@/lib/rule34-api';
// import styles from './Viewer.module.css'; // Removed as no longer needed
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  // DialogClose, // Removed as it's included in DialogContent now
  DialogPortal, // Import DialogPortal
  DialogOverlay // Import DialogOverlay
} from "@/components/ui/dialog";
// import { Card, CardContent } from "@/components/ui/card"; // Removed as no longer needed
// import { XIcon } from 'lucide-react'; // Removed as no longer needed

interface Rule34Image {
  id: number;
  file_url: string;
  tags: string;
  preview_url: string;
}

// Helper function to determine tag type and return corresponding color class
const getTagTypeAndColor = (tag: string): { type: string; colorClass: string } => {
  if (tag.startsWith('artist:')) {
    return { type: 'artist', colorClass: 'bg-red-500 text-white' };
  } else if (tag.startsWith('character:')) {
    return { type: 'character', colorClass: 'bg-blue-500 text-white' };
  } else if (tag.startsWith('copyright:')) {
    return { type: 'copyright', colorClass: 'bg-green-500 text-white' };
  } else if (['highres', 'absurdres', 'lowres', 'score'].includes(tag)) {
    return { type: 'meta', colorClass: 'bg-purple-500 text-white' };
  } else {
    return { type: 'general', colorClass: 'bg-gray-700 text-white' };
  }
};

const getMediaType = (fileUrl: string): 'image' | 'video' | 'gif' => {
  if (fileUrl.endsWith('.mp4') || fileUrl.endsWith('.webm')) {
    return 'video';
  } else if (fileUrl.endsWith('.gif')) {
    return 'gif';
  } else {
    return 'image';
  }
};

const Viewer: React.FC = () => {
  const [images, setImages] = useState<Rule34Image[]>([]);
  const [searchTags, setSearchTags] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<Rule34Image | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [showAllTags, setShowAllTags] = useState<boolean>(false);
  const [videoDurations, setVideoDurations] = useState<{ [id: number]: string }>({});
  const [currentVideoTime, setCurrentVideoTime] = useState<{ [id: number]: string }>({}); // New state for running time

  const contentRef = useRef<HTMLDivElement>(null); // Ref for content area
  const videoTimeUpdateHandlersRef = useRef(new Map<number, (event: Event) => void>()); // Ref to store event handlers

  const loadImages = async (tags: string, pageNum: number) => {
    setLoading(true);
    const fetchedImages = await fetchRule34Images(tags, 24, pageNum);
    setImages(fetchedImages);
    setLoading(false);
  };

  const handleLoadedVideoMetadata = (event: React.SyntheticEvent<HTMLVideoElement, Event>, imageId: number) => {
    const videoElement = event.currentTarget;
    const duration = videoElement.duration;
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    const formattedDuration = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    setVideoDurations(prev => ({ ...prev, [imageId]: formattedDuration }));
  };

  useEffect(() => {
    loadImages(searchTags, page);
    if (contentRef.current) {
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top on page change
    }
  }, [page]);

  const handleSearch = () => {
    setPage(0);
    loadImages(searchTags, 0);
  };

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setPage((prevPage) => Math.max(0, prevPage - 1));
  };

  const handleImageClick = (image: Rule34Image) => {
    setSelectedImage(image);
    setIsDialogOpen(true);
    setShowAllTags(false);
  };

  const displayedTags = selectedImage?.tags.split(' ') || [];
  const tagLimit = 10;
  const tagsToShow = showAllTags ? displayedTags : displayedTags.slice(0, tagLimit);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Input
          type="text"
          placeholder="Enter tags (e.g., 'touhou_project cirno')"
          value={searchTags}
          onChange={(e) => setSearchTags(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
          className="flex-grow"
        />
        <Button onClick={handleSearch} className="w-full sm:w-auto">Search</Button>
      </div>

      {loading && <div className="text-center text-lg text-muted-foreground py-10">Loading...</div>}

      <div ref={contentRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {images.map((image) => (
          <div
            key={image.id}
            className="rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300 relative aspect-[4/3] w-full bg-background"
            onClick={() => handleImageClick(image)}
            onMouseEnter={(e) => {
              const mediaElement = e.currentTarget.querySelector('img, video') as HTMLImageElement | HTMLVideoElement;
              if (mediaElement && (getMediaType(image.file_url) === 'video' || getMediaType(image.file_url) === 'gif')) {
                mediaElement.src = image.file_url; // Use file_url for hover-to-play
                if (mediaElement.tagName === 'VIDEO') {
                  (mediaElement as HTMLVideoElement).play();
                  const handler = (event: Event) => {
                    const videoElement = event.currentTarget as HTMLVideoElement;
                    const currentTime = videoElement.currentTime;
                    const minutes = Math.floor(currentTime / 60);
                    const seconds = Math.floor(currentTime % 60);
                    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                    setCurrentVideoTime(prev => ({ ...prev, [image.id]: formattedTime }));
                  };
                  (mediaElement as HTMLVideoElement).addEventListener('timeupdate', handler);
                  videoTimeUpdateHandlersRef.current.set(image.id, handler);
                }
              }
            }}
            onMouseLeave={(e) => {
              const mediaElement = e.currentTarget.querySelector('img, video') as HTMLImageElement | HTMLVideoElement;
              if (mediaElement && (getMediaType(image.file_url) === 'video' || getMediaType(image.file_url) === 'gif')) {
                mediaElement.src = image.preview_url;
                if (mediaElement.tagName === 'VIDEO') {
                  (mediaElement as HTMLVideoElement).pause();
                  (mediaElement as HTMLVideoElement).currentTime = 0;
                  const handler = videoTimeUpdateHandlersRef.current.get(image.id);
                  if (handler) {
                    (mediaElement as HTMLVideoElement).removeEventListener('timeupdate', handler);
                    videoTimeUpdateHandlersRef.current.delete(image.id);
                  }
                  setCurrentVideoTime(prev => { delete prev[image.id]; return { ...prev }; }); // Clear running time
                }
              }
            }}
          >
            {getMediaType(image.file_url) === 'video' ? (
              <>
                <video
                  muted
                  loop
                  src={image.preview_url}
                  poster={image.preview_url}
                  className="absolute inset-0 w-full h-full object-cover z-[0]"
                  onLoadedMetadata={(e) => handleLoadedVideoMetadata(e, image.id)}
                />
                {/* Hidden video to get metadata for duration */}
                <video
                  src={image.file_url}
                  onLoadedMetadata={(e) => handleLoadedVideoMetadata(e, image.id)}
                  preload="metadata"
                  className="hidden"
                />
              </>
            ) : (
              <img
                src={image.preview_url}
                alt={image.tags}
                className="absolute inset-0 w-full h-full object-cover z-[0]"
              />
            )}
            <Badge className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md capitalize z-[10]">
              {getMediaType(image.file_url)}
            </Badge>
            {getMediaType(image.file_url) === 'video' && (currentVideoTime[image.id] || videoDurations[image.id]) && (
              <Badge className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md capitalize z-[10]">
                {currentVideoTime[image.id] || videoDurations[image.id]}
              </Badge>
            )}
          </div>
        ))}
      </div>



      <div className="flex justify-center items-center gap-4 mt-8">
        <Button onClick={handlePrevPage} disabled={page === 0}>Previous</Button>
        <span>Page {page + 1}</span>
        <Button onClick={handleNextPage}>Next</Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogPortal>
          <DialogOverlay />
          <DialogContent className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
            {selectedImage && (
              <div className="relative flex flex-col items-center justify-center w-full max-w-6xl max-h-[85vh] bg-card p-6 rounded-lg shadow-lg flex flex-col overflow-y-auto">
                <DialogHeader className="w-full text-center mb-4  w-5xl">
                  <DialogTitle className="text-2xl font-bold">Content Viewer</DialogTitle>
                  <DialogDescription>ID: {selectedImage.id}</DialogDescription>
                </DialogHeader>
                <div className="flex-grow flex items-center justify-center overflow-hidden max-w-full max-h-full">
                  {getMediaType(selectedImage.file_url) === 'video' ? (
                    <video controls src={selectedImage.file_url} className="max-w-full max-h-full object-contain" />
                  ) : (
                    <img src={selectedImage.file_url} alt={selectedImage.tags} className="max-w-full max-h-full object-contain" />
                  )}
                </div>
                <div className="mt-4 text-center">
                  <p className="text-lg font-medium">Tags:</p>
                  <div className={`flex flex-wrap justify-center gap-2 mt-2 ${showAllTags ? 'max-h-48 overflow-y-auto' : ''}`}>
                    {tagsToShow.map((tag, index) => {
                      const { colorClass } = getTagTypeAndColor(tag);
                      return (
                        <Badge key={index} className={colorClass}>
                          {tag}
                        </Badge>
                      );
                    })}
                  </div>
                  {displayedTags.length > tagLimit && (
                    <Button variant="link" onClick={() => setShowAllTags(!showAllTags)} className="text-sm p-0 h-auto mt-2">
                      {showAllTags ? 'Show Less' : `Show More (${displayedTags.length - tagLimit} more)`}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </div>
  );
};

export default Viewer;
