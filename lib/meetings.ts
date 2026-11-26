import "server-only";
import { ObjectId, type Filter } from "mongodb";
import { requireRole } from "./auth";
import { getMeetings, getPairings, getUsers, type MeetingDocument } from "./db";
import { formatDateTime } from "./format";

// "unanswered" is a proposal whose time passed without a reply.
export type MeetingState = MeetingDocument["status"] | "unanswered";

export type Meeting = {
  id: string;
  // The other person, or the mentor when a counselor is looking.
  withName: string;
  when: string;
  location: string;
  note: string;
  state: MeetingState;
  // Still ahead, and either proposed or confirmed.
  upcoming: boolean;
  proposedByViewer: boolean;
  // Names read "you" for the person looking.
  proposedBy: string;
  // Who declined or cancelled it.
  closedBy: string;
  reason: string;
};

function isClosed(status: MeetingState) {
  return status === "declined" || status === "cancelled";
}

// What a meeting amounts to now.
function currentState(
  meeting: MeetingDocument,
  pairingEndedAt: Date | undefined,
  now: Date,
): MeetingState {
  if (isClosed(meeting.status)) return meeting.status;
  // An ended pairing takes its later meetings with it.
  if (pairingEndedAt && meeting.startsAt > pairingEndedAt) return "cancelled";
  return meeting.status === "proposed" && meeting.startsAt <= now
    ? "unanswered"
    : meeting.status;
}

// Upcoming meetings come first, soonest at the top, then the rest, newest first.
async function loadMeetings(
  filter: Filter<MeetingDocument>,
  viewerId?: string,
): Promise<Meeting[]> {
  const meetings = await getMeetings()
    .find(filter)
    .sort({ startsAt: -1 })
    .toArray();
  const pairings = await getPairings()
    .find(
      { _id: { $in: meetings.map((meeting) => meeting.pairingId) } },
      { projection: { endedAt: 1 } },
    )
    .toArray();
  const users = await getUsers()
    .find(
      {
        _id: {
          $in: meetings.flatMap((meeting) => [
            meeting.mentorId,
            meeting.menteeId,
          ]),
        },
      },
      { projection: { name: 1 } },
    )
    .toArray();
  const now = new Date();

  function nameOf(id?: ObjectId) {
    if (!id) return "";
    if (id.toString() === viewerId) return "you";
    return users.find(({ _id }) => _id.equals(id))?.name ?? "Unknown";
  }

  const list = meetings.map((meeting) => {
    const pairing = pairings.find(({ _id }) => _id.equals(meeting.pairingId));
    const state = currentState(meeting, pairing?.endedAt, now);
    const closed = isClosed(meeting.status);
    const otherId =
      meeting.mentorId.toString() === viewerId
        ? meeting.menteeId
        : meeting.mentorId;

    return {
      id: meeting._id.toString(),
      withName: nameOf(otherId),
      when: formatDateTime(meeting.startsAt),
      location: meeting.location,
      note: meeting.note,
      state,
      upcoming:
        (state === "proposed" || state === "confirmed") &&
        meeting.startsAt > now,
      proposedByViewer: meeting.proposedBy.toString() === viewerId,
      proposedBy: nameOf(meeting.proposedBy),
      closedBy: closed ? nameOf(meeting.updatedBy) : "",
      reason:
        state === "cancelled" && !closed
          ? "The pairing ended."
          : (meeting.reason ?? ""),
    };
  });

  return [
    ...list.filter((meeting) => meeting.upcoming).reverse(),
    ...list.filter((meeting) => !meeting.upcoming),
  ];
}

// A mentor's or mentee's meetings with the people they're paired with now.
export async function listMyMeetings() {
  const user = await requireRole("mentor", "mentee");
  const _id = new ObjectId(user.id);
  const pairings = await getPairings()
    .find(
      {
        ...(user.role === "mentor" ? { mentorId: _id } : { menteeId: _id }),
        status: "active",
      },
      { projection: { _id: 1 } },
    )
    .toArray();

  return loadMeetings(
    { pairingId: { $in: pairings.map((pairing) => pairing._id) } },
    user.id,
  );
}

// All of a mentee's meetings, including those from ended pairings.
export async function listMenteeMeetings(menteeId: string) {
  await requireRole("counselor", "admin");
  return loadMeetings({ menteeId: new ObjectId(menteeId) });
}
