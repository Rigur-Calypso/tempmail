export function EmptyState() {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">📭</span>
        </div>
        <p className="text-gray-400 font-medium">No emails yet</p>
        <p className="text-gray-600 text-sm mt-1">
          Send an email to your temporary address to see it here
        </p>
      </div>
    )
  }