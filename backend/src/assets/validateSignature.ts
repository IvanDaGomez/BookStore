import crypto from 'node:crypto'
export function validateSignature ({ signature, reqId, body }: 
  {signature: string, reqId: string, body: { id: string } }
) {
  const [ts, v1] = signature.split(',')

  const string = `id:${body.id};request-id:${reqId};ts:${ts.replace('ts=', '')};`
  // id:[data.id_url];request-id:[x-request-id_header];ts:[ts_header];
  const cyphedSignature = crypto
    .createHmac('sha256', process.env.MERCADOPAGO_WEBHOOKS_SECRET ?? '')
    .update(string)
    .digest('hex')

  if (cyphedSignature === v1.replace('v1=', '')) {
    return true
  }

  return false
}
