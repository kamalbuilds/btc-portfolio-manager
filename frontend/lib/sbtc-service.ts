import { Transaction } from '@/types/sbtc'

const API_BASE_URL = process.env.NEXT_PUBLIC_SBTC_API_URL || 'http://temp.sbtc-emily-dev.com'

export interface DepositRequest {
  amount: number
  recipient: string
}

export interface WithdrawalRequest {
  amount: number
  btcAddress: string
  maxFee: number
}

export interface PortfolioStats {
  totalBalance: number
  totalDeposits: number
  totalWithdrawals: number
  priceChange24h: number
}

class SBTCService {
  private async fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    // TODO: Add authentication logic
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  async getPortfolioStats(address: string): Promise<PortfolioStats> {
    return this.fetchWithAuth(`/portfolio/${address}`)
  }

  async getTransactions(address: string): Promise<Transaction[]> {
    return this.fetchWithAuth(`/transactions/${address}`)
  }

  async initiateDeposit(request: DepositRequest): Promise<{ depositAddress: string }> {
    return this.fetchWithAuth('/deposit', {
      method: 'POST',
      body: JSON.stringify(request),
    })
  }

  async initiateWithdrawal(request: WithdrawalRequest): Promise<{ requestId: string }> {
    return this.fetchWithAuth('/withdrawal', {
      method: 'POST',
      body: JSON.stringify(request),
    })
  }

  async getDepositStatus(txId: string): Promise<{
    status: 'pending' | 'completed' | 'failed'
    confirmations: number
  }> {
    return this.fetchWithAuth(`/deposit/${txId}/status`)
  }

  async getWithdrawalStatus(requestId: string): Promise<{
    status: 'pending' | 'completed' | 'failed'
    txId?: string
  }> {
    return this.fetchWithAuth(`/withdrawal/${requestId}/status`)
  }
}

export const sbtcService = new SBTCService() 