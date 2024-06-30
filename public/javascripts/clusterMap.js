
	mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/dark-v10',
        center: [-103.5917, 40.6699],
        zoom: 3,
        minZoom: 2
    });

    map.addControl(new mapboxgl.NavigationControl());

    map.on('load', () => {
        
        map.addSource('campgrounds', {
            type: 'geojson',
            data: campgrounds,
            cluster: true,
            clusterMaxZoom: 14, 
            clusterRadius: 50 
        });

        map.addLayer({
            id: 'clusters',
            type: 'circle',
            source: 'campgrounds',
            filter: ['has', 'point_count'],
            paint: {
                'circle-color': [
                    'step',
                    ['get', 'point_count'],
                    'rgba(178, 222, 39,0.5)',
                    10,
                    'rgba(144, 238, 144, 0.5)',
                    30,
                    '#f28cb1'
                ],
                'circle-radius': [
                    'step',
                    ['get', 'point_count'],
                    20,
                    10,
                    30,
                    30,
                    40
                ]
            }
        });

        map.addLayer({
            id: 'cluster-count',
            type: 'symbol',
            source: 'campgrounds',
            filter: ['has', 'point_count'],
            layout: {
                'text-field': ['get', 'point_count_abbreviated'],
                'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                'text-size': 12
            }
        });

        map.loadImage('/images/campfire.png', function (error, image) {
            if (error) throw error;
            map.addImage('campfire', image);
    
            map.addLayer({
                id: 'unclustered-point',
                type: 'symbol',
                source: 'campgrounds',
                filter: ['!', ['has', 'point_count']],
                layout: {
                    'icon-image': 'campfire',
                    'icon-size': 0.06
                }
            });
        });

        map.on('click', 'clusters', (e) => {
            const features = map.queryRenderedFeatures(e.point, {
                layers: ['clusters']
            });
            const clusterId = features[0].properties.cluster_id;
            map.getSource('campgrounds').getClusterExpansionZoom(
                clusterId,
                (err, zoom) => {
                    if (err) return;

                    map.easeTo({
                        center: features[0].geometry.coordinates,
                        zoom: zoom
                    });
                }
            );
        });

        map.on('click', 'unclustered-point', (e) => {
            /* console.log(e.features[0]) */
            const popText = `<a href="/campgrounds/${e.features[0].properties.id}">${e.features[0].properties.title}</a>`;
            const coordinates = e.features[0].geometry.coordinates.slice();
            
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            const popup = new mapboxgl.Popup({
                className: 'mapboxgl-popup',
                closeButton: false, 
                maxWidth: '300px' 
            })

            new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(
                    popText
                )
                .addTo(map);
        });

        map.on('mouseenter', 'clusters', () => {
            map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'clusters', () => {
            map.getCanvas().style.cursor = '';
        });
    });
