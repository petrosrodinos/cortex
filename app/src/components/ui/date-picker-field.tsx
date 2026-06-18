import type { DateValue } from '@internationalized/date';
import { Calendar, DateField, DatePicker, Label } from '@heroui/react';
import { formatIsoDate, parseIsoDate } from '@/lib/date';
import { cn } from '@/lib/utils';

interface DatePickerFieldProps {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  minValue?: string;
  maxValue?: string;
  className?: string;
}

function DatePickerCalendar({ label }: { label: string }) {
  return (
    <DatePicker.Popover>
      <Calendar aria-label={label}>
        <Calendar.Header>
          <Calendar.YearPickerTrigger>
            <Calendar.YearPickerTriggerHeading />
            <Calendar.YearPickerTriggerIndicator />
          </Calendar.YearPickerTrigger>
          <Calendar.NavButton slot="previous" />
          <Calendar.NavButton slot="next" />
        </Calendar.Header>
        <Calendar.Grid>
          <Calendar.GridHeader>
            {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
          </Calendar.GridHeader>
          <Calendar.GridBody>{(date) => <Calendar.Cell date={date} />}</Calendar.GridBody>
        </Calendar.Grid>
        <Calendar.YearPickerGrid>
          <Calendar.YearPickerGridBody>
            {({ year }) => <Calendar.YearPickerCell year={year} />}
          </Calendar.YearPickerGridBody>
        </Calendar.YearPickerGrid>
      </Calendar>
    </DatePicker.Popover>
  );
}

export function DatePickerField({
  label,
  value,
  onChange,
  minValue,
  maxValue,
  className,
}: DatePickerFieldProps) {
  const parsedMinValue = parseIsoDate(minValue);
  const parsedMaxValue = parseIsoDate(maxValue);

  return (
    <DatePicker
      className={cn('flex w-full flex-col gap-1.5', className)}
      value={parseIsoDate(value)}
      minValue={parsedMinValue ?? undefined}
      maxValue={parsedMaxValue ?? undefined}
      onChange={(nextValue: DateValue | null) => {
        onChange(formatIsoDate(nextValue));
      }}
    >
      <Label className="text-xs font-medium text-muted">{label}</Label>
      <DateField.Group
        fullWidth
        variant="secondary"
        className="h-10 rounded-md border border-border bg-surface shadow-none"
      >
        <DateField.Input className="text-sm">
          {(segment) => <DateField.Segment segment={segment} />}
        </DateField.Input>
        <DateField.Suffix>
          <DatePicker.Trigger className="text-muted">
            <DatePicker.TriggerIndicator />
          </DatePicker.Trigger>
        </DateField.Suffix>
      </DateField.Group>
      <DatePickerCalendar label={label} />
    </DatePicker>
  );
}
