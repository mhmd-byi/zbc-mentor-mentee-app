import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { SessionNote } from "@/lib/session-notes";
import { SessionNoteSummary } from "./session-note-summary";

const SHOWN = 3;

type SessionNotesCardProps = {
  notes: SessionNote[];
  forCounselor?: boolean;
};

// Session notes for reading: the latest few, with older ones folded away.
export function SessionNotesCard({
  notes,
  forCounselor,
}: SessionNotesCardProps) {
  const older = notes.slice(SHOWN);

  function list(some: SessionNote[]) {
    return (
      <ul className="divide-y">
        {some.map((note) => (
          <li key={note.id} className="py-4 first:pt-0 last:pb-0">
            <SessionNoteSummary note={note} showMentor={forCounselor} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle
          className={forCounselor ? undefined : "text-lg font-semibold"}
        >
          Session notes
        </CardTitle>
        <CardDescription>
          {notes.length === 0
            ? "No notes yet."
            : forCounselor
              ? "Written by the mentor after each session."
              : "Written by your mentor."}
        </CardDescription>
      </CardHeader>
      {notes.length > 0 && (
        <CardContent className="flex flex-col gap-4">
          {list(notes.slice(0, SHOWN))}
          {older.length > 0 && (
            <details className="border-t pt-4">
              <summary className="cursor-pointer touch-manipulation font-semibold text-primary">
                Older notes ({older.length})
              </summary>
              <div className="pt-4">{list(older)}</div>
            </details>
          )}
        </CardContent>
      )}
    </Card>
  );
}
