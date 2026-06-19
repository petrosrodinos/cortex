import { SmtpService } from './smtp.service';

describe('SmtpService', () => {
  it('decodes base64 attachments before sending email', async () => {
    const sendMail = jest.fn().mockResolvedValue({ messageId: 'message-id' });
    const service = new SmtpService({ sendMail }, 'sender@example.com');
    const fileBuffer = Buffer.from([0x50, 0x4b, 0x03, 0x04]);

    await service.sendEmailWithAttachments({
      to: 'petros@gmail.com',
      subject: 'Active Members List',
      body: 'Attached is the active members list.',
      attachments: [
        {
          filename: 'members.xlsx',
          content: fileBuffer.toString('base64'),
          encoding: 'base64',
          contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
      ],
    });

    expect(sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        attachments: [
          expect.objectContaining({
            filename: 'members.xlsx',
            content: fileBuffer,
            contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          }),
        ],
      }),
    );
  });
});
