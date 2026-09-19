import { isTodo } from "@/config/site";

/**
 * Zobrazí hodnotu, nebo – pokud chybí – zřetelný placeholder „TODO: DOPLNIT“.
 */
export function TodoValue({
  value,
  children,
}: {
  value: string;
  children?: (value: string) => React.ReactNode;
}) {
  if (isTodo(value)) {
    return <span className="todo">{value.replace(/^TODO:\s*/i, "TODO: ")}</span>;
  }
  return <>{children ? children(value) : value}</>;
}
