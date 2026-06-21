import {
  isWidgetFollowUpRequest,
  isWidgetRequest,
} from './widget-request.utils';

describe('widget-request.utils', () => {
  it('detects widget requests', () => {
    expect(isWidgetRequest('create a widget with sliders for sales')).toBe(true);
    expect(isWidgetRequest('list organization members')).toBe(false);
  });

  it('detects widget follow-up requests', () => {
    expect(isWidgetFollowUpRequest('make it into a widget')).toBe(true);
    expect(isWidgetFollowUpRequest('turn that into an interactive dashboard')).toBe(true);
    expect(isWidgetFollowUpRequest('create a widget from scratch with sliders')).toBe(false);
  });
});
