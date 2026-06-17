// ── Shared ────────────────────────────────────────────────────────────────────

export interface ListInput {
  limit?: number;
}

// ── Customers ─────────────────────────────────────────────────────────────────

export interface ListCustomersInput {
  email?: string;
  limit?: number;
}

export interface GetCustomerInput {
  customerId: string;
}

export interface CreateCustomerInput {
  email?: string;
  name?: string;
  phone?: string;
  description?: string;
  metadata?: Record<string, string>;
}

export interface UpdateCustomerInput {
  customerId: string;
  email?: string;
  name?: string;
  phone?: string;
  description?: string;
  metadata?: Record<string, string>;
}

export interface DeleteCustomerInput {
  customerId: string;
}

export interface SearchCustomersInput {
  query: string;
  limit?: number;
}

// ── Subscriptions ─────────────────────────────────────────────────────────────

export interface ListSubscriptionsInput {
  customer?: string;
  status?: string;
  limit?: number;
}

export interface GetSubscriptionInput {
  subscriptionId: string;
}

export interface CreateSubscriptionInput {
  customer: string;
  items: Array<{ price: string; quantity?: number }>;
  trialDays?: number;
  metadata?: Record<string, string>;
}

export interface UpdateSubscriptionInput {
  subscriptionId: string;
  metadata?: Record<string, string>;
  cancelAtPeriodEnd?: boolean;
}

export interface CancelSubscriptionInput {
  subscriptionId: string;
  immediately?: boolean;
}

// ── Payment Intents ───────────────────────────────────────────────────────────

export interface ListPaymentsInput {
  customer?: string;
  limit?: number;
}

export interface GetPaymentInput {
  paymentIntentId: string;
}

export interface CreatePaymentIntentInput {
  amount: number;
  currency: string;
  customer?: string;
  description?: string;
  metadata?: Record<string, string>;
}

export interface CancelPaymentIntentInput {
  paymentIntentId: string;
}

export interface ConfirmPaymentIntentInput {
  paymentIntentId: string;
  paymentMethod?: string;
}

// ── Charges ───────────────────────────────────────────────────────────────────

export interface ListChargesInput {
  customer?: string;
  limit?: number;
}

export interface GetChargeInput {
  chargeId: string;
}

// ── Refunds ───────────────────────────────────────────────────────────────────

export interface CreateRefundInput {
  payment_intent?: string;
  charge?: string;
  amount?: number;
}

export interface ListRefundsInput {
  charge?: string;
  payment_intent?: string;
  limit?: number;
}

export interface GetRefundInput {
  refundId: string;
}

// ── Invoices ──────────────────────────────────────────────────────────────────

export interface ListInvoicesInput {
  customer?: string;
  status?: string;
  limit?: number;
}

export interface GetInvoiceInput {
  invoiceId: string;
}

export interface CreateInvoiceInput {
  customer: string;
  description?: string;
  metadata?: Record<string, string>;
}

export interface InvoiceActionInput {
  invoiceId: string;
}

// ── Products ──────────────────────────────────────────────────────────────────

export interface GetProductInput {
  productId: string;
}

export interface CreateProductInput {
  name: string;
  description?: string;
  metadata?: Record<string, string>;
}

export interface UpdateProductInput {
  productId: string;
  name?: string;
  description?: string;
  metadata?: Record<string, string>;
}

export interface DeleteProductInput {
  productId: string;
}

// ── Prices ────────────────────────────────────────────────────────────────────

export interface ListPricesInput {
  product?: string;
  limit?: number;
}

export interface GetPriceInput {
  priceId: string;
}

export interface CreatePriceInput {
  product: string;
  unitAmount: number;
  currency: string;
  interval?: 'day' | 'week' | 'month' | 'year';
}

// ── Balance ───────────────────────────────────────────────────────────────────

export interface ListBalanceTransactionsInput {
  limit?: number;
}

// ── Payment Methods ───────────────────────────────────────────────────────────

export interface ListPaymentMethodsInput {
  customer: string;
  type?: string;
}

export interface AttachPaymentMethodInput {
  paymentMethodId: string;
  customer: string;
}

export interface DetachPaymentMethodInput {
  paymentMethodId: string;
}

// ── Result ────────────────────────────────────────────────────────────────────

export interface StripeActionResult<T = any> {
  success: boolean;
  data: T;
}
