import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  orderBy, 
  increment,
  updateDoc,
  where
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { nanoid } from 'nanoid';
import { ShortenedLink, PublicLink } from '@/types/link';

export class LinkService {
  static async shortenUrl(
    originalUrl: string, 
    userId: string, 
    userEmail: string, 
    customAlias?: string
  ): Promise<ShortenedLink> {
    // Generate short code
    const shortCode = customAlias || nanoid(8);
    
    // Check if custom alias already exists
    if (customAlias) {
      const existingDoc = await getDoc(doc(db, 'shortUrls', customAlias));
      if (existingDoc.exists()) {
        throw new Error('Custom alias already exists');
      }
    }

    const linkId = nanoid();
    const now = new Date();

    const shortenedLink: Omit<ShortenedLink, 'customAlias'> & { customAlias?: string } = {
      id: linkId,
      originalUrl,
      shortCode,
      clickCount: 0,
      createdAt: now,
      userId,
      userEmail
    };

    // Only add customAlias field if it exists
    if (customAlias) {
      (shortenedLink as ShortenedLink).customAlias = customAlias;
    }
    // Store in user's collection
    await setDoc(
      doc(db, 'users', userId, 'links', linkId), 
      shortenedLink
    );

    // Store public lookup
    const publicLink: PublicLink = {
      originalUrl,
      userId,
      createdAt: now
    };

    await setDoc(doc(db, 'shortUrls', shortCode), publicLink);

    return shortenedLink as ShortenedLink;
  }

  static async getUserLinks(userId: string): Promise<ShortenedLink[]> {
    const q = query(
      collection(db, 'users', userId, 'links'),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate()
    })) as ShortenedLink[];
  }

  static async getOriginalUrl(shortCode: string): Promise<string | null> {
    const docRef = doc(db, 'shortUrls', shortCode);
    const docSnap = await getDoc(docRef);
    // Handle edge case for deployment environments
    if (!shortCode || shortCode.length === 0) {
      console.log('Empty short code provided');
      return null;
    }
    
    
    if (docSnap.exists()) {
      const data = docSnap.data() as PublicLink;
      
      // Increment click count in user's collection
      try {
        const userLinksQuery = query(
          collection(db, 'users', data.userId, 'links'),
          where('shortCode', '==', shortCode)
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
        // Don't fail the redirect if click tracking fails
      }
      
      return data.originalUrl;
    }
    
    return null;
  }

  static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}