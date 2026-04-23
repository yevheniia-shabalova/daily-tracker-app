/**
 * Example implementation of a Firestore database backend
 * This shows how to implement the IDatabase interface for a different database
 * 
 * To use this:
 * 1. Install Firebase: npm install firebase
 * 2. Replace the getDatabase() export in lib/db/index.ts with this implementation
 * 3. Configure Firebase credentials in your environment
 */

import type { Tracker, TrackerCategory } from '@daily-tracker/core'
import type { IDatabase } from './types'

// TODO: Import Firebase modules
// import { initializeApp } from 'firebase/app'
// import {
//   getFirestore,
//   collection,
//   getDocs,
//   addDoc,
//   updateDoc,
//   deleteDoc,
//   doc,
//   setDoc,
//   getDoc,
// } from 'firebase/firestore'

/**
 * Example: Firestore Database Implementation
 */
export class FirestoreDatabase implements IDatabase {
  private db: any // firestore.Firestore
  private userId: string

  constructor(userId: string) {
    this.userId = userId
  }

  async init(): Promise<void> {
    // TODO: Initialize Firebase
    // const app = initializeApp(firebaseConfig)
    // this.db = getFirestore(app)
  }

  // Habits
  async getHabits(): Promise<Tracker[]> {
    // TODO: Implement
    // const habitsRef = collection(this.db, `users/${this.userId}/habits`)
    // const snapshot = await getDocs(habitsRef)
    // return snapshot.docs.map(doc => doc.data() as Tracker)
    return []
  }

  async addHabit(habit: Tracker): Promise<void> {
    // TODO: Implement
    // const habitsRef = collection(this.db, `users/${this.userId}/habits`)
    // await addDoc(habitsRef, habit)
  }

  async updateHabit(id: string, updates: Partial<Tracker>): Promise<void> {
    // TODO: Implement
    // const habitRef = doc(this.db, `users/${this.userId}/habits/${id}`)
    // await updateDoc(habitRef, updates)
  }

  async deleteHabit(id: string): Promise<void> {
    // TODO: Implement
    // const habitRef = doc(this.db, `users/${this.userId}/habits/${id}`)
    // await deleteDoc(habitRef)
  }

  // Categories
  async getCategories(): Promise<TrackerCategory[]> {
    // TODO: Implement
    // const docRef = doc(this.db, `users/${this.userId}/meta/categories`)
    // const docSnap = await getDoc(docRef)
    // return docSnap.exists()
    //   ? (docSnap.data().categories as TrackerCategory[])
    //   : ['Health', 'Mind', 'Fitness', 'Lifestyle']
    return ['Health', 'Mind', 'Fitness', 'Lifestyle']
  }

  async setCategories(categories: TrackerCategory[]): Promise<void> {
    // TODO: Implement
    // const docRef = doc(this.db, `users/${this.userId}/meta/categories`)
    // await setDoc(docRef, { categories })
  }

  // Completions
  async getCompletions(): Promise<Record<string, Record<string, boolean>>> {
    // TODO: Implement
    // const docRef = doc(this.db, `users/${this.userId}/meta/completions`)
    // const docSnap = await getDoc(docRef)
    // return docSnap.exists()
    //   ? (docSnap.data().completions as Record<string, Record<string, boolean>>)
    //   : {}
    return {}
  }

  async updateCompletion(date: string, habitId: string, completed: boolean): Promise<void> {
    // TODO: Implement - could use a subcollection or single document with nested data
    // const docRef = doc(this.db, `users/${this.userId}/meta/completions`)
    // const docSnap = await getDoc(docRef)
    // const completions = docSnap.exists() ? docSnap.data().completions : {}
    // completions[date] = { ...completions[date], [habitId]: completed }
    // await setDoc(docRef, { completions })
  }

  async deleteCompletionsForHabit(habitId: string): Promise<void> {
    // TODO: Implement
    // const docRef = doc(this.db, `users/${this.userId}/meta/completions`)
    // const docSnap = await getDoc(docRef)
    // if (docSnap.exists()) {
    //   const completions = docSnap.data().completions
    //   Object.keys(completions).forEach(date => {
    //     delete completions[date][habitId]
    //   })
    //   await setDoc(docRef, { completions })
    // }
  }

  async clear(): Promise<void> {
    // TODO: Implement - delete all user data
    // Note: You might want to add a confirmation dialog in the UI first
  }
}

/**
 * Example: REST API Database Implementation
 * 
 * This could be used with any REST API backend (Node.js, Django, etc.)
 */
export class RestAPIDatabase implements IDatabase {
  private apiUrl: string
  private userId: string
  private authToken: string

  constructor(apiUrl: string, userId: string, authToken: string) {
    this.apiUrl = apiUrl
    this.userId = userId
    this.authToken = authToken
  }

  async init(): Promise<void> {
    // Verify connection to API
    // const response = await fetch(`${this.apiUrl}/health`, {
    //   headers: { Authorization: `Bearer ${this.authToken}` }
    // })
    // if (!response.ok) throw new Error('API connection failed')
  }

  async getHabits(): Promise<Tracker[]> {
    // const response = await fetch(`${this.apiUrl}/habits`, {
    //   headers: { Authorization: `Bearer ${this.authToken}` }
    // })
    // return response.json()
    return []
  }

  async addHabit(habit: Tracker): Promise<void> {
    // await fetch(`${this.apiUrl}/habits`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: `Bearer ${this.authToken}`
    //   },
    //   body: JSON.stringify(habit)
    // })
  }

  async updateHabit(id: string, updates: Partial<Tracker>): Promise<void> {
    // await fetch(`${this.apiUrl}/habits/${id}`, {
    //   method: 'PUT',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: `Bearer ${this.authToken}`
    //   },
    //   body: JSON.stringify(updates)
    // })
  }

  async deleteHabit(id: string): Promise<void> {
    // await fetch(`${this.apiUrl}/habits/${id}`, {
    //   method: 'DELETE',
    //   headers: { Authorization: `Bearer ${this.authToken}` }
    // })
  }

  // ... implement other methods similarly
  async getCategories(): Promise<TrackerCategory[]> {
    return ['Health', 'Mind', 'Fitness', 'Lifestyle']
  }

  async setCategories(categories: TrackerCategory[]): Promise<void> {}
  async getCompletions(): Promise<Record<string, Record<string, boolean>>> {
    return {}
  }

  async updateCompletion(): Promise<void> {}
  async deleteCompletionsForHabit(): Promise<void> {}
  async clear(): Promise<void> {}
}
