import { FormEvent, ReactNode, useState } from 'react';
import { Button } from '../ui/Button';

export function QuickForm<T extends Record<string, string | number>>({
  title,
  fields,
  initial,
  submitLabel = 'שמירה',
  onSubmit,
  isNight = false,
}: {
  title: string;
  fields: { key: keyof T; label: string; type?: string; options?: { value: string; label: string }[]; min?: number }[];
  initial: T;
  submitLabel?: string;
  onSubmit: (value: T) => void;
  isNight?: boolean;
  footer?: ReactNode;
}) {
  const [value, setValue] = useState<T>(initial);
  const fieldClass = isNight ? 'field night-field' : 'field';

  const submit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit(value);
    setValue(initial);
  };

  return (
    <form onSubmit={submit} className={`rounded-3xl p-5 shadow-soft ${isNight ? 'border border-night-blue/15 bg-night-card' : 'border border-line bg-card'}`}>
      <h2 className="mb-4 text-xl font-extrabold">{title}</h2>
      <div className="space-y-3">
        {fields.map((field) => (
          <label key={String(field.key)} className="block">
            <span className={`mb-1 block text-sm font-bold ${isNight ? 'text-white/70' : 'text-text-muted'}`}>{field.label}</span>
            {field.options ? (
              <select
                className={fieldClass}
                value={String(value[field.key])}
                onChange={(event) => setValue((current) => ({ ...current, [field.key]: event.target.value }))}
              >
                {field.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                className={fieldClass}
                type={field.type ?? 'text'}
                min={field.min}
                value={value[field.key]}
                onChange={(event) =>
                  setValue((current) => ({
                    ...current,
                    [field.key]: field.type === 'number' ? Number(event.target.value) : event.target.value,
                  }))
                }
              />
            )}
          </label>
        ))}
      </div>
      <Button className="mt-4 w-full" variant={isNight ? 'night' : 'primary'}>{submitLabel}</Button>
    </form>
  );
}
