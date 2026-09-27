import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

export class SNSRepository {
  private sns: SNSClient;
  private topicArn: string;

  constructor(topicArn?: string, region?: string) {
    this.sns = new SNSClient({ region: region || process.env.AWS_REGION || 'us-east-1' });
    this.topicArn = topicArn || process.env.ALERTS_TOPIC_ARN || '';
  }

  async publishAlert(subject: string, message: string): Promise<boolean> {
    if (!this.topicArn) {
      console.warn('No SNS topic ARN configured. Alert not published.');
      return false;
    }

    try {
      const command = new PublishCommand({
        TopicArn: this.topicArn,
        Subject: subject,
        Message: message,
      });
      await this.sns.send(command);
      return true;
    } catch (err) {
      console.error('Error publishing alert to SNS:', err);
      return false;
    }
  }
}
