
	mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/dark-v10',
        center: [-103.5917, 40.6699],
        zoom: 3.85,
        minZoom: 2
    });

    map.addControl(new mapboxgl.NavigationControl());


    map.on('load', () => {
        
        // Add a new source from our GeoJSON data and
        // set the 'cluster' option to true. GL-JS will
        // add the point_count property to your source data.
        map.addSource('campgrounds', {
            type: 'geojson',
            // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
            // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
            data: campgrounds,
            cluster: true,
            clusterMaxZoom: 14, // Max zoom to cluster points on
            clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
        });

        map.addLayer({
            id: 'clusters',
            type: 'circle',
            source: 'campgrounds',
            filter: ['has', 'point_count'],
            paint: {
                // Use step expressions (https://docs.mapbox.com/style-spec/reference/expressions/#step)
                // with three steps to implement three types of circles:
                //   * Blue, 20px circles when point count is less than 100
                //   * Yellow, 30px circles when point count is between 100 and 750
                //   * Pink, 40px circles when point count is greater than or equal to 750
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
    
            // Add a symbol layer for the unclustered points
            map.addLayer({
                id: 'unclustered-point',
                type: 'symbol',
                source: 'campgrounds',
                filter: ['!', ['has', 'point_count']],
                layout: {
                    'icon-image': 'campfire',
                    'icon-size': 0.06 // Adjust the size as needed
                }
            });
        });

        // inspect a cluster on click
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

        // When a click event occurs on a feature in
        // the unclustered-point layer, open a popup at
        // the location of the feature, with
        // description HTML from its properties.
        map.on('click', 'unclustered-point', (e) => {
            /* console.log(e.features[0]) */
            const popText = `<a href="/campgrounds/${e.features[0].properties.id}">${e.features[0].properties.title}</a>`;
            const coordinates = e.features[0].geometry.coordinates.slice();
            

            // Ensure that if the map is zoomed out such that
            // multiple copies of the feature are visible, the
            // popup appears over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            const popup = new mapboxgl.Popup({
                className: 'mapboxgl-popup',
                closeButton: false, // Optionally disable the close button
                maxWidth: '300px' // Optionally set maximum width
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
