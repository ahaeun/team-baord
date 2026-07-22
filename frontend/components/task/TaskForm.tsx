interface TaskFormProps {
  projectId: string;
  onSubmit: (input: { title: string; description?: string; assignee?: string; dueDate?: string }) => void;
}

export function TaskForm({ projectId, onSubmit }: TaskFormProps) {
  // TODO: implement
  return null;
}
