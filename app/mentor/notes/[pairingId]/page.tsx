import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { BackLink } from "@/components/layout/back-link";
import { Loading } from "@/components/layout/loading";
import { PageHeader } from "@/components/layout/page-header";
import { AddSessionNote } from "@/components/session-notes/add-session-note";
import { EditableSessionNote } from "@/components/session-notes/editable-session-note";
import { Card, CardContent } from "@/components/ui/card";
import { todayInIndia } from "@/lib/format";
import { getMyMenteeNotes } from "@/lib/session-notes";

export const metadata: Metadata = { title: "Session notes" };

type Props = PageProps<"/mentor/notes/[pairingId]">;

export default function SessionNotesPage({ params }: Props) {
  return (
    <AppShell allowedRoles={["mentor"]}>
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <BackLink href="/mentor">Your mentees</BackLink>
        <Suspense fallback={<Loading />}>
          <Notes params={params} />
        </Suspense>
      </div>
    </AppShell>
  );
}

async function Notes({ params }: Pick<Props, "params">) {
  const { pairingId } = await params;
  const mentee = await getMyMenteeNotes(pairingId);
  if (!mentee) notFound();
  const today = todayInIndia();

  return (
    <>
      <PageHeader
        title="Session notes"
        description={`Your sessions with ${mentee.menteeName}.`}
      />
      <AddSessionNote key={pairingId} pairingId={pairingId} today={today} />
      {mentee.notes.length === 0 ? (
        <Card>
          <CardContent className="text-center text-muted-foreground">
            No notes yet. Add one after your first session.
          </CardContent>
        </Card>
      ) : (
        mentee.notes.map((note) => (
          <EditableSessionNote key={note.id} note={note} today={today} />
        ))
      )}
    </>
  );
}
