# Design Spec: Automatic Asset Optimization

**Date:** 2026-05-14  
**Topic:** Ultra-High Optimization - Performance & Speed  
**Status:** Draft (Pending User Review)

## 1. Overview
Large image files are the primary cause of slow page loads. This feature introduces a client-side optimization engine that automatically compresses and resizes images before they are uploaded to the server. This ensures the site remains fast and bandwidth-efficient without requiring manual work from administrators.

## 2. Technical Architecture

### 2.1. Optimization Engine (Canvas API)
To avoid adding heavy dependencies, we will use the native browser **Canvas API** for image processing.
- **Resizing**: If an image exceeds a maximum dimension (e.g., 1920px), it will be proportionally downscaled.
- **Compression**: Images will be converted to `image/webp` (preferred) or `image/jpeg` with a quality setting of 0.8.
- **Format Conversion**: Automatic conversion of heavy PNGs or BMPs to optimized WebP format.

### 2.2. Integration Flow (Visual Editor)
1. **Selection**: Admin selects a file via the "CHANGE IMAGE" button.
2. **Processing**: The editor intercepts the `File` object and passes it to the `optimizeImage` utility.
3. **Progress UI**: The upload button shows an "Optimizing..." state to provide feedback.
4. **Upload**: The resulting optimized `Blob` is uploaded to Supabase Storage instead of the original raw file.

## 3. Implementation Plan

### Stream A: Optimization Utility
1. Create `src/admin/lib/imageOptimizer.ts`.
2. Implement `optimizeImage(file, options)` using `Image`, `Canvas`, and `FileReader`.
3. Support configurable max width, height, and quality.

### Stream B: Editor Integration
1. Update `handleLanguageFileUpload` in `Content.tsx` to include the optimization step.
2. Add "Optimizing" visual state to the upload labels.
3. Update the storage file extension logic to reflect the conversion to WebP (if applied).

## 4. Success Criteria
- Uploading a 5MB PNG results in an optimized WebP file under 500KB.
- Image quality remains high for standard web viewing.
- The optimization process is fast (< 1 second for typical photos).
- Administrators receive visual confirmation that their assets are being optimized for speed.
