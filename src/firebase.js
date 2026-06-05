import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: 'AIzaSyAI9BID-P5sofWM5qQTMqxyw7OgdIGYlIo',
  authDomain: 'kremala-1ab94.firebaseapp.com',
  databaseURL: 'https://kremala-1ab94-default-rtdb.firebaseio.com',
  projectId: 'kremala-1ab94',
  storageBucket: 'kremala-1ab94.firebasestorage.app',
  messagingSenderId: '1036102325801',
  appId: '1:1036102325801:web:4a4a823a43bc8d9a60ae38',
}

const app = initializeApp(firebaseConfig)
export const db = getDatabase(app)
