// Nexariza AI Service Worker for Performance Optimization
// This service worker implements aggressive caching for rapid loading

const CACHE_NAME = 'nexariza-ai-v1.0.0';
const STATIC_CACHE = 'nexariza-static-v1.0.0';
const DYNAMIC_CACHE = 'nexariza-dynamic-v1.0.0';

// Critical resources to cache immediately
const CRITICAL_RESOURCES = [
  '/',
  '/index.html',
  '/assets/logos/nexariza-logo.svg',
  '/assets/favicons/favicon.ico',
  '/src/index.css',
  '/src/main.tsx'
];

// Resources to cache on demand
const CACHE_PATTERNS = [
  /^https:\/\/fonts\.googleapis\.com/,
  /^https:\/\/fonts\.gstatic\.com/,
  /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/,
  /\.(?:js|css|woff|woff2|ttf|eot)$/
];

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache critical resources
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.addAll(CRITICAL_RESOURCES.map(url => new Request(url, {
          cache: 'reload'
        })));
      }),
      
      // Skip waiting to activate immediately
      self.skipWaiting()
    ])
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker activating...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== CACHE_NAME) {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Take control of all clients
      self.clients.claim()
    ])
  );
});

// Fetch event - implement caching strategy
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Different strategies for different resource types
  if (isCriticalResource(request.url)) {
    // Critical resources: Cache First
    event.respondWith(cacheFirst(request, STATIC_CACHE));
  } else if (isAPIRequest(request.url)) {
    // API requests: Network First with short cache
    event.respondWith(networkFirst(request, DYNAMIC_CACHE, 5000));
  } else if (isStaticAsset(request.url)) {
    // Static assets: Stale While Revalidate
    event.respondWith(staleWhileRevalidate(request, STATIC_CACHE));
  } else {
    // Everything else: Network First
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
  }
});

// Cache First Strategy - for critical resources
async function cacheFirst(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      // Return cached version immediately
      return cachedResponse;
    }
    
    // If not in cache, fetch from network
    const networkResponse = await fetch(request);
    
    // Cache the response for next time
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Cache First failed:', error);
    return new Response('Resource not available', { status: 503 });
  }
}

// Network First Strategy - for dynamic content
async function networkFirst(request, cacheName, timeout = 3000) {
  try {
    const cache = await caches.open(cacheName);
    
    // Try network first with timeout
    const networkPromise = fetch(request).then(response => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    });
    
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Network timeout')), timeout)
    );
    
    try {
      return await Promise.race([networkPromise, timeoutPromise]);
    } catch (networkError) {
      // If network fails, try cache
      const cachedResponse = await cache.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
      throw networkError;
    }
  } catch (error) {
    console.error('Network First failed:', error);
    return new Response('Content not available', { status: 503 });
  }
}

// Stale While Revalidate Strategy - for static assets
async function staleWhileRevalidate(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    // Fetch from network in the background
    const networkPromise = fetch(request).then(response => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    }).catch(() => {
      // Ignore network errors for background updates
    });
    
    // Return cached version immediately if available
    if (cachedResponse) {
      // Update cache in background
      networkPromise;
      return cachedResponse;
    }
    
    // If not cached, wait for network
    return await networkPromise;
  } catch (error) {
    console.error('Stale While Revalidate failed:', error);
    return new Response('Asset not available', { status: 503 });
  }
}

// Helper functions
function isCriticalResource(url) {
  return CRITICAL_RESOURCES.some(resource => url.includes(resource)) ||
         url.includes('/assets/logos/') ||
         url.includes('/assets/favicons/');
}

function isAPIRequest(url) {
  return url.includes('/api/') || 
         url.includes('/contact') ||
         url.includes('analytics');
}

function isStaticAsset(url) {
  return CACHE_PATTERNS.some(pattern => pattern.test(url)) ||
         url.includes('/assets/') ||
         url.includes('.js') ||
         url.includes('.css') ||
         url.includes('.woff');
}

// Background sync for offline form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'contact-form-sync') {
    event.waitUntil(syncContactForms());
  }
});

async function syncContactForms() {
  try {
    // Get stored form submissions from IndexedDB
    const db = await openDB();
    const submissions = await getStoredSubmissions(db);
    
    for (const submission of submissions) {
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          body: JSON.stringify(submission.data),
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          // Remove successfully synced submission
          await removeSubmission(db, submission.id);
          console.log('📧 Contact form synced successfully');
        }
      } catch (error) {
        console.error('Failed to sync contact form:', error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// IndexedDB helpers for offline functionality
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('nexariza-offline', 1);
    
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('contact-forms')) {
        db.createObjectStore('contact-forms', { keyPath: 'id', autoIncrement: true });
      }
    };
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function getStoredSubmissions(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['contact-forms'], 'readonly');
    const store = transaction.objectStore('contact-forms');
    const request = store.getAll();
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function removeSubmission(db, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['contact-forms'], 'readwrite');
    const store = transaction.objectStore('contact-forms');
    const request = store.delete(id);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Push notification handling
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/assets/favicons/android-chrome-192x192.png',
      badge: '/assets/favicons/android-chrome-192x192.png',
      data: {
        url: data.url || '/'
      }
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const url = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Check if there's already a window open
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Open new window if none exists
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

console.log('🚀 Nexariza AI Service Worker loaded successfully!');