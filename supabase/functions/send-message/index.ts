// @ts-nocheck This file is a Deno file, and I don't have the LS set up.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Filter from "https://esm.sh/bad-words@3";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

console.log("send-message running");

export interface SentMessage {
  markdown: string;
  images: string[];
  attachments: string[];
  replied?: number;
}

export type ActionPayload =
  | number
  | string
  | boolean
  | {
      __DateObject: number;
    }
  | {
      __BlobObject: string;
    }
  | ActionPayloadObject
  | Array<ActionPayload>;

interface ActionPayloadObject {
  [key: string]: ActionPayload;
}

export interface Action {
  /**
   * Service the action is dispatching to.
   */
  serviceId: number;

  /**
   * The data associated with the action
   */
  data: ActionPayload;
}

export type SentMessageEvent = SentMessage | { action: Action };

export interface SendMessageResponse {
  profane: boolean;
  sent: boolean;
  webhooksPending: boolean;
}

serve(async (req) => {
  try {
    const requestPayload = (await req.json()) as SentMessageEvent;
    const client = createClient(
      // Supabase API URL - env var exported by default.
      Deno.env.get("SUPABASE_URL") ?? "",
      // Supabase API ANON KEY - env var exported by default.
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
      // Authorization headers are *not applied* --- users usually can't add
      // messages, so all validation has to be done here.
    );
    const filter = new Filter();

    return new Response(JSON.stringify({ user, data }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }
});

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
