import { ObjectId } from 'mongodb'

export const isValidObjectId = (id: string): boolean => {
  return ObjectId.isValid(id)
}

export const toObjectId = (id: string): ObjectId | null => {
  if (!isValidObjectId(id)) return null
  return new ObjectId(id)
}

export const objectIdToString = (id: ObjectId | undefined): string | undefined => {
  return id?.toString()
}

