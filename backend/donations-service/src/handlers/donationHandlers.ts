import { parseVoiceInput } from '../domain/voiceParser';
import { evaluateFreshnessSafety } from '../domain/freshnessEvaluator';
import { S3Repository } from '../repositories/s3Repository';
import { BedrockRepository } from '../repositories/bedrockRepository';
import { DonationRepository } from '../repositories/donationRepository';
import { DonationItem, WasteLogEntry } from '@messmind/shared-types';

const s3Repo = new S3Repository();
const bedrockRepo = new BedrockRepository();
const donationRepo = new DonationRepository();

export const getPresignedUploadUrlHandler = async (event: any) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const { fileName = `donation-${Date.now()}.jpg`, contentType = 'image/jpeg' } = body;
    const key = `photos/${Date.now()}-${fileName}`;

    const uploadUrl = await s3Repo.createPresignedUploadUrl(key, contentType);
    const publicUrl = s3Repo.getPublicUrl(key);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uploadUrl, key, publicUrl }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Failed to generate upload URL' }),
    };
  }
};

export const logWasteHandler = async (event: any) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const { facilityId = 'campus-dining-1', textInput } = body;

    const parsed = parseVoiceInput(textInput || '');
    if (!parsed.isValid) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Text input could not be parsed' }),
      };
    }

    const logEntry: WasteLogEntry = {
      id: `waste-${Date.now()}`,
      facilityId,
      date: new Date().toISOString(),
      itemName: parsed.itemName,
      quantityKg: parsed.quantityKg,
      source: 'voice_transcription',
    };

    await donationRepo.saveWasteLog(logEntry);

    return {
      statusCode: 201,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logEntry),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Failed to log waste entry' }),
    };
  }
};

export const analyzeFreshnessHandler = async (event: any) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const { imageBase64, mediaType } = body;

    if (!imageBase64) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing imageBase64 in request' }),
      };
    }

    const inference = await bedrockRepo.analyzeFoodImage(imageBase64, mediaType);
    const evaluation = evaluateFreshnessSafety(inference.score, inference.shelfLifeHours, inference.summary);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(evaluation),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Freshness evaluation failed' }),
    };
  }
};

export const createDonationHandler = async (event: any) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const donation: DonationItem = {
      id: `donation-${Date.now()}`,
      facilityId: body.facilityId || 'campus-dining-1',
      name: body.name,
      quantityKg: body.quantityKg,
      category: body.category || 'Prepared Meals',
      photoS3Key: body.photoS3Key,
      photoUrl: body.photoUrl,
      freshness: body.freshness,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    await donationRepo.saveDonation(donation);

    return {
      statusCode: 201,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(donation),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Failed to create donation' }),
    };
  }
};
