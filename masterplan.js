// Masterplan Interactive Map and Zone Details

document.addEventListener('DOMContentLoaded', function() {
  // Initialize Leaflet Map
  const campusMap = L.map('campus-map', {
    center: [25.4, 85.9], // Approximate coordinates for Panchmahala area
    zoom: 16,
    scrollWheelZoom: false,
    dragging: true,
    zoomControl: true
  });

  // Add OpenStreetMap tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
  }).addTo(campusMap);

  // Campus zones data
  const zones = {
    tower: {
      title: 'Library Tower',
      phase: 'Phase 1',
      description: 'The circular Library Tower is the centerpiece of the Panchmahala campus. Designed for climate-responsive learning, it provides study spaces across four levels with the iconic roof learning pavilion offering panoramic views.',
      image: 'Images/Final tower design.png',
      stats: {
        location: 'Panchmahala',
        role: 'Learning anchor',
        focus: 'Climate-responsive study',
        status: 'Design complete'
      },
      features: [
        'Reading, writing, and seminar spaces arranged for flexible learning',
        'Climate-responsive design language rooted in Panchmahala',
        'A visual anchor for the long-term campus vision',
        'Current image shown is a concept view for the tower area'
      ],
      coords: [25.4, 85.9]
    },
    hostel: {
      title: 'Hostels',
      phase: 'Phase 1',
      description: 'Residential accommodation designed for community living. Phase 1 provides basic dormitory-style housing for 20 students, with plans to expand to 200+ capacity in Phase 3.',
      image: 'Preview.png',
      stats: {
        capacity: 'Phase 1: 20 students',
        expansion: 'Phase 3: 200+ capacity',
        type: 'Shared living',
        status: 'Construction 2026-27'
      },
      features: [
        'Shared dormitory rooms',
        'Common study areas',
        'Community kitchen access',
        'Outdoor recreational spaces'
      ],
      coords: [25.401, 85.901]
    },
    kitchen: {
      title: 'Community Kitchen',
      phase: 'Phase 1',
      description: 'Central food preparation facility serving nutritious meals to residents and providing culinary education opportunities. Integrated with campus food gardens.',
      image: 'current-work-plan.png',
      stats: {
        capacity: 'Meals for 50+ people',
        garden: 'Integrated food systems',
        training: 'Culinary education space',
        status: 'Operational 2026'
      },
      features: [
        'Commercial-grade kitchen equipment',
        'Nutrition-first meal planning',
        'Garden-to-table program',
        'Culinary training workshops'
      ],
      coords: [25.399, 85.899]
    },
    amphitheatre: {
      title: 'Amphitheatre',
      phase: 'Phase 2',
      description: 'Open-air gathering space for performances, community meetings, cultural events, and outdoor classes. Accommodates 100+ people with natural acoustics.',
      image: 'current-work-plan.png',
      stats: {
        capacity: '100+ people',
        type: 'Open-air semi-circle',
        stage: 'Integrated performance area',
        status: 'Construction 2028-29'
      },
      features: [
        'Semi-circular seating arrangement',
        'Natural acoustics design',
        'Stage for performances',
        'Evening lighting systems'
      ],
      coords: [25.402, 85.898]
    },
    sports: {
      title: 'Sports Area',
      phase: 'Phase 2',
      description: 'Multi-purpose sports ground and indoor facility for physical education, team sports, yoga, and fitness training. Essential for holistic student development.',
      image: 'current-work-plan.png',
      stats: {
        outdoor: 'Multi-purpose ground',
        indoor: 'Covered sports facility',
        activities: 'Team sports, yoga, fitness',
        status: 'Construction 2028-30'
      },
      features: [
        'Football/cricket ground',
        'Basketball court',
        'Indoor sports hall',
        'Yoga and meditation area'
      ],
      coords: [25.398, 85.902]
    },
    workshop: {
      title: 'Workshop Zones',
      phase: 'Phase 2',
      description: 'Dedicated spaces for hands-on learning in crafts, technology, and agriculture. Students learn practical skills alongside academic studies.',
      image: 'current-work-plan.png',
      stats: {
        areas: 'Multiple workshop zones',
        focus: 'Craft, Tech, Agriculture',
        tools: 'Professional equipment',
        status: 'Construction 2028-30'
      },
      features: [
        'Carpentry and craft workshop',
        'Electronics and technology lab',
        'Agricultural training area',
        'Repair and maintenance bay'
      ],
      coords: [25.401, 85.898]
    },
    mobility: {
      title: 'Mobility Hub',
      phase: 'Phase 2',
      description: 'Central hub for sustainable transportation including electric shuttle pickup point, bicycle parking, and charging infrastructure. Supports the low-car campus model.',
      image: 'current-work-plan.png',
      stats: {
        shuttle: 'Electric vehicle hub',
        parking: 'Bicycle storage',
        charging: 'Solar EV charging',
        status: 'Implementation 2028-29'
      },
      features: [
        'Shuttle pickup/drop-off point',
        'Secure bicycle parking',
        'Solar charging station',
        'Waiting area with shelter'
      ],
      coords: [25.403, 85.9]
    },
    cultural: {
      title: 'Cultural Center',
      phase: 'Phase 2',
      description: 'Hub for cultural preservation activities including Kaithi script research, Magahi language documentation, oral history archiving, and exhibition spaces.',
      image: 'current-work-plan.png',
      stats: {
        archive: 'Kaithi manuscript storage',
        exhibition: 'Gallery space',
        recording: 'Oral history studio',
        status: 'Construction 2029-30'
      },
      features: [
        'Kaithi script research center',
        'Magahi language archive',
        'Exhibition gallery',
        'Recording studio for oral history'
      ],
      coords: [25.397, 85.9]
    }
  };

  // Add markers for each zone
  Object.keys(zones).forEach(zoneKey => {
    const zone = zones[zoneKey];
    const marker = L.circleMarker(zone.coords, {
      radius: 12,
      fillColor: getZoneColor(zoneKey),
      color: '#fff',
      weight: 2,
      opacity: 1,
      fillOpacity: 0.8
    }).addTo(campusMap);

    marker.bindPopup(`<strong>${zone.title}</strong><br>${zone.phase}`);
    
    marker.on('click', () => {
      updateZoneDetail(zoneKey);
      highlightZoneInList(zoneKey);
    });
  });

  // Zone list click handlers
  document.querySelectorAll('.zone-item').forEach(item => {
    item.addEventListener('click', () => {
      const zoneKey = item.dataset.zone;
      updateZoneDetail(zoneKey);
      highlightZoneInList(zoneKey);
      
      // Pan map to zone
      const zone = zones[zoneKey];
      if (zone) {
        campusMap.panTo(zone.coords);
      }
    });
  });

  // Helper function to get zone color
  function getZoneColor(zoneKey) {
    const colors = {
      tower: '#2d4a33',
      hostel: '#4a7c59',
      kitchen: '#8b6914',
      amphitheatre: '#6b8e6b',
      sports: '#c9a227',
      workshop: '#5a7a5a',
      mobility: '#7a9a7a',
      cultural: '#a08020'
    };
    return colors[zoneKey] || '#2d4a33';
  }

  // Update zone detail panel
  function updateZoneDetail(zoneKey) {
    const zone = zones[zoneKey];
    if (!zone) return;

    const detailPanel = document.getElementById('zoneDetail');
    
    detailPanel.innerHTML = `
      <div class="zone-detail-header">
        <span class="zone-phase">${zone.phase}</span>
        <h2 class="zone-detail-title">${zone.title}</h2>
      </div>
      <div class="zone-detail-body">
        <div class="zone-detail-image">
          <img src="${zone.image}" alt="${zone.title}" />
        </div>
        <div class="zone-detail-info">
          <p class="zone-description">${zone.description}</p>
          <div class="zone-stats">
            ${Object.entries(zone.stats).map(([key, value]) => `
              <div class="zone-stat">
                <span class="stat-label">${key.charAt(0).toUpperCase() + key.slice(1)}</span>
                <span class="stat-value">${value}</span>
              </div>
            `).join('')}
          </div>
          <ul class="zone-features">
            ${zone.features.map(feature => `<li>${feature}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
  }

  // Highlight zone in sidebar list
  function highlightZoneInList(zoneKey) {
    document.querySelectorAll('.zone-item').forEach(item => {
      item.classList.remove('active');
      if (item.dataset.zone === zoneKey) {
        item.classList.add('active');
      }
    });
  }

  // Handle map click to show default
  campusMap.on('click', function(e) {
    // Keep current selection or reset to tower
    if (!document.querySelector('.zone-item.active')) {
      updateZoneDetail('tower');
      highlightZoneInList('tower');
    }
  });

  // Initial load
  updateZoneDetail('tower');
});
