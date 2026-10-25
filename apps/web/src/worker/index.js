// Background worker process (APP_ROLE=worker): sends queued messages after their undo window,
// expires quotes and capacity holds, runs nightly retention. Implemented in milestone M2 (ordering).
import { getPayload } from 'payload'
import config from '../payload.config.js'

const payload = await getPayload({ config })
payload.logger.info('Coco Vanille worker started (stub).')
