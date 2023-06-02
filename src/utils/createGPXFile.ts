import RNFetchBlob from 'rn-fetch-blob';
import { create } from 'xmlbuilder2';

export const createGPXFile = async (trackPoints: any[]) => {
  const today = new Date().toISOString();
  const data = {
    gpx: {
      '@version': '1.1',
      '@creator': 'X-APP labs',
      metadata: {
        name: 'Simple track',
        desc: 'A sample GPX file with waypoints, tracks, and routes.',
        author: {
          name: 'Matias Fessia',
          email: 'matiasfessia@gmail.com',
        },
        time: today,
      },
      trk: [
        {
          name: 'Example Track',
          trkseg: [
            {
              trkpt: trackPoints,
            },
          ],
        },
      ],
    },
  };
  const doc = create({ version: '1.0', encoding: 'UTF-8' }, data);
  const xml = doc.end({ prettyPrint: true });

  const fileName = `track_${today}.gpx`;
  const filePath = `${RNFetchBlob.fs.dirs.DocumentDir}/${fileName}`; // /data/user/0/com.xapplab/files

  try {
    await RNFetchBlob.fs.createFile(filePath, xml, 'utf8');
    return xml;
  } catch (error) {
    console.log(error);
  }
};
