// Service Worker for push notifications and real-time features

const CACHE_NAME = 'marcha-brasil-v1';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/favicon.ico'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      }
    )
  );
});

// Push event
self.addEventListener('push', (event) => {
  const options = {
    body: 'Nova atualização disponível sobre sua manifestação',
    icon: '/favicon.ico',
    badge: '/favicon-32x32.png',
    data: {
      url: '/',
      timestamp: Date.now()
    },
    actions: [
      {
        action: 'view',
        title: 'Ver Detalhes'
      },
      {
        action: 'dismiss',
        title: 'Dispensar'
      }
    ],
    requireInteraction: false,
    tag: 'event-update'
  };

  if (event.data) {
    try {
      const data = event.data.json();
      options.body = data.message || options.body;
      options.data.url = data.url || options.data.url;
      options.tag = data.tag || options.tag;
      
      if (data.severity === 'critical') {
        options.requireInteraction = true;
        options.actions = [
          {
            action: 'view',
            title: 'Ver Urgente'
          }
        ];
      }
    } catch (e) {
      console.error('Error parsing push data:', e);
    }
  }

  event.waitUntil(
    self.registration.showNotification('Marcha Brasil', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'view') {
    const url = event.notification.data?.url || '/';
    event.waitUntil(
      clients.openWindow(url)
    );
  } else if (event.action !== 'dismiss') {
    // Default click action
    const url = event.notification.data?.url || '/';
    event.waitUntil(
      clients.openWindow(url)
    );
  }
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-attendance') {
    event.waitUntil(
      // Sync attendance confirmations when back online
      syncAttendanceData()
    );
  }
});

async function syncAttendanceData() {
  // In a real app, this would sync cached attendance data
  console.log('Syncing attendance data in background');
}