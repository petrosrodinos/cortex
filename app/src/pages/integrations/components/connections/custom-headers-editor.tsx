import { Button, Input, Label, TextField } from '@heroui/react';
import { Plus, Trash2 } from 'lucide-react';
import { INTEGRATION_INPUT_CLASSNAME } from './integration-field-styles';

export type CustomHeaderPair = {
  id: string;
  key: string;
  value: string;
};

export function createCustomHeaderPair(key = '', value = ''): CustomHeaderPair {
  return { id: crypto.randomUUID(), key, value };
}

export function customHeadersFromPairs(pairs: CustomHeaderPair[]): Record<string, string> {
  return pairs.reduce<Record<string, string>>((headers, pair) => {
    const trimmedKey = pair.key.trim();
    if (!trimmedKey) return headers;
    headers[trimmedKey] = pair.value;
    return headers;
  }, {});
}

interface CustomHeadersEditorProps {
  pairs: CustomHeaderPair[];
  onChange: (pairs: CustomHeaderPair[]) => void;
}

export function CustomHeadersEditor({ pairs, onChange }: CustomHeadersEditorProps) {
  function updatePair(id: string, field: 'key' | 'value', value: string) {
    onChange(pairs.map((pair) => (pair.id === id ? { ...pair, [field]: value } : pair)));
  }

  function removePair(id: string) {
    const next = pairs.filter((pair) => pair.id !== id);
    onChange(next.length > 0 ? next : [createCustomHeaderPair()]);
  }

  function addPair() {
    onChange([...pairs, createCustomHeaderPair()]);
  }

  return (
    <div className="flex flex-col gap-2">
      <Label>Custom headers</Label>
      <div className="grid gap-2">
        {pairs.map((pair) => (
          <div key={pair.id} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] items-end gap-2">
            <TextField
              value={pair.key}
              onChange={(value) => updatePair(pair.id, 'key', value)}
              fullWidth
              className="flex flex-col gap-1"
            >
              <Label className="text-xs text-muted">Header name</Label>
              <Input
                className={INTEGRATION_INPUT_CLASSNAME}
                placeholder="X-Custom-Header"
                autoComplete="off"
              />
            </TextField>
            <TextField
              value={pair.value}
              onChange={(value) => updatePair(pair.id, 'value', value)}
              fullWidth
              className="flex flex-col gap-1"
            >
              <Label className="text-xs text-muted">Value</Label>
              <Input className={INTEGRATION_INPUT_CLASSNAME} placeholder="value" autoComplete="off" />
            </TextField>
            <Button
              type="button"
              variant="ghost"
              isIconOnly
              aria-label="Remove header"
              onPress={() => removePair(pair.id)}
              className="h-10 w-10 shrink-0 rounded-field text-muted"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button type="button" variant="secondary" onPress={addPair} className="w-full rounded-field sm:w-auto">
        <Plus className="h-4 w-4" />
        Add header
      </Button>
    </div>
  );
}
