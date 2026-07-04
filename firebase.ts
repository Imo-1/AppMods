import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: 'AIzaSyDWh6X3zX7Du55_qV0g9yMVqfvpLZP60Hg',
  databaseURL: 'https://ibrahim-store-e701d-default-rtdb.firebaseio.com',
  projectId: 'ibrahim-store-e701d',
  storageBucket: 'ibrahim-store-e701d.firebasestorage.app',
  appId: '1:60383670450:android:a03a2537d274103ed919ab',
}

export const app = initializeApp(firebaseConfig)
export const db = getDatabase(app)
