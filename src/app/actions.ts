// app/actions.ts
"use server";

import { revalidatePath } from 'next/cache';
import { db } from '@/db';
import { activities } from '@/db/schema';
import { eq } from 'drizzle-orm';

// READ: Mengambil semua aktivitas, tanpa filter user
export async function getActivities() {
    return db.query.activities.findMany({
        orderBy: (activities, { desc }) => [desc(activities.startTime)],
    });
}

// CREATE: Membuat aktivitas baru
export async function createActivity(data: { 
  title: string; 
  category: string; 
  userId: string;
  startTime?: Date;
  endTime?: Date;
}) {
    const activityData: any = {
        title: data.title,
        category: data.category,
        userId: data.userId
    };
    
    // Add custom times if provided
    if (data.startTime) {
        activityData.startTime = data.startTime;
    }
    if (data.endTime) {
        activityData.endTime = data.endTime;
    }
    
    await db.insert(activities).values(activityData);
    revalidatePath('/'); // Path utama sekarang adalah '/'
}

// UPDATE: Memperbarui aktivitas berdasarkan ID
export async function updateActivity(id: string, data: { 
  title?: string; 
  category?: string; 
  userId?: string; 
  startTime?: Date;
  endTime?: Date | null;
}) {
    // Filter out null values from the update data
    const updateData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== null)
    );
    
    // If endTime is explicitly set to null, we need to handle it specially
    if ('endTime' in data && data.endTime === null) {
        // For resuming activity, we remove the endTime by setting it to null
        await db.update(activities)
            .set({ ...updateData, endTime: null })
            .where(eq(activities.id, id));
    } else {
        await db.update(activities)
            .set(updateData)
            .where(eq(activities.id, id));
    }
    
    revalidatePath('/');
}

// DELETE: Menghapus aktivitas berdasarkan ID
export async function deleteActivity(id: string) {
    await db.delete(activities)
        .where(eq(activities.id, id));
    revalidatePath('/');
}