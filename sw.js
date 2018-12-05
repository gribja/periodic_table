var cache_name = 'v1';

var paths = [
  'index.html',
  'style.css',
  'js/build/three.min.js',
  'js/libs/tween.min.js',
  'js/renderers/CSS3DRenderer.js',
  'js/controls/TrackballControls.js',
  'manifest.json',
  'images/i48.png',
  'images/i96.png',
  'images/i144.png',
  'images/i192.png',
  'images/i256.png',
  'images/i512.png'
];

self.addEventListener( 'install', function ( event ) {
  event.waitUntil( caches.open( cache_name ).then( function ( cache ) {
    return cache.addAll( paths ).then( function () {
      self.skipWaiting();
    } );
  } ) );
}, false );

self.addEventListener( 'fetch', function ( event ) {
  event.respondWith( caches.match( event.request ).then( function ( response ) {
    return response || fetch( event.request.clone() ).then( function ( response ) {
      if ( response && response.status === 200 && response.type === 'basic' ) {
        var res = response.clone();

        caches.open( cache_name ).then( function ( cache ) {
          cache.put( event.request, res );
        } );
      }

            return response;
    } );
  } ) );
}, false );

self.addEventListener( 'activate', function ( event ) {
  var whitelist = [ cache_name ];

  event.waitUntil( caches.keys().then( function ( list ) {
    return Promise.all( list.map( function ( key ) {
      if ( whitelist.indexOf( key ) < 0 ) {
        return caches.delete( key );
      }
    } ) );
  } ) );
}, false );