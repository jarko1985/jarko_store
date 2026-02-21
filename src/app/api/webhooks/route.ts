import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import type { User } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    return new Response(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local",
      { status: 500 }
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }
  // When user is created or updated
  if (evt.type === "user.created" || evt.type === "user.updated") {
    try {
      const data = JSON.parse(body).data as {
        id: string;
        first_name?: string | null;
        last_name?: string | null;
        primary_email_address_id?: string;
        image_url?: string | null;
        profile_image_url?: string | null;
        email_addresses?: Array<{ id: string; email_address: string }>;
      };

      // Resolve primary email (use primary_email_address_id when available)
      const primaryEmail =
        data.email_addresses?.find(
          (e) => e.id === data.primary_email_address_id
        ) ?? data.email_addresses?.[0];
      const email = primaryEmail?.email_address;

      if (!email) {
        console.error("Webhook: No email found for user", data.id);
        return new Response("Missing email", { status: 400 });
      }

      const name = [data.first_name, data.last_name]
        .filter(Boolean)
        .join(" ")
        .trim();
      const picture =
        data.image_url || data.profile_image_url || "https://www.gravatar.com/avatar?d=mp";

      const user: Partial<User> = {
        id: data.id,
        name: name || email,
        email,
        picture,
      };

      const { db } = await import("@/lib/db");
      const { clerkClient } = await import("@clerk/nextjs/server");

      const dbUser = await db.user.upsert({
        where: { email },
        update: user,
        create: {
          id: data.id,
          name: user.name!,
          email,
          picture,
          role: "USER",
        },
      });

      await clerkClient.users.updateUserMetadata(data.id, {
        publicMetadata: { role: dbUser.role },
      });
    } catch (err) {
      console.error("Webhook user.created/updated error:", err);
      return new Response("Internal error processing webhook", {
        status: 500,
      });
    }
  }

  // When user is deleted
  if (evt.type === "user.deleted") {
    // Parse the incoming event data to get the user ID
    const userId = JSON.parse(body).data.id;

    // Delete the user from the database based on the user ID
    const { db } = await import("@/lib/db");
    await db.user.delete({
      where: {
        id: userId,
      },
    });
  }

  return new Response("", { status: 200 });
}
