import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import {
  assignUserToCompany,
  createUser,
  deleteUser,
  patchUser,
  removeUserFromCompany,
} from "@/db/functions/user";
import {
  createCompany,
  deleteCompany,
  updateCompany,
} from "@/db/functions/company";

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
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

  // Get the ID and type
  const { id } = evt.data;
  const eventType = evt.type;

  console.log(`Webhook with and ID of ${id} and type of ${eventType}`);
  console.log("Webhook body:", body);

  switch (eventType) {
    case "user.created": {
      const { id, email_addresses, username } = evt.data;
      await createUser({
        externalId: id,
        email: email_addresses[0].email_address,
        username: username,
      });
      break;
    }
    case "user.updated": {
      const { id, email_addresses, username } = evt.data;
      await patchUser(id, {
        email: email_addresses[0].email_address,
        username: username,
      });
      break;
    }
    case "user.deleted": {
      const { id } = evt.data;
      await deleteUser(id!);
      break;
    }
    case "organization.created": {
      const { id, name } = evt.data;
      await createCompany({
        externalId: id,
        name: name,
      });
      break;
    }
    case "organization.updated": {
      const { id, name } = evt.data;
      await updateCompany(id, {
        externalId: id,
        name: name,
      });
      break;
    }
    case "organization.deleted": {
      const { id } = evt.data;
      await deleteCompany(id!);
      break;
    }
    case "organizationMembership.created": {
      const { public_user_data, organization } = evt.data;
      await assignUserToCompany(public_user_data.user_id, organization.id);
      break;
    }
    case "organizationMembership.updated": {
      const { public_user_data, organization } = evt.data;
      await assignUserToCompany(public_user_data.user_id, organization.id);
      break;
    }
    case "organizationMembership.deleted": {
      const { public_user_data } = evt.data;
      await removeUserFromCompany(public_user_data.user_id);
      break;
    }
  }
  return new Response("", { status: 200 });
}
