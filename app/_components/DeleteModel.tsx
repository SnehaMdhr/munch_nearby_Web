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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-100">
      <div className="bg-white rounded-xl p-6 shadow-xl w-[320px] border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">{title}</h2>

        <p className="text-sm text-gray-600 mb-6">{description}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="
              px-4 py-2 text-sm font-medium
              rounded-xl  
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
              bg-linear-to-r from-[#E87A5D] to-[#F6B88F] 
              text-white rounded-xl 
              hover:opacity-90 disabled:opacity-50 
              transition-all shadow-lg shadow-orange-200
            "
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
