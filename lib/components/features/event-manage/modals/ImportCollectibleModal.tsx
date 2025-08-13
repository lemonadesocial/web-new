import { useState, useEffect } from "react";
import { OTPInput, SlotProps } from 'input-otp';
import clsx from "clsx";
import { ModalContent, modal, Button, Input, LabeledInput, toast, DropdownTags, Segment } from "$lib/components/core";
import type { Option } from "$lib/components/core/input/dropdown";
import { Event, GetPoapDropInfoByIdDocument, CheckPoapDropEditCodeDocument, ImportPoapDropDocument, PoapClaimMode, ListPoapDropsDocument } from "$lib/graphql/generated/backend/graphql";
import { useQuery, useMutation } from "$lib/graphql/request";

interface ImportCollectibleModalProps {
  event: Event;
}

export function ImportCollectibleModal({ event }: ImportCollectibleModalProps) {
  const [poapId, setPoapId] = useState<number | null>(null);
  const [editCode, setEditCode] = useState("");
  const [poapIdValid, setPoapIdValid] = useState(false);
  const [editCodeValid, setEditCodeValid] = useState(false);
  const [showClaimSettings, setShowClaimSettings] = useState(false);
  const [totalQuantity, setTotalQuantity] = useState<number | undefined>(undefined);
  const [claimableOn, setClaimableOn] = useState<'registration' | 'checkin'>('registration');
  const [selectedTicketTypes, setSelectedTicketTypes] = useState<Option[]>([]);

  const { data: poapInfo, loading: loadingPoapInfo, error: poapError } = useQuery(GetPoapDropInfoByIdDocument, {
    variables: { getPoapDropInfoByIdId: poapId! },
    skip: !poapId,
    onComplete: () => {
      setPoapIdValid(true);
    }
  });

  const { loading: loadingEditCode, error: editCodeError } = useQuery(CheckPoapDropEditCodeDocument, {
    variables: {
      code: editCode,
      checkPoapDropEditCodeId: poapId!
    },
    skip: !poapId || !editCode || editCode.length < 6,
    onComplete: (data) => {
      const isValid = data.checkPoapDropEditCode;
      setEditCodeValid(isValid);

      if (!isValid) {
        toast.error("Invalid edit code");
      }
    }
  });

  const [importPoapDrop, { loading: importLoading }] = useMutation(ImportPoapDropDocument, {
    onComplete: (client, response) => {
      if (response?.importPoapDrop) {
        const existingData = client.readQuery(ListPoapDropsDocument, { event: event._id });
        if (existingData?.listPoapDrops) {
          client.writeQuery({
            query: ListPoapDropsDocument,
            variables: { event: event._id },
            data: {
              ...existingData,
              listPoapDrops: [...existingData.listPoapDrops, response.importPoapDrop]
            }
          });
        }
        toast.success(`Collectible submitted! Guests will be able to claim it once it's live—usually within ~20 seconds.`);
        modal.close();
      }

      toast.success(`Collectible submitted! Guests will be able to claim it once it's live—usually within ~20 seconds.`);
      modal.close();
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  useEffect(() => {
    if (poapError || !poapId) {
      setPoapIdValid(false);
    }
  }, [poapError, poapId]);

  useEffect(() => {
    if (editCodeError) {
      setEditCodeValid(false);
      toast.error("Failed to verify edit code");
    }
  }, [editCodeError]);

  const handleSubmit = async () => {
    if (!poapId || !editCode.trim()) {
      return;
    }

    if (!totalQuantity) {
      toast.error("Please provide a total quantity for the collectible");
      return;
    }

    const claimMode = claimableOn === 'registration' ? PoapClaimMode.Registration : PoapClaimMode.CheckIn;
    const ticketTypeIds = selectedTicketTypes.map(option => option.key);

    await importPoapDrop({
      variables: {
        input: {
          amount: totalQuantity,
          claim_mode: claimMode,
          event: event._id,
          ticket_types: ticketTypeIds.length > 0 ? ticketTypeIds : undefined
        },
        code: editCode,
        importPoapDropId: poapId
      }
    });
  };

  const isFormValid = poapIdValid && editCodeValid;

  const ticketTypeOptions: Option[] = event.event_ticket_types?.map(ticketType => ({
    key: ticketType._id,
    value: ticketType.title,
    icon: undefined
  })) || [];

  const handleNext = () => {
    setShowClaimSettings(true);
  };

  const handleBack = () => {
    setShowClaimSettings(false);
  };

  if (showClaimSettings) {
    return (
      <ModalContent
        onClose={() => modal.close()}
        onBack={handleBack}
        title="Claim Settings"
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            {poapInfo?.getPoapDropInfoById?.image_url ? (
              <img
                src={poapInfo.getPoapDropInfoById.image_url}
                alt={poapInfo.getPoapDropInfoById.name}
                className="size-[34px] rounded-sm object-cover"
              />
            ) : (
              <div className="size-[34px] rounded-sm bg-primary/8" />
            )}
            <div>
              <p className="text-sm">{poapInfo?.getPoapDropInfoById?.name}</p>
              <p className="text-tertiary text-xs">ID: {poapId}</p>
            </div>
          </div>

          <hr className="border-t border-t-divider -mx-4" />

          <div className='flex justify-between items-center'>
            <p className='text-sm text-secondary'>Total Quantity</p>
            <Input
              value={totalQuantity}
              onChange={(e) => setTotalQuantity(e.target.valueAsNumber)}
              variant="outlined"
              className='w-[96px]'
              type='number'
            />
          </div>

          <DropdownTags
            label="Eligible Ticket Types"
            options={ticketTypeOptions}
            value={selectedTicketTypes}
            onSelect={setSelectedTicketTypes}
          />

          <div className="space-y-1.5">
            <p className="text-sm text-secondary">Claimable On</p>
            <Segment
              selected={claimableOn}
              onSelect={(item) => setClaimableOn(item.value as 'registration' | 'checkin')}
              className="w-full"
              items={[
                { label: 'Registration', value: 'registration' },
                { label: 'Check In', value: 'checkin' }
              ]}
            />
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full"
            variant="secondary"
            loading={importLoading}
          >
            Save
          </Button>
        </div>
      </ModalContent>
    );
  }

  return (
    <ModalContent
      icon="icon-download"
      onClose={() => modal.close()}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-lg">Import Collectible</p>
          <p className="text-sm text-secondary">Attach an existing POAP you've created on poap.xyz to your event.</p>
          <div className="flex items-center gap-1">
            <span className="text-tertiary text-sm">Powered by</span>
            <i className="icon-poap size-4.5" />
          </div>
        </div>

        <LabeledInput label="POAP ID">
          <div className="relative">
            <Input
              value={poapId?.toString() || ""}
              onChange={(e) => {
                const value = e.target.valueAsNumber;
                setPoapId(isNaN(value) ? null : value);
              }}
              variant="outlined"
              placeholder="Enter POAP ID"
              type="number"
              className={clsx(
                "[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-moz-number-spin-button]:appearance-none",
                poapId && {
                  'border-success': poapIdValid && !loadingPoapInfo,
                  'border-error': poapError
                }
              )}
            />
            {poapId && (
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                {loadingPoapInfo ? (
                  <i className="icon-loader animate-spin size-4 text-tertiary" />
                ) : poapIdValid && !poapError ? (
                  <i className="icon-done size-4 text-success-500" />
                ) : poapError ? (
                  <i className="icon-alert-circle size-4 text-error" />
                ) : null}
              </div>
            )}
          </div>
        </LabeledInput>

        <div className="space-y-2">
          <p className="text-sm text-secondary">Edit Code</p>
          <OTPInput
            maxLength={6}
            containerClassName={clsx(
              "group flex items-center",
              !poapIdValid && "opacity-50 pointer-events-none"
            )}
            render={({ slots }) => (
              <div className="flex gap-2 w-full">
                {slots.map((slot, idx) => (
                  <OTPSlot key={idx} {...slot} />
                ))}
              </div>
            )}
            value={editCode}
            onChange={(code) => setEditCode(code)}
            onComplete={(code) => setEditCode(code)}
            disabled={!poapIdValid}
          />
          {editCode.length === 6 && loadingEditCode && (
            <div className="flex">
              <i className="icon-dot text-warning-300" />
              <p className="text-secondary text-sm">Verifying edit code...</p>
            </div>
          )}
        </div>

        <Button
          onClick={handleNext}
          className="w-full"
          variant="secondary"
          disabled={!isFormValid}
        >
          Next
        </Button>
      </div>
    </ModalContent>
  );
}

function OTPSlot(props: SlotProps) {
  return (
    <div
      className={clsx(
        'relative flex-1 aspect-square text-lg font-medium',
        'flex items-center justify-center',
        'transition-all duration-300',
        'border rounded-sm',
        { 'border-primary': props.isActive },
      )}
    >
      {props.char !== null && <div>{props.char}</div>}
    </div>
  )
}
