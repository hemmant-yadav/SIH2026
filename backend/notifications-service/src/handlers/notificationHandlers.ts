import { SNSRepository } from '../repositories/snsRepository';
import { createSurplusAlert } from '../domain/notificationDispatcher';

const snsRepo = new SNSRepository();

export const sendSurplusAlertHandler = async (event: any) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const { itemName, quantityKg, facilityName } = body;

    const alert = createSurplusAlert(itemName || 'Surplus Food', quantityKg || 1, facilityName || 'Kitchen #1');
    const success = await snsRepo.publishAlert(alert.subject, alert.body);

    return {
      statusCode: success ? 200 : 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success, alert }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Notification failed' }),
    };
  }
};
