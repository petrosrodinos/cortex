import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { EncryptionService } from '@/shared/utils/encryption.service';
import { IntegrationProvider } from 'generated/prisma';
import { SaasActionDefinition, SaasIntegration, emptySchema, loadRuntimePackage, optionalNumber, optionalString } from '../saas-integration.base';
import { STRIPE_REQUIRED_CONFIG_KEYS } from './config/stripe.config';
import { StripeService } from './services/stripe.service';

const metadataSchema = z.record(z.string()).optional();

@Injectable()
export class StripeIntegration extends SaasIntegration {
  provider = IntegrationProvider.STRIPE;

  protected readonly actions: SaasActionDefinition[] = [
    // ── Customers ─────────────────────────────────────────────────────────
    {
      key: 'list_customers',
      label: 'List customers',
      description: 'List Stripe customers.',
      schema: z.object({ email: optionalString, limit: optionalNumber }),
      parameters: this.jsonSchema({ email: { type: 'string' }, limit: { type: 'number' } }),
    },
    {
      key: 'get_customer',
      label: 'Get customer',
      description: 'Get a Stripe customer by ID.',
      schema: z.object({ customerId: z.string() }),
      parameters: this.jsonSchema({ customerId: { type: 'string' } }, ['customerId']),
    },
    {
      key: 'create_customer',
      label: 'Create customer',
      description: 'Create a new Stripe customer.',
      schema: z.object({ email: optionalString, name: optionalString, phone: optionalString, description: optionalString, metadata: metadataSchema }),
      parameters: this.jsonSchema({ email: { type: 'string' }, name: { type: 'string' }, phone: { type: 'string' }, description: { type: 'string' }, metadata: { type: 'object' } }),
    },
    {
      key: 'update_customer',
      label: 'Update customer',
      description: 'Update a Stripe customer.',
      schema: z.object({ customerId: z.string(), email: optionalString, name: optionalString, phone: optionalString, description: optionalString, metadata: metadataSchema }),
      parameters: this.jsonSchema({ customerId: { type: 'string' }, email: { type: 'string' }, name: { type: 'string' }, phone: { type: 'string' }, description: { type: 'string' }, metadata: { type: 'object' } }, ['customerId']),
    },
    {
      key: 'delete_customer',
      label: 'Delete customer',
      description: 'Delete a Stripe customer.',
      schema: z.object({ customerId: z.string() }),
      parameters: this.jsonSchema({ customerId: { type: 'string' } }, ['customerId']),
    },
    {
      key: 'search_customers',
      label: 'Search customers',
      description: 'Search Stripe customers by query.',
      schema: z.object({ query: z.string(), limit: optionalNumber }),
      parameters: this.jsonSchema({ query: { type: 'string' }, limit: { type: 'number' } }, ['query']),
    },

    // ── Subscriptions ─────────────────────────────────────────────────────
    {
      key: 'list_subscriptions',
      label: 'List subscriptions',
      description: 'List Stripe subscriptions.',
      schema: z.object({ customer: optionalString, status: optionalString, limit: optionalNumber }),
      parameters: this.jsonSchema({ customer: { type: 'string' }, status: { type: 'string' }, limit: { type: 'number' } }),
    },
    {
      key: 'get_subscription',
      label: 'Get subscription',
      description: 'Get a Stripe subscription by ID.',
      schema: z.object({ subscriptionId: z.string() }),
      parameters: this.jsonSchema({ subscriptionId: { type: 'string' } }, ['subscriptionId']),
    },
    {
      key: 'create_subscription',
      label: 'Create subscription',
      description: 'Create a new Stripe subscription.',
      schema: z.object({ customer: z.string(), items: z.array(z.object({ price: z.string(), quantity: optionalNumber })), trialDays: optionalNumber, metadata: metadataSchema }),
      parameters: this.jsonSchema({ customer: { type: 'string' }, items: { type: 'array', items: { type: 'object', properties: { price: { type: 'string' }, quantity: { type: 'number' } }, required: ['price'] } }, trialDays: { type: 'number' }, metadata: { type: 'object' } }, ['customer', 'items']),
    },
    {
      key: 'update_subscription',
      label: 'Update subscription',
      description: 'Update a Stripe subscription.',
      schema: z.object({ subscriptionId: z.string(), cancelAtPeriodEnd: z.boolean().optional(), metadata: metadataSchema }),
      parameters: this.jsonSchema({ subscriptionId: { type: 'string' }, cancelAtPeriodEnd: { type: 'boolean' }, metadata: { type: 'object' } }, ['subscriptionId']),
    },
    {
      key: 'cancel_subscription',
      label: 'Cancel subscription',
      description: 'Cancel a Stripe subscription immediately or at period end.',
      schema: z.object({ subscriptionId: z.string(), immediately: z.boolean().optional() }),
      parameters: this.jsonSchema({ subscriptionId: { type: 'string' }, immediately: { type: 'boolean' } }, ['subscriptionId']),
    },

    // ── Payment Intents ───────────────────────────────────────────────────
    {
      key: 'list_payments',
      label: 'List payments',
      description: 'List Stripe payment intents.',
      schema: z.object({ customer: optionalString, limit: optionalNumber }),
      parameters: this.jsonSchema({ customer: { type: 'string' }, limit: { type: 'number' } }),
    },
    {
      key: 'get_payment',
      label: 'Get payment',
      description: 'Get a Stripe payment intent by ID.',
      schema: z.object({ paymentIntentId: z.string() }),
      parameters: this.jsonSchema({ paymentIntentId: { type: 'string' } }, ['paymentIntentId']),
    },
    {
      key: 'create_payment_intent',
      label: 'Create payment intent',
      description: 'Create a new Stripe payment intent.',
      schema: z.object({ amount: z.number(), currency: z.string(), customer: optionalString, description: optionalString, metadata: metadataSchema }),
      parameters: this.jsonSchema({ amount: { type: 'number' }, currency: { type: 'string' }, customer: { type: 'string' }, description: { type: 'string' }, metadata: { type: 'object' } }, ['amount', 'currency']),
    },
    {
      key: 'cancel_payment_intent',
      label: 'Cancel payment intent',
      description: 'Cancel a Stripe payment intent.',
      schema: z.object({ paymentIntentId: z.string() }),
      parameters: this.jsonSchema({ paymentIntentId: { type: 'string' } }, ['paymentIntentId']),
    },
    {
      key: 'confirm_payment_intent',
      label: 'Confirm payment intent',
      description: 'Confirm a Stripe payment intent.',
      schema: z.object({ paymentIntentId: z.string(), paymentMethod: optionalString }),
      parameters: this.jsonSchema({ paymentIntentId: { type: 'string' }, paymentMethod: { type: 'string' } }, ['paymentIntentId']),
    },

    // ── Charges ───────────────────────────────────────────────────────────
    {
      key: 'list_charges',
      label: 'List charges',
      description: 'List Stripe charges.',
      schema: z.object({ customer: optionalString, limit: optionalNumber }),
      parameters: this.jsonSchema({ customer: { type: 'string' }, limit: { type: 'number' } }),
    },
    {
      key: 'get_charge',
      label: 'Get charge',
      description: 'Get a Stripe charge by ID.',
      schema: z.object({ chargeId: z.string() }),
      parameters: this.jsonSchema({ chargeId: { type: 'string' } }, ['chargeId']),
    },

    // ── Refunds ───────────────────────────────────────────────────────────
    {
      key: 'create_refund',
      label: 'Create refund',
      description: 'Create a Stripe refund.',
      schema: z.object({ payment_intent: optionalString, charge: optionalString, amount: optionalNumber }),
      parameters: this.jsonSchema({ payment_intent: { type: 'string' }, charge: { type: 'string' }, amount: { type: 'number' } }),
    },
    {
      key: 'list_refunds',
      label: 'List refunds',
      description: 'List Stripe refunds.',
      schema: z.object({ charge: optionalString, payment_intent: optionalString, limit: optionalNumber }),
      parameters: this.jsonSchema({ charge: { type: 'string' }, payment_intent: { type: 'string' }, limit: { type: 'number' } }),
    },
    {
      key: 'get_refund',
      label: 'Get refund',
      description: 'Get a Stripe refund by ID.',
      schema: z.object({ refundId: z.string() }),
      parameters: this.jsonSchema({ refundId: { type: 'string' } }, ['refundId']),
    },

    // ── Invoices ──────────────────────────────────────────────────────────
    {
      key: 'list_invoices',
      label: 'List invoices',
      description: 'List Stripe invoices.',
      schema: z.object({ customer: optionalString, status: optionalString, limit: optionalNumber }),
      parameters: this.jsonSchema({ customer: { type: 'string' }, status: { type: 'string' }, limit: { type: 'number' } }),
    },
    {
      key: 'get_invoice',
      label: 'Get invoice',
      description: 'Get a Stripe invoice by ID.',
      schema: z.object({ invoiceId: z.string() }),
      parameters: this.jsonSchema({ invoiceId: { type: 'string' } }, ['invoiceId']),
    },
    {
      key: 'create_invoice',
      label: 'Create invoice',
      description: 'Create a new Stripe invoice.',
      schema: z.object({ customer: z.string(), description: optionalString, metadata: metadataSchema }),
      parameters: this.jsonSchema({ customer: { type: 'string' }, description: { type: 'string' }, metadata: { type: 'object' } }, ['customer']),
    },
    {
      key: 'finalize_invoice',
      label: 'Finalize invoice',
      description: 'Finalize a Stripe draft invoice.',
      schema: z.object({ invoiceId: z.string() }),
      parameters: this.jsonSchema({ invoiceId: { type: 'string' } }, ['invoiceId']),
    },
    {
      key: 'pay_invoice',
      label: 'Pay invoice',
      description: 'Attempt to pay a Stripe invoice.',
      schema: z.object({ invoiceId: z.string() }),
      parameters: this.jsonSchema({ invoiceId: { type: 'string' } }, ['invoiceId']),
    },
    {
      key: 'void_invoice',
      label: 'Void invoice',
      description: 'Void a Stripe invoice.',
      schema: z.object({ invoiceId: z.string() }),
      parameters: this.jsonSchema({ invoiceId: { type: 'string' } }, ['invoiceId']),
    },

    // ── Products ──────────────────────────────────────────────────────────
    {
      key: 'list_products',
      label: 'List products',
      description: 'List Stripe products.',
      schema: z.object({ limit: optionalNumber }),
      parameters: this.jsonSchema({ limit: { type: 'number' } }),
    },
    {
      key: 'get_product',
      label: 'Get product',
      description: 'Get a Stripe product by ID.',
      schema: z.object({ productId: z.string() }),
      parameters: this.jsonSchema({ productId: { type: 'string' } }, ['productId']),
    },
    {
      key: 'create_product',
      label: 'Create product',
      description: 'Create a new Stripe product.',
      schema: z.object({ name: z.string(), description: optionalString, metadata: metadataSchema }),
      parameters: this.jsonSchema({ name: { type: 'string' }, description: { type: 'string' }, metadata: { type: 'object' } }, ['name']),
    },
    {
      key: 'update_product',
      label: 'Update product',
      description: 'Update a Stripe product.',
      schema: z.object({ productId: z.string(), name: optionalString, description: optionalString, metadata: metadataSchema }),
      parameters: this.jsonSchema({ productId: { type: 'string' }, name: { type: 'string' }, description: { type: 'string' }, metadata: { type: 'object' } }, ['productId']),
    },
    {
      key: 'delete_product',
      label: 'Delete product',
      description: 'Delete a Stripe product.',
      schema: z.object({ productId: z.string() }),
      parameters: this.jsonSchema({ productId: { type: 'string' } }, ['productId']),
    },

    // ── Prices ────────────────────────────────────────────────────────────
    {
      key: 'list_prices',
      label: 'List prices',
      description: 'List Stripe prices.',
      schema: z.object({ product: optionalString, limit: optionalNumber }),
      parameters: this.jsonSchema({ product: { type: 'string' }, limit: { type: 'number' } }),
    },
    {
      key: 'get_price',
      label: 'Get price',
      description: 'Get a Stripe price by ID.',
      schema: z.object({ priceId: z.string() }),
      parameters: this.jsonSchema({ priceId: { type: 'string' } }, ['priceId']),
    },
    {
      key: 'create_price',
      label: 'Create price',
      description: 'Create a new Stripe price for a product.',
      schema: z.object({ product: z.string(), unitAmount: z.number(), currency: z.string(), interval: optionalString }),
      parameters: this.jsonSchema({ product: { type: 'string' }, unitAmount: { type: 'number' }, currency: { type: 'string' }, interval: { type: 'string', enum: ['day', 'week', 'month', 'year'] } }, ['product', 'unitAmount', 'currency']),
    },

    // ── Balance ───────────────────────────────────────────────────────────
    {
      key: 'get_balance',
      label: 'Get balance',
      description: 'Get the current Stripe account balance.',
      schema: emptySchema,
      parameters: this.jsonSchema(),
    },
    {
      key: 'list_balance_transactions',
      label: 'List balance transactions',
      description: 'List Stripe balance transactions.',
      schema: z.object({ limit: optionalNumber }),
      parameters: this.jsonSchema({ limit: { type: 'number' } }),
    },

    // ── Payment Methods ───────────────────────────────────────────────────
    {
      key: 'list_payment_methods',
      label: 'List payment methods',
      description: 'List payment methods for a Stripe customer.',
      schema: z.object({ customer: z.string(), type: optionalString }),
      parameters: this.jsonSchema({ customer: { type: 'string' }, type: { type: 'string' } }, ['customer']),
    },
    {
      key: 'attach_payment_method',
      label: 'Attach payment method',
      description: 'Attach a payment method to a Stripe customer.',
      schema: z.object({ paymentMethodId: z.string(), customer: z.string() }),
      parameters: this.jsonSchema({ paymentMethodId: { type: 'string' }, customer: { type: 'string' } }, ['paymentMethodId', 'customer']),
    },
    {
      key: 'detach_payment_method',
      label: 'Detach payment method',
      description: 'Detach a payment method from a Stripe customer.',
      schema: z.object({ paymentMethodId: z.string() }),
      parameters: this.jsonSchema({ paymentMethodId: { type: 'string' } }, ['paymentMethodId']),
    },
  ];

