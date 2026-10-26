// Payload's own emails (password reset for « Avancé » accounts) go through the same adapter as the shop's.
import { emailSender, mailFrom } from './senders.js'

export const cocoEmailAdapter = () => {
  const from = mailFrom()
  const sender = emailSender()
  return {
    name: `coco-${sender.name}`,
    defaultFromAddress: from.email,
    defaultFromName: from.name,
    sendEmail: async (message) => {
      const to = Array.isArray(message.to) ? message.to.map((t) => (typeof t === 'string' ? t : t.address)).join(', ') : typeof message.to === 'string' ? message.to : message.to?.address
      return sender.send({ to, subject: message.subject, text: message.text || '', html: message.html })
    },
  }
}
