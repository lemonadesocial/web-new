import { toast as toastifyToast, ToastOptions } from 'react-toastify';

function success(message: string, options?: ToastOptions) {
  toastifyToast(<SuccessComp message={message} />, { autoClose: false, ...options });
}

function SuccessComp({ message }: { message: string }) {
  return (
    <div className="bg-danger-600 w-full p-4 rounded text-tertiary flex gap-3 items-start">
      <i className="icon-check-circle-filled size-[20]" />
      <span className="text-md font-medium font-body w-md">{message}</span>
    </div>
  );
}

export const toast = { success };
