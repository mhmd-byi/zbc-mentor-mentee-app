"use server";

import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { notifyPairings } from "@/lib/pairing-emails";
import { endPairingSchema, type EndPairingValues } from "@/lib/pairing-schema";
import { createPairing, endPairing } from "@/lib/pairing-service";
import type { FormState } from "@/lib/schemas";

// Both actions finish on the mentee's page, which shows the notice.
function showMentee(menteeId: string, notice: string): never {
  revalidatePath("/counselor", "layout");
  redirect(`/counselor/mentees/${menteeId}?notice=${notice}`);
}

export async function assignMentor(
  menteeId: string,
  mentorId: string,
): Promise<FormState> {
  const counselor = await requireRole("counselor", "admin");
  if (!ObjectId.isValid(menteeId) || !ObjectId.isValid(mentorId)) {
    return { error: "That account no longer exists." };
  }

  const result = await createPairing(
    { mentorId: new ObjectId(mentorId), menteeId: new ObjectId(menteeId) },
    counselor.id,
  );
  if ("error" in result) return result;

  const emailed = await notifyPairings("started", [result.pairing]);
  showMentee(menteeId, emailed ? "paired" : "paired-no-email");
}

export async function closePairing(
  pairingId: string,
  _state: FormState,
  values: EndPairingValues,
): Promise<FormState> {
  const counselor = await requireRole("counselor", "admin");
  const parsed = endPairingSchema.safeParse(values);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const pairing = ObjectId.isValid(pairingId)
    ? await endPairing(
        new ObjectId(pairingId),
        parsed.data.outcome,
        parsed.data.note,
        counselor.id,
      )
    : null;
  if (!pairing) {
    return { error: "This pairing has already ended. Reload the page." };
  }

  const emailed = await notifyPairings("ended", [pairing]);
  showMentee(pairing.menteeId.toString(), emailed ? "ended" : "ended-no-email");
}
