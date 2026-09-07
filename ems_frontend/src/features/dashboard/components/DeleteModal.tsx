import { Button } from '../../../components/Button/Button.tsx'

interface DeleteModalProps {
  employeeName: string
  onConfirm: () => void
  onCancel: () => void
}

export function DeleteModal({ employeeName, onConfirm, onCancel }: DeleteModalProps) {
  return (
    <div className="flex flex-col gap-5">
      <p className="text-[15px] text-gray-700 leading-relaxed m-0">
        Are you sure you want to delete <strong className="text-slate-900">{employeeName}</strong>? This action cannot be undone.
      </p>
      <div className="flex justify-end gap-2.5">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Delete
        </Button>
      </div>
    </div>
  )
}
