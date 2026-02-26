import { Button, modal, Skeleton } from "$lib/components/core";
import { EmailSetting, EmailTemplateType, Event, GetListEventEmailSettingsDocument } from "$lib/graphql/generated/backend/graphql";
import { useQuery } from "$lib/graphql/request";
import { ConfirmationEmailModal } from "../modals/ConfirmationEmailModal";

export function RegistrationEmails({ event }: { event: Event }) {
  const { data, loading } = useQuery(GetListEventEmailSettingsDocument, {
    variables: {
      event: event._id,
      system: true
    },
  });

  const confirmationEmailSetting = data?.listEventEmailSettings.find((i) => i.type === EmailTemplateType.PostRsvp);

  if (loading) {
    return (
      <div className="space-y-5">
        <div>
          <Skeleton animate className="h-6 w-40 mb-2" />
          <Skeleton animate className="h-4 w-full mb-1" />
          <Skeleton animate className="h-4 w-3/4" />
        </div>
        <Skeleton animate className="h-10 w-32 rounded-sm" />
      </div>
    );
  }
  
  // if (event.approval_required) return (
  //   <div className="space-y-5">
  //     <div>
  //       <h1 className="text-xl font-semibold">Registration Emails</h1>
  //       <p className="text-secondary">Customize the emails sent when a guest registers for the event and for when you approve or decline their registration..</p>
  //     </div>
  //     <div className="grid grid-cols-3 gap-2">
  //       <div className="rounded-md border border-card-border bg-card">
  //         <div className="p-3 space-y-4 bg-card">
  //           <i aria-hidden="true" className="icon-pending size-7 text-warning-400" />
  //           <div className="space-y-2">
  //             <Skeleton className="h-2.5 w-[240px]" />
  //             <Skeleton className="h-2.5 w-[96px]" />
  //           </div>
  //         </div>
  //         <div className="px-3 py-2.5">
  //           <p>Pending Approval</p>
  //         </div>
  //       </div>

  //       <div
  //         className="rounded-md border border-card-border bg-card cursor-pointer"
  //         onClick={() => modal.open(ConfirmationEmailModal, { props: { setting: confirmationEmailSetting as EmailSetting, event } })}
  //       >
  //         <div className="p-3 space-y-4 bg-card">
  //           <i aria-hidden="true" className="icon-check size-7 text-success-500" />
  //           <div className="space-y-2">
  //             <Skeleton className="h-2.5 w-[240px]" />
  //             <Skeleton className="h-2.5 w-[96px]" />
  //           </div>
  //         </div>
  //         <div className="px-3 py-2.5">
  //           <p>Going</p>
  //         </div>
  //       </div>

  //       <div className="rounded-md border border-card-border bg-card">
  //         <div className="p-3 space-y-4 bg-card">
  //           <i aria-hidden="true" className="icon-cancel size-7 text-error" />
  //           <div className="space-y-2">
  //             <Skeleton className="h-2.5 w-[240px]" />
  //             <Skeleton className="h-2.5 w-[96px]" />
  //           </div>
  //         </div>
  //         <div className="px-3 py-2.5">
  //           <p>Declined</p>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold">Registration Email</h1>
        <p className="text-secondary">Upon registration, we send guests a confirmation email that includes a calendar invite. You can add a custom message to the email.</p>
      </div>
      <Button
        variant="secondary"
        iconLeft="icon-email"
        onClick={() => modal.open(ConfirmationEmailModal, { props: { setting: confirmationEmailSetting as EmailSetting, event } })}
      >
        Customize Email
      </Button>
    </div>
  );
}
