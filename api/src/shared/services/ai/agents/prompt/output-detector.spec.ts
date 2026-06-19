import { OutputType } from 'generated/prisma';
import { detectOutputType } from './output-detector';

describe('detectOutputType', () => {
  it('detects widget output from output__create_widget tool results', () => {
    const result = detectOutputType(
      'create a widget with sliders',
      'Here is your widget.',
      [
        {
          toolName: 'output__create_widget',
          output: {
            file_url: 'https://storage.example/widget.html',
            filename: 'generated-widget.html',
            document_uuid: 'doc-uuid',
            media_type: 'text/html',
          },
        },
      ],
    );

    expect(result.outputType).toBe(OutputType.WIDGET);
    expect(result.files).toEqual(['https://storage.example/widget.html']);
  });

  it('prefers widget tool results over image tool results', () => {
    const result = detectOutputType(
      'create an interactive widget',
      'Done.',
      [
        {
          toolName: 'output__create_image',
          output: { file_url: 'https://storage.example/image.png' },
        },
        {
          toolName: 'output__create_widget',
          output: { file_url: 'https://storage.example/widget.html' },
        },
      ],
    );

    expect(result.outputType).toBe(OutputType.WIDGET);
    expect(result.files).toEqual(['https://storage.example/widget.html']);
  });
});
