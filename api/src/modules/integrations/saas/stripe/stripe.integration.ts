import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { EncryptionService } from '@/shared/utils/encryption.service';
import { IntegrationProvider } from 'generated/prisma';
import { SaasActionDefinition, SaasIntegration, optionalNumber, optionalString, loadRuntimePackage } from '../saas-integration.base';

@Injectable()
export class StripeIntegration extends SaasIntegration {
  provider = IntegrationProvider.STRIPE;
  protected readonly actions: SaasActionDefinition[] = [
    { key: 'list_customers', label: 'List customers', description: 'List Stripe customers.', schema: z.object({ email: optionalString, limit: optionalNumber }), parameters: this.jsonSchema({ email: { type: 'string' }, limit: { type: 'number' } }) },
    { key: 'get_customer', label: 'Get customer', description: 'Get a Stripe customer by ID.', schema: z.object({ customerId: z.string() }), parameters: this.jsonSchema({ customerId: { type: 'string' } }, ['customerId']) },
    { key: 'list_subscriptions', label: 'List subscriptions', description: 'List Stripe subscriptions.', schema: z.object({ customer: optionalString, status: optionalString, limit: optionalNumber }), parameters: this.jsonSchema({ customer: { type: 'string' }, status: { type: 'string' }, limit: { type: 'number' } }) },
    { key: 'get_subscription', label: 'Get subscription', description: 'Get a Stripe subscription.', schema: z.object({ subscriptionId: z.string() }), parameters: this.jsonSchema({ subscriptionId: { type: 'string' } }, ['subscriptionId']) },
    { key: 'list_payments', label: 'List payments', description: 'List Stripe payment intents.', schema: z.object({ customer: optionalString, limit: optionalNumber }), parameters: this.jsonSchema({ customer: { type: 'string' }, limit: { type: 'number' } }) },
    { key: 'create_refund', label: 'Create refund', description: 'Create a Stripe refund.', schema: z.object({ payment_intent: optionalString, charge: optionalString, amount: optionalNumber }), parameters: this.jsonSchema({ payment_intent: { type: 'string' }, charge: { type: 'string' }, amount: { type: 'number' } }) },
  ];

  constructor(prisma: PrismaService, encryption: EncryptionService) { super(prisma, encryption); }
  protected requiredConfigKeys() { return ['secretKey']; }

  protected async executeValidatedTool(actionKey: string, input: Record<string, any>, config: Record<string, any>) {
    const Stripe = (await loadRuntimePackage('stripe')).default;
    const client: any = new Stripe(config.secretKey);
    const actions: Record<string, () => Promise<any>> = {
      list_customers: () => client.customers.list(input),
      get_customer: () => client.customers.retrieve(input.customerId),
      list_subscriptions: () => client.subscriptions.list(input),
      get_subscription: () => client.subscriptions.retrieve(input.subscriptionId),
      list_payments: () => client.paymentIntents.list(input),
      create_refund: () => client.refunds.create(input),
    };
    return { success: true, data: await actions[actionKey]() };
  }
}
