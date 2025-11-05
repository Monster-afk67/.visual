/**
 * @fileOverview Main entry point for the Visually Script library.
 * Exports all public classes and functions for creating, reading, and
 * converting .visual presentation files.
 */

// "Writer" functionality
export { Presentation, Slide, Source } from './builder';

// "Reader" functionality
export { parseVisualFile } from './parser';

// "Converter" functionality
export { fromImageUrls } from './converter';

// Core types and interfaces
export * from './types';
