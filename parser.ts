/**
 * @fileOverview Provides functions for reading and validating .visual files.
 * This is the "Reader" part of the library.
 */

import { z } from 'zod';
import type { VisualPresentation } from './types';

// --- Zod Schemas for Validation ---
// These schemas ensure that the parsed JSON conforms to the .visual format.

const TextSlideElementSchema = z.object({
  id: z.string(),
  type: z.literal('text'),
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
  content: z.string(),
  fontSize: z.number(),
  color: z.string(),
  fontFamily: z.string(),
  textAlign: z.enum(['left', 'center', 'right']).optional(),
});

const ImageSlideElementSchema = z.object({
  id: z.string(),
  type: z.literal('image'),
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
  src: z.string(),
  alt: z.string().optional(),
});

const SlideElementSchema = z.union([TextSlideElementSchema, ImageSlideElementSchema]);

const PresentationSlideSchema = z.object({
  id: z.string(),
  title: z.string(),
  elements: z.array(SlideElementSchema),
  backgroundColor: z.string().optional(),
});

const CreatedSlideMediaItemSchema = z.object({
  id: z.string(),
  type: z.literal('created-slide'),
  name: z.string(),
  slide: PresentationSlideSchema,
  notes: z.string().optional(),
  transition: z.enum(['fade', 'slide', 'zoom', 'none']).optional(),
});

const ImageMediaItemSchema = z.object({
  id: z.string(),
  type: z.literal('image'),
  name: z.string(),
  dataUrl: z.string(),
  notes: z.string().optional(),
  transition: z.enum(['fade', 'slide', 'zoom', 'none']).optional(),
});

const YouTubeMediaItemSchema = z.object({
  id: z.string(),
  type: z.literal('youtube'),
  name: z.string(),
  url: z.string(),
  embedUrl: z.string(),
  notes: z.string().optional(),
  transition: z.enum(['fade', 'slide', 'zoom', 'none']).optional(),
});

const WebsiteMediaItemSchema = z.object({
  id: z.string(),
  type: z.literal('url'),
  name: z.string(),
  url: z.string(),
  notes: z.string().optional(),
  transition: z.enum(['fade', 'slide', 'zoom', 'none']).optional(),
});

const MediaItemSchema = z.union([
  ImageMediaItemSchema,
  YouTubeMediaItemSchema,
  WebsiteMediaItemSchema,
  CreatedSlideMediaItemSchema,
]);

const SourceItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

const VisualPresentationSchema = z.object({
  title: z.string(),
  mediaQueue: z.array(MediaItemSchema),
  sources: z.array(SourceItemSchema),
});


/**
 * Parses and validates the content of a .visual file.
 * Throws an error if the content is not valid JSON or does not match the format.
 * @param fileContent The string content of the .visual file.
 * @returns A validated VisualPresentation object.
 */
export function parseVisualFile(fileContent: string): VisualPresentation {
  let parsedJson: unknown;

  try {
    parsedJson = JSON.parse(fileContent);
  } catch (error) {
    throw new Error('Invalid file content: Not a valid JSON format.');
  }
  
  const result = VisualPresentationSchema.safeParse(parsedJson);

  if (!result.success) {
    // Provide a more detailed error message from Zod's validation.
    const firstIssue = result.error.issues[0];
    const path = firstIssue.path.join('.');
    throw new Error(`Validation failed: Field '${path}' - ${firstIssue.message}.`);
  }

  return result.data as VisualPresentation;
}
