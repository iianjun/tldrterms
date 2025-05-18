import DeleteAccountModal from "@/components/account/general/DeleteAccountModal";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangleIcon } from "lucide-react";

export default function AccoutnDeletion() {
  return (
    <>
      <Card className="bg-muted py-4">
        <CardHeader className="border-b pb-4">
          <CardTitle variant="h2">Delete account</CardTitle>
          <CardDescription>
            Permanently delete your account and all associated data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangleIcon className="h-4 w-4" />
            <AlertTitle>Warning: This action cannot be undone</AlertTitle>
            <AlertDescription>
              Deleting your account will permanently remove all of your data,
              including previous terms and conditions analyses, settings, and
              personal information.
            </AlertDescription>
          </Alert>
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">
              Once you delete your account, there is no going back. This action:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Permanently deletes all your personal information</li>
              <li>Removes all your terms and conditions analyses</li>
            </ul>
          </div>
          <DeleteAccountModal />
        </CardContent>
      </Card>
    </>
  );
}
