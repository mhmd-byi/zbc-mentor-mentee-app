import { DetailsList } from "@/components/layout/details-list";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Partner } from "@/lib/pairings";

// How to reach the person on the other side of a pairing.
export function ContactCard({ partner }: { partner: Partner }) {
  const linkClass = "font-medium text-primary underline-offset-4 hover:underline";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{partner.name}</CardTitle>
        <CardDescription>Paired since {partner.since}</CardDescription>
      </CardHeader>
      <CardContent>
        <DetailsList
          details={[
            {
              label: "Email",
              value: (
                <a href={`mailto:${partner.email}`} className={linkClass}>
                  {partner.email}
                </a>
              ),
            },
            {
              label: "Phone",
              value: partner.phone && (
                <a href={`tel:${partner.phone}`} className={linkClass}>
                  {partner.phone}
                </a>
              ),
            },
            { label: "City or area", value: partner.city },
            { label: "Mohalla", value: partner.mohalla },
            { label: "ITS ID", value: partner.itsId },
          ]}
        />
      </CardContent>
    </Card>
  );
}
