"use server";

import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import type { MeetingDocument } from "@/lib/db";
import { notifyMeeting } from "@/lib/meeting-emails";
import {
  cancelSchema,
  declineSchema,
  meetingSchema,
  meetingStart,
  type MeetingValues,
  type ReasonValues,
} from "@/lib/meeting-schema";
import {
  answerMeeting,
  cancelOpenMeeting,
  createMeeting,
} from "@/lib/meeting-service";
import { DASHBOARD_PATHS } from "@/lib/roles";
import type { FormState } from "@/lib/schemas";

const CHANGED = "This meeting has changed since you opened it. Reload the page.";

// Only mentors and mentees arrange meetings, and only their own.
async function requireMember() {
  const user = await requireRole("mentor", "mentee");
  return { id: new ObjectId(user.id), dashboard: DASHBOARD_PATHS[user.role] };
}

type Member = Awaited<ReturnType<typeof requireMember>>;

// Emails the other person and words the outcome. The change is saved either way.
async function announce(
  meeting: MeetingDocument,
  member: Member,
  done: string,
): Promise<FormState> {
  const emailed = await notifyMeeting(meeting, member.id);
  revalidatePath(member.dashboard);
  return {
    success: emailed
      ? `${done} We've emailed them.`
      : `${done} We couldn't email them, so please tell them yourself.`,
  };
}

export async function proposeMeeting(
  values: MeetingValues,
): Promise<FormState> {
  const member = await requireMember();
  const parsed = meetingSchema.safeParse(values);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { pairingId, date, time, location, note } = parsed.data;

  const meeting = ObjectId.isValid(pairingId)
    ? await createMeeting(new ObjectId(pairingId), member.id, {
        startsAt: meetingStart(date, time),
        location,
        note,
      })
    : null;
  if (!meeting) {
    return { error: "You're no longer paired with them. Reload the page." };
  }
  return announce(meeting, member, "Proposal sent.");
}

export async function confirmMeeting(meetingId: string): Promise<FormState> {
  const member = await requireMember();
  const meeting = ObjectId.isValid(meetingId)
    ? await answerMeeting(new ObjectId(meetingId), member.id, {
        status: "confirmed",
      })
    : null;
  if (!meeting) return { error: CHANGED };
  return announce(meeting, member, "Meeting confirmed.");
}

export async function declineMeeting(
  meetingId: string,
  values: ReasonValues,
): Promise<FormState> {
  const member = await requireMember();
  const parsed = declineSchema.safeParse(values);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const meeting = ObjectId.isValid(meetingId)
    ? await answerMeeting(new ObjectId(meetingId), member.id, {
        status: "declined",
        reason: parsed.data.reason,
      })
    : null;
  if (!meeting) return { error: CHANGED };
  return announce(meeting, member, "Meeting declined.");
}

export async function cancelMeeting(
  meetingId: string,
  values: ReasonValues,
): Promise<FormState> {
  const member = await requireMember();
  const parsed = cancelSchema.safeParse(values);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const meeting = ObjectId.isValid(meetingId)
    ? await cancelOpenMeeting(
        new ObjectId(meetingId),
        member.id,
        parsed.data.reason,
      )
    : null;
  if (!meeting) return { error: CHANGED };
  return announce(meeting, member, "Meeting cancelled.");
}
