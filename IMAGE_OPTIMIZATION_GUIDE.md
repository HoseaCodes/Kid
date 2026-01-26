# Image and Asset Optimization Guide

## 1. Compress Images

- **Tool:** [imagemin](https://github.com/imagemin/imagemin)
- **Purpose:** Reduce image file sizes without sacrificing quality.
- **How to Use:**
  1. Install imagemin and plugins:
     ```bash
     npm install imagemin imagemin-mozjpeg imagemin-pngquant imagemin-svgo --save-dev
     ```
  2. Add a build script to your `package.json`:
     ```json
     "scripts": {
       "build:images": "node scripts/compress-images.js"
     }
     ```
  3. Create a script (`scripts/compress-images.js`) to process images in your assets folder.
  4. Run:
     ```bash
     npm run build:images
     ```
- **Result:** Optimized images are output to your build/public/static/media folder.

## 2. Lazy Load Images

- **Tool:** [react-lazyload](https://www.npmjs.com/package/react-lazyload)
- **Purpose:** Defer loading offscreen images until the user scrolls near them, improving performance.
- **How to Use:**
  1. Install:
     ```bash
     npm install react-lazyload
     ```
  2. Wrap image elements in `<LazyLoad>`:
     ```jsx
     import LazyLoad from 'react-lazyload';
     // ...existing code...
     <LazyLoad height={100} offset={100} once>
       <img src={imageSrc} alt="description" />
     </LazyLoad>
     ```
- **Result:** Images are loaded only when they enter the viewport, reducing initial load time.

## 3. Debounce and Throttle User Input

- **Purpose:** Reduce unnecessary updates and API calls by controlling the rate of event handling (e.g., search, scroll, resize).

### Debounce
- **How it works:** Delays execution until the user stops triggering the event for a set period.
- **Example (React Hook):**
  ```jsx
  import { useDebounce } from '../hooks/useDebounce';
  const debouncedValue = useDebounce(value, 500);
  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue]);
  ```

### Throttle
- **How it works:** Ensures the event handler runs at most once every set interval.
- **Example (React Hook):**
  ```jsx
  import { useThrottle } from '../hooks/useThrottle';
  const throttledValue = useThrottle(value, 500);
  useEffect(() => {
    onSearch(throttledValue);
  }, [throttledValue]);
  ```

---

**Best Practices:**
- Always compress images before deployment.
- Use lazy loading for all images not immediately visible.
- Apply debounce/throttle to search, scroll, resize, and other frequent events.
- Test performance improvements using Lighthouse or similar tools.
