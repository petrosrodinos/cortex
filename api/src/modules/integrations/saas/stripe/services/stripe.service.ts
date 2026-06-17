import { STRIPE_DEFAULTS } from '../config/stripe.config';
import {
  AttachPaymentMethodInput,
  CancelPaymentIntentInput,
  CancelSubscriptionInput,
  ConfirmPaymentIntentInput,
  CreateCustomerInput,
  CreateInvoiceInput,
  CreatePaymentIntentInput,
  CreatePriceInput,
  CreateProductInput,
  CreateRefundInput,
  CreateSubscriptionInput,
  DeleteCustomerInput,
  DeleteProductInput,
  DetachPaymentMethodInput,
  GetChargeInput,
  GetCustomerInput,
  GetInvoiceInput,
  GetPaymentInput,
  GetPriceInput,
  GetProductInput,
  GetRefundInput,
  GetSubscriptionInput,
  InvoiceActionInput,
  ListBalanceTransactionsInput,
  ListChargesInput,
  ListCustomersInput,
  ListInvoicesInput,
  ListPaymentMethodsInput,
  ListPaymentsInput,
  ListPricesInput,
  ListRefundsInput,
  ListSubscriptionsInput,
  SearchCustomersInput,
  UpdateCustomerInput,
  UpdateProductInput,
  UpdateSubscriptionInput,
} from '../interfaces/stripe.interfaces';
import { wrapResult } from '../utils/stripe.utils';

export class StripeService {
  constructor(private readonly client: any) {}

  // ── Customers ─────────────────────────────────────────────────────────────

  async listCustomers({ email, limit }: ListCustomersInput = {}) {
    return wrapResult(await this.client.customers.list({ email, limit: limit ?? STRIPE_DEFAULTS.LIMIT }));
  }

  async getCustomer({ customerId }: GetCustomerInput) {
    return wrapResult(await this.client.customers.retrieve(customerId));
  }

  async createCustomer({ email, name, phone, description, metadata }: CreateCustomerInput) {
    return wrapResult(await this.client.customers.create({ email, name, phone, description, metadata }));
  }

  async updateCustomer({ customerId, ...rest }: UpdateCustomerInput) {
    return wrapResult(await this.client.customers.update(customerId, rest));
  }

  async deleteCustomer({ customerId }: DeleteCustomerInput) {
    return wrapResult(await this.client.customers.del(customerId));
  }

  async searchCustomers({ query, limit }: SearchCustomersInput) {
    return wrapResult(await this.client.customers.search({ query, limit: limit ?? STRIPE_DEFAULTS.LIMIT }));
  }

  // ── Subscriptions ─────────────────────────────────────────────────────────

  async listSubscriptions({ customer, status, limit }: ListSubscriptionsInput = {}) {
    return wrapResult(await this.client.subscriptions.list({ customer, status, limit: limit ?? STRIPE_DEFAULTS.LIMIT }));
  }

  async getSubscription({ subscriptionId }: GetSubscriptionInput) {
    return wrapResult(await this.client.subscriptions.retrieve(subscriptionId));
  }

  async createSubscription({ customer, items, trialDays, metadata }: CreateSubscriptionInput) {
    return wrapResult(await this.client.subscriptions.create({ customer, items, trial_period_days: trialDays, metadata }));
  }

  async updateSubscription({ subscriptionId, metadata, cancelAtPeriodEnd }: UpdateSubscriptionInput) {
    return wrapResult(await this.client.subscriptions.update(subscriptionId, { metadata, cancel_at_period_end: cancelAtPeriodEnd }));
  }

  async cancelSubscription({ subscriptionId, immediately }: CancelSubscriptionInput) {
    return immediately
      ? wrapResult(await this.client.subscriptions.cancel(subscriptionId))
      : wrapResult(await this.client.subscriptions.update(subscriptionId, { cancel_at_period_end: true }));
  }

  // ── Payment Intents ───────────────────────────────────────────────────────

  async listPayments({ customer, limit }: ListPaymentsInput = {}) {
    return wrapResult(await this.client.paymentIntents.list({ customer, limit: limit ?? STRIPE_DEFAULTS.LIMIT }));
  }

  async getPayment({ paymentIntentId }: GetPaymentInput) {
    return wrapResult(await this.client.paymentIntents.retrieve(paymentIntentId));
  }

  async createPaymentIntent({ amount, currency, customer, description, metadata }: CreatePaymentIntentInput) {
    return wrapResult(await this.client.paymentIntents.create({ amount, currency, customer, description, metadata }));
  }

  async cancelPaymentIntent({ paymentIntentId }: CancelPaymentIntentInput) {
    return wrapResult(await this.client.paymentIntents.cancel(paymentIntentId));
  }

