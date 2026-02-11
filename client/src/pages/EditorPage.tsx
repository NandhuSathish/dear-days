import { useParams } from 'react-router';

/**
 * Canvas editor page — the core editing experience.
 * Reads the journal ID from the URL and will render the Konva canvas.
 */
export default function EditorPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Journal Editor</h1>
      <p className="text-gray-500">Editing journal: {id}</p>
      <div className="mt-6 flex h-[600px] items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white">
        <p className="text-gray-400">Konva canvas will render here</p>
      </div>
    </div>
  );
}
