/**
 * @fileOverview Provides builder classes to programmatically create .visual presentations.
 * This is the "Writer" part of the library.
 */
import type { 
    VisualPresentation, 
    MediaItem, 
    SourceItem, 
    PresentationSlide, 
    TextSlideElement, 
    ImageSlideElement,
    YouTubeMediaItem,
    WebsiteMediaItem,
    ImageMediaItem as TImageMediaItem, // Renamed to avoid conflict with class name
    CreatedSlideMediaItem
} from './types';
import { generateId, getYouTubeEmbedUrl } from './utils';

// --- Builder for an entire Presentation ---
export class Presentation {
    private title: string;
    private mediaQueue: MediaItem[] = [];
    private sources: SourceItem[] = [];

    constructor(title: string) {
        this.title = title;
    }

    addSlide(slide: Slide): this {
        const slideItem: CreatedSlideMediaItem = {
            id: generateId(),
            type: 'created-slide',
            name: slide.getTitle(),
            slide: slide.build(),
            transition: 'fade',
        };
        this.mediaQueue.push(slideItem);
        return this;
    }

    addImage(url: string, name?: string): this {
        const imageItem: TImageMediaItem = {
            id: generateId(),
            type: 'image',
            name: name || `Image: ${url.substring(url.lastIndexOf('/') + 1)}`,
            dataUrl: url,
            transition: 'fade',
        };
        this.mediaQueue.push(imageItem);
        return this;
    }

    addYouTube(url: string, name?: string): this {
        const embedUrl = getYouTubeEmbedUrl(url);
        if (!embedUrl) {
            console.warn(`Invalid YouTube URL skipped: ${url}`);
            return this;
        }
        const youtubeItem: YouTubeMediaItem = {
            id: generateId(),
            type: 'youtube',
            name: name || 'YouTube Video',
            url: url,
            embedUrl: embedUrl,
            transition: 'fade',
        };
        this.mediaQueue.push(youtubeItem);
        return this;
    }

    addWebsite(url: string, name?: string): this {
        const websiteItem: WebsiteMediaItem = {
            id: generateId(),
            type: 'url',
            name: name || `Website: ${url}`,
            url: url,
            transition: 'fade',
        };
        this.mediaQueue.push(websiteItem);
        return this;
    }

    addSource(source: Source): this {
        this.sources.push(source.build());
        return this;
    }

    // Finalizes and returns the serializable presentation object.
    toJSON(): VisualPresentation {
        return {
            title: this.title,
            mediaQueue: this.mediaQueue,
            sources: this.sources,
        };
    }
}

// --- Builder for a single Slide ---
export class Slide {
    private id: string;
    private title: string;
    private elements: (TextSlideElement | ImageSlideElement)[] = [];
    private backgroundColor: string = '#FFFFFF';

    constructor(title: string) {
        this.id = generateId();
        this.title = title;
    }

    getTitle(): string {
        return this.title;
    }
    
    setBackground(color: string): this {
        this.backgroundColor = color;
        return this;
    }

    addText(props: Omit<TextSlideElement, 'id' | 'type' | 'width' | 'height'> & { width?: number; height?: number }): this {
        const element: TextSlideElement = {
            id: generateId(),
            type: 'text',
            width: 700,
            height: 100,
            ...props,
        };
        this.elements.push(element);
        return this;
    }

    addImage(props: Omit<ImageSlideElement, 'id' | 'type'>): this {
        const element: ImageSlideElement = {
            id: generateId(),
            type: 'image',
            ...props,
        };
        this.elements.push(element);
        return this;
    }

    build(): PresentationSlide {
        return {
            id: this.id,
            title: this.title,
            elements: this.elements,
            backgroundColor: this.backgroundColor,
        };
    }
}

// --- Builder for a Source item ---
export class Source {
    private id: string;
    private title: string;
    private url: string;
    private notes?: string;
    private tags?: string[];

    constructor(title: string, url: string) {
        this.id = generateId();
        this.title = title;
        this.url = url;
    }

    withNotes(notes: string): this {
        this.notes = notes;
        return this;
    }
    
    withTags(tags: string[]): this {
        this.tags = tags;
        return this;
    }

    build(): SourceItem {
        return {
            id: this.id,
            title: this.title,
            url: this.url,
            notes: this.notes,
            tags: this.tags,
        };
    }
}
