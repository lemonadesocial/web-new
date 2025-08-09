import { ApplicationProfileField } from "$lib/graphql/generated/backend/graphql";
import { modal } from "$lib/components/core";
import { AddJobTitleQuestion } from "./AddJobTitleQuestion";
import { AddOrganizationQuestion } from "./AddOrganizationQuestion";
import { AddPersonalDetailsQuestion } from "./AddPersonalDetailsQuestion";
import { AddSocialProfileQuestion } from "./AddSocialProfileQuestion";
import { AddWebsiteQuestion } from "./AddWebsiteQuestion";

const FIELD_LABELS: Record<string, string> = {
  'job_title': 'Job Title',
  'company_name': 'Organization',
  'description': 'Bio',
  'location_line': 'Location',
  'pronoun': 'Pronouns',
  'website': 'Website',
  'handle_twitter': 'X (Twitter)',
  'handle_linkedin': 'LinkedIn',
  'handle_farcaster': 'Farcaster',
  'handle_instagram': 'Instagram',
  'handle_github': 'Github',
  'calendly_url': 'Calendly'
};

export function ApplicationProfileCard({ field }: { field: ApplicationProfileField; }) {
  const getFieldLabel = (fieldName: string) => {
    return FIELD_LABELS[fieldName] || fieldName;
  };

  const handleEdit = (field: ApplicationProfileField) => {
    switch (field.field) {
      case 'job_title':
        modal.open(AddJobTitleQuestion, { props: { field } });
        break;
      case 'company_name':
        modal.open(AddOrganizationQuestion, { props: { field } });
        break;
      case 'website':
        modal.open(AddWebsiteQuestion, { props: { field } });
        break;
      case 'description':
      case 'location_line':
      case 'pronoun':
        modal.open(AddPersonalDetailsQuestion, { props: { field } });
        break;
      case 'handle_twitter':
      case 'handle_linkedin':
      case 'handle_farcaster':
      case 'handle_instagram':
      case 'handle_github':
      case 'calendly_url':
        modal.open(AddSocialProfileQuestion, { props: { field } });
        break;
      default:
        break;
    }
  };

  return (
    <div className="rounded-md py-2 px-3.5 border border-card-border bg-card flex items-center gap-3">
      <div className="flex-1 min-w-0">
        <p>{field.question || getFieldLabel(field.field)}</p>
        <div className="flex items-center gap-1.5">
          <p className="text-sm text-tertiary">{getFieldLabel(field.field)}</p>
          {field.required && (
            <>
              <i className="icon-dot size-2 text-tertiary" />
              <p className="text-sm text-tertiary">Required</p>
            </>
          )}
        </div>
      </div>

      <i
        className="icon-edit-sharp size-5 text-tertiary cursor-pointer"
        onClick={() => handleEdit(field)}
      />
    </div>
  );
} 