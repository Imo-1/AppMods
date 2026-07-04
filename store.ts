import { db } from './firebase'
import {
  ref,
  push,
  set,
  get,
  onValue,
  update,
  query,
  orderByChild,
} from 'firebase/database'

export interface AppItem {
  id: string
  name: string
  description: string
  logoUrl: string
  downloadUrl: string
  category: 'app' | 'game'
  createdAt: number
  downloads: number
  ratings: Record<string, number>
}

export interface AppRequest {
  id: string
  fullName: string
  requestText: string
  createdAt: number
}

export interface RatingRecord {
  ratings: Record<string, number>
}

export async function fetchApps(): Promise<AppItem[]> {
  const snap = await get(ref(db, 'apps'))
  if (!snap.exists()) return []
  const val = snap.val() as Record<string, any>
  return Object.entries(val).map(([id, v]) => ({
    id,
    name: v.name || '',
    description: v.description || '',
    logoUrl: v.logoUrl || '',
    downloadUrl: v.downloadUrl || '',
    category: v.category === 'game' ? 'game' : 'app',
    createdAt: v.createdAt || 0,
    downloads: v.downloads || 0,
    ratings: v.ratings || {},
  }))
}

export function subscribeApps(cb: (apps: AppItem[]) => void) {
  const appsRef = ref(db, 'apps')
  return onValue(appsRef, (snap) => {
    if (!snap.exists()) {
      cb([])
      return
    }
    const val = snap.val() as Record<string, any>
    const apps: AppItem[] = Object.entries(val).map(([id, v]) => ({
      id,
      name: v.name || '',
      description: v.description || '',
      logoUrl: v.logoUrl || '',
      downloadUrl: v.downloadUrl || '',
      category: v.category === 'game' ? 'game' : 'app',
      createdAt: v.createdAt || 0,
      downloads: v.downloads || 0,
      ratings: v.ratings || {},
    }))
    apps.sort((a, b) => b.createdAt - a.createdAt)
    cb(apps)
  })
}

export async function addApp(data: Omit<AppItem, 'id' | 'createdAt' | 'downloads' | 'ratings'>) {
  const newRef = push(ref(db, 'apps'))
  const item = {
    ...data,
    createdAt: Date.now(),
    downloads: 0,
    ratings: {},
  }
  await set(newRef, item)
  return newRef.key
}

export async function deleteApp(id: string) {
  await set(ref(db, `apps/${id}`), null)
}

export async function incrementDownload(id: string, current: number) {
  await update(ref(db, `apps/${id}`), { downloads: current + 1 })
}

export async function setRating(appId: string, userId: string, stars: number) {
  await set(ref(db, `apps/${appId}/ratings/${userId}`), stars)
}

export function subscribeRequests(cb: (reqs: AppRequest[]) => void) {
  const reqRef = ref(db, 'requests')
  return onValue(reqRef, (snap) => {
    if (!snap.exists()) {
      cb([])
      return
    }
    const val = snap.val() as Record<string, any>
    const reqs: AppRequest[] = Object.entries(val).map(([id, v]) => ({
      id,
      fullName: v.fullName || '',
      requestText: v.requestText || '',
      createdAt: v.createdAt || 0,
    }))
    reqs.sort((a, b) => b.createdAt - a.createdAt)
    cb(reqs)
  })
}

export async function addRequest(fullName: string, requestText: string) {
  const newRef = push(ref(db, 'requests'))
  await set(newRef, {
    fullName,
    requestText,
    createdAt: Date.now(),
  })
  return newRef.key
}

export async function deleteRequest(id: string) {
  await set(ref(db, `requests/${id}`), null)
}

export function computeAverage(ratings: Record<string, number>): number {
  const vals = Object.values(ratings || {})
  if (vals.length === 0) return 0
  return vals.reduce((a, b) => a + b, 0) / vals.length
}

export function ratingCount(ratings: Record<string, number>): number {
  return Object.keys(ratings || {}).length
}
