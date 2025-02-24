"use client"

import { useEffect, useState } from "react"
import {
  ArrowDownLeft,
  ArrowUpRight,
  BarChart,
  LineChart,
  Wallet,
} from "lucide-react"

import type { PortfolioStats, Transaction } from "@/types/sbtc"
import { sbtcService } from "@/lib/sbtc-service"
import { calculatePercentageChange, formatBTC, formatUSD } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DepositModal } from "@/components/deposit-modal"
import { PriceChart } from "@/components/price-chart"
import { TransactionList } from "@/components/transaction-list"
import { WithdrawalModal } from "@/components/withdrawal-modal"
import { useAppKitAccount } from "@reown/appkit/react"

export default function PortfolioPage() {
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false)
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false)
  const [stats, setStats] = useState<PortfolioStats>({
    totalBalance: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    priceChange24h: 0,
    btcPrice: 0,
    sbtcPrice: 0,
  })
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  const { address, isConnected, caipAddress, status, embeddedWalletInfo } = useAppKitAccount()

  useEffect(() => {
    const fetchData = async () => {

      if (!address) return;

      try {
        setIsLoading(true)
        setError("")

        const [portfolioStats, txHistory] = await Promise.all([
          sbtcService.getPortfolioStats(address),
          sbtcService.getTransactions(address),
        ])

        setStats(portfolioStats)
        setTransactions(txHistory)
      } catch (err) {
        console.error("Failed to fetch portfolio data:", err)
        setError("Failed to load portfolio data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [address])


  const handleDepositSuccess = (txId: string) => {
    // Optimistically add the transaction to the list
    const newTx: Transaction = {
      id: txId,
      type: "deposit",
      amount: 0, // Will be updated when confirmed
      status: "pending",
      timestamp: new Date().toISOString(),
      txId,
    }
    setTransactions([newTx, ...transactions])
  }

  const handleWithdrawalSuccess = (requestId: string) => {
    // Optimistically add the transaction to the list
    const newTx: Transaction = {
      id: requestId,
      type: "withdrawal",
      amount: 0, // Will be updated when confirmed
      status: "pending",
      timestamp: new Date().toISOString(),
    }
    setTransactions([newTx, ...transactions])
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg text-gray-500">Loading portfolio...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg text-red-500">{error}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-4xl font-bold">sBTC Portfolio</h1>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Balance</p>
              <p className="text-2xl font-bold">
                {formatBTC(stats.totalBalance)}
              </p>
              {stats.btcPrice && (
                <p className="text-sm text-gray-500">
                  {formatUSD(stats.totalBalance * stats.btcPrice)}
                </p>
              )}
            </div>
            <Wallet className="size-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Deposits</p>
              <p className="text-2xl font-bold">
                {formatBTC(stats.totalDeposits)}
              </p>
            </div>
            <ArrowUpRight className="size-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Withdrawals</p>
              <p className="text-2xl font-bold">
                {formatBTC(stats.totalWithdrawals)}
              </p>
            </div>
            <ArrowDownLeft className="size-8 text-red-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">24h Change</p>
              <p className="text-2xl font-bold">
                {calculatePercentageChange(
                  stats.sbtcPrice || 0,
                  (stats.sbtcPrice || 0) * (1 - stats.priceChange24h / 100)
                )}
              </p>
            </div>
            <LineChart className="size-8 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Actions */}
      <div className="mb-8 flex gap-4">
        <Button onClick={() => setIsDepositModalOpen(true)}>
          <ArrowUpRight className="mr-2 size-4" />
          Deposit BTC
        </Button>
        <Button
          variant="outline"
          onClick={() => setIsWithdrawalModalOpen(true)}
          disabled={stats.totalBalance === 0}
        >
          <ArrowDownLeft className="mr-2 size-4" />
          Withdraw sBTC
        </Button>
      </div>

      {/* Price Chart */}
      <div className="mb-8">
        <PriceChart />
      </div>

      {/* Recent Transactions */}
      <TransactionList
        transactions={transactions}
        isLoading={isLoading}
        error={error}
      />

      {/* Modals */}
      <DepositModal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        onSuccess={handleDepositSuccess}
      />

      <WithdrawalModal
        isOpen={isWithdrawalModalOpen}
        onClose={() => setIsWithdrawalModalOpen(false)}
        onSuccess={handleWithdrawalSuccess}
        maxAmount={stats.totalBalance}
      />
    </div>
  )
}
