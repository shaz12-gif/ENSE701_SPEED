/* eslint-disable @typescript-eslint/no-unused-vars */
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
    <div 
      className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-xl font-semibold mb-4">
        {type === 'approve' ? 'Approve Article' : 'Reject Article'}
      </h2>
      
      <div className="mb-4 bg-gray-50 p-3 rounded">
        <h3 className="font-medium">Article Details</h3>
        <p className="text-gray-700">{article.title}</p>
        <p className="text-sm text-gray-500">by {article.authors}</p>
      </div>
      
      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium">
          {type === 'approve' 
            ? 'Comments (Optional)' 
            : 'Reason for Rejection (Required)'}
        </label>
        <textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          className="w-full border rounded p-2 h-32"
          placeholder={type === 'approve' 
            ? 'Add any comments about this article (optional)' 
            : 'Please provide a reason for rejection'}
          required={type === 'reject'}
        />
        {type === 'reject' && !notes.trim() && (
          <p className="text-sm text-red-500 mt-1">
            Please provide a reason for rejection
          </p>
        )}
      </div>
      
      <div className="flex justify-end space-x-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCancel();
          }}
          className="px-4 py-2 border rounded hover:bg-gray-100"
          type="button"
        >
          Cancel
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onConfirm();
          }}
          disabled={isLoading || (type === 'reject' && !notes.trim())}
          className={`py-2 px-4 rounded text-white ${
            type === 'approve' 
              ? 'bg-green-500 hover:bg-green-600' 
              : 'bg-red-500 hover:bg-red-600'
          } disabled:opacity-50`}
          type="button"
        >
          {isLoading ? 'Processing...' : type === 'approve' ? 'Approve' : 'Reject'}
        </button>
      </div>
    </div>
  );
}