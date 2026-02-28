"use client";

import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'celula-offline-db';
const STORE_NAME = 'pending-meetings';

export interface PendingMeeting {
  id: string;
  cell_id: string;
  meeting_date: string;
  gods_presence: number;
  decisions_for_christ: number;
  offering_amount: number;
  theme: string;
  observations: string;
  attendance: Array<{
    person_id: string;
    present: boolean;
    is_visitor?: boolean;
    checkin_lat?: number;
    checkin_lng?: number;
    checkin_at?: string;
  }>;
  submitted_by: string;
  timestamp: number;
}

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
}

export async function saveMeetingOffline(meeting: PendingMeeting) {
  const db = await getDB();
  await db.put(STORE_NAME, meeting);
}

export async function getPendingMeetings(): Promise<PendingMeeting[]> {
  const db = await getDB();
  return db.getAll(STORE_NAME);
}

export async function removePendingMeeting(id: string) {
  const db = await getDB();
  await db.delete(STORE_NAME, id);
}

export async function syncMeetings(submitAction: (data: FormData) => Promise<any>) {
  if (!navigator.onLine) return;

  const pending = await getPendingMeetings();
  for (const meeting of pending) {
    try {
      const formData = new FormData();
      formData.set("cell_id", meeting.cell_id);
      formData.set("meeting_date", meeting.meeting_date);
      formData.set("gods_presence", String(meeting.gods_presence));
      formData.set("decisions_for_christ", String(meeting.decisions_for_christ));
      formData.set("offering_amount", String(meeting.offering_amount));
      formData.set("theme", meeting.theme);
      formData.set("observations", meeting.observations);
      formData.set("submitted_by", meeting.submitted_by);
      formData.set("attendance", JSON.stringify(meeting.attendance));

      await submitAction(formData);
      await removePendingMeeting(meeting.id);
    } catch (err) {
      console.error("Failed to sync meeting:", meeting.id, err);
    }
  }
}
