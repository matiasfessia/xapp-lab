import SQLite from 'react-native-sqlite-storage';

// Función para abrir y configurar la base de datos SQLite
async function openDatabase() {
  const db = await SQLite.openDatabase({
    name: 'mydatabase.db',
    location: 'default',
  });
  return db;
}

// Función para crear la tabla de registros en la base de datos
async function createTable() {
  const db = await openDatabase();

  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS records (id INTEGER PRIMARY KEY AUTOINCREMENT, startTime INTEGER, endTime INTEGER, distance REAL, gpxPath TEXT)',
        [],
        () => {
          console.log('Tabla de registros creada correctamente');
          resolve();
        },
        (_, error) => {
          console.error('Error al crear la tabla de registros:', error);
          reject(error);
        },
      );
    });
  });
}

// Función para insertar un registro en la base de datos
async function insertRecord(record: Record) {
  const db = await openDatabase();

  return new Promise<number>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO records (startTime, endTime, distance, gpxPath) VALUES (?, ?, ?, ?)',
        [record.startTime, record.endTime, record.distance, record.gpxPath],
        (_, { insertId }) => {
          console.log('Registro insertado correctamente con ID:', insertId);
          resolve(insertId);
        },
        (_, error) => {
          console.error('Error al insertar el registro:', error);
          reject(error);
        },
      );
    });
  });
}

// Función para obtener todos los registros de la tabla
async function getAllRecords() {
  const db = await openDatabase();

  return new Promise<Record[]>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM records',
        [],
        (_, { rows }) => {
          const records = rows.raw() as Record[];
          console.log('Registros obtenidos correctamente:', records);
          resolve(records);
        },
        (_, error) => {
          console.error('Error al obtener los registros:', error);
          reject(error);
        },
      );
    });
  });
}

// Función para obtener un registro por ID
async function getRecordById(id: number) {
  const db = await openDatabase();

  return new Promise<Record | null>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM records WHERE id = ?',
        [id],
        (_, { rows }) => {
          const record = rows.item(0) as Record;
          console.log('Registro obtenido correctamente:', record);
          resolve(record);
        },
        (_, error) => {
          console.error('Error al obtener el registro:', error);
          reject(error);
        },
      );
    });
  });
}

// Definición de tipo para el registro
interface Record {
  id: number | null;
  startTime: number;
  endTime: number;
  distance: number;
  gpxPath: string;
}

// Ejemplo de uso
async function runExample() {
  await createTable();

  const record: Record = {
    id: null, // El ID será generado automáticamente por SQLite
    startTime: Date.now(),
    endTime: Date.now(),
    distance: 10,
    gpxPath: '/path/to/gpxFile',
  };

  await insertRecord(record);

  const allRecords = await getAllRecords();
  console.log('Todos los registros:', allRecords);

  const recordId = 1;
  const specificRecord = await getRecordById(recordId);
  console.log('Registro específico:', specificRecord);
}

runExample().catch(error => console.error('Error en la operación:', error));
