const DomParser = require('react-native-html-parser').DOMParser;

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const earthRadius = 6371; // Radius of the earth in kilometers
  const dLat = degreesToRadians(lat2 - lat1);
  const dLon = degreesToRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degreesToRadians(lat1)) *
      Math.cos(degreesToRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c;

  return distance;
}

function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

const parseGPX = (gpxData: string): void => {
  const parser = new DomParser();
  const xmlDoc = parser.parseFromString(gpxData, 'text/xml');

  const trackNodes = xmlDoc.getElementsByTagName('trk');

  let totalDistance = 0;

  for (let i = 0; i < trackNodes.length; i++) {
    const trackPoints = trackNodes[i].getElementsByTagName('trkpt');
    let trackDistance = 0;

    for (let j = 0; j < trackPoints.length - 1; j++) {
      const point1 = trackPoints[j];
      const point2 = trackPoints[j + 1];

      const lat1 = parseFloat(point1.getAttribute('lat')!);
      const lon1 = parseFloat(point1.getAttribute('lon')!);
      const lat2 = parseFloat(point2.getAttribute('lat')!);
      const lon2 = parseFloat(point2.getAttribute('lon')!);

      const distance = calculateDistance(lat1, lon1, lat2, lon2);
      trackDistance += distance;
    }

    console.log(`Track ${i + 1} distance: ${trackDistance.toFixed(2)} km`);
    totalDistance += trackDistance;
  }

  console.log(`Total distance: ${totalDistance.toFixed(2)} km`);
};

// Example usage
// const gpxData = `
// <?xml version="1.0" encoding="UTF-8"?>
// <gpx version="1.1" creator="OpenAI Assistant">
//   <metadata>
//     <name>Example GPX File</name>
//     <desc>A sample GPX file with waypoints, tracks, and routes.</desc>
//     <author>
//       <name>John Doe</name>
//       <email>johndoe@example.com</email>
//     </author>
//     <time>2023-05-27T10:00:00Z</time>
//   </metadata>
//   <trk>
//     <name>Example Track</name>
//     <trkseg>
//       <trkpt lat="-33.12514" lon="-64.31963"/>
//       <trkpt lat="-33.1251263" lon="-64.3196672"/>
//       <trkpt lat="-33.125108" lon="-64.3197111"/>
//       <trkpt lat="-33.1250903" lon="-64.3197533"/>
//       <trkpt lat="-33.1250754" lon="-64.3197909"/>
//       <trkpt lat="-33.125064" lon="-64.3198232"/>
//       <trkpt lat="-33.1250557" lon="-64.3198502"/>
//       <trkpt lat="-33.12505" lon="-64.3198725"/>
//       <trkpt lat="-33.1250461" lon="-64.3198905"/>
//       <trkpt lat="-33.1250435" lon="-64.3199049"/>
//       <trkpt lat="-33.1250419" lon="-64.3199163"/>
//       <trkpt lat="-33.125095" lon="-64.3198616"/>
//       <trkpt lat="-33.1251356" lon="-64.3197923"/>
//       <trkpt lat="-33.125154" lon="-64.3197536"/>
//       <trkpt lat="-33.1251507" lon="-64.3197383"/>
//       <trkpt lat="-33.1251189" lon="-64.3197747"/>
//       <trkpt lat="-33.1250627" lon="-64.319976"/>
//       <trkpt lat="-33.124932" lon="-64.3204677"/>
//       <trkpt lat="-33.1245167" lon="-64.3206356"/>
//       <trkpt lat="-33.1239929" lon="-64.3206441"/>
//       <trkpt lat="-33.1235941" lon="-64.3199156"/>
//       <trkpt lat="-33.1235437" lon="-64.3192499"/>
//       <trkpt lat="-33.1239549" lon="-64.3185551"/>
//       <trkpt lat="-33.1241995" lon="-64.3179525"/>
//       <trkpt lat="-33.1241768" lon="-64.3177793"/>
//       <trkpt lat="-33.1241092" lon="-64.3176582"/>
//       <trkpt lat="-33.1240148" lon="-64.3175484"/>
//       <trkpt lat="-33.1239083" lon="-64.3174243"/>
//       <trkpt lat="-33.1237075" lon="-64.3171477"/>
//       <trkpt lat="-33.1236442" lon="-64.3170425"/>
//       <trkpt lat="-33.1235313" lon="-64.3168238"/>
//       <trkpt lat="-33.1233592" lon="-64.3164531"/>
//       <trkpt lat="-33.1232622" lon="-64.316247"/>
//       <trkpt lat="-33.123168" lon="-64.3160342"/>
//       <trkpt lat="-33.1230708" lon="-64.315816"/>
//       <trkpt lat="-33.1229778" lon="-64.3156076"/>
//       <trkpt lat="-33.1227924" lon="-64.3151964"/>
//       <trkpt lat="-33.122661" lon="-64.3149328"/>
//       <trkpt lat="-33.1225556" lon="-64.3147371"/>
//       <trkpt lat="-33.1224049" lon="-64.3144787"/>
//       <trkpt lat="-33.1221814" lon="-64.3141973"/>
//       <trkpt lat="-33.1220419" lon="-64.3140346"/>
//       <trkpt lat="-33.1219031" lon="-64.3138777"/>
//       <trkpt lat="-33.1216558" lon="-64.3135936"/>
//       <trkpt lat="-33.1213767" lon="-64.3132695"/>
//       <trkpt lat="-33.1211799" lon="-64.3130318"/>
//       <trkpt lat="-33.1210494" lon="-64.312871"/>
//       <trkpt lat="-33.1208932" lon="-64.3126723"/>
//       <trkpt lat="-33.1206586" lon="-64.3124551"/>
//       <trkpt lat="-33.1204918" lon="-64.3123332"/>
//       <trkpt lat="-33.1201553" lon="-64.3123762"/>
//       <trkpt lat="-33.1199713" lon="-64.312856"/>
//       <trkpt lat="-33.1198644" lon="-64.3132005"/>
//       <trkpt lat="-33.1199493" lon="-64.3133818"/>
//       <trkpt lat="-33.1201595" lon="-64.3135921"/>
//       <trkpt lat="-33.1202925" lon="-64.3136304"/>
//       <trkpt lat="-33.1203851" lon="-64.3136384"/>
//       <trkpt lat="-33.1204478" lon="-64.3136286"/>
//       <trkpt lat="-33.1204865" lon="-64.3136106"/>
//     </trkseg>
//   </trk>
// </gpx>
// `;

// parseGPX(gpxData);

export const getDistanceFromGPX = (gpxData: any) => {
  parseGPX(gpxData);
};
