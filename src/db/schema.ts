// db/schema.ts
import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';

export const activities = pgTable('activities', {
  id: uuid('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  userId: uuid('user_id').notNull(),
  title: text('title').notNull(),
  category: text('category'),
  startTime: timestamp('start_time', { withTimezone: true }).defaultNow().notNull(),
  endTime: timestamp('end_time', { withTimezone: true }),
});