  constructor(prisma: PrismaService, encryption: EncryptionService) {
    super(prisma, encryption);
  }

  protected requiredConfigKeys() {
    return [...STRIPE_REQUIRED_CONFIG_KEYS];
  }

  protected async executeValidatedTool(actionKey: string, input: Record<string, any>, config: Record<string, any>) {
    const Stripe = (await loadRuntimePackage('stripe')).default;
    const service = new StripeService(new Stripe(config.secretKey));

    const actions: Record<string, () => Promise<any>> = {
      // Customers
      list_customers: () => service.listCustomers(input),
      get_customer: () => service.getCustomer(input as any),
      create_customer: () => service.createCustomer(input as any),
      update_customer: () => service.updateCustomer(input as any),
      delete_customer: () => service.deleteCustomer(input as any),
      search_customers: () => service.searchCustomers(input as any),
      // Subscriptions
      list_subscriptions: () => service.listSubscriptions(input),
      get_subscription: () => service.getSubscription(input as any),
      create_subscription: () => service.createSubscription(input as any),
      update_subscription: () => service.updateSubscription(input as any),
      cancel_subscription: () => service.cancelSubscription(input as any),
      // Payment Intents
      list_payments: () => service.listPayments(input),
      get_payment: () => service.getPayment(input as any),
      create_payment_intent: () => service.createPaymentIntent(input as any),
      cancel_payment_intent: () => service.cancelPaymentIntent(input as any),
      confirm_payment_intent: () => service.confirmPaymentIntent(input as any),
      // Charges
      list_charges: () => service.listCharges(input),
      get_charge: () => service.getCharge(input as any),
      // Refunds
      create_refund: () => service.createRefund(input as any),
      list_refunds: () => service.listRefunds(input),
      get_refund: () => service.getRefund(input as any),
      // Invoices
      list_invoices: () => service.listInvoices(input),
      get_invoice: () => service.getInvoice(input as any),
      create_invoice: () => service.createInvoice(input as any),
      finalize_invoice: () => service.finalizeInvoice(input as any),
      pay_invoice: () => service.payInvoice(input as any),
      void_invoice: () => service.voidInvoice(input as any),
      // Products
      list_products: () => service.listProducts(input),
      get_product: () => service.getProduct(input as any),
      create_product: () => service.createProduct(input as any),
      update_product: () => service.updateProduct(input as any),
      delete_product: () => service.deleteProduct(input as any),
      // Prices
      list_prices: () => service.listPrices(input),
      get_price: () => service.getPrice(input as any),
      create_price: () => service.createPrice(input as any),
      // Balance
      get_balance: () => service.getBalance(),
      list_balance_transactions: () => service.listBalanceTransactions(input),
      // Payment Methods
      list_payment_methods: () => service.listPaymentMethods(input as any),
      attach_payment_method: () => service.attachPaymentMethod(input as any),
      detach_payment_method: () => service.detachPaymentMethod(input as any),
    };

    return actions[actionKey]();
  }
}
