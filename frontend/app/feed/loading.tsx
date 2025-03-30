export default function Loading() {
  // Or a custom loading skeleton component
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-16 h-16 border-4 border-blue-500 border-solid border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
