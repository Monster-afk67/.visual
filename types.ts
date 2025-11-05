/**
 * @fileOverview Defines the core data structures for the .visual presentation format.
 * This file serves as the official schema for the format.
 */

// A presentation consists of a media queue and a list of sources.
export interface VisualPresentation {
    title: string;
    mediaQueue: MediaItem[];
    sources: SourceItem[];
}

// A source for the bibliography slide.
export interface SourceItem {
    id: string;
    title:string;
    url: string;
    notes?: string;
    tags?: string[];
}

// Union type for all possible items in the media queue.
export type MediaItem = 
    | ImageMediaItem
    | YouTubeMediaItem
    | WebsiteMediaItem
    | CreatedSlideMediaItem;

// Base properties for any item in the media queue.
interface MediaItemBase {
    id: string;
    type: string;
    name: string;
    notes?: string;
    transition?: 'fade' | 'slide' | 'zoom' | 'none';
}

// Specific media item types.
export interface ImageMediaItem extends MediaItemBase {
    type: 'image';
    dataUrl: string; // URL to the image.
}

export interface YouTubeMediaItem extends MediaItemBase {
    type: 'youtube';
    url: string; // Original YouTube URL.
    embedUrl: string; // Processed embed URL.
}

export interface WebsiteMediaItem extends MediaItemBase {
    type: 'url';
    url: string; // URL of the website to embed.
}

export interface CreatedSlideMediaItem extends MediaItemBase {
    type: 'created-slide';
    slide: PresentationSlide;
}

// Represents a custom slide with its own elements.
export interface PresentationSlide {
    id: string;
    title: string;
    elements: SlideElement[];
    backgroundColor?: string;
}

// Union type for all elements that can be on a slide.
export type SlideElement = TextSlideElement | ImageSlideElement;

// Base properties for any element on a slide.
interface SlideElementBase {
    id: string;
    type: 'text' | 'image';
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface TextSlideElement extends SlideElementBase {
    type: 'text';
    content: string;
    fontSize: number;
    color: string;
    fontFamily: string;
    textAlign?: 'left' | 'center' | 'right';
}

export interface ImageSlideElement extends SlideElementBase {
    type: 'image';
    src: string;
    alt?: string;
}
