import Dexie from 'dexie'
import { useLiveQuery } from 'dexie-react-hooks'

import type { EntityTable } from 'dexie'

import type { ExpenseRecord } from '@/lib/expense-metrics'

export type LocalExpenseRecord = ExpenseRecord & {
  createdAt: string
  updatedAt: string
}

export type CreateExpenseRecordInput = Omit<
  LocalExpenseRecord,
  'id' | 'createdAt' | 'updatedAt'
> & {
  id?: string
}

export type UpdateExpenseRecordInput = Partial<
  Omit<LocalExpenseRecord, 'id' | 'createdAt' | 'updatedAt'>
>

class AmortizeLocalDB extends Dexie {
  expenses!: EntityTable<LocalExpenseRecord, 'id'>

  constructor() {
    super('dayscale-local-expense-db')

    this.version(1).stores({
      expenses: 'id, categoryId, purchasedAt, createdAt, updatedAt',
    })
  }
}

export const localDb = new AmortizeLocalDB()

export async function listExpenseRecords() {
  return localDb.expenses.orderBy('updatedAt').reverse().toArray()
}

export async function getExpenseRecord(id: string) {
  return localDb.expenses.get(id)
}

export const getExpenseRecordById = getExpenseRecord

export async function createExpenseRecord(input: CreateExpenseRecordInput) {
  const timestamp = new Date().toISOString()
  const nextRecord: LocalExpenseRecord = {
    id: input.id ?? crypto.randomUUID(),
    name: input.name.trim(),
    amount: input.amount,
    purchasedAt: input.purchasedAt,
    categoryId: input.categoryId,
    note: input.note.trim(),
    image: input.image,
    createdAt: timestamp,
    updatedAt: timestamp,
  }

  await localDb.expenses.put(nextRecord)

  return nextRecord
}

export async function updateExpenseRecord(
  id: string,
  input: UpdateExpenseRecordInput,
) {
  const currentRecord = await localDb.expenses.get(id)

  if (!currentRecord) {
    throw new Error('Expense record not found')
  }

  const nextRecord: LocalExpenseRecord = {
    ...currentRecord,
    ...input,
    name: input.name?.trim() ?? currentRecord.name,
    note: input.note?.trim() ?? currentRecord.note,
    updatedAt: new Date().toISOString(),
  }

  await localDb.expenses.put(nextRecord)

  return nextRecord
}

export async function deleteExpenseRecord(id: string) {
  await localDb.expenses.delete(id)
}

export async function clearExpenseRecords() {
  await localDb.expenses.clear()
}

export function useExpenseRecords() {
  const records = useLiveQuery(async () => {
    if (typeof window === 'undefined') {
      return []
    }

    return listExpenseRecords()
  }, [])

  return records ?? []
}

export function useExpenseRecord(id?: string) {
  const record = useLiveQuery(async () => {
    if (typeof window === 'undefined' || !id) {
      return null
    }

    return getExpenseRecord(id)
  }, [id])

  return record
}
