# Production Build Optimization Guide

## 1. Minification
- **How it's handled:**
  - The `react-scripts build` command automatically minifies JavaScript and CSS files for production.
  - Output files are hashed for cache busting and stored in the `build/` directory.

## 2. Gzip Compression
- **How to enable:**
  - Most modern hosting platforms (Netlify, Vercel, Firebase Hosting, AWS S3, etc.) automatically serve static assets with gzip or Brotli compression.
  - If self-hosting (e.g., Nginx, Apache), enable gzip in your server config:
    - **Nginx:**
      ```nginx
      gzip on;
      gzip_types text/css application/javascript image/svg+xml;
      gzip_min_length 256;
      ```
    - **Apache:**
      ```apache
      <IfModule mod_deflate.c>
        AddOutputFilterByType DEFLATE text/css application/javascript image/svg+xml
      </IfModule>
      ```

## 3. Proper Caching Headers
- **Purpose:**
  - Ensure browsers cache static assets efficiently, reducing load times for repeat visitors.
- **How to set:**
  - **Netlify/Vercel/Firebase Hosting:** These platforms set optimal caching headers by default.
  - **Custom server (Nginx/Apache):**
    - **Nginx:**
      ```nginx
      location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
      }
      ```
    - **Apache:**
      ```apache
      <FilesMatch "\.(js|css|png|jpg|jpeg|gif|svg|ico)$">
        Header set Cache-Control "public, max-age=31536000, immutable"
      </FilesMatch>
      ```

## 4. Verification
- **Test your build:**
  - Use [Google Lighthouse](https://developers.google.com/web/tools/lighthouse) to audit performance, compression, and caching.
  - Check response headers in browser dev tools (Network tab) for `Content-Encoding: gzip` and proper `Cache-Control` values.

---

**Summary:**
- Production builds are minified by default with Create React App.
- Gzip compression and caching headers are typically handled by your host/server.
- For custom deployments, configure your server for gzip and caching as shown above.
- Always verify with Lighthouse and browser dev tools.
