import "server-only";
import { ObjectId, type Filter, type WithId } from "mongodb";
import { requireRole } from "./auth";
import {
  getPairings,
  getUsers,
  type PairingDocument,
  type UserDocument,
} from "./db";
import { formatDate } from "./format";
import type { PairingOutcome } from "./pairing-schema";

// The only details a paired mentor and mentee see about each other.
const CONTACT_FIELDS = {
  name: 1,
  email: 1,
  phone: 1,
  city: 1,
  mohalla: 1,
  itsId: 1,
} as const;

export type Partner = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  mohalla: string;
  itsId: string;
  since: string;
};

// A pairing as counselors and admins see it.
export type PairingRecord = {
  id: string;
  mentorId: string;
  mentorName: string;
  menteeId: string;
  menteeName: string;
  state: "active" | PairingOutcome;
  startedOn: string;
  endedOn: string;
  note: string;
};

function toPartner(user: WithId<UserDocument>, since: Date): Partner {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    phone: user.phone ?? "",
    city: user.city ?? "",
    mohalla: user.mohalla ?? "",
    itsId: user.itsId ?? "",
    since: formatDate(since),
  };
}

// The people on the other side of someone's active pairings.
async function activePartners(
  filter: Filter<PairingDocument>,
  partnerKey: "mentorId" | "menteeId",
) {
  const pairings = await getPairings()
    .find({ ...filter, status: "active" })
    .sort({ startedAt: 1 })
    .toArray();
  const users = await getUsers()
    .find(
      { _id: { $in: pairings.map((pairing) => pairing[partnerKey]) } },
      { projection: CONTACT_FIELDS },
    )
    .toArray();

  return pairings.flatMap((pairing) => {
    const user = users.find(({ _id }) => _id.equals(pairing[partnerKey]));
    return user ? [toPartner(user, pairing.startedAt)] : [];
  });
}

export async function listMyMentees() {
  const { id } = await requireRole("mentor");
  return activePartners({ mentorId: new ObjectId(id) }, "menteeId");
}

export async function getMyMentor() {
  const { id } = await requireRole("mentee");
  const [mentor] = await activePartners(
    { menteeId: new ObjectId(id) },
    "mentorId",
  );
  return mentor ?? null;
}

// All pairings, or one person's. Active ones come first, then the newest.
export async function listPairings(
  person: { mentorId?: string; menteeId?: string } = {},
): Promise<PairingRecord[]> {
  await requireRole("counselor", "admin");

  const filter: Filter<PairingDocument> = {};
  if (person.mentorId) filter.mentorId = new ObjectId(person.mentorId);
  if (person.menteeId) filter.menteeId = new ObjectId(person.menteeId);
  const pairings = await getPairings()
    .find(filter)
    .sort({ status: 1, startedAt: -1 })
    .toArray();

  const users = await getUsers()
    .find(
      {
        _id: {
          $in: pairings.flatMap((pairing) => [
            pairing.mentorId,
            pairing.menteeId,
          ]),
        },
      },
      { projection: { name: 1 } },
    )
    .toArray();
  const names = new Map(users.map((user) => [user._id.toString(), user.name]));

  return pairings.map((pairing) => {
    const mentorId = pairing.mentorId.toString();
    const menteeId = pairing.menteeId.toString();
    return {
      id: pairing._id.toString(),
      mentorId,
      mentorName: names.get(mentorId) ?? "Unknown",
      menteeId,
      menteeName: names.get(menteeId) ?? "Unknown",
      state:
        pairing.status === "active"
          ? "active"
          : (pairing.outcome ?? "ended_early"),
      startedOn: formatDate(pairing.startedAt),
      endedOn: formatDate(pairing.endedAt),
      note: pairing.note ?? "",
    };
  });
}
