/**
 * @fileOverview Provides utility functions to convert other data formats
 * into a valid .visual presentation format.
 */

import { Presentation } from './builder';
import type { VisualPresentation } from './types';

interface ImageInput {
    url: string;
    name?: string;
}

/**
 * Converts a simple array of image URLs into a full VisualPresentation object.
 * @param title The title of the new presentation.
 * @param images An array of objects, each with a `url` and optional `name`.
 * @returns A VisualPresentation object.
 */
export function fromImageUrls(title: string, images: ImageInput[]): VisualPresentation {
    const presentation = new Presentation(title);

    for (const image of images) {
        presentation.addImage(image.url, image.name);
    }

    return presentation.toJSON();
}
