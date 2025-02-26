import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../../@types/supabase";
import { Subscribable } from "../NetworkBackend";

export function normalizeJoin<T>(value: T[] | T | null): T[] {
  const cleanedValue = value ?? [];
  return Array.isArray(cleanedValue) ? cleanedValue : [cleanedValue];
}

export type ConversationSupabaseClient = SupabaseClient<Database>;

export function promiseFromSubscribable<T>(subscribable: Subscribable<T>) {
  return new Promise<NonNullable<T>>((resolve, reject) => {
    const unsubscribe = subscribable.subscribe(({ value, error }) => {
      if (error) {
        reject(error);
      } else if (value !== null && value !== undefined) {
        resolve(value);
      }
      unsubscribe();
    });
  });
}

export function nullablePromiseFromSubscribable<T>(
  subscribable: Subscribable<T>
) {
  return new Promise<T>((resolve, reject) => {
    const unsubscribe = subscribable.subscribe(({ value, error }) => {
      if (error) {
        reject(error);
      } else {
        resolve(value);
      }
      unsubscribe();
    });
  });
}