  async confirmPaymentIntent({ paymentIntentId, paymentMethod }: ConfirmPaymentIntentInput) {
    return wrapResult(await this.client.paymentIntents.confirm(paymentIntentId, { payment_method: paymentMethod }));
  }

  // ── Charges ───────────────────────────────────────────────────────────────

  async listCharges({ customer, limit }: ListChargesInput = {}) {
    return wrapResult(await this.client.charges.list({ customer, limit: limit ?? STRIPE_DEFAULTS.LIMIT }));
  }

  async getCharge({ chargeId }: GetChargeInput) {
    return wrapResult(await this.client.charges.retrieve(chargeId));
  }

  // ── Refunds ───────────────────────────────────────────────────────────────

  async createRefund({ payment_intent, charge, amount }: CreateRefundInput) {
    return wrapResult(await this.client.refunds.create({ payment_intent, charge, amount }));
  }

  async listRefunds({ charge, payment_intent, limit }: ListRefundsInput = {}) {
    return wrapResult(await this.client.refunds.list({ charge, payment_intent, limit: limit ?? STRIPE_DEFAULTS.LIMIT }));
  }

  async getRefund({ refundId }: GetRefundInput) {
    return wrapResult(await this.client.refunds.retrieve(refundId));
  }

  // ── Invoices ──────────────────────────────────────────────────────────────

  async listInvoices({ customer, status, limit }: ListInvoicesInput = {}) {
    return wrapResult(await this.client.invoices.list({ customer, status, limit: limit ?? STRIPE_DEFAULTS.LIMIT }));
  }

  async getInvoice({ invoiceId }: GetInvoiceInput) {
    return wrapResult(await this.client.invoices.retrieve(invoiceId));
  }

  async createInvoice({ customer, description, metadata }: CreateInvoiceInput) {
    return wrapResult(await this.client.invoices.create({ customer, description, metadata }));
  }

  async finalizeInvoice({ invoiceId }: InvoiceActionInput) {
    return wrapResult(await this.client.invoices.finalizeInvoice(invoiceId));
  }

  async payInvoice({ invoiceId }: InvoiceActionInput) {
    return wrapResult(await this.client.invoices.pay(invoiceId));
  }

  async voidInvoice({ invoiceId }: InvoiceActionInput) {
    return wrapResult(await this.client.invoices.voidInvoice(invoiceId));
  }

  // ── Products ──────────────────────────────────────────────────────────────

  async listProducts({ limit }: { limit?: number } = {}) {
    return wrapResult(await this.client.products.list({ limit: limit ?? STRIPE_DEFAULTS.LIMIT }));
  }

  async getProduct({ productId }: GetProductInput) {
    return wrapResult(await this.client.products.retrieve(productId));
  }

  async createProduct({ name, description, metadata }: CreateProductInput) {
    return wrapResult(await this.client.products.create({ name, description, metadata }));
  }

  async updateProduct({ productId, name, description, metadata }: UpdateProductInput) {
    return wrapResult(await this.client.products.update(productId, { name, description, metadata }));
  }

  async deleteProduct({ productId }: DeleteProductInput) {
    return wrapResult(await this.client.products.del(productId));
  }

  // ── Prices ────────────────────────────────────────────────────────────────

  async listPrices({ product, limit }: ListPricesInput = {}) {
    return wrapResult(await this.client.prices.list({ product, limit: limit ?? STRIPE_DEFAULTS.LIMIT }));
  }

  async getPrice({ priceId }: GetPriceInput) {
    return wrapResult(await this.client.prices.retrieve(priceId));
  }

  async createPrice({ product, unitAmount, currency, interval }: CreatePriceInput) {
    const recurring = interval ? { interval } : undefined;
    return wrapResult(await this.client.prices.create({ product, unit_amount: unitAmount, currency, recurring }));
  }

  // ── Balance ───────────────────────────────────────────────────────────────

  async getBalance() {
    return wrapResult(await this.client.balance.retrieve());
  }

  async listBalanceTransactions({ limit }: ListBalanceTransactionsInput = {}) {
    return wrapResult(await this.client.balanceTransactions.list({ limit: limit ?? STRIPE_DEFAULTS.LIMIT }));
  }

  // ── Payment Methods ───────────────────────────────────────────────────────

  async listPaymentMethods({ customer, type }: ListPaymentMethodsInput) {
    return wrapResult(await this.client.paymentMethods.list({ customer, type }));
  }

  async attachPaymentMethod({ paymentMethodId, customer }: AttachPaymentMethodInput) {
    return wrapResult(await this.client.paymentMethods.attach(paymentMethodId, { customer }));
  }

  async detachPaymentMethod({ paymentMethodId }: DetachPaymentMethodInput) {
    return wrapResult(await this.client.paymentMethods.detach(paymentMethodId));
  }
}
