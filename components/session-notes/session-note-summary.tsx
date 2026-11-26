import type { SessionNote } from "@/lib/session-notes";

type SessionNoteSummaryProps = {
  note: SessionNote;
  // Counselors also see which mentor wrote it.
  showMentor?: boolean;
};

export function SessionNoteSummary({
  note,
  showMentor,
}: SessionNoteSummaryProps) {
  const about = [
    showMentor && `By ${note.mentorName}`,
    note.editedOn && `Edited on ${note.editedOn}`,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="flex flex-col gap-2">
      <div>
        <p className="font-semibold">{note.dateLabel}</p>
        {about && <p className="text-sm text-muted-foreground">{about}</p>}
      </div>
      <p className="break-words whitespace-pre-line">{note.summary}</p>
      {note.nextSteps && (
        <div>
          <p className="text-sm font-semibold text-muted-foreground">
            Next steps
          </p>
          <p className="break-words whitespace-pre-line">{note.nextSteps}</p>
        </div>
      )}
    </div>
  );
}
