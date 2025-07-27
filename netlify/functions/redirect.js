const { initializeApp, getApps } = require('firebase/app');
const { getFirestore, doc, getDoc, updateDoc, increment, collection, query, where, getDocs } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

exports.handler = async (event, context) => {
  const { code } = event.queryStringParameters;
  
  if (!code) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Short code is required' })
    };
  }

  try {
    const docRef = doc(db, 'shortUrls', code);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return {
        statusCode: 302,
        headers: {
          Location: '/?error=not-found'
        }
      };
    }

    const data = docSnap.data();
    
    // Increment click count
    try {
      const userLinksQuery = query(
        collection(db, 'users', data.userId, 'links'),
        where('shortCode', '==', code)
      );
      
      const userLinksSnapshot = await getDocs(userLinksQuery);
      
      if (!userLinksSnapshot.empty) {
        const linkDoc = userLinksSnapshot.docs[0];
        await updateDoc(linkDoc.ref, {
          clickCount: increment(1)
        });
      }
    } catch (error) {
      console.error('Error incrementing click count:', error);
    }
    
    return {
      statusCode: 302,
      headers: {
        Location: data.originalUrl
      }
    };
  } catch (error) {
    console.error('Error in redirect function:', error);
    return {
      statusCode: 302,
      headers: {
        Location: '/?error=server-error'
      }
    };
  }
};