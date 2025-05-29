interface Article {
  _id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
}

interface ModerationDialogProps {
  type: 'approve' | 'reject';
  article: Article;
  notes: string;
  onNotesChange: (notes: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

export default function ModerationDialog({
  type,
  article,
  notes,
  onNotesChange,
  onConfirm,
  onCancel,
  isLoading
}: ModerationDialogProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-lg font-bold mb-4">
          {type === 'approve' ? 'Approve Article' : 'Reject Article'}
        </h3>
        
        <p className="mb-2">
          <span className="font-semibold">Title:</span> {article.title}
        </p>
        <p className="mb-4 text-sm text-gray-600">
          <span className="font-semibold">Authors:</span> {article.authors}
        </p>
        
        <div className="mb-4">
          <label htmlFor="notes" className="block text-sm font-medium mb-1">
            Moderation Notes {type === 'reject' && <span className="text-red-500">*</span>}
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            rows={4}
            className="w-full border border-gray-300 rounded-md py-2 px-3"
            placeholder={type === 'approve' ? 'Optional notes' : 'Please provide a reason for rejection'}
            required={type === 'reject'}
          />
        </div>
        
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="border border-gray-300 bg-white text-gray-700 font-bold py-2 px-4 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading || (type === 'reject' && !notes.trim())}
            className={`font-bold py-2 px-4 rounded text-white ${
              type === 'approve' 
                ? 'bg-green-500 hover:bg-green-600' 
                : 'bg-red-500 hover:bg-red-600'
            } disabled:opacity-50`}
          >
            {isLoading ? 'Processing...' : type === 'approve' ? 'Approve' : 'Reject'}
          </button>
        </div>
      </div>
    </div>
  );
}