import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../../@types/supabase";
import { Subscribable } from "../network_definitions";

export function normalizeJoin<T>(value: T[] | T | null): T[] {
  const cleanedValue = value ?? [];
  return Array.isArray(cleanedValue) ? cleanedValue : [cleanedValue];
}

export type ConversationSupabaseClient = SupabaseClient<Database>;

export function promiseFromSubscribable<T>(subscribable: Subscribable<T>) {
  return new Promise<NonNullable<T>>((resolve, reject) => {
    const unsubscribe = subscribable.subscribe((value) => {
      if (value instanceof Error) {
        reject(value);
      } else if (value !== null && value !== undefined) {
        resolve(value);
      }
      unsubscribe();
    });
  });
}
