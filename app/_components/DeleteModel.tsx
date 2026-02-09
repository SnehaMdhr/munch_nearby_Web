interface DeleteModalProps {
  isOpen: null | boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
}: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 shadow-xl w-[320px] border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h2>

        <p className="text-sm text-gray-600 mb-6">
          {description}
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="
              px-4 py-2 text-sm font-medium
              rounded-full
              border border-gray-300
              text-gray-700
              hover:bg-gray-100
              transition
            "
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="
              px-4 py-2 text-sm font-semibold
              rounded-full
              bg-[#E87A5D] text-white
              hover:bg-[#d96a4f]
              transition
              shadow-sm
            "
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
